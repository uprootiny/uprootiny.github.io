---
layout: text
title: Resource Ledger
permalink: /docs/ledger-resources/
---

# Resource Ledger

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  RESOURCE TRACKING                                          rev. 2026-01-02 │
│  datasets, models, APIs, compute, credentials                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Status Key

```
[✓]  have access, verified working
[~]  have access, untested
[?]  unknown access status
[✗]  no access / broken
[$]  requires payment
[⌛] pending approval/download
[🔑] needs API key
```

---

## I. Datasets

### I.1 Parallel Text

| Dataset | Languages | Size | Status | Location | Notes |
|---------|-----------|------|--------|----------|-------|
| FLORES-200 | 200 | 1012 sent/lang | [✓] | HuggingFace | [!] gold for fertility |
| OPUS-100 | 100 | varies | [~] | opus.nlpl.eu | MT training data |
| Tatoeba | 400+ | varies | [✓] | tatoeba.org | short sentences |
| WikiMatrix | 85 | 135M pairs | [?] | Meta | mined from Wikipedia |
| CCAligned | 137 | 392M pairs | [?] | Meta | web crawl |

[  ] FLORES-200 is the priority. Download command:
```bash
# [TODO] [t:now]
from datasets import load_dataset
flores = load_dataset("facebook/flores", "all")
```

### I.2 Linguistic Typology

| Database | Languages | Features | Status | Format | Notes |
|----------|-----------|----------|--------|--------|-------|
| WALS | 2679 | 192 | [✓] | CSV/JSON | wals.info |
| Grambank | 2467 | 195 | [~] | CSV | glottobank.org |
| PHOIBLE | 2186 | phonemes | [?] | CSV | phoible.org |
| Glottolog | 8500+ | genealogy | [✓] | newick/CSV | glottolog.org |
| Ethnologue | 7000+ | metadata | [$] | proprietary | expensive |

[  ] WALS download:
```bash
# [DONE]
wget https://wals.info/static/download/cldf/cldf-datasets-wals-014143f.zip
```

### I.3 Evaluation Benchmarks

| Benchmark | Languages | Tasks | Status | Notes |
|-----------|-----------|-------|--------|-------|
| XTREME | 40 | 9 | [~] | Google, comprehensive |
| XNLI | 15 | NLI | [✓] | MultiNLI translations |
| XCOPA | 11 | reasoning | [~] | causal reasoning |
| XStoryCloze | 11 | narrative | [?] | story completion |
| TyDiQA | 11 | QA | [~] | typologically diverse |
| MLQA | 7 | QA | [✓] | extractive QA |
| PAWS-X | 7 | paraphrase | [~] | adversarial |
| Belebele | 122 | reading | [~] | Meta, new |

---

## II. Models

### II.1 Multilingual Base Models (for quantization experiments)

| Model | Params | Languages | Status | Quant Available | Priority |
|-------|--------|-----------|--------|-----------------|----------|
| BLOOM | 560M-176B | 46 | [✓] | GPTQ, AWQ | [!] high |
| Aya-23 | 8B, 35B | 23 | [~] | GPTQ | [!] high |
| Qwen2.5 | 0.5B-72B | 29 | [~] | GPTQ, AWQ | high |
| mGPT | 1.3B | 60 | [?] | unknown | medium |
| XGLM | 564M-7.5B | 30 | [~] | unknown | medium |
| Llama-3 | 8B-70B | ~8 | [✓] | many | low (not multilingual enough) |

[  ] Priority order for Phase 1: BLOOM-7B → Aya-8B → Qwen2.5-7B

### II.2 Quantized Checkpoints (pre-made)

| Model | Quant | Source | Status | Notes |
|-------|-------|--------|--------|-------|
| BLOOM-7B-GPTQ | W4 | TheBloke | [~] | HuggingFace |
| BLOOM-7B-AWQ | W4 | TheBloke | [~] | HuggingFace |
| Aya-8B-GPTQ | W4 | ? | [?] | search needed |
| Qwen2.5-7B-AWQ | W4 | Qwen | [~] | official |

[TODO] [t:week] Verify TheBloke BLOOM quantizations still available

### II.3 Tokenizers

