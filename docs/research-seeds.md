---
layout: text
title: Research Seeds
permalink: /docs/research-seeds/
---

# Research Seeds: PhD Proposal Ideas

*Dozens of experimental goals suitable for refining into PhD research proposals. Each grounded in prior work and commits.*

---

## How to Use This Document

Each seed is:
- **1-3 paragraphs** describing the research direction
- **Grounded** in specific commits and prior work
- **Actionable** with clear first steps
- **Pitched** toward specific advisors/labs where relevant

Seeds are organized by theme. Many can be combined or refined based on advisor interests.

---

## Theme A: Multilingual Quantization & Linguistic Typology

*Grounded in commits: `30985ba`, `0a00cb9`, `e1c5e1a`, `945fd66`*

### A1. Morphological Complexity as Quantization Predictor

**The idea:** Build a predictive model that takes WALS typological features as input and outputs expected quantization degradation. The hypothesis is that languages with richer morphology (higher Lupyan-Dale index) encode more information per token, requiring higher precision to preserve.

**First step:** Re-analyze Marchisio et al. (2024) data with WALS features. Compute partial correlations controlling for training data size and tokenization fertility. If r > 0.5, the effect is real and worth pursuing.

**Advisor fit:** Daniel Soudry (Technion) - extends his quantization theory; Roy Schwartz (HUJI) - connects to efficiency research.

*Ref: `30985ba` "Add multilingual quantization hypotheses and experimental design"*

---

### A2. The Threshold Function: Language-Specific Precision Requirements

**The idea:** Derive a function b*(L) = f(fertility, complexity, script) that predicts the minimum bit-width required for language L to achieve acceptable quality. Arabic might need 4.5 bits while English needs only 3.2 bits—a 40% difference with direct hardware implications.

**First step:** Fit the function on Marchisio data (23 languages), validate on held-out Aya benchmarks. If predictions hold, this becomes a practical tool for multilingual deployment.

**Novelty:** No one has formalized precision requirements as a function of linguistic features. This bridges NLP and hardware efficiency.

*Ref: `e1c5e1a` "Add hypothesis reformulation loop and quantitative predictions"*

---

### A3. Layer-Wise Sensitivity Profiles Across Languages

**The idea:** Different transformer layers encode different types of information. Hypothesis: attention layers are more sensitive for languages with flexible word order (SOV), while FFN layers are more sensitive for morphologically complex languages. This could enable language-aware mixed-precision quantization.

**First step:** Run probing experiments on Aya-8B: quantize attention layers to FP4, FFN to FP8 (and vice versa), measure perplexity by language. Build a language × layer sensitivity matrix.

**Advisor fit:** Yonatan Belinkov (Technion) - his probing classifier work is foundational here.

*Ref: `30985ba` hypothesis 3 on layer sensitivity*

---

### A4. Tokenization Fertility as the Mediating Variable

**The idea:** Maybe morphological complexity doesn't directly cause quantization sensitivity—it just correlates with tokenization fertility (tokens/word), which is the true causal driver. Disentangling these requires careful mediation analysis.

**First step:** Compute fertility for 50+ languages across BLOOM, Aya, Qwen tokenizers. Run mediation analysis: does the morphology→degradation path disappear when controlling for fertility?

**Outcome:** If fertility mediates, the intervention is tokenizer improvement, not precision allocation. Different research direction entirely.

*Ref: `0a00cb9` section C on tokenization fertility data*

---

### A5. Script Type and Quantization: The Logographic Advantage?

