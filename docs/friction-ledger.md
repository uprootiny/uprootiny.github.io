# Friction Ledger

*Observed friction in workflows and mitigation strategies.*

---

## F001: Model Selection in `hyle`

**Date:** 2026-01-02
**Severity:** Medium (daily friction)
**Status:** Open

### Observed Friction

When running `hyle`, a flat list of models appears with no differentiation by:
- Cost (free vs. paid)
- Capability (tool use, reasoning, code, etc.)
- Reliability (context window, rate limits, uptime)
- Integration status (API key configured, tested)

**Current behavior:**
```
$ hyle
Select model:
1. gpt-4o
2. claude-sonnet-4-20250514
3. gemini-1.5-pro
4. llama-3.1-70b
5. mixtral-8x7b
...
```

**Desired behavior:**
```
$ hyle
Select model (or profile):

[FREE] [TOOL+] [CODE+] llama-3.3-70b-versatile (groq)
[FREE] [TOOL+]         gemma-2-9b-it (groq)
[FREE]                 llama-3.1-8b-instant (groq)
─────────────────────────────────────────────────
[PAID] [TOOL+] [CODE+] [REASON+] claude-sonnet-4-20250514
[PAID] [TOOL+] [CODE+] [REASON+] gpt-4o
[PAID] [TOOL+]                   gemini-1.5-pro
─────────────────────────────────────────────────
[PROFILE] research-cheap: llama-70b → claude-sonnet (fallback)
[PROFILE] code-heavy: claude-sonnet (primary)
[PROFILE] exploration: gemma-9b → llama-70b → claude (escalation)

Default: research-cheap
```

### Pain Points

1. **No cost visibility** - accidentally burning tokens on expensive models
2. **No capability flags** - guessing which models support tools
3. **No free-first sorting** - have to scan entire list
4. **Single model selection** - can't express "try cheap first, escalate if needed"
5. **No defaults** - must choose every time

### Proposed Mitigation

#### M1: Model Registry with Traits

```clojure
;; data/models.edn
{:models
 [{:id "llama-3.3-70b-versatile"
   :provider :groq
   :cost :free
   :traits #{:tool-use :code :fast}
   :context 131072
   :rate-limit {:rpm 30 :tpd 14400}
   :tested true}

  {:id "claude-sonnet-4-20250514"
   :provider :anthropic
   :cost {:input 3.0 :output 15.0}  ;; per 1M tokens
   :traits #{:tool-use :code :reasoning :agentic}
   :context 200000
   :rate-limit {:rpm 50}
   :tested true}

  {:id "gemini-1.5-pro"
   :provider :google
   :cost {:input 1.25 :output 5.0}
   :traits #{:tool-use :long-context :multimodal}
   :context 2000000
   :rate-limit {:rpm 60}
   :tested false}]}
```

#### M2: Trait Flags Display

```clojure
(def trait-flags
  {:tool-use  "[TOOL+]"
   :code      "[CODE+]"
   :reasoning "[REASON+]"
   :fast      "[FAST]"
   :long-context "[LONG]"
   :multimodal   "[MULTI]"
   :agentic      "[AGENT+]"})

(defn format-model [{:keys [id provider cost traits]}]
  (str (if (= cost :free) "[FREE]" "[PAID]")
       " "
       (str/join " " (keep trait-flags traits))
       " "
       id
       " (" (name provider) ")"))
```

#### M3: Model Profiles (Mixtures)

```clojure
;; data/profiles.edn
{:profiles
 [{:id :research-cheap
   :description "Free models with paid fallback"
   :strategy :fallback
   :models ["llama-3.3-70b-versatile"
            "gemma-2-9b-it"
            "claude-sonnet-4-20250514"]
   :escalation-triggers #{:tool-failure :context-exceeded :rate-limited}}

  {:id :code-heavy
   :description "Best code model, no fallback"
   :strategy :primary
   :models ["claude-sonnet-4-20250514"]}

  {:id :exploration
   :description "Start cheap, escalate on complexity"
   :strategy :escalation
   :models ["gemma-2-9b-it"
            "llama-3.3-70b-versatile"
            "claude-sonnet-4-20250514"]
   :escalation-triggers #{:confidence-low :task-complex}}

  {:id :parallel-consensus
   :description "Run multiple, take consensus"
   :strategy :ensemble
   :models ["llama-3.3-70b-versatile"
            "gemma-2-9b-it"]
   :aggregation :majority-vote}]}
```