| Tokenizer | Vocab | Type | Status | Notes |
|-----------|-------|------|--------|-------|
| BLOOM | 250k | BPE | [✓] | bigscience/bloom |
| Aya | 256k | BPE | [~] | Cohere |
| Qwen | 151k | BPE | [~] | tiktoken-based |
| Llama-3 | 128k | BPE | [✓] | meta-llama |
| GPT-4 | ~100k | BPE | [🔑] | via API only |

---

## III. APIs & Services

### III.1 Inference APIs

| Service | Models | Rate Limit | Cost | Status | Notes |
|---------|--------|------------|------|--------|-------|
| Groq | llama, gemma, mixtral | 30 RPM | free | [✓] | [!] primary free |
| OpenRouter | 100+ | varies | $/token | [🔑] | aggregator |
| Together | 50+ | varies | $/token | [🔑] | good selection |
| Anthropic | claude | 50 RPM | $/token | [✓] | best quality |
| OpenAI | gpt-4 | 60 RPM | $/token | [✓] | reliable |
| Google | gemini | 60 RPM | free tier | [~] | long context |
| HuggingFace | many | varies | free/$ | [✓] | inference endpoints |

### III.2 Compute

| Resource | GPUs | Status | Cost | Notes |
|----------|------|--------|------|-------|
| Local | none | [✗] | — | no GPU |
| Colab | T4 | [✓] | free/$ | limited |
| Colab Pro | A100 | [$] | $10/mo | worth it |
| Lambda | A100/H100 | [$] | $/hr | for serious runs |
| Vast.ai | varies | [$] | cheap | community GPUs |
| RunPod | varies | [$] | cheap | similar |

[  ] For Phase 1 (zero-cost): Colab free tier sufficient
[  ] For Phase 2: Budget ~$200 for Lambda/RunPod time

---

## IV. Credentials Vault

[    ] [priv] DO NOT commit actual keys

| Service | Key Location | Env Var | Status | Expires |
|---------|--------------|---------|--------|---------|
| Groq | ~/.config/groq | GROQ_API_KEY | [✓] | — |
| Anthropic | ~/.config/anthropic | ANTHROPIC_API_KEY | [✓] | — |
| OpenAI | ~/.config/openai | OPENAI_API_KEY | [✓] | — |
| HuggingFace | ~/.cache/huggingface | HF_TOKEN | [✓] | — |
| Google | ~/.config/gcloud | GOOGLE_API_KEY | [?] | — |

---

## V. Software Stack

### V.1 Python Packages

| Package | Version | Purpose | Status |
|---------|---------|---------|--------|
| transformers | 4.35+ | model loading | [✓] |
| auto-awq | latest | AWQ quantization | [~] |
| auto-gptq | latest | GPTQ quantization | [~] |
| datasets | latest | HF datasets | [✓] |
| evaluate | latest | metrics | [~] |
| scipy | latest | statistics | [✓] |
| statsmodels | latest | mediation analysis | [~] |
| pandas | latest | data manipulation | [✓] |
| matplotlib | latest | plotting | [✓] |

### V.2 Clojure Stack

| Library | Purpose | Status |
|---------|---------|--------|
| babashka | scripting | [✓] |
| clj-http | API calls | [~] |
| cheshire | JSON | [✓] |
| datascript | local DB | [~] |

---

## VI. Data Files (Local)

```
data/
├── wals/                    [✓] downloaded
│   ├── languages.csv
│   ├── parameters.csv
│   └── values.csv
├── flores/                  [⌛] to download
│   └── dev/
├── fertility/               [⌛] to compute
│   ├── bloom-fertility.csv
│   ├── aya-fertility.csv
│   └── qwen-fertility.csv
├── marchisio/               [⌛] to extract
│   └── tables.csv
└── experiments/             [⌛] future
    └── ...
```

---

## VII. Acquisition Queue

| Resource | Priority | Action | Blocker | ETA |
|----------|----------|--------|---------|-----|
| FLORES-200 | [!] high | download | — | today |
| Marchisio tables | [!] high | OCR/extract | PDF access | today |
| BLOOM-7B-GPTQ | high | download | bandwidth | week |
| Grambank | medium | download | — | week |
| Colab Pro | medium | subscribe | $ | when needed |

---

*Last updated: 2026-01-02*
