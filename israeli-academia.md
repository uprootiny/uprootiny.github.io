---
layout: text
title: Israeli Academia Guide
permalink: /israeli-academia/
---

# Israeli Academia: PhD Programs & Research

*Complete guide to graduate programs in Math, CS, and AI at Israeli universities.*

---

## Timelines: When to Engage

*Your first question answered: when do I need to act?*

### Critical Deadlines (Fall 2026 Entry)

| Date | Action | University |
|------|--------|------------|
| **NOW** | Start reading faculty papers, identify 2-4 potential advisors | All |
| **Oct 2025** | Begin emailing advisors (brief, specific) | All |
| **Nov 5, 2025** | Weizmann application opens | Weizmann |
| **Nov-Dec 2025** | Request transcripts, ask recommenders | All |
| **Feb 15, 2026** | TAU housing deadline | TAU |
| **March 28, 2026** | **Weizmann deadline** | Weizmann |
| **March 31, 2026** | **HUJI deadline** | HUJI |
| **April 2026** | Technion deadline | Technion |
| **May 31, 2026** | **TAU deadline** | TAU |
| **May-July 2026** | Interviews, decisions | All |

**Bottom line:** If you want to start Fall 2026, you need to be actively emailing advisors by October 2025 and submitting applications by March 2026.

### Time Investment

| Component | Time | Notes |
|-----------|------|-------|
| Program research | 2-3 weeks | Read faculty publications |
| Statement of purpose | 2-3 weeks | Expect 5+ drafts |
| Research proposal (PhD) | 2-4 weeks | Required for most PhD programs |
| CV preparation | 1 week | Academic format |
| Recommendation letters | 4 weeks lead time | Ask early |
| Application forms | 1 week | Tedious but important |

---

## Credentials: What You'll Need

*Your second question addressed: what records do they require?*

### Typical Requirements

| Document | Required By | Notes |
|----------|-------------|-------|
| **Official transcripts** | All | Usually need official/certified copies |
| **Degree certificate** | All | Or expected completion letter |
| **Statement of purpose** | All | 1-2 pages, program-specific |
| **CV** | All | Academic format with photo (Israel norm) |
| **Recommendation letters** | All | 2-3, academic preferred |
| **TOEFL/IELTS** | Most | If English not native; ~80 iBT / 6.5 IELTS |
| **GRE** | Some | Technion EE/Aero require; others optional |
| **Research proposal** | PhD | 2-5 pages on proposed research |
| **Application fee** | Most | $100-150 (Weizmann: free) |

### If You're Missing Credentials

**No official transcripts available?**
- Contact universities directly — some accept unofficial copies with explanation
- Some Israeli universities are flexible with international applicants

**No academic recommenders?**
- Research supervisors, thesis advisors are preferred
- Industry supervisors acceptable for some programs
- Explain gaps in statement of purpose

**GPA below threshold?**
- Weizmann requires 90+ (Israeli scale) but accepts explanation letters
- Strong statement + advisor pre-approval can overcome GPA issues
- Consider MSc first to establish track record

---

## Quick Comparison: Universities

| University | Deadline | Tuition | Strengths | Recruiting |
|------------|----------|---------|-----------|------------|
| **Weizmann** | March 28 | **Free + stipend** | Math, TCS, theory | ~10 PhD/year |
| **HUJI** | March 31 | $10-30k | NLP (Schwartz ✅), neuroscience | Active |
| **TAU** | May 31 | $10-30k | Applied ML, industry ties | Active |
| **Technion** | April | Varies | Deep learning (Soudry ✅), optimization | Active |
| **BIU** | Varies | $5-12k | NLP (world-class), lowest tuition | High standards |
| **BGU** | Oct 2025 | $10-30k | Cyber security, water | Smaller |

---

## Actively Recruiting Advisors (January 2026)

*These explicitly state they want PhD students — prioritize these.*

