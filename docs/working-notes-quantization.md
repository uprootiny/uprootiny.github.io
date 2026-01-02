# Working Notes: Linguistic Typology & Quantization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  WORKING DOCUMENT                                           rev. 2026-01-02 │
│  status: accumulating                                                       │
│  confidence: provisional                                                    │
│  for: personal rework, not circulation                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Revision Log

| Rev | Date | Changes | Confidence Δ |
|-----|------|---------|--------------|
| 0.1 | 2026-01-02 | Initial dump from conversation | baseline |
| 0.2 | 2026-01-02 | Added epistemic layers, actionables tracker | +0.1 overall |
| — | — | [after A05] expect major revision | TBD |

## Document Map

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   ┌─────────────┐                                                            │
│   │ Visual      │  ← how to read this document                               │
│   │ Grammar     │                                                            │
│   └──────┬──────┘                                                            │
│          │                                                                   │
│   ┌──────▼──────┐     ┌──────────────┐     ┌──────────────┐                  │
│   │ Actionables │────▶│ Hypothesis   │────▶│ Decision     │                  │
│   │ Tracker     │     │ Registry     │     │ Log          │                  │
│   └──────┬──────┘     └──────┬───────┘     └──────────────┘                  │
│          │                   │                                               │
│   ┌──────▼───────────────────▼──────┐                                        │
│   │  I. Core Intuition              │  ← the crack in the wall               │
│   └──────┬──────────────────────────┘                                        │
│          │                                                                   │
│   ┌──────▼──────────────────────────┐                                        │
│   │  II. The Predictors             │  ← fertility, complexity, script       │
│   │      II.1 Fertility             │                                        │
│   │      II.2 Complexity            │                                        │
│   │      II.3 Script                │                                        │
│   └──────┬──────────────────────────┘                                        │
│          │                                                                   │
│   ┌──────▼──────────────────────────┐                                        │
│   │  III. Threshold Function        │  ← the deliverable equation            │
│   └──────┬──────────────────────────┘                                        │
│          │                                                                   │
│   ┌──────▼──────────────────────────┐                                        │
│   │  IV. Mechanistic Question       │  ← why does this happen?               │
│   └──────┬──────────────────────────┘                                        │
│          │                                                                   │
│   ┌──────▼──────────────────────────┐                                        │
│   │  V. Existing Artifacts          │  ← what's already out there            │
│   └──────┬──────────────────────────┘                                        │
│          │                                                                   │
│   ┌──────▼──────────────────────────┐                                        │
│   │  VI. Zero-Cost Experiments      │  ← what to do first (no GPU)           │
│   └──────┬──────────────────────────┘                                        │
│          │                                                                   │
│   ┌──────▼──────┐     ┌──────────────┐                                       │
│   │ VII. Refs   │     │ VIII. Threads│  ← parking lot                        │
│   └─────────────┘     └──────────────┘                                       │
│          │                                                                   │
│   ┌──────▼──────────────────────────┐                                        │
│   │  IX. Marginalia Overflow        │  ← extended thoughts                   │
│   └─────────────────────────────────┘                                        │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Visual Grammar

### Layer 0: Basic Annotations
```
[ ]         quick note, inline thought
[  ]        marginalia, elaboration
[   ]       extended commentary, digression
[    ]      meta-level, epistemic status
[     ]     philosophical aside, may skip
```

### Layer 1: Epistemic Status
```
[○]         observation (empirical fact)
[△]         hypothesis (testable claim)
[◇]         conjecture (speculative, hard to test)
[●]         confirmed (tested, held up)
[◐]         partial support (mixed evidence)
[⊥]         falsified (tested, failed)
[~]         uncertain (coin flip)
```

### Layer 2: Confidence Gradients
```
[p≈0.9]     high confidence, would bet on it
[p≈0.7]     moderate confidence, more likely than not
[p≈0.5]     uncertain, need more data
[p≈0.3]     skeptical, probably wrong but worth checking
[p≈0.1]     long shot, included for completeness
```

