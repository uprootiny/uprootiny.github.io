---
layout: text
title: Attention Taxonomy
permalink: /docs/attention-taxonomy/
---

# Attention Taxonomy & Corpus Lifecycle

*Managing scarce user attention across the progressive slowing of LLM experiments from conversation to verified result.*

---

## The Problem

Human attention is finite. LLM conversations generate:
- Half-baked ideas (many)
- Promising directions (some)
- Structured experiments (few)
- Verified results (rare)

The funnel is steep. Most ideas die in conversation. The ones that survive need:
- Incubation without active attention
- Periodic checkpointing
- Eventual crystallization into artifacts

**Current failure mode:** Ideas exist only in conversation context. When context is lost, the idea is lost. No systematic way to:
1. Park promising threads
2. Incubate them asynchronously
3. Surface them when ripe
4. Connect them to related threads

---

## The Lifecycle: Conversation to Verified Result

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     ATTENTION TEMPERATURE GRADIENT                       │
│                                                                         │
│  HOT                                                                    │
│   │  ┌──────────────────┐                                              │
│   │  │ ACTIVE DIALOGUE  │  User + LLM in real-time                     │
│   │  │ (seconds)        │  High bandwidth, high noise                  │
│   │  └────────┬─────────┘                                              │
│   │           │ extraction                                              │
│   │           ▼                                                         │
│   │  ┌──────────────────┐                                              │
│   │  │ BACKBURNER       │  Parked threads, periodic check-in           │
│   │  │ (hours-days)     │  LLM reviews, user skims summaries           │
│   │  └────────┬─────────┘                                              │
│   │           │ crystallization                                         │
│   │           ▼                                                         │
│   │  ┌──────────────────┐                                              │
│   │  │ TYPED ARTIFACT   │  Markdown docs, structured schemas           │
│   │  │ (days-weeks)     │  Human-readable, version-controlled          │
│   │  └────────┬─────────┘                                              │
│   │           │ formalization                                           │
│   │           ▼                                                         │
│   │  ┌──────────────────┐                                              │
│   │  │ DATA             │  JSON, EDN, databases                        │
│   │  │ (weeks-months)   │  Machine-readable, queryable                 │
│   │  └────────┬─────────┘                                              │
│   │           │ operationalization                                      │
│   │           ▼                                                         │
│   │  ┌──────────────────┐                                              │
│   │  │ PIPELINE TRACE   │  Training runs, inference logs               │
│   │  │ (months)         │  Reproducible, tracked                       │
│   │  └────────┬─────────┘                                              │
│   │           │ verification                                            │
│   │           ▼                                                         │
│  COLD ┌──────────────────┐                                              │
│       │ VERIFIED RESULT  │  Paper, benchmark, tool                     │
│       │ (months-years)   │  Citeable, usable, done                     │
│       └──────────────────┘                                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Stage Definitions

### 1. Active Dialogue (Hot)

**Temperature:** Seconds to minutes
**Attention:** Full user engagement
**Form:** Conversation turns
**Artifacts:** None (ephemeral)

**Characteristics:**
- High bandwidth (many tokens/minute)
- High noise (exploration, dead ends)
- High serendipity (unexpected connections)
- Zero persistence (context window is the only memory)

**Failure mode:** Good ideas lost when conversation ends

**Transition trigger:** User says "park this" / "backburner" / conversation ends with promising thread

---

### 2. Backburner (Warm)

**Temperature:** Hours to days
**Attention:** Periodic user check-in (5 min/day)
**Form:** Summarized threads with status
**Artifacts:** Backburner index file

**Characteristics:**
- LLM periodically reviews parked threads
- Generates "what changed?" summaries
- Flags threads that need attention
- Connects related threads automatically

**Operations:**
```
backburner/add <thread-id> <summary>
backburner/check                      # What needs attention?
backburner/connect <thread-a> <thread-b>
backburner/promote <thread-id>        # Move to artifact stage
backburner/archive <thread-id>        # Move to cold storage
```

**Data structure:**
```clojure
{:thread-id "quant-multilingual-2026-01"
 :summary "Hypothesis: morphological complexity predicts quantization sensitivity"
 :status :incubating
 :created #inst "2026-01-02"
 :last-touched #inst "2026-01-02"
 :temperature 0.7  ;; how "hot" is this thread
 :connections ["tokenization-fertility" "soudry-proposal"]
 :next-action "Re-analyze Marchisio data with WALS features"
 :blockers []
 :artifacts []}
```