#### M4: Default Selection Logic

```clojure
(defn select-default-profile [task-type]
  (case task-type
    :research   :research-cheap
    :coding     :code-heavy
    :explore    :exploration
    :validate   :parallel-consensus
    :research-cheap))  ;; fallback default

(defn hyle-interactive []
  (let [models (load-models)
        profiles (load-profiles)
        free-models (filter #(= :free (:cost %)) models)
        paid-models (remove #(= :free (:cost %)) models)]

    (println "Select model (or profile):\n")

    ;; Free models first
    (doseq [m (sort-by (comp count :traits) > free-models)]
      (println (format-model m)))

    (println (str/join "" (repeat 50 "─")))

    ;; Paid models
    (doseq [m (sort-by (comp count :traits) > paid-models)]
      (println (format-model m)))

    (println (str/join "" (repeat 50 "─")))

    ;; Profiles
    (doseq [p profiles]
      (println (str "[PROFILE] " (name (:id p)) ": " (:description p))))

    (println (str "\nDefault: " (name (select-default-profile :research))))))
```

### Implementation Steps

| Step | Description | Effort |
|------|-------------|--------|
| 1 | Create `data/models.edn` with trait annotations | 1h |
| 2 | Create `data/profiles.edn` with mixture strategies | 1h |
| 3 | Implement display formatting with flags | 2h |
| 4 | Implement profile execution (fallback/escalation) | 4h |
| 5 | Add `--default` flag to skip selection | 30m |
| 6 | Test with actual API calls | 2h |

### Success Criteria

- [ ] Free models visually distinct and sorted first
- [ ] Capability flags visible at a glance
- [ ] Can select profile instead of single model
- [ ] Default works without interaction (`hyle --default`)
- [ ] Profile escalation works on failure

---

## F002: [Template for Future Friction]

**Date:** YYYY-MM-DD
**Severity:** Low/Medium/High
**Status:** Open/In Progress/Resolved

### Observed Friction

[Description of the pain point]

### Pain Points

1. [Specific issue]
2. [Specific issue]

### Proposed Mitigation

[Solution sketch]

### Implementation Steps

| Step | Description | Effort |
|------|-------------|--------|

### Success Criteria

- [ ] [Criterion]

---

## Friction Index

| ID | Summary | Severity | Status |
|----|---------|----------|--------|
| F001 | Model selection lacks traits, profiles, defaults | Medium | Open |

---

## Model Trait Definitions

For reference, trait semantics:

| Trait | Meaning | Test |
|-------|---------|------|
| `tool-use` | Reliably calls tools in correct format | >90% tool call success on benchmark |
| `code` | Strong code generation | >80% HumanEval or similar |
| `reasoning` | Chain-of-thought, multi-step | >70% on GSM8K or MATH |
| `fast` | <2s response time typical | P95 latency <2s |
| `long-context` | >100k context window | Stated context >100k |
| `multimodal` | Accepts images/audio | API supports non-text |
| `agentic` | Good at multi-turn autonomous tasks | Subjective, based on testing |

---

## Provider Notes

### Groq (Free Tier)
- Rate limits: 30 RPM, 14,400 tokens/day (varies by model)
- Models: llama-3.3-70b, gemma-2-9b, llama-3.1-8b, mixtral-8x7b
- Reliability: Generally good, occasional 503s under load
- Tool use: Supported on llama-3.3-70b, quality varies

### Anthropic
- Rate limits: Varies by plan
- Models: claude-sonnet-4-20250514, claude-opus-4-5-20251101
- Reliability: Excellent
- Tool use: Best-in-class

### OpenAI
- Rate limits: Varies by plan
- Models: gpt-4o, gpt-4o-mini
- Reliability: Excellent
- Tool use: Very good

### Google
- Rate limits: Generous free tier
- Models: gemini-1.5-pro, gemini-1.5-flash
- Reliability: Good
- Tool use: Improving, some edge cases

---

*Last updated: 2026-01-02*
