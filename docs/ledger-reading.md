---
layout: text
title: Reading Ledger
permalink: /docs/ledger-reading/
---

# Reading Ledger

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  READING TRACKER                                            rev. 2026-01-02 │
│  papers, books, blog posts, videos                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Status Key

```
[Q]   queued, not started
[R]   reading, in progress
[S]   skimmed, got the gist
[D]   deep read, understood
[X]   abandoned, not useful
[★]   essential, cite heavily
[◐]   partially relevant
```

---

## I. Core Papers (Must Read)

### I.1 Quantization

| Paper | Authors | Venue | Status | Key Insight | [ref] |
|-------|---------|-------|--------|-------------|-------|
| Quantized Neural Networks | Hubara et al. | JMLR 2017 | [D] [★] | STE for binary networks | 1 |
| Post-training 4-bit | Banner et al. | NeurIPS 2019 | [S] | Layer sensitivity analysis | 2 |
| GPTQ | Frantar & Alistarh | ICLR 2023 | [S] | Optimal brain quantization | 3 |
| AWQ | Lin et al. | MLSys 2024 | [S] | Salient weight protection | 4 |
| FP8 Training | Chmiel et al. | ICLR 2025 | [R] | [!] Soudry lab, flagship | 5 |
| FP4 for Trillion-Token LLMs | Chmiel et al. | NeurIPS 2025 | [Q] | Latest frontier | 6 |

[  ] FP8/FP4 papers are the entry point for Soudry conversation

### I.2 Multilingual & Quantization

| Paper | Authors | Venue | Status | Key Insight | [ref] |
|-------|---------|-------|--------|-------------|-------|
| How does quantization affect multilingual LLMs? | Marchisio et al. | EMNLP 2024 | [D] [★] | [!] 10× gap auto/human | 7 |
| Quantization for Low-Resource | ? | ? | [Q] | search needed | — |

[  ] [TODO] Search for more multilingual quantization work

### I.3 Linguistic Typology & NLP

| Paper | Authors | Venue | Status | Key Insight | [ref] |
|-------|---------|-------|--------|-------------|-------|
| WALS Online | Dryer & Haspelmath | 2013 | [D] | 192 features, 2600 langs | 8 |
| Grambank | Skirgård et al. | Science Adv 2023 | [S] | Genealogical constraints | 9 |
| Morphological Complexity | Lupyan & Dale | PLoS ONE 2010 | [S] | Complexity index | 10 |
| Language Complexity as Evolving Variable | — | — | [Q] | — | — |

### I.4 Probing & Interpretability

| Paper | Authors | Venue | Status | Key Insight | [ref] |
|-------|---------|-------|--------|-------------|-------|
| Probing Classifiers | Belinkov | CL 2022 | [S] | Methodological review | 11 |
| What do Neural MT Models Learn? | Belinkov et al. | ACL 2017 | [S] | Layer-wise analysis | 12 |
| A Structural Probe | Hewitt & Manning | NAACL 2019 | [Q] | Syntax in embeddings | 13 |

### I.5 Tokenization

| Paper | Authors | Venue | Status | Key Insight | [ref] |
|-------|---------|-------|--------|-------------|-------|
| BPE | Sennrich et al. | ACL 2016 | [D] | Subword segmentation | 14 |
| SentencePiece | Kudo & Richardson | EMNLP 2018 | [S] | Language-agnostic | 15 |
| Tokenization Fertility | Various | Blog posts | [S] | Chars per token metric | — |
| No Language Left Behind | NLLB Team | arXiv 2022 | [S] | 200-language MT | 16 |

---

## II. Soudry Lab Papers (Priority)

| Paper | First Author | Year | Status | Relevance |
|-------|--------------|------|--------|-----------|
| Binarized Neural Networks | Hubara | 2016 | [D] | foundational |
| Quantized Neural Networks | Hubara | 2017 | [D] | [★] cite |
| Post-training 4-bit | Banner | 2019 | [S] | [★] cite |
| Scalable Methods for 8-bit Training | Banner | 2018 | [Q] | background |
| FP8 Training | Chmiel | 2025 | [R] | [★] main ref |
| FP4 LLMs | Chmiel | 2025 | [Q] | [★] frontier |
| Neural Network Quantization Survey | — | — | [Q] | if exists |