---

### 3. Typed Artifact (Cool)

**Temperature:** Days to weeks
**Attention:** Occasional deep read (30 min/week)
**Form:** Markdown documents, structured sections
**Artifacts:** `docs/*.md`, `plans/*.md`

**Characteristics:**
- Human-readable prose
- Version-controlled (git)
- Internally consistent (managers enforce)
- Referenceable (can be cited in other docs)

**Transition from backburner:**
- Thread has clear structure
- Key claims are enumerable
- Next steps are concrete
- Worth investing in persistence

**Example:** The `israeli-academia.md` file with its Part 0 reasoning framework

---

### 4. Data (Cold)

**Temperature:** Weeks to months
**Attention:** Rare (when running experiments)
**Form:** JSON, EDN, CSV, database tables
**Artifacts:** `data/*.edn`, `data/*.json`

**Characteristics:**
- Machine-readable
- Queryable
- Typed/validated (spec)
- Versionable (content-addressed)

**Example:**
```clojure
;; data/measurements.edn
{:fertility
 {"eng" {:value 1.2 :ci [1.1 1.4] :source :bloom :measured #inst "2026-01-02"}
  "heb" {:value 2.1 :ci [1.8 2.4] :source :aya :measured #inst "2026-01-02"}}}
```

---

### 5. Pipeline Trace (Frozen)

**Temperature:** Months
**Attention:** During debugging/reproduction
**Form:** Experiment configs, logs, checkpoints
**Artifacts:** `experiments/<exp-id>/`

**Characteristics:**
- Reproducible (pinned dependencies, seeds)
- Tracked (MLflow, W&B, or simple logs)
- Comparable (same metrics across runs)
- Archivable (can be deleted after paper)

**Structure:**
```
experiments/
  quant-multilingual-001/
    config.edn
    run.log
    metrics.json
    checkpoints/
    outputs/
```

---

### 6. Verified Result (Archived)

**Temperature:** Months to years
**Attention:** When cited or reused
**Form:** Paper, benchmark, tool, library
**Artifacts:** Published outputs

**Characteristics:**
- Citeable (DOI, arXiv, GitHub release)
- Usable (others can build on it)
- Done (not actively developed)
- Archived (preserved for posterity)

---

## Housekeeping Mode: Intake & Stitching

A separate mode for processing half-baked LLM experiments.

### The Intake Problem

LLM conversations generate fragments:
- A hypothesis mentioned in passing
- A data source discovered
- A code snippet that might work
- A connection to another project

These fragments are valuable but disorganized. **Intake mode** systematically:
1. Extracts fragments from conversations
2. Tags and categorizes them
3. Stores in a queryable format
4. Periodically surfaces connections

### Intake Operations

```
intake/extract <conversation>     # Pull fragments from transcript
intake/tag <fragment-id> <tags>   # Categorize
intake/query <query>              # Find related fragments
intake/stitch <frag-a> <frag-b>   # Combine into larger piece
intake/scaffold <fragment-id>     # Generate surrounding structure
```

### Fragment Schema

```clojure
{:fragment-id "frag-2026-01-02-001"
 :type :hypothesis | :data-source | :code | :connection | :question | :claim
 :content "Morphologically complex languages may have higher-entropy embeddings"
 :source {:conversation "quant-multilingual" :turn 47}
 :tags #{:quantization :linguistics :embeddings}
 :confidence :speculative | :plausible | :supported | :verified
 :connections []
 :created #inst "2026-01-02"
 :promoted-to nil}  ;; when stitched into artifact
```

### Stitching Process

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Fragment A  │     │ Fragment B  │     │ Fragment C  │
│ (hypothesis)│     │ (data src)  │     │ (method)    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Scaffold        │
                  │ (generates glue │
                  │  and structure) │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Draft Artifact  │
                  │ (typed document │
                  │  with gaps)     │
                  └─────────────────┘
