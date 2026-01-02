---
layout: text
title: Questions Ledger
permalink: /docs/ledger-questions/
---

# Questions Ledger

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  OPEN QUESTIONS                                             rev. 2026-01-02 │
│  things we don't know, who might know, how to find out                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Status Key

```
[?]   open, unanswered
[~]   partially answered
[✓]   answered
[!]   blocking, urgent
[◐]   controversial, multiple answers
[⊥]   unanswerable / wrong question
```

---

## I. Core Research Questions

### Q001: Why do some languages degrade more under quantization?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Status:      [?] open                                                       │
│ Priority:    [!] blocking - this IS the research                            │
│ Asked:       2026-01-02                                                     │
│ Answered:    —                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ HYPOTHESES                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ H1: Morphological complexity → more info/token → more noise impact          │
│ H2: Tokenization fertility → proxy for training data representation         │
│ H3: Script type → embedding space structure                                 │
│ H4: All of the above, interacting                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ WHO MIGHT KNOW                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Marchisio et al. - documented the phenomenon, didn't explain              │
│ • Soudry lab - quantization theory, but not multilingual                    │
│ • Multilingual NLP community - may not care about efficiency                │
├─────────────────────────────────────────────────────────────────────────────┤
│ HOW TO FIND OUT                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Zero-cost analysis (A01-A05)                                              │
│ • Controlled experiments (Phase 2)                                          │
│ • Mechanistic analysis (Phase 3)                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Q002: What is the functional form of language-specific precision requirements?

```
Status:      [?] open
Priority:    high
Hypothesis:  b*(L) = b_base + α·fertility + β·complexity + γ·script
Test:        Fit on training languages, validate on held-out
Who knows:   No one yet - this is novel
```

---

### Q003: Which transformer layers are sensitive for which languages?

```
Status:      [?] open
Priority:    medium (Phase 3)
Hypothesis:  Attention for syntax-heavy, FFN for morphology-heavy
Test:        Mixed-precision experiments
Who knows:   Belinkov (probing), Soudry (layer sensitivity)
```

---

## II. Methodological Questions

### Q010: Is the Marchisio auto/human gap real or measurement error?

```
Status:      [~] partially answered
Priority:    high
Evidence:    10× gap seems too large for noise
             But n is small, could be outlier
Test:        Replicate on new model/languages
Who knows:   Marchisio authors (email them?)
```

---

### Q011: How to compute tokenization fertility correctly?

```
Status:      [~] partially answered
Answer:      fertility(L) = tokens(L) / words(L) on parallel text
Caveats:     - What counts as a "word"? (whitespace-split?)
             - Which tokenizer version?
             - Which parallel corpus?
Source:      Standard practice, see FLORES paper
```

---

### Q012: Which WALS features to use for "morphological complexity"?

```
Status:      [~] partially answered
Answer:      Lupyan-Dale index uses 18 features
Caveats:     - Some features missing for some languages
             - Index may be outdated
             - Grambank has different features
Source:      Lupyan & Dale 2010, need to verify computation
```

---

### Q013: How to do mediation analysis correctly?

```
Status:      [?] open
Priority:    medium (for A04)
Approach:    Baron-Kenny method + Sobel test
Caveats:     - Assumes linear relationships
             - Small n may lack power
             - Confounders?
Who knows:   Any statistician, statsmodels docs
```

---

## III. Practical Questions

### Q020: Does Soudry take PhD students from outside Israel?

```
Status:      [?] unknown
How to find: Check Technion international admission
             Look at current lab members' backgrounds
             Email directly
```

---

### Q021: What's the timeline for Fall 2026 PhD admission?

```
Status:      [?] unknown
How to find: Technion graduate admissions website
             Probably: apply by Dec 2025 or Jan 2026
```

---

### Q022: Do I need GRE for Technion?

```
Status:      [?] unknown
How to find: Check admissions requirements
             Probably: not required for Technion
```

---

### Q023: Can I do this research without GPU access?

```
Status:      [~] partially yes
Answer:      Phase 1 (zero-cost) needs no GPU
             Phase 2-4 need GPU
             Colab Pro may suffice for Phase 2
             Lambda/RunPod for Phase 3-4
```

---

## IV. Philosophical Questions

### Q030: Is "linguistic typology predicts X" a valid research program?

```
Status:      [◐] controversial
Arguments FOR:
  - Typology has predictive power (Lupyan-Dale)
  - Cross-linguistic variation is systematic
  - Useful for deployment decisions

Arguments AGAINST:
  - Typology is descriptive, not causal
  - Languages are not independent samples
  - "Predicts" may be spurious correlation

My position:  Valid if we're careful about causality claims
```

---

### Q031: Is this research high-impact or niche?

```
Status:      [~] uncertain
Arguments FOR high-impact:
  - Multilingual AI affects billions
  - Efficiency is bottleneck for deployment
  - Fairness angle is timely

Arguments AGAINST:
  - Small community cares about both NLP + efficiency
  - May be seen as "just benchmarking"
  - Hard to publish if results are null

My position:  High-impact if we find strong signal
              Moderate-impact even if null (documenting fairness issue)
```

---

## V. Questions for Specific People

### For Daniel Soudry

```
- Are you interested in multilingual applications of quantization theory?
- Do you have existing multilingual data from FP4/FP8 experiments?
- What's your current understanding of why some layers are more sensitive?
- Would you consider a student whose strength is linguistics, not math?
```

### For Marchisio et al.

```
- Is the raw data from your experiments available?
- Did you investigate why Japanese showed 10× auto/human gap?
- Are you continuing this line of research?
```

### For Belinkov

```
- Have you applied probing to quantized models?
- What linguistic information would you predict is most sensitive?
```

---

## VI. Answered Questions Archive

### Q100: What bit-widths are used in practice?

```
Status:      [✓] answered
Answer:      W8 (most common), W4 (aggressive), W3 (experimental)
             Activations usually FP8 or FP16
             FP4 is frontier (Soudry lab)
Source:      Survey of quantization literature
Answered:    2026-01-02
```

---

### Q101: What's the main quantization methods zoo?

```
Status:      [✓] answered
Answer:      PTQ: GPTQ, AWQ, SmoothQuant
             QAT: LSQ, PACT
             Recent: FP8/FP4 training (Soudry)
Source:      Survey papers
Answered:    2026-01-02
```

---

## VII. Question Queue

```
┌────────────────────────────────────────────────────────────────────────────┐
│ NEXT QUESTIONS TO INVESTIGATE                                              │
├────────────────────────────────────────────────────────────────────────────┤
│ • What's the correlation between WALS complexity and training data size?   │
│ • Are there quantized multilingual models I haven't found?                 │
│ • What probing tasks exist for morphological features?                     │
│ • How does calibration data language affect quantization quality?          │
│ • Is there prior work on "linguistic fairness" in ML?                      │
└────────────────────────────────────────────────────────────────────────────┘
```

---

*Last updated: 2026-01-02*