**The idea:** Chinese characters are semantically denser than alphabetic tokens—one character often = one morpheme. Hypothesis: logographic scripts are more robust to quantization because errors are more isolated (don't cascade across subwords).

**First step:** Compare Chinese, Japanese (mixed), Korean (syllabic), Hindi (alphabetic) under identical quantization. Control for fertility. If Chinese degrades less, script type is a real factor.

**Broader impact:** Informs tokenizer design for multilingual models.

*Ref: `0a00cb9` section on script type interactions*

---

### A6. Quantization-Aware Morphological Tokenization

**The idea:** BPE tokenizes based on frequency, ignoring morpheme boundaries. A morpheme-aware tokenizer (Morfessor-based) might produce representations more robust to quantization because the units are linguistically meaningful rather than arbitrary.

**First step:** Train two small LMs (350M) on Finnish—one with BPE, one with Morfessor. Quantize both to FP4. Compare degradation. If Morfessor helps, this suggests a new tokenizer design principle.

**Risk:** High (requires training). Payoff: High if it works.

*Ref: `30985ba` hypothesis 5*

---

### A7. Human Evaluation vs. Automatic Metrics for Quantization

**The idea:** Marchisio et al. found that automatic metrics underestimate degradation by 10×. A 1.7% automatic drop corresponds to 16% human-perceived drop. This means all existing quantization papers may be overly optimistic.

**First step:** Design a systematic human evaluation protocol for quantized multilingual models. Test on 10 languages, multiple tasks. Calibrate automatic metrics to human perception.

**Broader impact:** Changes how the field evaluates quantization.

*Ref: `0a00cb9` section B on human evaluation findings*

---

### A8. Information-Theoretic Bounds on Multilingual Precision

**The idea:** Rate-distortion theory gives fundamental limits on compression. Can we derive language-specific bounds? Hypothesis: languages with higher per-token entropy require proportionally more bits.

**First step:** Measure token-level entropy for 30 languages using a reference model. Correlate with observed quantization sensitivity. If they align, we have a theoretical foundation.

**Advisor fit:** Soudry (theory), or information theory researchers.

*Ref: `0a00cb9` section E on quantization theory, `945fd66` on information-theoretic bounds*

---

### A9. Weight "Clumpiness" and Language-Specific Representations

**The idea:** Quantization affects sparse (outlier-heavy) weight regions more than dense ones. If underrepresented languages have representations in sparse regions, they'll suffer more. "Clumpiness" = kurtosis × outlier_ratio × (1/effective_rank).

**First step:** Identify which subspaces encode which languages (via probing). Measure clumpiness per language subspace. Correlate with degradation.

**Novelty:** Connects weight distribution analysis to multilingual fairness.

*Ref: `e1c5e1a` section eleven on weight set clumpiness*

---

### A10. Cross-Lingual Transfer Under Quantization

**The idea:** Multilingual models enable zero-shot cross-lingual transfer. Does quantization affect transfer differently than monolingual performance? Hypothesis: transfer relies on shared representations that may be more fragile.

**First step:** Measure zero-shot transfer (e.g., English→German NER) before and after quantization. Compare to monolingual degradation. If transfer degrades more, this has deployment implications.

---

## Theme B: Efficient NLP & Green AI

*Grounded in commits: `aaeaa1c`, research on Roy Schwartz*

### B1. Vocabulary Optimization for Inference Efficiency

**The idea:** LLM inference cost scales with vocabulary size, but vocabulary design is understudied. Schwartz's group has shown optimal vocabularies can reduce compute while maintaining performance. Extend to multilingual setting.

**First step:** Analyze vocabulary overlap across languages in multilingual models. Identify redundant tokens. Propose pruning strategy.

**Advisor fit:** Roy Schwartz (HUJI) - his "Green AI" agenda.

*Ref: `aaeaa1c` on Schwartz lab, `0b8d802` project idea 1*

---

### B2. Adaptive Computation for Multilingual Models

**The idea:** Not all inputs require the same compute. Easy inputs (short, common language) can use fewer layers; hard inputs (long, rare language) need full model. Design an adaptive computation scheme that routes by language/difficulty.

**First step:** Measure per-layer contribution to output for different languages. Identify which languages can skip layers. Implement early-exit mechanism.

**Broader impact:** 2-3× speedup for common languages without multilingual fairness loss.

---

### B3. Carbon Footprint of Multilingual Training

**The idea:** Quantify the environmental cost of training multilingual vs. monolingual models. Is the efficiency gain of a single multilingual model worth the training cost? At what language count does multilingual become more efficient?

**First step:** Literature review of training costs. Estimate break-even point. Propose carbon-aware training schedules.

**Advisor fit:** Roy Schwartz (Green AI), or sustainability-focused labs.

---

### B4. Distillation for Low-Resource Languages

**The idea:** Knowledge distillation from large to small models works well for English. Does it work for low-resource languages? Hypothesis: less training data → less "knowledge" to distill → worse compression.

**First step:** Distill a multilingual model. Compare student-teacher gap across languages. Correlate with training data size.

---

## Theme C: Deep Learning Theory & Optimization

*Grounded in commits: `aaeaa1c` Soudry deep dive*

### C1. Implicit Bias of Gradient Descent on Attention

**The idea:** Soudry's signature result: GD on separable data converges to max-margin solution. What's the analogous characterization for attention layers? Hypothesis: attention converges to sparse solutions.

**First step:** Train attention-only networks on separable data. Characterize the limiting solution. Prove (or conjecture) the implicit bias.

**Risk:** High (pure theory). Advisor: Soudry (Technion).

*Ref: `aaeaa1c` angle 2 on implicit bias*

---

### C2. Langevin Dynamics for Language Model Training

**The idea:** The NeurIPS 2025 spotlight "Temperature is All You Need for Generalization" treats training as a physical system. Language models use temperature for sampling—what about training dynamics? Treat parameter updates as Langevin diffusion.

**First step:** Analyze LLM training through statistical mechanics lens. When does "temperature" (learning rate × batch noise) determine generalization?

**Physics angle:** Your background is an asset here.

*Ref: `aaeaa1c` angle A on Langevin dynamics*

---

### C3. Phase Transitions in Transformer Training

**The idea:** Physical systems exhibit phase transitions (solid→liquid→gas). Do transformers? "Grokking" (sudden generalization after overfitting) looks like a phase transition. Can we predict when it happens?

**First step:** Train small transformers on algorithmic tasks. Map the loss landscape. Identify critical points. Relate to thermodynamic phase diagrams.

---

### C4. Loss Landscape Geometry of Multilingual Representations

**The idea:** Use differential geometry to understand multilingual embedding spaces. Why do some languages cluster? Where does transfer happen? What's the curvature of the language manifold?

**First step:** Compute local curvature (Hessian) of loss landscape for different language inputs. Correlate with transfer performance.

**Physics angle:** Differential geometry is physics-adjacent.

*Ref: `aaeaa1c` angle 4 on information geometry*

---

### C5. Optimization Dynamics of Tokenization

**The idea:** Tokenization is pre-optimization, but it shapes the loss landscape. How does BPE vs. character-level vs. byte-level change optimization dynamics?

**First step:** Train identical models with different tokenizers. Measure convergence speed, final loss, generalization gap. Relate to tokenizer properties.

*Ref: `aaeaa1c` angle 5*

---

### C6. Continual Learning for Instruction Tuning

**The idea:** Evron's continual learning framework (Soudry lab) is for linear models. Instruction-tuned LLMs face real continual learning: task after task. When does adding coding hurt math?

**First step:** Fine-tune a small LLM on task sequences. Measure forgetting. Compare to theoretical predictions from linear models.

*Ref: `aaeaa1c` angle C on continual learning*

---

## Theme D: Multi-Agent Systems & LLM Architecttic

*Grounded in commits: `0758715`, `a2760be`*

### D1. Hyle: Distributed Reasoning for Scientific Paper Writing

**The idea:** A system of slow-burning LLM agents, each managing a paragraph + state slice, coordinated by managers enforcing formal properties. The output: an iteratively refined scientific article.

**First step:** Implement single-agent loop in Clojure. Add state atom. Extend to multi-agent with core.async. Evaluate on the quantization research as test case.

**Novelty:** Goes beyond single-prompt LLM use to structured multi-agent collaboration.

*Ref: `0758715` "Add Hyle architecture for distributed LLM reasoning graph"*

---

### D2. Formal Verification of LLM Outputs in Multi-Agent Systems

**The idea:** When multiple LLM agents contribute to a document, inconsistencies can arise. Design a manager layer that enforces formal properties: no contradictory measurements, all claims traceable to sources, numerical predictions consistent.

**First step:** Define spec schemas for agent outputs. Implement consistency checker. Test on synthetic multi-agent outputs.

*Ref: `0758715` manager rules section*

---

### D3. Attention Taxonomy: Managing Research Across Temperature Gradients

**The idea:** Ideas cool from hot (conversation) to cold (verified result). Design a system that manages this lifecycle: backburner mode for parking threads, intake mode for extracting fragments, stitching for combining pieces.

**First step:** Implement backburner schema and basic operations. Evaluate on a real research thread (e.g., the quantization project).

*Ref: `a2760be` "Add attention taxonomy: lifecycle from conversation to verified result"*

---

### D4. Fragment Extraction and Knowledge Crystallization

**The idea:** LLM conversations generate many fragments: hypotheses, data sources, code snippets, connections. Most are lost. Build an extractor that identifies, tags, and stores fragments for later stitching.

**First step:** Define fragment types and schema. Implement extractor on conversation transcripts. Evaluate recall of useful fragments.

*Ref: `a2760be` intake section*

---

### D5. Convergence Dynamics of Multi-Agent Reasoning

**The idea:** When do multi-agent systems converge? What determines the number of iterations needed? Hypothesis: convergence depends on graph structure and manager strictness.

**First step:** Run Hyle on synthetic tasks. Vary graph structure and manager rules. Measure iterations to convergence. Build predictive model.

---

### D6. Human-in-the-Loop for Slow-Burning LLM Research

**The idea:** The attention taxonomy has "backburner" for threads needing periodic human check-in. Design the interface: what to surface, when to ping, how to handle user absence.

**First step:** Prototype a daily summary generator. User study: does it reduce lost ideas? Does it feel intrusive?

---

## Theme E: NLP for Semitic Languages

*Grounded in: Hebrew/Arabic focus, Israeli academia context*

### E1. Hebrew-Arabic Transfer Learning

**The idea:** Hebrew and Arabic share Semitic roots, templatic morphology, right-to-left script. Hypothesis: transfer between them should be easier than to/from Indo-European languages.

**First step:** Measure zero-shot transfer on NER, POS, QA across Hebrew-Arabic-English triplet. Compare to typologically distant pairs.

**Advisor fit:** BIU-NLP (Goldberg, Tsarfaty), HUJI (Schwartz).

---

### E2. Root-Pattern Morphology in Neural Representations

**The idea:** Semitic morphology uses consonantal roots + vowel patterns (e.g., Hebrew k-t-v → katav, kotev, miktav). Do neural models learn this structure? Can we probe for it?

**First step:** Design probing tasks for root identification and pattern classification. Test on multilingual models. Compare Hebrew/Arabic to non-Semitic languages.

**Advisor fit:** Reut Tsarfaty (BIU) - morphological analysis expertise.

---

### E3. Diacritization as a Testbed for Low-Resource NLP

**The idea:** Hebrew and Arabic often omit vowel diacritics, creating ambiguity. Diacritization is a well-defined task with limited training data—ideal for studying low-resource methods.

**First step:** Benchmark existing methods on Hebrew diacritization. Propose improvements using multilingual pretraining or morphological inductive biases.

---

### E4. Code-Switching in Hebrew-English Social Media

**The idea:** Israeli social media frequently mixes Hebrew and English. Existing NLP models fail on code-switched text. Build robust models for this mixed-language domain.

**First step:** Collect/annotate code-switched corpus. Train and evaluate existing models. Propose adaptations.

---

### E5. Morphological Disambiguation for Hebrew NLP

**The idea:** Hebrew has extreme ambiguity due to omitted vowels and dense morphology. A single surface form can have dozens of analyses. Improve disambiguation using contextual models.

**First step:** Analyze error patterns of current Hebrew NLP tools. Propose contextual disambiguation model. Evaluate on standard benchmarks.

---

## Theme F: Interpretability & Analysis

*Grounded in: Belinkov's probing work, commits on layer analysis*

### F1. Probing Classifiers for Quantization Sensitivity

**The idea:** Standard probing asks "what information is encoded?" For quantization, ask "what information is lost?" Train probes on FP16 representations, evaluate on quantized. The accuracy drop reveals what quantization destroys.

**First step:** Probe for morphology, syntax, semantics before and after quantization. Identify which linguistic levels are most affected.

*Ref: `945fd66` elicitation protocol B*

---

### F2. Attention Pattern Divergence Under Quantization

**The idea:** Quantization changes attention distributions. Measure the change: compute Jensen-Shannon divergence between FP16 and quantized attention. Correlate with task degradation.

**First step:** Extract attention from 10 models × 10 languages. Compute divergence. Regress on downstream performance change.

*Ref: `30985ba` experiment 3.2*

---

### F3. Causal Probing: Beyond Correlation

**The idea:** Standard probing shows correlation, not causation. Use causal interventions: ablate the subspace encoding a property, measure downstream effect. Does morphological information causally contribute to performance?

**First step:** Identify morphology-encoding subspace via probing. Ablate it. Measure task performance. Compare to ablating random subspaces.

---

### F4. Behavioral Testing (CheckList) for Quantized Models

**The idea:** CheckList defines capabilities (negation, temporal reasoning, etc.) and test types (MFT, INV, DIR). Apply to quantized models: which capabilities degrade most? Are there universal failure modes?

**First step:** Run CheckList on FP16 vs. W4 models. Identify capabilities with largest degradation. Propose targeted fixes.

*Ref: `945fd66` elicitation protocol A*

---

### F5. Cross-Lingual Consistency of Learned Representations

**The idea:** Do multilingual models learn the same concepts across languages? Probe for "negation" in English, transfer probe to French—does it work? Quantization might disrupt this alignment.

**First step:** Train probes for 10 concepts in English. Transfer to 10 languages. Measure accuracy. Repeat after quantization. Does quantization hurt transfer more than monolingual?

---

## Theme G: Evaluation & Benchmarking

*Grounded in: Intel Leaderboard, Marchisio work*

### G1. A Multilingual Quantization Benchmark

**The idea:** No standard benchmark for evaluating quantized multilingual models. Create one: 30 languages, multiple tasks, multiple quantization methods, standardized evaluation.

**First step:** Aggregate existing benchmarks (mMMLU, FLORES, MGSM). Define evaluation protocol. Release benchmark suite.

**Impact:** Becomes the standard for the field.

---

### G2. Linguistic Feature Database for NLP Research

**The idea:** Researchers repeatedly need WALS features, fertility scores, script types for language studies. Build a unified database mapping ISO codes to all relevant features.

**First step:** Merge WALS, Ethnologue, computed fertility. Expose as API or downloadable dataset. Maintain and extend.

---

### G3. Calibrating Automatic Metrics to Human Judgment

**The idea:** Automatic metrics (perplexity, BLEU) underestimate degradation by 10×. Derive calibration functions that map automatic to human-perceived quality.

**First step:** Collect human judgments on quantized outputs. Fit calibration curves per metric. Release calibrated metrics.

---

### G4. The Intel Low-Bit Leaderboard: A Meta-Analysis

**The idea:** Intel's leaderboard has data on hundreds of quantized models. Mine it: which quantization methods are most consistent? Which model sizes are most robust? What predicts performance?

**First step:** Download leaderboard data. Run statistical analysis. Publish findings as a paper.

*Ref: `0a00cb9` analysis 0.3*

---

## Theme H: Applications & Deployment

### H1. Multilingual Chatbots with Precision-Aware Routing

**The idea:** A chatbot serving multiple languages could route queries to different precision models: English queries to W4, Arabic queries to W8. Implement this routing and measure cost/quality tradeoff.

**First step:** Build a routing layer. Benchmark on multilingual customer service dataset. Measure latency, cost, quality by language.

---

### H2. Edge Deployment of Multilingual Models

**The idea:** Deploying multilingual models on edge devices (phones, IoT) requires extreme quantization. Which languages can be served at 2-bit? Which require cloud fallback?

**First step:** Quantize a multilingual model to 2-bit. Test on 30 languages. Identify deployment-feasible languages.

---

### H3. Fairness Auditing Tools for Quantized Models

**The idea:** Quantization creates disparate impact across languages. Build an auditing tool that takes a quantized model and reports per-language quality metrics, flagging potential fairness issues.

**First step:** Define fairness criteria for multilingual models. Implement automated auditor. Test on existing quantized models.

---

## Theme I: Theoretical Foundations

### I1. A Theory of Linguistic Complexity and Model Capacity

**The idea:** Why do some languages require more model capacity? Derive a theory connecting linguistic complexity measures to minimum model size for competence.

**First step:** Formalize "competence" (e.g., perplexity threshold). Relate to grammar complexity (context-free vs. context-sensitive). Derive bounds.

---

### I2. Information-Theoretic Limits of Cross-Lingual Transfer

**The idea:** How much can you transfer between languages without parallel data? Derive information-theoretic bounds based on linguistic distance (typological, phylogenetic).

**First step:** Formalize transfer as a channel. Derive capacity bounds. Compare to empirical transfer performance.

---

### I3. The Computational Complexity of Multilingual Tokenization

**The idea:** What's the optimal tokenization for a multilingual corpus? Is finding it NP-hard? If so, what approximations are achievable?

**First step:** Formalize as an optimization problem. Analyze complexity. Propose approximation algorithm.

---

## Theme J: Interdisciplinary Connections

### J1. Statistical Mechanics of Language Model Training

**The idea:** Treat training as a physical system. Temperature = learning rate × noise. Energy = loss. Entropy = model uncertainty. Derive training dynamics from thermodynamic principles.

**First step:** Map training quantities to thermodynamic analogs. Derive equations of motion. Validate on small models.

**Physics background:** Essential for this direction.

*Ref: `aaeaa1c` angle A*

---

### J2. Linguistic Typology Meets Machine Learning

**The idea:** Typology classifies languages by structure. ML models learn implicit structure from data. Do they converge? Use ML as a tool to discover typological features, and typology as a prior for ML.

**First step:** Probe multilingual models for known typological features. Do they emerge? Can we discover new features?

---

### J3. Cognitive Science of LLM Morphological Generalization

**The idea:** Humans productively apply morphological rules to novel words. LLMs struggle with this. Why? Study the gap between human and LLM morphological generalization.

**First step:** Replicate human psycholinguistic experiments with LLMs. Identify failure modes. Propose architectures that better match human behavior.

---

### J4. Historical Linguistics via Language Model Analysis

**The idea:** Can language models reveal historical relationships between languages? Analyze multilingual model representations for phylogenetic signal.

**First step:** Cluster languages by representation similarity. Compare to established language family trees. Do they match?

---

## Summary Table

| ID | Theme | Title | Advisor Fit | Risk | Novelty |
|----|-------|-------|-------------|------|---------|
| A1 | Quant | Morphological Complexity as Predictor | Soudry, Schwartz | Low | Medium |
| A2 | Quant | Threshold Function | Soudry | Medium | High |
| A3 | Quant | Layer-Wise Sensitivity | Belinkov | Medium | High |
| A4 | Quant | Fertility as Mediator | Any | Low | Medium |
| A5 | Quant | Script Type | Any | Low | Medium |
| A6 | Quant | Morphological Tokenization | Any | High | High |
| A7 | Quant | Human Evaluation | Any | Medium | Medium |
| A8 | Quant | Information-Theoretic Bounds | Soudry | High | High |
| A9 | Quant | Weight Clumpiness | Soudry | High | High |
| A10 | Quant | Cross-Lingual Transfer | Any | Medium | Medium |
| B1 | Efficiency | Vocabulary Optimization | Schwartz | Low | Medium |
| B2 | Efficiency | Adaptive Computation | Any | Medium | High |
| B3 | Efficiency | Carbon Footprint | Schwartz | Low | Medium |
| B4 | Efficiency | Distillation for Low-Resource | Any | Medium | Medium |
| C1 | Theory | Implicit Bias in Attention | Soudry | High | High |
| C2 | Theory | Langevin Dynamics | Soudry | High | High |
| C3 | Theory | Phase Transitions | Soudry | High | High |
| C4 | Theory | Loss Landscape Geometry | Soudry | High | High |
| C5 | Theory | Tokenization Dynamics | Soudry | Medium | High |
| C6 | Theory | Continual Learning | Soudry | Medium | High |
| D1 | Multi-Agent | Hyle System | Any | Medium | High |
| D2 | Multi-Agent | Formal Verification | Any | Medium | High |
| D3 | Multi-Agent | Attention Taxonomy | Any | Low | High |
| D4 | Multi-Agent | Fragment Extraction | Any | Low | Medium |
| D5 | Multi-Agent | Convergence Dynamics | Any | Medium | High |
| D6 | Multi-Agent | Human-in-the-Loop | Any | Low | Medium |
| E1 | Semitic | Hebrew-Arabic Transfer | BIU-NLP | Low | Medium |
| E2 | Semitic | Root-Pattern Morphology | Tsarfaty | Medium | High |
| E3 | Semitic | Diacritization | Any | Low | Low |
| E4 | Semitic | Code-Switching | Any | Medium | Medium |
| E5 | Semitic | Morphological Disambiguation | Tsarfaty | Medium | Medium |
| F1 | Interpretability | Probing for Quantization | Belinkov | Low | Medium |
| F2 | Interpretability | Attention Divergence | Belinkov | Low | Medium |
| F3 | Interpretability | Causal Probing | Belinkov | Medium | High |
| F4 | Interpretability | CheckList for Quantized | Any | Low | Medium |
| F5 | Interpretability | Cross-Lingual Consistency | Any | Medium | Medium |
| G1 | Benchmarking | Multilingual Quant Benchmark | Any | Low | High |
| G2 | Benchmarking | Linguistic Feature Database | Any | Low | Medium |
| G3 | Benchmarking | Metric Calibration | Any | Medium | High |
| G4 | Benchmarking | Intel Leaderboard Analysis | Any | Low | Low |
| H1 | Deployment | Precision-Aware Routing | Any | Medium | High |
| H2 | Deployment | Edge Multilingual | Any | Medium | Medium |
| H3 | Deployment | Fairness Auditing | Any | Low | Medium |
| I1 | Theory | Complexity and Capacity | Any | High | High |
| I2 | Theory | Transfer Limits | Any | High | High |
| I3 | Theory | Tokenization Complexity | Any | High | Medium |
| J1 | Interdisciplinary | Statistical Mechanics | Soudry | High | High |
| J2 | Interdisciplinary | Typology Meets ML | Any | Medium | High |
| J3 | Interdisciplinary | Cognitive Science | Any | Medium | High |
| J4 | Interdisciplinary | Historical Linguistics | Any | Medium | Medium |

---

## Grounding References

| Commit | What it establishes |
|--------|---------------------|
| `a2760be` | Attention taxonomy, lifecycle framework |
| `0758715` | Hyle architecture, multi-agent reasoning |
| `e1c5e1a` | Quantitative predictions, threshold function |
| `945fd66` | Instrumentalization thesis, probing protocols |
| `0a00cb9` | Empirical foundation, existing data |
| `30985ba` | Hypotheses and experimental design |
| `aaeaa1c` | Soudry lab, research angles |
| `110d07e` | Advisor deep dives |
| `0b8d802` | 128 project ideas (pruned to 85) |

---

## How to Develop a Seed into a Proposal

1. **Pick 1-3 related seeds** (e.g., A1 + A2 + A4)
2. **Identify target advisor** from fit column
3. **Read their recent papers** (5-10)
4. **Refine hypothesis** to connect to their work
5. **Design first experiment** concretely
6. **Write 2-page proposal**:
   - Motivation (why this matters)
   - Background (what's known, citing advisor)
   - Research questions (3-5)
   - Proposed approach (methods, data, evaluation)
   - Preliminary results (if any from zero-cost analysis)
   - Timeline (milestones, not dates)
7. **Draft email** to advisor
8. **Iterate** based on response

---

*This document is a living seed bank. Seeds can be planted, cultivated, or left dormant. The backburner system (attention-taxonomy.md) manages their lifecycle.*