```

---

## The Slowing-Down Process

### Velocity Profile

| Stage | Tokens/day | User attention/day | LLM attention/day |
|-------|------------|-------------------|-------------------|
| Active dialogue | 50,000 | 2 hours | 2 hours |
| Backburner | 1,000 | 5 minutes | 30 minutes |
| Typed artifact | 500 | 30 minutes/week | 1 hour/week |
| Data | 100 | 10 minutes/month | 2 hours/month |
| Pipeline | 50 | During runs only | Continuous logging |
| Verified | 0 | When cited | Never |

### Cooling Triggers

| From | To | Trigger |
|------|-----|---------|
| Dialogue | Backburner | User parks, conversation ends with open thread |
| Backburner | Artifact | Structure emerges, worth persisting |
| Artifact | Data | Claims become measurements, need querying |
| Data | Pipeline | Ready to run experiments |
| Pipeline | Verified | Results reproduced, paper written |

### Heating Triggers (Promotion)

| From | To | Trigger |
|------|-----|---------|
| Backburner | Dialogue | User revisits, needs active exploration |
| Artifact | Dialogue | Found error, needs rethinking |
| Data | Artifact | Need to update prose with new data |
| Pipeline | Data | Run complete, need to extract results |
| Verified | Dialogue | Extension, follow-up work |

---

## Implementation Sketch

### File Structure

```
project/
  conversations/           # Hot: transcripts of active dialogues
    2026-01-02-quant.md

  backburner/              # Warm: parked threads
    index.edn              # Thread registry
    threads/
      quant-multilingual.edn

  docs/                    # Cool: typed artifacts
    israeli-academia.md
    attention-taxonomy.md

  data/                    # Cold: structured data
    measurements.edn
    correlations.edn

  experiments/             # Frozen: pipeline traces
    quant-001/

  published/               # Archived: verified results
    papers/
    tools/
```

### Backburner Daemon

A slow-burning process that periodically:
1. Reviews all threads
2. Computes "staleness" (time since last touch)
3. Generates connection suggestions
4. Flags threads needing attention
5. Writes summary for user

```clojure
(defn backburner-daemon []
  (loop []
    (let [threads (load-all-threads)
          stale (filter stale? threads)
          connections (find-new-connections threads)
          summary (generate-daily-summary threads)]

      (notify-user-if-needed stale)
      (update-connection-graph connections)
      (write-summary summary)

      (Thread/sleep (* 6 60 60 1000))  ;; every 6 hours
      (recur))))
```

### Intake Extractor

Processes conversation transcripts:
1. Identifies fragment types (hypothesis, data, code, etc.)
2. Extracts and tags
3. Stores in fragment database
4. Suggests stitching opportunities

```clojure
(defn extract-fragments [conversation]
  (let [turns (parse-conversation conversation)
        candidates (identify-fragment-candidates turns)
        fragments (map extract-fragment candidates)]
    (doseq [f fragments]
      (store-fragment! f)
      (update-connection-graph! f))
    fragments))
```

---

## Relation to Hyle Architecture

The Hyle reasoning graph (Section Fourteen of israeli-academia.md) is the **machinery** that operates within this lifecycle:

| Lifecycle Stage | Hyle Role |
|-----------------|-----------|
| Backburner | Hyle agents review threads, generate summaries |
| Typed Artifact | Hyle canvas composes article from paragraphs |
| Data | Hyle state atom stores measurements |
| Pipeline | Hyle agents run probes, log results |
| Verified | Hyle output is the paper |

**Key insight:** Hyle is the active processing; this taxonomy is the **storage and attention management** around it.

---

## Open Questions

1. **How to measure "ripeness"?** When is a backburner thread ready for promotion?

2. **Connection discovery:** How to find non-obvious links between fragments?

3. **Garbage collection:** When to archive/delete cold threads?

4. **User interface:** How to surface backburner state without overwhelming?

5. **Multi-project:** How to manage attention across multiple research threads?

---

## Next Steps

| Priority | Task | Effort |
|----------|------|--------|
| 1 | Define backburner schema (`.edn`) | 1 hour |
| 2 | Write `backburner/add` command | 2 hours |
| 3 | Write daily summary generator | 4 hours |
| 4 | Integrate with conversation flow | 4 hours |
| 5 | Build intake extractor | 8 hours |
| 6 | Build stitching scaffold | 8 hours |

---

## References

- israeli-academia.md, Section Fourteen: Hyle Architecture
- Unix philosophy: do one thing well, text as universal interface
- GTD (Getting Things Done): capture, clarify, organize, reflect, engage
- Zettelkasten: atomic notes, connections, emergence
