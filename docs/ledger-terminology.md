---
layout: text
title: Terminology Ledger
permalink: /docs/ledger-terminology/
---

# Terminology Ledger

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TERMINOLOGY & TRANSLATIONS                                 rev. 2026-01-02 │
│  bridging ML, linguistics, physics                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## I. Quantization Terms

| Term | Definition | Example | Notes |
|------|------------|---------|-------|
| **W4** | 4-bit weight quantization | "W4 model" = weights stored in 4 bits | Common shorthand |
| **A8** | 8-bit activation quantization | "W4A8" = 4-bit weights, 8-bit activations | |
| **FP4** | 4-bit floating point | E2M1 format (2 exp, 1 mantissa) | Soudry frontier |
| **FP8** | 8-bit floating point | E4M3 or E5M2 formats | Current production |
| **PTQ** | Post-Training Quantization | Quantize already-trained model | GPTQ, AWQ |
| **QAT** | Quantization-Aware Training | Train with quantization in the loop | More expensive |
| **STE** | Straight-Through Estimator | Gradient approximation for discrete | Hubara et al. |
| **Calibration** | Data used to estimate quantization ranges | 128 samples typical | Language matters! |
| **Group size** | Number of weights sharing a scale factor | 128 typical for W4 | Larger = more compression |
| **AWQ** | Activation-aware Weight Quantization | Protect salient weights | Lin et al. 2023 |
| **GPTQ** | GPT Quantization | Optimal brain quantization for GPT | Frantar 2023 |

---

## II. Linguistics Terms

| Term | Definition | ML Translation | Example |
|------|------------|----------------|---------|
| **Morpheme** | Smallest meaningful unit | Subword token (roughly) | "un-" + "break" + "-able" |
| **Fusional** | Multiple features per morpheme | Dense encoding | Spanish "-o" = masc+sing |
| **Agglutinative** | One feature per morpheme | Sparse encoding | Turkish "-lar" = plural only |
| **Isolating** | One morpheme per word | Token ≈ word | Mandarin |
| **Polysynthetic** | Many morphemes per word | Very long tokens | Mohawk |
| **Fertility** | Tokens per word | Information spreading | Hebrew 2.0 = 2 tokens/word |
| **WALS** | World Atlas of Language Structures | Feature database | 192 features, 2600 languages |
| **Lupyan-Dale** | Morphological complexity index | -18 (isolating) to 0 (complex) | English -12, Finnish -2 |
| **Nonconcatenative** | Root-and-pattern morphology | Hard for BPE | Arabic, Hebrew |

---

## III. Cross-Domain Translations

### Linguistics → ML

| Linguistics | ML Equivalent | Notes |
|-------------|---------------|-------|
| Morphological complexity | Information density per token | Core hypothesis |
| Word order flexibility | Long-range dependencies | Attention sensitivity? |
| Case system | Syntactic marking | May affect layer sensitivity |
| Script type | Tokenizer fit | Latin vs. non-Latin |
| Language family | Training data distribution | Confound |

### ML → Physics

| ML | Physics Equivalent | Notes |
|----|-------------------|-------|
| Quantization noise | Thermal noise | Both add error |
| Information density | Signal strength | SNR = signal/noise |
| Layer sensitivity | Resonance | Some modes more affected |
| Outlier weights | Phase transitions | Discontinuous behavior |
| Training dynamics | Annealing | Optimization as cooling |

### Physics → Linguistics

| Physics | Linguistics Equivalent | Notes |
|---------|------------------------|-------|
| Entropy | Morphological complexity | Both measure "disorder" |
| Compression | Zipf's law | Efficient encoding |
| Phase space | Typological space | Possible configurations |
| Conservation laws | Universal tendencies | Greenberg universals |

---

## IV. Abbreviations

| Abbrev | Full Form | Domain |
|--------|-----------|--------|
| LLM | Large Language Model | ML |
| NLP | Natural Language Processing | ML |
| MT | Machine Translation | ML |
| BPE | Byte Pair Encoding | Tokenization |
| PPL | Perplexity | Evaluation |
| BLEU | Bilingual Evaluation Understudy | MT metric |
| chrF | Character F-score | MT metric |
| WALS | World Atlas of Language Structures | Linguistics |
| SOV/SVO | Subject-Object-Verb order | Linguistics |
| ISO 639 | Language code standard | "eng", "heb", "ara" |

---

## V. Jargon Decoder

### "The model is sensitive to quantization at layer 12"

```
Translation:
- When we reduce precision of layer 12's weights
- The model's output quality degrades more
- Than when we quantize other layers equally
- This suggests layer 12 stores critical information
```

### "Fertility of 2.5 for Hebrew"

```
Translation:
- On average, Hebrew text requires 2.5 BPE tokens per word
- Compare to English ~1.2 tokens per word
- This means Hebrew is "undertokenized"
- Each Hebrew token carries less information
- (Or the tokenizer wasn't trained on enough Hebrew)
```

### "Morphologically rich language"

```
Translation:
- Words change form a lot (conjugation, declension)
- High information density per word
- Examples: Finnish, Turkish, Arabic, Hebrew
- Opposite: isolating languages (Mandarin, English)
```

### "Calibration data affects quantization"

```
Translation:
- To quantize, we need to know typical activation ranges
- We run model on "calibration data" to measure this
- If calibration is English, ranges optimized for English
- Non-English inputs may have different ranges
- Result: worse quality on non-English
```

---

## VI. Contested Terms

| Term | Meaning A | Meaning B | My Usage |
|------|-----------|-----------|----------|
| **Complexity** | Morphological complexity (linguistic) | Computational complexity (CS) | I mean linguistic |
| **Precision** | Numerical precision (bits) | Classification precision (metric) | I mean bits |
| **Degradation** | Quality loss | Gradient descent step | I mean quality loss |
| **Token** | Subword unit | OAuth token | I mean subword |
| **Layer** | Neural network layer | Typological layer | I mean NN layer |

---

## VII. Notation

| Symbol | Meaning | Example |
|--------|---------|---------|
| L | Language | L = Hebrew |
| b | Bit-width | b = 4 |
| Δ | Relative degradation | Δ = (PPL_q - PPL_fp16) / PPL_fp16 |
| b*(L) | Threshold bit-width for language L | b*(Hebrew) ≈ 4.2 |
| fertility(L) | Tokens per word for language L | fertility(Hebrew) ≈ 2.0 |
| complexity(L) | Lupyan-Dale index for L | complexity(Hebrew) ≈ -4 |
| I(x) | Indicator function | I(non-Latin) = 1 for Hebrew |

---

## VIII. Etymology / History

| Term | Origin | Notes |
|------|--------|-------|
| Quantization | From "quantum" (Latin: how much) | Discretization |
| Morphology | Greek: morphe (form) + logos (study) | Shape of words |
| Agglutinative | Latin: agglutinare (to glue together) | Morphemes stick |
| Fusional | Latin: fundere (to pour, fuse) | Morphemes blend |
| Token | Old English: tacen (sign, symbol) | Now means subword |

---

*Last updated: 2026-01-02*