[  ] Goal: Deep read all Soudry papers before contact

---

## III. Secondary Reading

### III.1 Efficient ML (Background)

| Paper | Status | Notes |
|-------|--------|-------|
| Lottery Ticket Hypothesis | [S] | pruning |
| Knowledge Distillation | [S] | compression |
| Mixed-Precision Training | [S] | NVIDIA |
| Activation Checkpointing | [Q] | memory |

### III.2 Multilingual NLP (Background)

| Paper | Status | Notes |
|-------|--------|-------|
| mBERT | [S] | baseline |
| XLM-R | [S] | improved |
| BLOOM | [S] | open multilingual |
| Aya | [R] | recent, relevant |

---

## IV. Reading Queue (Prioritized)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ PRIORITY │ PAPER                                    │ WHY                  │
├──────────┼──────────────────────────────────────────┼──────────────────────┤
│ [!] 1    │ FP8 Training (Chmiel 2025)               │ Soudry flagship      │
│ [!] 2    │ FP4 for Trillion-Token (Chmiel 2025)     │ Latest work          │
│ [!] 3    │ Marchisio EMNLP 2024 (re-read)           │ Extract all tables   │
│     4    │ Belinkov Probing Classifiers             │ Methodology          │
│     5    │ Grambank Science Advances                │ Typology update      │
│     6    │ Aya Model Paper                          │ Understand model     │
│     7    │ AWQ deep dive                            │ Quantization method  │
│     8    │ GPTQ deep dive                           │ Quantization method  │
└──────────┴──────────────────────────────────────────┴──────────────────────┘
```

---

## V. Key Takeaways Log

### From Marchisio et al. (2024) [ref:7]

[D] [★] Read 2026-01-02

**Main findings:**
1. Auto metrics underestimate degradation 10× for Japanese
2. Non-Latin scripts consistently worse
3. Human eval essential for true quality

**Tables to extract:**
- Table A3-A19: Per-language scores
- Table 2: Summary statistics

**Gaps identified:**
- No linguistic feature analysis
- No explanation of *why* some languages worse
- No threshold analysis

**My contribution:** Fill these gaps

### From Hubara et al. (2017) [ref:1]

[D] Read earlier

**Main findings:**
1. Binary networks trainable with STE
2. Quantization error accumulates across layers
3. Batch norm helps stabilization

**Relevance to my work:**
- Foundation for understanding quantization dynamics
- Layer sensitivity concept

---

## VI. Search Queries to Run

[TODO] Run these searches:

```
Google Scholar:
- "multilingual quantization" language
- "morphological complexity" neural network
- "tokenization" "quantization"
- "low-resource languages" compression
- "linguistic typology" deep learning

Semantic Scholar:
- quantization language-specific
- WALS machine learning

arXiv:
- cs.CL + quantization + multilingual
```

---

## VII. Non-Paper Sources

### VII.1 Blog Posts

| Source | Topic | Status | Notes |
|--------|-------|--------|-------|
| Hugging Face Blog | Quantization intro | [S] | good overview |
| Medium (various) | Tokenization fertility | [S] | varying quality |
| Soudry Lab Blog | ? | [Q] | check if exists |

### VII.2 Talks/Videos

| Talk | Speaker | Status | Notes |
|------|---------|--------|-------|
| Efficient ML course | MIT | [Q] | comprehensive |
| Quantization tutorial | NVIDIA | [S] | practical |
| Soudry talks | Soudry | [Q] | [!] search YouTube |

---

## VIII. Citation Management

[  ] Using: Zotero / BibTeX / plain text?

```bibtex
@article{marchisio2024quantization,
  title={How does quantization affect multilingual LLMs?},
  author={Marchisio, Kelly and others},
  journal={EMNLP Findings},
  year={2024}
}

@article{hubara2017quantized,
  title={Quantized neural networks: Training neural networks with low precision weights and activations},
  author={Hubara, Itay and others},
  journal={JMLR},
  year={2017}
}
```

---

*Last updated: 2026-01-02*
