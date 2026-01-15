---
layout: text
title: Lab Harness
permalink: /docs/lab-harness/
---

# Experimental Lab Harness

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAB HARNESS DESIGN                                         rev. 2026-01-02 │
│  logging, tracking, reporting for experiment roadmaps                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## I. Log Taxonomy

### Scale Levels

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ LEVEL     │ LINES    │ PURPOSE              │ FREQUENCY      │ AUDIENCE     │
├───────────┼──────────┼──────────────────────┼────────────────┼──────────────┤
│ TRACE     │ 1-10     │ Heartbeat, progress  │ Continuous     │ Machine      │
│ EVENT     │ 10-50    │ Significant actions  │ Per operation  │ Developer    │
│ REPORT    │ 50-200   │ Stage completion     │ Per stage      │ Researcher   │
│ MATRIX    │ 100-500  │ Results tables       │ Per experiment │ Publication  │
│ SUMMARY   │ 200-1000 │ Full experiment      │ Per campaign   │ Advisor      │
└───────────┴──────────┴──────────────────────┴────────────────┴──────────────┘
```

### Log Entry Schema

```clojure
{:log/id        #uuid "..."
 :log/timestamp #inst "2026-01-02T14:30:00Z"
 :log/level     :trace | :event | :report | :matrix | :summary
 :log/source    {:experiment "quant-multilingual-001"
                 :stage      "phase-1"
                 :step       "fertility-computation"
                 :run        3}
 :log/status    :started | :running | :success | :warning | :error | :fatal
 :log/message   "Computing fertility for Hebrew..."
 :log/data      {...}  ;; structured payload
 :log/friction  nil | {:type :rate-limit :severity :minor :resolution "retry in 60s"}
 :log/duration  {:started #inst "..." :elapsed-ms 1234}
 :log/metrics   {:progress 0.45 :eta-ms 5000}}
```

---

## II. Friction Classification

```clojure
{:friction/types
 {:rate-limit     {:severity :minor   :auto-resolve true  :typical-delay "60s"}
  :timeout        {:severity :minor   :auto-resolve true  :typical-delay "retry"}
  :oom            {:severity :medium  :auto-resolve false :action "reduce batch"}
  :data-missing   {:severity :medium  :auto-resolve false :action "investigate"}
  :api-error      {:severity :medium  :auto-resolve true  :typical-delay "backoff"}
  :model-error    {:severity :major   :auto-resolve false :action "debug"}
  :hypothesis-fail{:severity :major   :auto-resolve false :action "pivot"}
  :infra-down     {:severity :fatal   :auto-resolve false :action "wait/escalate"}}}
```

---

## III. Example Logs by Scale

### III.1 TRACE Level (Heartbeat)

```
2026-01-02T14:30:00.123Z [TRACE] exp=quant-001 stage=phase-1 step=fertility run=3
2026-01-02T14:30:00.456Z [TRACE] progress=12/200 lang=heb tokens=45231 words=22615
2026-01-02T14:30:00.789Z [TRACE] progress=13/200 lang=ara tokens=38291 words=12097
2026-01-02T14:30:01.012Z [TRACE] progress=14/200 lang=fin tokens=52891 words=21156
2026-01-02T14:30:01.234Z [·····] rate-limit hit, backing off 60s
2026-01-02T14:31:01.456Z [TRACE] resumed, progress=14/200
```

### III.2 EVENT Level (Significant Actions)

```
════════════════════════════════════════════════════════════════════════════════
EVENT: fertility-computation-started
────────────────────────────────────────────────────────────────────────────────
timestamp:   2026-01-02T14:30:00Z
experiment:  quant-multilingual-001
stage:       phase-1 / zero-cost-analysis
step:        A07 / fertility-computation

config:
  corpus:     FLORES-200 dev
  tokenizers: [bloom-7b, aya-8b, qwen2.5-7b]
  languages:  200

status: STARTED
────────────────────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════════════════════
EVENT: fertility-computation-partial
────────────────────────────────────────────────────────────────────────────────
timestamp:   2026-01-02T14:35:00Z
progress:    87/200 languages (43.5%)

friction:
  type:       rate-limit
  count:      3
  resolution: auto-retry after backoff
  total-delay: 180s

partial-results:
  completed:  [eng, deu, fra, heb, ara, fin, tur, jpn, kor, zho, ...]
  pending:    [swa, yor, amh, ...]

metrics:
  throughput: 17.4 langs/min (adjusted for rate limits)
  eta:        ~6.5 min remaining
────────────────────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════════════════════
EVENT: fertility-computation-completed
────────────────────────────────────────────────────────────────────────────────
timestamp:   2026-01-02T14:42:00Z
duration:    12m 00s (includes 3m 00s friction delay)

results:
  languages-processed: 200
  tokenizers:          3
  total-measurements:  600

friction-summary:
  rate-limits:    3 (auto-resolved)
  timeouts:       1 (auto-resolved)
  errors:         0

output:
  file: data/fertility/fertility-2026-01-02.csv
  rows: 600
  checksum: sha256:a1b2c3d4...

next-step: A03 / correlation-analysis
────────────────────────────────────────────────────────────────────────────────
```

### III.3 REPORT Level (Stage Completion)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   STAGE REPORT: Phase 1 / Zero-Cost Analysis                                 ║
║   Experiment: quant-multilingual-001                                         ║
║   Date: 2026-01-02                                                           ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────────┐
│ EXECUTION SUMMARY                                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Started:     2026-01-02T10:00:00Z                                          │
│   Completed:   2026-01-02T18:30:00Z                                          │
│   Duration:    8h 30m (planned: 6h)                                          │
│   Overhead:    2h 30m friction (29%)                                         │
│                                                                              │
│   Steps Completed: 5/5                                                       │
│   ├─ A01 Extract Marchisio tables     [✓] 45m                                │
│   ├─ A02 Merge with WALS              [✓] 30m                                │
│   ├─ A06 Download FLORES              [✓] 20m                                │
│   ├─ A07 Compute fertility            [✓] 2h (incl. 45m friction)            │
│   └─ A03 Correlation analysis         [✓] 1h                                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ FRICTION LOG                                                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Total Friction Events: 7                                                   │
│                                                                              │
│   [minor]  rate-limit ×3        auto-resolved, +3m total                     │
│   [minor]  timeout ×2           auto-resolved, +2m total                     │
│   [medium] OCR-error ×1         manual fix, +30m                             │
│            → Marchisio Table A7 had corrupted characters                     │
│            → Resolution: manual correction of 12 entries                     │
│   [medium] WALS-missing ×1      workaround, +15m                             │
│            → 3 languages missing from WALS (Amharic, Yoruba, Swahili)        │
│            → Resolution: imputed from language family averages               │
│                                                                              │
│   Friction Rate: 7 events / 8.5h = 0.82 events/hour                          │
│   Friction Impact: 29% time overhead                                         │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ KEY RESULTS                                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Hypothesis Tests:                                                          │
│                                                                              │
│   H1 (complexity → degradation):                                             │
│       r = 0.58, p = 0.003, n = 23                                            │
│       Status: [◐] PARTIAL SUPPORT (below 0.7 threshold, but significant)     │
│                                                                              │
│   H2 (fertility mediates):                                                   │
│       Sobel z = 2.34, p = 0.019                                              │
│       Status: [●] SUPPORTED (significant mediation)                          │
│                                                                              │
│   H3 (script independent effect):                                            │
│       β_script = 0.31, p = 0.045, controlling for fertility+complexity       │
│       Status: [◐] PARTIAL SUPPORT (borderline significant)                   │
│                                                                              │
│   Overall Assessment: PROCEED TO PHASE 2                                     │
│   Confidence: 0.65 → 0.72 (Bayesian update)                                  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ ARTIFACTS PRODUCED                                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   data/marchisio/tables-extracted.csv          (23 languages, 6 quant methods)│
│   data/wals/features-merged.csv                (23 languages, 18 features)   │
│   data/fertility/fertility-all.csv             (200 languages, 3 tokenizers) │
│   results/phase1/correlations.json             (correlation matrix)          │
│   results/phase1/mediation-analysis.json       (Baron-Kenny results)         │
│   results/phase1/regression-coefficients.json  (fitted model)                │
│   figures/phase1/correlation-heatmap.png                                     │
│   figures/phase1/fertility-vs-degradation.png                                │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ DECISION POINT                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Question: Proceed to Phase 2?                                              │
│                                                                              │
│   Evidence FOR:                                                              │
│   ├─ H1 significant (p < 0.05) though effect smaller than hoped              │
│   ├─ H2 mediation confirmed                                                  │
│   └─ Novel finding: fertility mediates complexity→degradation path           │
│                                                                              │
│   Evidence AGAINST:                                                          │
│   ├─ r = 0.58 below pre-registered 0.7 threshold                             │
│   ├─ Small n (23 languages from Marchisio)                                   │
│   └─ H3 borderline, may be noise                                             │
│                                                                              │
│   DECISION: PROCEED with adjusted expectations                               │
│   ├─ Lower effect size estimate: r ≈ 0.5-0.6                                 │
│   ├─ Focus on mediation story (stronger finding)                             │
│   └─ Expand n in Phase 2 to increase power                                   │
│                                                                              │
│   Recorded: 2026-01-02T18:30:00Z                                             │
│   Rationale: Significant effects found, story is coherent, worth pursuing    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ NEXT ACTIONS                                                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Immediate (today):                                                         │
│   └─ Update hypothesis registry with new confidence values                   │
│                                                                              │
│   This week:                                                                 │
│   ├─ A08: Download BLOOM-7B weights                                          │
│   ├─ A09: Compute weight statistics                                          │
│   └─ Write up Phase 1 as internal tech report                                │
│                                                                              │
│   Phase 2 prep:                                                              │
│   ├─ Select 30 languages for expanded study                                  │
│   ├─ Budget GPU time (estimate: 200h A100)                                   │
│   └─ Set up experiment tracking (MLflow or W&B)                              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

───────────────────────────────────────────────────────────────────────────────
End of Stage Report: Phase 1
Generated: 2026-01-02T18:45:00Z
───────────────────────────────────────────────────────────────────────────────
```

### III.4 MATRIX Level (Results Tables)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  RESULTS MATRIX: Fertility × Degradation × Model                             ║
║  Experiment: quant-multilingual-001 / Phase 2                                ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────────┐
│ TABLE 1: Tokenization Fertility by Language and Tokenizer                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ Language    │ ISO │ BLOOM  │ Aya    │ Qwen   │ Mean   │ Std    │ Type       │
│ ────────────┼─────┼────────┼────────┼────────┼────────┼────────┼─────────── │
│ English     │ eng │ 1.18   │ 1.22   │ 1.15   │ 1.18   │ 0.03   │ isolating  │
│ German      │ deu │ 1.62   │ 1.71   │ 1.58   │ 1.64   │ 0.07   │ fusional   │
│ French      │ fra │ 1.45   │ 1.52   │ 1.41   │ 1.46   │ 0.06   │ fusional   │
│ Spanish     │ spa │ 1.38   │ 1.44   │ 1.35   │ 1.39   │ 0.05   │ fusional   │
│ Russian     │ rus │ 1.89   │ 2.01   │ 1.85   │ 1.92   │ 0.08   │ fusional   │
│ Hebrew      │ heb │ 2.05   │ 2.18   │ 1.98   │ 2.07   │ 0.10   │ fusional   │
│ Arabic      │ ara │ 2.78   │ 3.12   │ 2.65   │ 2.85   │ 0.24   │ fusional   │
│ Turkish     │ tur │ 2.34   │ 2.51   │ 2.28   │ 2.38   │ 0.12   │ agglut.    │
│ Finnish     │ fin │ 2.45   │ 2.62   │ 2.38   │ 2.48   │ 0.12   │ agglut.    │
│ Hungarian   │ hun │ 2.52   │ 2.71   │ 2.45   │ 2.56   │ 0.13   │ agglut.    │
│ Japanese    │ jpn │ 2.28   │ 2.45   │ 2.21   │ 2.31   │ 0.12   │ agglut.    │
│ Korean      │ kor │ 2.15   │ 2.32   │ 2.08   │ 2.18   │ 0.12   │ agglut.    │
│ Mandarin    │ cmn │ 1.85   │ 1.92   │ 1.78   │ 1.85   │ 0.07   │ isolating  │
│ Vietnamese  │ vie │ 1.72   │ 1.81   │ 1.68   │ 1.74   │ 0.07   │ isolating  │
│ Thai        │ tha │ 2.95   │ 3.21   │ 2.82   │ 2.99   │ 0.20   │ isolating* │
│ ────────────┴─────┴────────┴────────┴────────┴────────┴────────┴─────────── │
│ * Thai has no word boundaries, fertility computed on syllable estimate      │
│                                                                              │
│ Summary Statistics:                                                          │
│   Mean fertility:      2.03 (σ = 0.52)                                       │
│   Range:               1.18 (eng) - 2.99 (tha)                               │
│   Tokenizer agreement: Pearson r = 0.97 (BLOOM vs Aya)                       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ TABLE 2: Perplexity Degradation (Δ%) by Language and Bit-Width               │
│          Model: BLOOM-7B, Method: AWQ                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ Language    │ FP16   │ W8     │ W6     │ W4     │ W3     │ Threshold │       │
│             │ (base) │ Δ%     │ Δ%     │ Δ%     │ Δ%     │ b*        │       │
│ ────────────┼────────┼────────┼────────┼────────┼────────┼───────────│       │
│ English     │ 8.21   │ +0.1%  │ +0.3%  │ +0.8%  │ +2.1%  │ 3.2       │ [✓]   │
│ German      │ 9.45   │ +0.2%  │ +0.5%  │ +1.2%  │ +3.5%  │ 3.6       │ [✓]   │
│ French      │ 8.89   │ +0.1%  │ +0.4%  │ +1.0%  │ +2.8%  │ 3.4       │ [✓]   │
│ Spanish     │ 8.67   │ +0.1%  │ +0.3%  │ +0.9%  │ +2.5%  │ 3.3       │ [✓]   │
│ Russian     │ 11.23  │ +0.3%  │ +0.8%  │ +2.1%  │ +5.8%  │ 4.0       │ [~]   │
│ Hebrew      │ 12.45  │ +0.4%  │ +1.2%  │ +3.2%  │ +8.1%  │ 4.3       │ [!]   │
│ Arabic      │ 14.21  │ +0.5%  │ +1.5%  │ +4.1%  │ +10.5% │ 4.6       │ [!]   │
│ Turkish     │ 13.12  │ +0.4%  │ +1.3%  │ +3.5%  │ +9.2%  │ 4.4       │ [!]   │
│ Finnish     │ 13.56  │ +0.4%  │ +1.4%  │ +3.8%  │ +9.8%  │ 4.5       │ [!]   │
│ Hungarian   │ 14.02  │ +0.5%  │ +1.5%  │ +4.0%  │ +10.2% │ 4.6       │ [!]   │
│ Japanese    │ 10.89  │ +0.3%  │ +1.0%  │ +2.8%  │ +7.2%  │ 4.1       │ [~]   │
│ Korean      │ 11.45  │ +0.3%  │ +0.9%  │ +2.5%  │ +6.5%  │ 4.0       │ [~]   │
│ Mandarin    │ 9.78   │ +0.2%  │ +0.5%  │ +1.4%  │ +3.8%  │ 3.7       │ [✓]   │
│ Vietnamese  │ 10.12  │ +0.2%  │ +0.6%  │ +1.6%  │ +4.2%  │ 3.8       │ [✓]   │
│ Thai        │ 15.34  │ +0.6%  │ +1.8%  │ +4.8%  │ +12.1% │ 4.8       │ [!]   │
│ ────────────┴────────┴────────┴────────┴────────┴────────┴───────────┴────── │
│                                                                              │
│ Legend: [✓] W4-safe  [~] W4-marginal  [!] Needs W6+ for quality              │
│ Threshold b* = min bit-width for Δ < 5%                                      │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ TABLE 3: Correlation Matrix                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                  │ Δ@W4   │ fert.  │ compl. │ script │ train  │ PPL_base    │
│ ─────────────────┼────────┼────────┼────────┼────────┼────────┼──────────── │
│ Δ@W4             │ 1.00   │        │        │        │        │             │
│ fertility        │ 0.72***│ 1.00   │        │        │        │             │
│ complexity       │ 0.58** │ 0.65** │ 1.00   │        │        │             │
│ script (non-Lat) │ 0.51*  │ 0.42*  │ 0.38   │ 1.00   │        │             │
│ training_size    │-0.35   │-0.28   │-0.15   │-0.52*  │ 1.00   │             │
│ PPL_baseline     │ 0.68***│ 0.71***│ 0.55** │ 0.48*  │-0.41*  │ 1.00        │
│ ─────────────────┴────────┴────────┴────────┴────────┴────────┴──────────── │
│                                                                              │
│ Significance: * p<0.05  ** p<0.01  *** p<0.001                               │
│ n = 15 languages                                                             │
│                                                                              │
│ Key finding: fertility (r=0.72) > complexity (r=0.58) > script (r=0.51)      │
│ Note: fertility and baseline PPL highly correlated (r=0.71) - collinearity   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ TABLE 4: Threshold Function Fit                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ Model: b*(L) = β₀ + β₁·fertility + β₂·complexity + β₃·I(non-Latin)          │
│                                                                              │
│ Coefficient    │ Estimate │ Std.Err │ t-value │ p-value │ 95% CI            │
│ ───────────────┼──────────┼─────────┼─────────┼─────────┼────────────────── │
│ β₀ (intercept) │ 2.45     │ 0.32    │ 7.66    │ <0.001  │ [1.78, 3.12]      │
│ β₁ (fertility) │ 0.58     │ 0.12    │ 4.83    │ 0.001   │ [0.32, 0.84]      │
│ β₂ (complexity)│ 0.08     │ 0.03    │ 2.67    │ 0.021   │ [0.01, 0.15]      │
│ β₃ (script)    │ 0.25     │ 0.15    │ 1.67    │ 0.121   │ [-0.08, 0.58]     │
│ ───────────────┴──────────┴─────────┴─────────┴─────────┴────────────────── │
│                                                                              │
│ Model Fit:                                                                   │
│   R² = 0.71                                                                  │
│   Adjusted R² = 0.63                                                         │
│   RMSE = 0.38 bits                                                           │
│   F(3,11) = 8.94, p = 0.003                                                  │
│                                                                              │
│ Validation (held-out, n=5):                                                  │
│   RMSE = 0.45 bits                                                           │
│   Mean absolute error = 0.38 bits                                            │
│   Within ±0.5 bits: 4/5 (80%)                                                │
│                                                                              │
│ Interpretation:                                                              │
│   • Each +1.0 fertility → +0.58 bits threshold                               │
│   • Each +1 complexity point → +0.08 bits threshold                          │
│   • Non-Latin script → +0.25 bits (but not significant, p=0.12)              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### III.5 SUMMARY Level (Full Experiment)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   ██╗      █████╗ ██████╗     ██████╗ ███████╗██████╗  ██████╗ ██████╗ ████████╗
║   ██║     ██╔══██╗██╔══██╗    ██╔══██╗██╔════╝██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝
║   ██║     ███████║██████╔╝    ██████╔╝█████╗  ██████╔╝██║   ██║██████╔╝   ██║
║   ██║     ██╔══██║██╔══██╗    ██╔══██╗██╔══╝  ██╔═══╝ ██║   ██║██╔══██╗   ██║
║   ███████╗██║  ██║██████╔╝    ██║  ██║███████╗██║     ╚██████╔╝██║  ██║   ██║
║   ╚══════╝╚═╝  ╚═╝╚═════╝     ╚═╝  ╚═╝╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝
║                                                                              ║
║   Experiment: quant-multilingual-001                                         ║
║   Campaign: Linguistic Typology & LLM Quantization                           ║
║   Duration: 2026-01-02 to 2026-02-15 (6 weeks)                               ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTIVE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We investigated whether linguistic typology predicts LLM quantization sensitivity.
Across 30 languages and 3 models, we found:

  [●] CONFIRMED: Tokenization fertility predicts degradation (r=0.72, p<0.001)
  [●] CONFIRMED: Morphological complexity predicts degradation (r=0.58, p<0.01)
  [◐] PARTIAL:   Script type has marginal effect (r=0.51, p=0.05)
  [●] CONFIRMED: Threshold function achieves R²=0.71, RMSE=0.38 bits

  MAIN FINDING: W4 quantization is systematically unfair to morphologically
  rich languages. Arabic and Hebrew require ~4.5 bits to match English at 3.2 bits.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROADMAP TRAVERSAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 1: Zero-Cost Analysis                                    [████████████] ✓
├─ A01 Extract Marchisio tables                               [████████████] ✓
├─ A02 Merge with WALS features                               [████████████] ✓
├─ A06 Download FLORES-200                                    [████████████] ✓
├─ A07 Compute fertility                                      [████████████] ✓
├─ A03 Correlation analysis                                   [████████████] ✓
├─ A04 Mediation analysis                                     [████████████] ✓
└─ A05 Go/no-go decision                                      [████████████] ✓ → PROCEED

Phase 2: Controlled Experiments                                [████████████] ✓
├─ A08 Download model weights                                 [████████████] ✓
├─ A09 Compute weight statistics                              [████████████] ✓
├─ Quantize BLOOM-7B (W8,W6,W4,W3 × 30 langs)                [████████████] ✓
├─ Quantize Aya-8B (W8,W6,W4,W3 × 30 langs)                  [████████████] ✓
├─ Evaluate perplexity                                        [████████████] ✓
├─ A10 Fit threshold function                                 [████████████] ✓
└─ A11 Validate on held-out                                   [████████████] ✓

Phase 3: Mechanistic Analysis                                  [████░░░░░░░░] 33%
├─ Mixed-precision experiments                                [████████████] ✓
├─ Layer sensitivity matrix                                   [████████░░░░] 67%
├─ Probing experiments                                        [░░░░░░░░░░░░] 0%  ← CURRENT
└─ Weight distribution analysis                               [░░░░░░░░░░░░] 0%

Phase 4: Intervention (Future)                                 [░░░░░░░░░░░░] 0%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESOURCE UTILIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                        Planned      Actual       Delta
GPU Hours (A100):       210h         248h         +18%
API Calls:              5,000        6,234        +25%
Storage (GB):           50           67           +34%
Human Hours:            80h          95h          +19%
Calendar Days:          42           44           +5%
Total Cost:             $420         $512         +22%

Friction Overhead:
├─ Rate limits:         +12h         (auto-resolved)
├─ OOM errors:          +8h          (batch size tuning)
├─ Data issues:         +6h          (manual fixes)
├─ Infrastructure:      +4h          (setup, debugging)
└─ Unexpected findings: +8h          (exploratory detours)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HYPOTHESIS OUTCOMES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ID   Claim                                    Prior   Posterior   Outcome
───────────────────────────────────────────────────────────────────────────────
H0   Info density → quant sensitivity         0.70    0.88        [●] CONFIRMED
H1   Fertility is proxy, not causal           0.60    0.72        [●] CONFIRMED
H2   Complexity is true predictor             0.65    0.78        [●] CONFIRMED
H3   Script has independent effect            0.55    0.52        [◐] UNCERTAIN
H4   Threshold function is predictive         0.50    0.85        [●] CONFIRMED
H5   Layer sensitivity varies by lang type    0.45    0.61        [◐] PARTIAL
H6   Weight×activation interaction            0.40    0.45        [~] UNTESTED

Bayesian update method: Approximate, based on evidence strength and sample size.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRICTION ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Friction Events: 47

By Type:
  rate-limit      ████████████████████  23  (49%)  auto-resolved
  timeout         ████████              9   (19%)  auto-resolved
  oom             ████                  5   (11%)  manual batch tuning
  data-missing    ███                   4   (9%)   manual imputation
  api-error       ██                    3   (6%)   auto-resolved
  model-error     █                     2   (4%)   debugging required
  hypothesis-fail █                     1   (2%)   pivot (H3 weakened)

By Phase:
  Phase 1:  7 events  (15%)  - mostly data issues
  Phase 2: 31 events  (66%)  - heavy compute, many rate limits
  Phase 3:  9 events  (19%)  - ongoing

Friction Patterns Identified:
  • Rate limits cluster during batch inference runs
  • OOM errors correlate with Arabic (longest sequences)
  • API errors spike during peak hours (US afternoon)

Mitigation Effectiveness:
  • Exponential backoff: 95% success rate
  • Batch size reduction: 100% resolved OOM
  • Off-peak scheduling: 40% reduction in API errors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARTIFACTS INDEX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Data:
├─ data/marchisio/tables-extracted.csv
├─ data/wals/features-merged.csv
├─ data/fertility/fertility-all.csv
├─ data/perplexity/bloom-7b-all.csv
├─ data/perplexity/aya-8b-all.csv
└─ data/layer-sensitivity/sensitivity-matrix.csv

Results:
├─ results/phase1/correlations.json
├─ results/phase1/mediation-analysis.json
├─ results/phase2/threshold-function.json
├─ results/phase2/validation-holdout.json
└─ results/phase3/layer-sensitivity.json

Figures:
├─ figures/correlation-heatmap.png
├─ figures/fertility-vs-degradation.png
├─ figures/threshold-function-fit.png
├─ figures/layer-sensitivity-matrix.png
└─ figures/language-typology-map.png

Reports:
├─ reports/phase1-report.md
├─ reports/phase2-report.md
└─ reports/phase3-report-partial.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONCLUSIONS & NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Conclusions:
1. Linguistic typology predicts quantization sensitivity (main claim supported)
2. Fertility is the strongest predictor, complexity adds signal
3. Threshold function achieves practical predictive accuracy
4. Mechanistic understanding still incomplete (Phase 3 ongoing)

Remaining Work:
├─ Complete probing experiments (2 weeks)
├─ Complete weight distribution analysis (1 week)
├─ Write up results as paper draft (2 weeks)
└─ Phase 4: Intervention experiments (future work)

Publication Target:
├─ Venue: EMNLP 2026 or ACL 2026
├─ Submission deadline: ~April 2026
└─ Status: On track

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated: 2026-02-15T18:00:00Z
Experiment ID: quant-multilingual-001
Checksum: sha256:e5f6g7h8...
```

---

## IV. Harness Architecture

### IV.1 Core Components

```clojure
;; src/lab/core.clj

(ns lab.core
  (:require [lab.log :as log]
            [lab.roadmap :as roadmap]
            [lab.friction :as friction]
            [lab.report :as report]))

;; === State Atom ===
(defonce lab-state
  (atom {:experiment nil
         :roadmap nil
         :current-stage nil
         :current-step nil
         :logs []
         :friction-events []
         :artifacts []
         :metrics {}
         :started nil
         :status :idle}))

;; === Experiment Definition ===
(defn define-experiment
  [{:keys [id name roadmap config]}]
  (swap! lab-state assoc
         :experiment {:id id :name name :config config}
         :roadmap (roadmap/parse roadmap)
         :status :defined
         :started (java.time.Instant/now)))

;; === Step Execution Wrapper ===
(defmacro with-step
  "Execute a step with logging, timing, and friction handling."
  [{:keys [stage step description]} & body]
  `(let [step-id# (str ~stage "/" ~step)
         start# (System/currentTimeMillis)]
     (log/event :step-started {:stage ~stage :step ~step :desc ~description})
     (swap! lab-state assoc :current-stage ~stage :current-step ~step)
     (try
       (let [result# (do ~@body)]
         (log/event :step-completed
                    {:stage ~stage
                     :step ~step
                     :duration-ms (- (System/currentTimeMillis) start#)
                     :result (summarize result#)})
         (roadmap/mark-complete! lab-state step-id#)
         result#)
       (catch Exception e#
         (friction/handle! lab-state e# {:stage ~stage :step ~step})
         (throw e#)))))

;; === Progress Heartbeat ===
(defn start-heartbeat!
  "Start background thread emitting trace logs."
  [interval-ms]
  (future
    (while (not= (:status @lab-state) :completed)
      (log/trace {:progress (roadmap/progress @lab-state)
                  :current (:current-step @lab-state)
                  :friction-count (count (:friction-events @lab-state))})
      (Thread/sleep interval-ms))))
```

### IV.2 Logging System

```clojure
;; src/lab/log.clj

(ns lab.log
  (:require [clojure.java.io :as io]
            [cheshire.core :as json]))

(def ^:dynamic *log-level* :event)
(def ^:dynamic *log-outputs* [:console :file :structured])

(defn- level-rank [level]
  ({:trace 0 :event 1 :report 2 :matrix 3 :summary 4} level))

(defn- should-log? [level]
  (>= (level-rank level) (level-rank *log-level*)))

(defn- timestamp []
  (.toString (java.time.Instant/now)))

(defn- format-console [level message data]
  (case level
    :trace  (str (timestamp) " [TRACE] " message)
    :event  (str "\n" (apply str (repeat 80 "=")) "\n"
                 "EVENT: " message "\n"
                 (apply str (repeat 80 "-")) "\n"
                 (with-out-str (clojure.pprint/pprint data)))
    :report (str "\n" (apply str (repeat 80 "═")) "\n"
                 "REPORT: " message "\n"
                 (apply str (repeat 80 "═")) "\n"
                 (format-report data))
    :matrix (format-matrix message data)
    :summary (format-summary message data)))

(defn- write-structured! [entry]
  (spit "logs/structured.jsonl"
        (str (json/generate-string entry) "\n")
        :append true))

(defn log!
  [level message data]
  (when (should-log? level)
    (let [entry {:timestamp (timestamp)
                 :level level
                 :message message
                 :data data
                 :experiment (get-in @lab.core/lab-state [:experiment :id])
                 :stage (:current-stage @lab.core/lab-state)
                 :step (:current-step @lab.core/lab-state)}]
      (when (contains? (set *log-outputs*) :console)
        (println (format-console level message data)))
      (when (contains? (set *log-outputs*) :file)
        (spit (str "logs/" (name level) ".log")
              (format-console level message data)
              :append true))
      (when (contains? (set *log-outputs*) :structured)
        (write-structured! entry)))))

;; Convenience functions
(defn trace [data] (log! :trace "" data))
(defn event [message data] (log! :event message data))
(defn report [title data] (log! :report title data))
(defn matrix [title data] (log! :matrix title data))
(defn summary [title data] (log! :summary title data))
```

### IV.3 Friction Handler

```clojure
;; src/lab/friction.clj

(ns lab.friction
  (:require [lab.log :as log]))

(def friction-types
  {:rate-limit     {:severity :minor  :auto-resolve true  :strategy :backoff}
   :timeout        {:severity :minor  :auto-resolve true  :strategy :retry}
   :oom            {:severity :medium :auto-resolve false :strategy :reduce-batch}
   :data-missing   {:severity :medium :auto-resolve false :strategy :impute-or-skip}
   :api-error      {:severity :medium :auto-resolve true  :strategy :backoff}
   :model-error    {:severity :major  :auto-resolve false :strategy :debug}
   :hypothesis-fail{:severity :major  :auto-resolve false :strategy :pivot}})

(defn classify-exception [e]
  (let [msg (.getMessage e)]
    (cond
      (re-find #"rate.?limit" msg) :rate-limit
      (re-find #"timeout" msg) :timeout
      (re-find #"out of memory|OOM|CUDA" msg) :oom
      (re-find #"not found|missing" msg) :data-missing
      (re-find #"api|http|5\d\d" msg) :api-error
      :else :unknown)))

(defn handle!
  [state-atom exception context]
  (let [friction-type (classify-exception exception)
        friction-info (get friction-types friction-type {:severity :unknown})
        event {:type friction-type
               :severity (:severity friction-info)
               :auto-resolve (:auto-resolve friction-info)
               :strategy (:strategy friction-info)
               :context context
               :exception-msg (.getMessage exception)
               :timestamp (java.time.Instant/now)}]

    ;; Log the friction event
    (log/event "friction-encountered" event)

    ;; Record in state
    (swap! state-atom update :friction-events conj event)

    ;; Attempt auto-resolution if possible
    (when (:auto-resolve friction-info)
      (case (:strategy friction-info)
        :backoff (do
                   (log/trace {:action "backing off" :delay-ms 60000})
                   (Thread/sleep 60000))
        :retry   (log/trace {:action "will retry"})
        nil))

    ;; Return friction info for caller to handle
    event))

(defn summarize-friction [friction-events]
  {:total (count friction-events)
   :by-type (frequencies (map :type friction-events))
   :by-severity (frequencies (map :severity friction-events))
   :auto-resolved (count (filter :auto-resolve friction-events))
   :manual-required (count (remove :auto-resolve friction-events))})
```

### IV.4 Roadmap Tracker

```clojure
;; src/lab/roadmap.clj

(ns lab.roadmap)

(defn parse
  "Parse roadmap definition into executable structure."
  [roadmap-def]
  (let [steps (for [[phase-id phase] (:phases roadmap-def)
                    [step-id step] (:steps phase)]
                {:id (str (name phase-id) "/" (name step-id))
                 :phase phase-id
                 :step step-id
                 :description (:description step)
                 :depends-on (:depends-on step #{})
                 :status :pending
                 :started nil
                 :completed nil})]
    {:phases (:phases roadmap-def)
     :steps (into {} (map (juxt :id identity) steps))
     :order (mapv :id steps)}))

(defn mark-complete!
  [state-atom step-id]
  (swap! state-atom update-in [:roadmap :steps step-id]
         assoc :status :completed
               :completed (java.time.Instant/now)))

(defn progress
  "Calculate overall progress as fraction."
  [state]
  (let [steps (vals (get-in state [:roadmap :steps]))
        completed (count (filter #(= :completed (:status %)) steps))
        total (count steps)]
    {:completed completed
     :total total
     :fraction (if (zero? total) 0 (/ completed total))
     :percent (if (zero? total) 0 (* 100 (/ completed total)))}))

(defn next-steps
  "Get steps that are ready to run (dependencies satisfied)."
  [state]
  (let [steps (get-in state [:roadmap :steps])
        completed-ids (set (map :id (filter #(= :completed (:status %)) (vals steps))))]
    (->> (vals steps)
         (filter #(= :pending (:status %)))
         (filter #(every? completed-ids (:depends-on %)))
         (map :id))))

(defn format-progress-bar
  "ASCII progress bar."
  [progress width]
  (let [filled (int (* width (:fraction progress)))
        empty (- width filled)]
    (str "[" (apply str (repeat filled "█"))
         (apply str (repeat empty "░")) "]"
         " " (:completed progress) "/" (:total progress))))
```

### IV.5 Report Generator

```clojure
;; src/lab/report.clj

(ns lab.report
  (:require [lab.log :as log]
            [clojure.string :as str]))

(defn generate-stage-report
  [state stage-id]
  (let [experiment (:experiment state)
        steps (->> (vals (get-in state [:roadmap :steps]))
                   (filter #(= stage-id (:phase %))))
        friction (filter #(= stage-id (get-in % [:context :stage]))
                         (:friction-events state))
        duration (reduce + (map #(or (some-> % :completed (.toEpochMilli)
                                            (- (some-> % :started (.toEpochMilli))))
                                     0)
                               steps))]
    {:stage stage-id
     :experiment (:id experiment)
     :steps (map #(select-keys % [:id :status :started :completed]) steps)
     :steps-completed (count (filter #(= :completed (:status %)) steps))
     :steps-total (count steps)
     :duration-ms duration
     :friction-events (count friction)
     :friction-summary (lab.friction/summarize-friction friction)}))

(defn generate-matrix-report
  [data {:keys [title rows cols value-key]}]
  (let [header (cons "" cols)
        body (for [r rows]
               (cons r (for [c cols]
                         (get-in data [r c value-key] "-"))))]
    {:title title
     :header header
     :body body
     :summary (calculate-summary data)}))

(defn generate-summary-report
  [state]
  (let [experiment (:experiment state)
        roadmap (:roadmap state)
        friction (:friction-events state)
        progress (lab.roadmap/progress state)]
    {:experiment experiment
     :progress progress
     :phases (for [[phase-id phase] (:phases roadmap)]
               (generate-stage-report state phase-id))
     :friction-summary (lab.friction/summarize-friction friction)
     :artifacts (:artifacts state)
     :metrics (:metrics state)
     :generated (java.time.Instant/now)}))

;; ASCII formatting
(defn format-box [title content width]
  (let [border (apply str (repeat width "─"))
        top (str "┌" border "┐")
        bottom (str "└" border "┘")
        pad (fn [s] (let [len (count s)
                         padding (- width len)]
                     (str "│ " s (apply str (repeat (- padding 2) " ")) "│")))]
    (str/join "\n" (concat [top (pad title)] (map pad content) [bottom]))))
```

---

## V. Example Roadmap Definition

```clojure
;; experiments/quant-multilingual.edn

{:id "quant-multilingual-001"
 :name "Linguistic Typology & LLM Quantization"
 :config {:models ["bloom-7b" "aya-8b"]
          :languages 30
          :bit-widths [8 6 4 3]
          :quality-threshold 0.05}

 :phases
 {:phase-1
  {:name "Zero-Cost Analysis"
   :steps
   {:A01 {:description "Extract Marchisio tables"
          :depends-on #{}}
    :A02 {:description "Merge with WALS features"
          :depends-on #{:A01}}
    :A06 {:description "Download FLORES-200"
          :depends-on #{}}
    :A07 {:description "Compute fertility"
          :depends-on #{:A06}}
    :A03 {:description "Correlation analysis"
          :depends-on #{:A01 :A02 :A07}}
    :A04 {:description "Mediation analysis"
          :depends-on #{:A03}}
    :A05 {:description "Go/no-go decision"
          :depends-on #{:A04}}}}

  :phase-2
  {:name "Controlled Experiments"
   :steps
   {:A08 {:description "Download model weights"
          :depends-on #{:A05}}
    :A09 {:description "Compute weight statistics"
          :depends-on #{:A08}}
    :quant-bloom {:description "Quantize BLOOM-7B"
                  :depends-on #{:A08}}
    :quant-aya {:description "Quantize Aya-8B"
                :depends-on #{:A08}}
    :eval-ppl {:description "Evaluate perplexity"
               :depends-on #{:quant-bloom :quant-aya}}
    :A10 {:description "Fit threshold function"
          :depends-on #{:eval-ppl}}
    :A11 {:description "Validate on held-out"
          :depends-on #{:A10}}}}

  :phase-3
  {:name "Mechanistic Analysis"
   :steps
   {:mixed-prec {:description "Mixed-precision experiments"
                 :depends-on #{:A11}}
    :layer-sens {:description "Layer sensitivity matrix"
                 :depends-on #{:mixed-prec}}
    :probing {:description "Probing experiments"
              :depends-on #{:A11}}
    :weight-dist {:description "Weight distribution analysis"
                  :depends-on #{:A09}}}}}}
```

---

## VI. Usage Example

```clojure
;; Run experiment

(require '[lab.core :as lab]
         '[lab.log :as log])

;; Load experiment definition
(def exp-def (edn/read-string (slurp "experiments/quant-multilingual.edn")))

;; Initialize
(lab/define-experiment exp-def)
(lab/start-heartbeat! 5000)

;; Execute Phase 1
(lab/with-step {:stage :phase-1 :step :A01 :description "Extract Marchisio tables"}
  (extract-marchisio-tables!))

(lab/with-step {:stage :phase-1 :step :A06 :description "Download FLORES-200"}
  (download-flores!))

;; ... etc

;; Generate reports
(log/report "Phase 1 Complete" (lab.report/generate-stage-report @lab/lab-state :phase-1))
(log/summary "Experiment Summary" (lab.report/generate-summary-report @lab/lab-state))
```

---

*Last updated: 2026-01-02*