| Advisor | University | Field | Source |
|---------|-----------|-------|--------|
| **Daniel Soudry** | Technion EE | Deep learning theory | [soudry.github.io](https://soudry.github.io/) |
| **Roy Schwartz** | HUJI CS | Efficient NLP, Green AI | [schwartz-lab-huji.github.io](https://schwartz-lab-huji.github.io/) |
| **Weizmann Math/CS** | Weizmann | Math, TCS | [weizmann.ac.il/math/join-us](https://www.weizmann.ac.il/math/join-us) |

### Conditional / Contact Carefully

| Advisor | Status |
|---------|--------|
| **Yonatan Belinkov (Technion)** | Not accepting 2025-26 (sabbatical); **open for 2026-27** |
| **Yoav Goldberg (BIU)** | [Note to prospective students](http://u.cs.biu.ac.il/~yogo/note-to-grads.html) — high standards |

---

## Top 12 Project Ideas (Developed)

*Well-specified problems with clear objectives, established methods, and active advisors. Start here.*

### 1. Vocabulary Optimization for Efficient LLMs

**Advisor:** Roy Schwartz (HUJI) ✅ actively recruiting

**The problem:** LLM inference cost scales with vocabulary size, but vocabulary design is understudied. Schwartz's group has shown optimal vocabularies can reduce compute while maintaining performance.

**Why tractable:**
- Clear metric: tokens/second, energy/query
- Established benchmarks (GLUE, SuperGLUE)
- Active advisor with published methodology

**Research questions:**
1. What is the optimal vocabulary size for different tasks and languages?
2. How do subword tokenizers affect downstream efficiency?
3. Can vocabulary be dynamically adjusted during inference?

**Your fit:** Linguistics background gives intuition for morphological tokenization; physics background enables optimization analysis.

**Next step:** Read [Schwartz Lab publications](https://schwartz-lab-huji.github.io/publications/) and email Roy with specific questions about vocabulary research.

---

### 2. Green AI: Carbon-Aware Training

**Advisor:** Roy Schwartz (HUJI) ✅ actively recruiting

**The problem:** Training large models has significant environmental cost. Schwartz's highly-cited "Green AI" paper (2020) established the research agenda for minimizing compute while maintaining capability.

**Why tractable:**
- Measurable: energy per accuracy point
- Established benchmarks and methodology
- Growing field with industry interest

**Research questions:**
1. How do we measure the true energy cost of NLP systems?
2. Can carbon-aware training schedules reduce environmental impact?
3. What architectural choices minimize compute-per-accuracy?

**Key paper:** [Green AI (Schwartz et al., 2020)](https://cacm.acm.org/magazines/2020/12/248800-green-ai/fulltext) — 3000+ citations

**Next step:** Read the Green AI paper and recent Schwartz lab work on efficiency.

---

### 3. Optimization Landscape of Deep Learning

**Advisor:** Daniel Soudry (Technion) ✅ actively recruiting

**The problem:** Why do neural networks trained with gradient descent generalize well despite having many more parameters than training examples? The geometry of the loss landscape holds answers.

**Why tractable:**
- Physics-native problem (energy surfaces, critical points)
- Strong theoretical tradition
- Soudry has multiple published results

**Research questions:**
1. What geometric properties predict trainability?
2. How does overparameterization affect landscape structure?
3. Can we design architectures with favorable landscapes?

**Your fit:** Physics background maps directly to loss landscape analysis (think: statistical mechanics of learning).

**Key papers:** Check [Soudry's Google Scholar](https://scholar.google.com/citations?user=soudry) for recent loss landscape work.

---

### 4. Developmental Interpretability

**Advisor:** Daniel Soudry (Technion) ✅ actively recruiting

**The problem:** Most interpretability research studies trained models. This emerging subfield studies how neural network mechanisms **form during training** — like developmental biology for AI.

**Why tractable:**
- Well-defined: track circuit formation over training
- Active advisor with relevant expertise
- Connects to Soudry's work on training dynamics

**Research questions:**
1. What phase transitions occur during training?
2. Can we predict final model behavior from early training dynamics?
3. How do circuits emerge and stabilize?

**Key paper:** [Developmental Interpretability (arXiv 2508.15841)](https://arxiv.org/abs/2508.15841)

---

### 5. Hebrew NLP: Beyond Morpho-Syntactic Tasks

**Advisor:** Reut Tsarfaty (BIU) — ERC-funded NLPRO project

**The problem:** Current Hebrew NLP benchmarks focus on morphology and syntax. Semantic understanding (reading comprehension, inference, QA) is underdeveloped. BIU-NLP is building Hebrew MRC datasets.

**Why tractable:**
- Clear gap in existing benchmarks
- ERC-funded lab with resources
- Your linguistics background is directly relevant

**Research questions:**
1. How can morphological analysis improve semantic task performance in Hebrew?
2. Can cross-lingual transfer from Arabic (another Semitic language) help?
3. What evaluation metrics are appropriate for morphologically-rich languages?

**Key resource:** [BIU-NLP Lab](https://biu-nlp.github.io/)

---

### 6. Morphological Analysis for Low-Resource Languages

**Advisor:** Reut Tsarfaty (BIU)

**The problem:** Low-resource languages with rich morphology (Dogri, Luganda, Hebrew dialects) benefit from hybrid approaches combining rules with neural methods. Recent work shows 35-38% BLEU improvement from morphological features.

**Why tractable:**
- Clear methodology exists
- Measurable improvements (BLEU)
- Builds on linguistics expertise

**Research questions:**
1. Can we design tokenization that respects morphological boundaries?
2. How do morphological features improve translation quality?
3. Can morphological structure guide attention mechanisms?

**Key paper:** [Hybrid morphological analysis (Springer 2025)](https://link.springer.com/article/10.1007/s42979-025-04429-9)

---

### 7. Information Bottleneck in Deep Learning

**Advisor:** Nati Linial (HUJI)

**The problem:** The information bottleneck principle suggests networks compress inputs while preserving task-relevant information. This connects information theory to deep learning generalization.

**Why tractable:**
- Physics-native (information theory)
- Clear theoretical questions
- Strong tradition at HUJI

**Research questions:**
1. Does training actually optimize the information bottleneck?
2. How does architecture affect information flow?
3. Can we design architectures that explicitly optimize information objectives?

**Your fit:** Physics background provides information theory intuition.

---

### 8. Random Matrices and Deep Learning

**Advisors:** Ofer Zeitouni, Boaz Klartag (Weizmann) ✅ recruiting

**The problem:** Random matrix theory provides tools for understanding high-dimensional data and neural network training dynamics. Weizmann has world-class probability faculty.

**Why tractable:**
- Physics background directly relevant
- World-class advisors
- Clear mathematical framework

**Research questions:**
1. What are the universality limits of random matrix eigenvalue statistics?
2. How do random matrices connect to neural network training dynamics?
3. Can random matrix theory explain deep learning phenomena?

**Your fit:** Physics + math background is ideal for this direction.

---

### 9. Desalination Process Optimization

**Institution:** BGU Zuckerberg Institute for Water Research

**The problem:** Israel leads the world in desalination (~70% of domestic water). ML can reduce energy consumption and predict membrane fouling.

**Why tractable:**
- Clear objective: energy per cubic meter
- Real-world data available
- Israel is global leader with industry connections

**Research questions:**
1. Can we predict membrane fouling before it occurs?
2. What control strategies minimize energy consumption?
3. How do we handle varying water quality inputs?

**Your fit:** Physics background enables process modeling; optimization is well-defined.

---

### 10. Climate Modeling with Physics-Informed Neural Networks

**Institution:** Weizmann Earth and Planetary Sciences

**The problem:** Climate models are computationally expensive. Physics-informed neural networks (PINNs) can incorporate conservation laws while learning from data.

**Why tractable:**
- Physics-informed approach is your strength
- Growing field with clear methodology
- Climate relevance ensures funding

**Research questions:**
1. How should conservation laws be encoded in climate models?
2. Can neural networks learn subgrid-scale processes?
3. What uncertainty quantification is achievable?

---

### 11. Code-Switching in Hebrew-English Text

**Advisor:** Reut Tsarfaty (BIU)

**The problem:** Israeli texts freely mix Hebrew and English ("Hebrish"). Code-switching NLP must handle mixed scripts and rapid language alternation.

**Why tractable:**
- Underexplored but practical
- Clear evaluation on social media data
- Builds on morphological expertise

**Research questions:**
1. How should tokenizers handle code-switched text?
2. Can language ID improve downstream NLP tasks?
3. What linguistic patterns govern code-switching in Israeli social media?

---

### 12. Precision Irrigation from Sensor Data

**Institution:** BGU Zuckerberg Institute for Water Research

**The problem:** Water-efficient agriculture is critical in arid regions. ML can optimize irrigation scheduling from soil moisture, weather, and crop models.

**Why tractable:**
- Clear objective: water efficiency
- Israel is world leader in drip irrigation
- Measurable real-world impact

**Research questions:**
1. How should sensor data and weather forecasts be combined?
2. Can we learn crop-specific water needs?
3. What is the optimal sensor density for different farm sizes?

---

## Remaining Project Ideas (Scored)

*73 additional ideas, pruned from original 128. Grouped by theme with tractability score.*

### NLP & Language (18 ideas)

| # | Idea | Tractability | Advisor |
|---|------|--------------|---------|
| 1 | Mechanistic interpretability of LLMs | Medium | Goldberg, Reichart |
| 3 | String counterfactuals for robustness | High | Goldberg, Dagan |
| 4 | Zero-shot NER via type embeddings | High | Goldberg |
| 5 | Few-shot learning: diversity over quantity | Medium | Goldberg, Mansour |
| 47 | Jailbreak attack analysis | Medium | Goldberg, Schwartz |
| 48 | Adversarial robustness in Hebrew/Arabic | High | Tsarfaty, Goldberg |
| 49 | Uncertainty quantification in LLMs | High | Schwartz, Soudry |
| 56 | Palestinian Arabic NLP | Medium | Tsarfaty |
| 57 | Hebrew-Arabic cross-lingual transfer | High | Tsarfaty |
| 58 | Diacritization for Semitic languages | High | Tsarfaty |
| 59 | Neuro-symbolic reasoning | Medium | Dagan, Abend |
| 60 | Compositional generalization | Medium | Abend, Goldberg |
| 61 | Temporal reasoning in NLP | Medium | Dagan |
| 62 | Knowledge graph + LLM integration | Medium | Dagan, Shapira |
| 79 | Clinical NLP for Hebrew | Medium | Tsarfaty |
| 80 | Misinformation detection (multilingual) | Medium | Goldberg, Elovici |
| 81 | Educational NLP assessment | Medium | NLP faculty |
| 82 | Legal NLP for Israeli law | Medium | Dagan |

### ML Theory (12 ideas)

| # | Idea | Tractability | Advisor |
|---|------|--------------|---------|
| 7 | Sample complexity of online RL | Medium | Mannor, Mansour |
| 8 | Adversarially robust PAC learning | Medium | Mansour, Linial |
| 9 | Margin bounds for voting classifiers | Medium | Mansour, Globerson |
| 10 | Kolmogorov complexity and generalization | Medium | Linial, Goldreich |
| 11 | Sample complexity of diffusion models | High | Globerson, Soudry |
| 41 | Efficient training at scale | High | Soudry, Globerson |
| 43 | Continual learning theory | Medium | Mannor, ELSC |
| 70 | Unlearning in LLMs | High | Soudry, Goldberg |
| 74 | Manifold learning for high-D data | Medium | Klartag, Soudry |
| 75 | Information bottleneck | High | Linial, Soudry |
| 76 | MDL and neural networks | Medium | Linial, Mansour |
| 78 | Rate-distortion for generative models | Medium | Globerson, Soudry |

### Mathematics & TCS (8 ideas)

| # | Idea | Tractability | Advisor |
|---|------|--------------|---------|
| 12 | Additive combinatorics + communication | Medium | Ziegler |
| 14 | Metric geometry and algorithms | Medium | Naor |
| 15 | GNNs for combinatorial optimization | High | Kimmel, Ailon |
| 16 | Diffusion for combinatorial optimization | Medium | Mannor, Barequet |
| 36 | Graph algorithms + learning | Medium | Elkin, Linial |
| 37 | LLM reasoning on graphs | Medium | NLP + TCS faculty |
| 38 | Computational geometry + vision | Medium | Kimmel, Barequet |
| 66 | LLM-assisted theorem proving | Low | Math faculty |

### Neuroscience & Cognition (6 ideas)

| # | Idea | Tractability | Advisor |
|---|------|--------------|---------|
| 21 | LLMs as brain models | Medium | Globerson, ELSC |
| 22 | Brain encoding/decoding | Medium | ELSC, NLP faculty |
| 23 | Neuromorphic language models | Low | ELSC, Technion EE |
| 51 | Grounded language learning | Medium | Abend, Wolf |
| 52 | Video understanding | Medium | Irani, Wolf |
| 53 | Audio-visual speech (Semitic) | Medium | ELSC |

### Energy & Climate (8 ideas)

| # | Idea | Tractability | Advisor |
|---|------|--------------|---------|
| 83 | Solar cell materials discovery | Medium | Weizmann Chemistry |
| 86 | Smart grid optimization | High | Mannor |
| 87 | Agricultural yield prediction | Medium | Weizmann Earth Sci |
| 106 | Battery materials discovery | Medium | Technion Materials |
| 107 | Hydrogen fuel cell catalysts | Medium | Weizmann Chemistry |
| 108 | Building energy digital twins | Medium | Technion Civil |
| 109 | Wind farm optimization | Medium | Mannor |
| 110 | Perovskite solar stability | Medium | Weizmann Chemistry |

### Biotech & Chemistry (12 ideas)

| # | Idea | Tractability | Advisor |
|---|------|--------------|---------|
| 88 | Molecular property prediction (GNNs) | High | Kimmel |
| 89 | Protein structure + design | Medium | Weizmann Structural Bio |
| 90 | Retrosynthesis planning | Medium | Weizmann Chemistry |
| 91 | Drug-target interaction | Medium | Goldberg, Weizmann |
| 92 | Single-cell RNA analysis | Medium | Weizmann Bio Regulation |
| 93 | CRISPR guide RNA design | Medium | Harel, Weizmann |
| 94 | Microbiome-host modeling | Medium | Weizmann Immunology |
| 95 | Antibiotic resistance prediction | Medium | Weizmann, BGU |
| 119 | Vaccine target identification | Medium | Weizmann Immunology |
| 121 | Personalized nutrition | Medium | Weizmann (Segal) |
| 127 | Organ-on-chip analysis | Low | Technion Biomedical |
| 128 | Stem cell differentiation | Low | Weizmann MCB |

### Privacy & Security (5 ideas)

| # | Idea | Tractability | Advisor |
|---|------|--------------|---------|
| 31 | Cyber security via NLP | Medium | Elovici, Goldberg |
| 67 | Differentially private NLP | Medium | Mansour, Schwartz |
| 68 | Federated multilingual learning | Medium | Mannor, Mansour |
| 69 | Membership inference attacks | Medium | Elovici |
| 98 | Federated learning for medical imaging | Medium | Mansour |

### Sustainability & Society (4 ideas)

| # | Idea | Tractability | Advisor |
|---|------|--------------|---------|
| 102 | Assistive technology / accessibility | Medium | NLP faculty |
| 103 | Archaeological site detection | Medium | Irani, HUJI Archaeology |
| 104 | Endangered language documentation | Medium | Tsarfaty |
| 105 | Humanitarian earth observation | Medium | Technion EE |

---

## Priority Contact List

Based on recruitment status and research fit:

**Tier 1 — Explicitly Recruiting:**
1. Daniel Soudry (Technion) — daniel.soudry@gmail.com
2. Roy Schwartz (HUJI) — schwartz@cs.huji.ac.il
3. Weizmann Math/CS — Apply through Feinberg School

**Tier 2 — Active Labs:**
4. Reut Tsarfaty (BIU) — Hebrew NLP
5. Amir Globerson (TAU) — ML theory
6. Shie Mannor (Technion) — RL theory
7. Ido Dagan (BIU) — NLP semantics

**Tier 3 — Conditional:**
8. Yoav Goldberg (BIU) — High standards, read his note first
9. Yonatan Belinkov (Technion) — For 2026-27 start only

---

## Funding

| Source | Amount | Notes |
|--------|--------|-------|
| **Weizmann** | Free + stipend | All admitted students |
| **HUJI Mandel** | 75,000 NIS/year | 4 years max |
| **Excellence Fellowship** | 168,000 NIS/year | Competitive |
| **Fulbright Israel** | Full support | US citizens |
| **Azrieli Visiting** | 12,000 NIS/month | Short visits |

---

## Note on Peaceful Research

*All project ideas in this document focus on civilian, peaceful applications. Topics with potential dual-use concerns have been excluded. Research should serve humanitarian goals: health, sustainability, knowledge, and human flourishing.*

---

*For art residencies and senior tech positions, see [Levant Resources](/levant/)*