### Layer 3: Actionables
```
[TODO]      action required, blocking
[TODO?]     action optional, nice-to-have
[WAIT]      blocked on external dependency
[NEXT]      immediate next action
[LATER]     deferred, low priority
[DONE]      completed
[SKIP]      decided not to do
```

### Layer 4: Relational
```
[ref:N]     reference to item N
[cf:N]      compare with item N
[contra:N]  tension with item N
[extends:N] builds on item N
[requires:N] depends on item N
[enables:N] unlocks item N
[←]         depends on previous
[→]         leads to next
```

### Layer 5: Temporal
```
[t:now]     do immediately
[t:week]    this week
[t:month]   this month
[t:phase1]  during Phase 1
[t:someday] no deadline
[t:stale]   information may be outdated
```

### Layer 6: Source Quality
```
[src:1°]    primary source, I verified
[src:2°]    secondary source, cited by others
[src:est]   estimate, not measured
[src:mem]   from memory, may be wrong
[src:llm]   LLM-generated, needs verification
```

### Layer 7: Audience
```
[pub]       safe for public
[priv]      private notes only
[draft]     needs editing before sharing
[raw]       stream of consciousness
```

---

## Actionables Tracker

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ ID    │ ACTION                              │ STATUS │ TIME   │ BLOCKS  │ ENABLES │
├───────┼─────────────────────────────────────┼────────┼────────┼─────────┼─────────┤
│ A01   │ Extract Marchisio tables            │ [NEXT] │ t:now  │ —       │ A02,A03 │
│ A02   │ Merge with WALS features            │ [WAIT] │ t:week │ A01     │ A04     │
│ A03   │ Run correlation analysis            │ [WAIT] │ t:week │ A01,A02 │ A05     │
│ A04   │ Mediation analysis (Baron-Kenny)    │ [WAIT] │ t:week │ A03     │ A05     │
│ A05   │ Go/no-go decision on H1-H3          │ [WAIT] │ t:week │ A04     │ A10     │
├───────┼─────────────────────────────────────┼────────┼────────┼─────────┼─────────┤
│ A06   │ Download FLORES-200 dev             │ [TODO] │ t:now  │ —       │ A07     │
│ A07   │ Compute fertility (3 tokenizers)    │ [WAIT] │ t:week │ A06     │ A03     │
├───────┼─────────────────────────────────────┼────────┼────────┼─────────┼─────────┤
│ A08   │ Load BLOOM-7B fp16 weights          │ [TODO] │ t:week │ —       │ A09     │
│ A09   │ Compute weight statistics by layer  │ [WAIT] │ t:week │ A08     │ A10     │
├───────┼─────────────────────────────────────┼────────┼────────┼─────────┼─────────┤
│ A10   │ Fit threshold function (linear)     │ [WAIT] │ t:month│ A05,A09 │ A11     │
│ A11   │ Test on held-out languages          │ [WAIT] │ t:month│ A10     │ —       │
├───────┼─────────────────────────────────────┼────────┼────────┼─────────┼─────────┤
│ A12   │ Draft email to Soudry               │ [LATER]│ t:month│ A05     │ —       │
└───────┴─────────────────────────────────────┴────────┴────────┴─────────┴─────────┘
```

**Critical Path:** A01 → A02 → A03 → A04 → A05 → A10 → A11

---

## Hypothesis Registry

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ ID  │ CLAIM                                           │ p    │ STATUS │ TEST        │ DEP  │
├─────┼─────────────────────────────────────────────────┼──────┼────────┼─────────────┼──────┤
│ H0  │ Info density/token → quant sensitivity          │ 0.70 │ [△]    │ A03         │ —    │
│ H1  │ Fertility is proxy, not causal                  │ 0.60 │ [△]    │ A04         │ H0   │
│ H2  │ Morphological complexity is true predictor      │ 0.65 │ [△]    │ A03,A04     │ H0   │
│ H3  │ Script has independent effect                   │ 0.55 │ [△]    │ A03         │ H0   │
│ H4  │ Threshold function b*(L) is predictive          │ 0.50 │ [△]    │ A10,A11     │ H2,H3│
│ H5  │ Layer sensitivity varies by language type       │ 0.45 │ [◇]    │ [t:phase2]  │ H4   │
│ H6  │ Weight×activation interaction drives error      │ 0.40 │ [◇]    │ [t:phase2]  │ H5   │
└─────┴─────────────────────────────────────────────────┴──────┴────────┴─────────────┴──────┘
```

**Cascade:** If H0 fails (p<0.3 after A03), consider pivoting to:
- H0': Training data quantity dominates
- H0'': Tokenizer quality dominates
- H0''': It's random noise, no systematic pattern

---

## Decision Log

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ DATE       │ DECISION                                    │ RATIONALE                        │
├────────────┼─────────────────────────────────────────────┼──────────────────────────────────┤
│ 2026-01-02 │ Start with Marchisio re-analysis            │ Zero-cost, high information      │
│            │ Focus on morphology over syntax             │ More data available (WALS)       │
│            │ Use AWQ over GPTQ for experiments           │ Faster, comparable quality       │
│            │ Target Soudry lab specifically              │ Best fit: quant theory + my ling │
├────────────┼─────────────────────────────────────────────┼──────────────────────────────────┤
│ [PENDING]  │ Linear vs. nonlinear threshold function     │ Depends on A05 residual analysis │
│ [PENDING]  │ Which languages for Phase 2                 │ Depends on WALS coverage         │
│ [PENDING]  │ Include human eval or auto-only             │ Cost/benefit, depends on A05     │
└────────────┴─────────────────────────────────────────────┴──────────────────────────────────┘
```

---

## Confidence Calibration

[    ] [p≈0.8] [priv] My confidence estimates:

| Range | Meaning | Expected hit rate |
|-------|---------|-------------------|
| p≈0.9 | Very confident | Should be right 85-95% |
| p≈0.7 | Moderate | Should be right 60-80% |
| p≈0.5 | Uncertain | Coin flip |
| p≈0.3 | Skeptical | Probably wrong |

[  ] Track these. After A05, check calibration: were my p≈0.7 claims right ~70% of the time?

---

## I. The Core Intuition

[    ] [p≈0.9] [src:1°] [pub] this section: high confidence, well-grounded

[○] [p≈0.95] [src:1°] Observation: Quantization hurts languages unequally.

[  ] Marchisio et al. [ref:1] [src:1°] show Japanese at W4: auto metrics say -1.7%, humans say -16%. [!] Ten-fold gap. This is the crack in the wall. [enables:H0]

[   ] [p≈0.7] [src:llm] Why would automatic metrics miss this? Hypothesis: auto metrics (BLEU, chrF) reward surface similarity. Japanese degradation is *semantic*—the meaning shifts while surface tokens stay plausible. Human raters catch meaning drift; n-gram overlap doesn't.

[?] [p≈0.5] Is this specific to Japanese or general to non-Latin scripts? [requires:A03]

[△] **H0**: [p≈0.7] Languages with higher information density per token are more sensitive to quantization noise. [enables:H1,H2,H3]

[  ] [p≈0.8] Information density ~ bits per token. If Hebrew packs more morphological information into each token than English, then quantization noise (which is per-parameter, not per-token) has more semantic impact. [extends:information-theory]

[   ] [p≈0.85] [priv] This is the physics intuition: same noise amplitude, different signal density → different SNR. [     ] Recall: SNR = signal power / noise power. If signal is denser, same noise has larger relative effect.

---

## II. The Predictors

[    ] [this section: medium confidence, needs empirical grounding]

### II.1 Tokenization Fertility

[○] fertility(L) = tokens(L) / words(L) for parallel text

| Language | BLOOM | Aya | GPT-4 est. | [?] verify |
|----------|-------|-----|------------|------------|
| English  | 1.2   | 1.3 | 1.1        |            |
| German   | 1.6   | 1.7 | 1.4        |            |
| Hebrew   | 2.0   | 2.2 | 1.8        | [TODO]     |
| Arabic   | 2.8   | 3.1 | 2.5        | [TODO]     |
| Finnish  | 2.4   | 2.6 | 2.2        |            |

[  ] High fertility = tokenizer struggles = each token carries less information = [contra:H0]?

[   ] Wait. Let me re-examine. High fertility means MORE tokens per word. So information is SPREAD across tokens. This would make the language MORE robust to per-token noise, not less. But empirically, high-fertility languages degrade MORE. [!]

[    ] This suggests fertility is a *proxy* for something else, not the causal mechanism. Fertility correlates with "how badly the tokenizer fits this language" which correlates with "how underrepresented this language was in training data" which...

[△] **H1**: Fertility is proxy for training data representation, not causal.

[←] [cf:II.2]

### II.2 Morphological Complexity

[○] Lupyan-Dale index: -18 (isolating) to 0 (maximal synthesis)

| Language | Index | Type | [ref:2] |
|----------|-------|------|---------|
| Mandarin | -15   | isolating | |
| English  | -12   | weakly fusional | |
| German   | -8    | fusional | |
| Hebrew   | -4    | fusional + nonconcatenative | [  ] root-pattern morphology |
| Arabic   | -3    | fusional + nonconcatenative | |
| Finnish  | -2    | agglutinative | |
| Turkish  | -1    | agglutinative | |

[   ] Morphologically complex languages pack more information into word structure. A single Arabic verb form can encode: tense, aspect, mood, person, number, gender, voice. That's 7+ features in one token. English spreads this across multiple words/tokens.

[△] **H2**: Morphological complexity is the true predictor; fertility is confound.

[  ] Test: partial correlation. Does complexity predict degradation *after controlling for* fertility?

[TODO] Run this on Marchisio data.

### II.3 Script Type

[○] Non-Latin scripts consistently degrade more.

| Script | Languages | Avg Δ@W4 | [?] source |
|--------|-----------|----------|------------|
| Latin  | en, de, fr, es, pt | -0.7% | [ref:1] |
| Arabic | ar | -2.5% | [ref:1] |
| Hebrew | he | -2.1% | [?] estimate |
| Hangul | ko | -1.8% | [ref:1] |
| Kanji/Kana | ja | -2.2% | [ref:1] |
| Cyrillic | ru | -1.2% | [?] |
| Hanzi | zh | -1.3% | [ref:1] |

[  ] But is this script *per se* or correlated factors?

[   ] Script correlates with: training data volume, tokenizer optimization, morphological type, writing direction. Need to disentangle.

[△] **H3**: Script has independent effect after controlling for fertility and complexity.

[  ] Mechanism hypothesis: Embedding initialization. Latin characters share subword statistics with English (dominant training language). Non-Latin characters are more "foreign" to the embedding space, hence more vulnerable to quantization.

[    ] This is testable: compare romanized Arabic (Arabizi) vs. Arabic script in same model.

---

## III. The Threshold Function

[    ] [this section: speculative, needs validation]

[△] **H4**: There exists a predictive function:

```
b*(L) = b_base + α·fertility(L) + β·complexity(L) + γ·I(non-Latin)
```

where b*(L) is minimum bit-width for language L to stay within quality threshold τ.

[  ] This is the deliverable. If we can fit this function, we can:
1. Predict which languages need more precision
2. Design mixed-precision schemes
3. Quantify fairness/equity in model deployment

[   ] The function assumes linearity. Probably wrong. More likely:

```
b*(L) = b_base + f(fertility, complexity, script, training_size, ...)
```

where f is learned or at least nonlinear.

[TODO] Start with linear, test residuals for nonlinearity.

### III.1 Preliminary Estimates

[  ] From eyeballing Marchisio + WALS:

| Language | fertility | complexity | script | predicted b* | [?] |
|----------|-----------|------------|--------|--------------|-----|
| English  | 1.2 | -12 | Latin | 3.2 | |
| German   | 1.6 | -8 | Latin | 3.6 | |
| Hebrew   | 2.0 | -4 | Hebrew | 4.2 | [!] needs 4+ bits |
| Arabic   | 2.8 | -3 | Arabic | 4.5 | [!] needs 4+ bits |
| Finnish  | 2.4 | -2 | Latin | 4.1 | |
| Japanese | 2.3 | -6 | Mixed | 4.3 | |

[   ] If these estimates hold, the implication is: W4 quantization is *systematically unfair* to morphologically rich languages. English gets ~3.2 bits of headroom; Arabic is right at the edge.

[    ] This is a fairness/equity argument for the NLP community. Not just "some languages are harder" but "our methods are biased toward English-like languages."

---

## IV. The Mechanistic Question

[    ] [this section: deep speculation, very uncertain]

[?] *Where* in the network is language-specific information stored?

[○] Belinkov probing work [ref:3] shows:
- Morphological information: concentrated in layers 4-12
- Syntactic information: layers 8-16
- Semantic information: distributed, peaks in later layers

[△] **H5**: Quantization sensitivity is layer-specific AND language-specific.

```
sensitivity(layer, language) = f(info_type(layer), complexity(language, info_type))
```

[  ] Prediction: For agglutinative languages (Turkish, Finnish), FFN layers are more sensitive (morphology is local). For free word-order languages (Russian, Latin), attention layers are more sensitive (syntax is global).

[   ] This is testable via mixed-precision experiments:
- Attention FP4, FFN FP8 → measure per-language
- Attention FP8, FFN FP4 → measure per-language
- Compare sensitivity profiles

[TODO] Design layer-swap experiment.

### IV.1 Weight Distribution Hypothesis

[  ] Quantization error depends on weight distribution. High kurtosis (heavy tails, outliers) → more quantization error.

[△] **H6**: Layers that encode language-specific information have different weight distributions for different languages.

[   ] This is weird to state. The weights are the same for all languages! But the *activations* differ. And quantization of weights affects activations differently depending on input statistics.

[    ] Reformulation: The interaction of (fixed) weight distribution with (language-varying) activation distribution determines effective quantization error.

[  ] This is measurable: run calibration data in different languages, observe activation distributions, predict quantization error.

[TODO] Activation statistics experiment.

---

## V. The Existing Artifacts

[    ] [this section: grounded, actionable]

[!] Before running any experiments, mine the existing landscape.

### V.1 Quantized Models Available

| Model | Sizes | Languages | Quant Available | [ref] |
|-------|-------|-----------|-----------------|-------|
| BLOOM | 560M-176B | 46 | GPTQ, AWQ | HuggingFace |
| Aya | 8B, 35B | 23 | GPTQ | Cohere |
| Qwen2.5 | 0.5B-72B | 29 | GPTQ, AWQ | Alibaba |
| mGPT | 1.3B | 60 | [?] | Sberbank |
| XGLM | 564M-7.5B | 30 | [?] | Meta |

[  ] These are sitting on HuggingFace RIGHT NOW. No GPU time needed to test initial hypotheses.

[TODO] Download BLOOM-7B GPTQ, run per-language perplexity.

### V.2 Existing Benchmarks

| Benchmark | Languages | Tasks | [ref] |
|-----------|-----------|-------|-------|
| FLORES-200 | 200 | MT | Meta |
| XTREME | 40 | 9 tasks | Google |
| XNLI | 15 | NLI | [ref:4] |
| TyDiQA | 11 | QA | Google |

[  ] FLORES-200 is gold for fertility computation. Parallel sentences in 200 languages.

### V.3 Linguistic Databases

| Database | Coverage | Features | [ref] |
|----------|----------|----------|-------|
| WALS | 2600+ | 192 features | [ref:2] |
| Grambank | 2400+ | 195 features | [ref:5] |
| PHOIBLE | 2000+ | phonological | |
| Glottolog | 8000+ | genealogical | |

[  ] WALS + Grambank together give unprecedented typological coverage.

---

## VI. Zero-Cost Experiments

[    ] [this section: immediately actionable]

[!] What can we learn WITHOUT running new models?

### VI.1 Marchisio Re-Analysis

[○] Their paper has Tables A3-A19 with per-language scores.

[TODO]
1. OCR/extract tables
2. Merge with WALS features
3. Run correlations: Δ ~ fertility, complexity, script, training_size
4. Mediation analysis: complexity → fertility → Δ

[  ] Expected output: correlation matrix, regression coefficients, mediation test.

[  ] Go/no-go: If r(complexity, Δ) < 0.3 with p > 0.05, pivot to alternative hypotheses.

### VI.2 Fertility Validation

[TODO]
1. Download FLORES-200 dev set
2. Tokenize with BLOOM, Aya, Qwen tokenizers
3. Compute fertility for all 200 languages
4. Compare to estimates in literature

[  ] This gives us ground truth fertility data, not estimates.

### VI.3 Weight Distribution Analysis

[TODO]
1. Load BLOOM-7B (fp16)
2. Load BLOOM-7B-GPTQ (W4)
3. For each layer: compute kurtosis, outlier ratio, effective rank
4. Correlate with known sensitivity patterns

[  ] Tests H6 without any new training.

---

## VII. References

[ref:1] Marchisio, K. et al. (2024). How does quantization affect multilingual LLMs? EMNLP Findings.

[ref:2] Dryer, M. S. & Haspelmath, M. (2013). WALS Online. Max Planck Institute.

[ref:3] Belinkov, Y. (2022). Probing Classifiers: Promises, Shortcomings, and Advances. Computational Linguistics.

[ref:4] Conneau, A. et al. (2018). XNLI: Evaluating Cross-lingual Sentence Representations. EMNLP.

[ref:5] Skirgård, H. et al. (2023). Grambank reveals the importance of genealogical constraints on linguistic diversity. Science Advances.

---

## VIII. Open Threads

[    ] [for future sessions]

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ THREAD                          │ STATUS        │ NEXT ACTION               │
├─────────────────────────────────┼───────────────┼───────────────────────────┤
│ Marchisio re-analysis           │ ready         │ extract tables            │
│ Fertility validation            │ ready         │ download FLORES           │
│ Weight distribution             │ ready         │ load BLOOM weights        │
│ Layer sensitivity               │ blocked       │ needs GPU for mixed-prec  │
│ Activation statistics           │ blocked       │ needs inference runs      │
│ Probing experiments             │ blocked       │ needs trained probes      │
│ Threshold function fitting      │ blocked       │ needs Phase 1 data        │
│ Mixed-precision design          │ blocked       │ needs Phase 2 data        │
└─────────────────────────────────┴───────────────┴───────────────────────────┘
```

---

## IX. Marginalia Overflow

[   ] [extended thoughts that don't fit elsewhere]

### On the epistemology of this research

[    ] We are not discovering NEW facts about language. We are discovering how EXISTING artifacts (quantized models) interact with EXISTING facts (linguistic typology). The knowledge already exists; we are instrumentalizing it.

[   ] This is closer to archaeology than physics. We're excavating, not experimenting.

### On the politics

[    ] "Multilingual fairness" is becoming a hot topic. This work slots into that discourse. But be careful: the framing matters.

[  ] Bad framing: "Some languages are harder for AI."
[  ] Good framing: "Our methods encode biases toward English-like languages."

[   ] The second framing locates the problem in the method, not the language. This is more accurate AND more actionable.

### On the advisor fit

[    ] Soudry's group does quantization theory. They don't do linguistics. I bring the linguistics; they bring the quantization. This is genuine complementarity, not just "I want to work with famous lab."

[  ] The pitch: "I can extend your methods into a new domain (multilingual) using expertise you don't have (linguistics)."

### On uncertainty

[    ] Everything above might be wrong. The correlations might not hold. The threshold function might not be learnable. The mechanistic hypothesis might be unfalsifiable.

[  ] That's fine. The first phase is cheap (zero-cost analysis). If it fails, we pivot. If it succeeds, we have a real research program.

[   ] The meta-skill is designing experiments that fail fast and fail informatively.

---

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  END OF WORKING NOTES                                                       │
│  next: run zero-cost experiments (VI.1, VI.2, VI.3)                        │
│  checkpoint: after Marchisio re-analysis                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```
