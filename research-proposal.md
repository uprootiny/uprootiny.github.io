---
layout: text
title: Research Proposals
permalink: /research-proposal/
---

<style>
.header-box {
  font-family: monospace;
  background: #1a1a1a;
  color: #e0e0e0;
  padding: 1.5em;
  border-radius: 4px;
  margin-bottom: 2em;
  white-space: pre;
  overflow-x: auto;
  font-size: 0.85em;
  line-height: 1.4;
}
.roadmap-card {
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  padding: 1.5em;
  margin: 1.5em 0;
  background: #fafafa;
}
.roadmap-card.featured {
  border-color: #333;
  background: #f5f5f0;
}
.roadmap-title {
  font-size: 1.2em;
  font-weight: bold;
  margin: 0 0 0.3em 0;
}
.roadmap-subtitle {
  color: #666;
  font-style: italic;
  margin-bottom: 1em;
}
.tag {
  display: inline-block;
  padding: 0.15em 0.5em;
  border-radius: 3px;
  font-size: 0.75em;
  font-family: monospace;
  margin-right: 0.3em;
}
.tag-physics { background: #e3f2fd; color: #1565c0; }
.tag-theory { background: #f3e5f5; color: #7b1fa2; }
.tag-systems { background: #e8f5e9; color: #2e7d32; }
.tag-nlp { background: #fff3e0; color: #ef6c00; }
.tag-risk-low { background: #c8e6c9; color: #1b5e20; }
.tag-risk-med { background: #fff9c4; color: #f57f17; }
.tag-risk-high { background: #ffcdd2; color: #b71c1c; }
.hypothesis-box {
  background: #fff;
  border-left: 3px solid #333;
  padding: 0.8em 1em;
  margin: 1em 0;
  font-family: monospace;
  font-size: 0.9em;
}
.phase-list {
  list-style: none;
  padding: 0;
}
.phase-list li {
  padding: 0.3em 0;
  border-bottom: 1px dotted #ddd;
}
.phase-list li:last-child {
  border-bottom: none;
}
.advisor-fit {
  background: #f0f0f0;
  padding: 0.5em 1em;
  border-radius: 4px;
  font-size: 0.9em;
  margin-top: 1em;
}
</style>

<div class="header-box">┌─────────────────────────────────────────────────────────────────────────────┐
│  RESEARCH PROPOSALS                                         rev. 2026-01-02 │
│  multiple roadmaps, pick what resonates                                     │
│  status: exploring                                                          │
└─────────────────────────────────────────────────────────────────────────────┘</div>

## Choose Your Adventure

Five distinct research directions. Each is a viable PhD trajectory. They can be combined or pursued independently.

---

<div class="roadmap-card featured">

<div class="roadmap-title">Roadmap A: Statistical Mechanics of Language Model Training</div>
<div class="roadmap-subtitle">Treat training as a physical system. Derive dynamics from first principles.</div>

<span class="tag tag-physics">PHYSICS</span>
<span class="tag tag-theory">THEORY</span>
<span class="tag tag-risk-high">HIGH RISK</span>
<span class="tag tag-risk-high">HIGH REWARD</span>

<div class="hypothesis-box">
<strong>Core Hypothesis:</strong> LLM training dynamics can be described by statistical mechanics.

Temperature = learning_rate × gradient_noise
Energy = loss_function
Entropy = model_uncertainty
Free_energy = loss + temperature × complexity

Training is annealing. Generalization is a phase transition.
</div>

**The Idea:** The NeurIPS 2025 spotlight "Temperature is All You Need for Generalization" treats neural network training as a thermodynamic process. Language models use temperature for sampling—but what about training? Map parameter updates to Langevin diffusion. Derive when "cooling" (decreasing LR) leads to generalization vs. overfitting.

**Why This Is Exciting:**
- First-principles derivation of training dynamics
- Explains grokking (sudden generalization) as phase transition
- Connects to physics in a deep way
- Could yield predictive theory of when models generalize

<ul class="phase-list">
<li><strong>Phase 1:</strong> Formalize the mapping (loss↔energy, LR↔temperature)</li>
<li><strong>Phase 2:</strong> Derive equations of motion for parameter evolution</li>
<li><strong>Phase 3:</strong> Predict phase transitions, validate on small models</li>
<li><strong>Phase 4:</strong> Scale to LLM training, make testable predictions</li>
</ul>

<div class="advisor-fit">
<strong>Advisor fit:</strong> Daniel Soudry (Technion) — his lab does optimization theory, has published on Langevin dynamics in learning
</div>

</div>

---

<div class="roadmap-card featured">

<div class="roadmap-title">Roadmap B: Phase Transitions in Transformer Learning</div>
<div class="roadmap-subtitle">When do transformers suddenly "get it"? Map the critical points.</div>

<span class="tag tag-physics">PHYSICS</span>
<span class="tag tag-theory">THEORY</span>
<span class="tag tag-risk-med">MEDIUM RISK</span>

<div class="hypothesis-box">
<strong>Core Hypothesis:</strong> Transformer training exhibits phase transitions analogous to physical systems.

At critical points:
- Loss drops discontinuously
- Representations reorganize
- New capabilities emerge

These are predictable from loss landscape geometry.
</div>

**The Idea:** "Grokking" is the phenomenon where models suddenly generalize long after memorizing training data. This looks like a first-order phase transition—extended metastable state followed by rapid reorganization. Can we predict when grokking happens? What determines the critical point?

**Why This Is Exciting:**
- Explains mysterious training phenomena
- Connects deep learning to physics of phase transitions
- Practical implications for training schedules
- Your physics background is directly applicable

<ul class="phase-list">
<li><strong>Phase 1:</strong> Train small transformers on algorithmic tasks, map loss landscape</li>
<li><strong>Phase 2:</strong> Identify order parameters (what changes at transition?)</li>
<li><strong>Phase 3:</strong> Derive critical exponents, compare to known universality classes</li>
<li><strong>Phase 4:</strong> Build predictive model of when grokking occurs</li>
</ul>

<div class="advisor-fit">
<strong>Advisor fit:</strong> Soudry (optimization theory), or statistical physics of ML researchers (e.g., Surya Ganguli's network)
</div>

</div>

---

<div class="roadmap-card">

<div class="roadmap-title">Roadmap C: Implicit Bias of Gradient Descent on Attention</div>
<div class="roadmap-subtitle">What solution does training converge to? Characterize the limit.</div>

<span class="tag tag-theory">THEORY</span>
<span class="tag tag-risk-high">HIGH RISK</span>
<span class="tag tag-risk-high">HIGH NOVELTY</span>

<div class="hypothesis-box">
<strong>Core Hypothesis:</strong> Gradient descent on attention layers converges to a specific limiting solution.

For linear networks: GD → max-margin classifier (Soudry et al.)
For attention: GD → ??? (open problem)

Conjecture: Attention converges to sparse, interpretable patterns.
</div>

**The Idea:** Soudry's signature result is that gradient descent on separable data converges to the max-margin solution—even without explicit regularization. This "implicit bias" explains why deep learning generalizes. But this is proven for linear/homogeneous networks. What's the analogous characterization for attention layers?

**Why This Is Exciting:**
- Extends foundational theoretical work
- Could explain why attention is effective
- Pure theory with deep implications
- Direct continuation of Soudry's research agenda

<ul class="phase-list">
<li><strong>Phase 1:</strong> Train attention-only networks on separable data</li>
<li><strong>Phase 2:</strong> Characterize the limiting solution empirically</li>
<li><strong>Phase 3:</strong> Conjecture the implicit bias (sparsity? low-rank?)</li>
<li><strong>Phase 4:</strong> Attempt proof or identify obstacles</li>
</ul>

<div class="advisor-fit">
<strong>Advisor fit:</strong> Daniel Soudry (Technion) — this is literally his research program
</div>

</div>

---

<div class="roadmap-card">

<div class="roadmap-title">Roadmap D: Hyle — Multi-Agent Reasoning for Scientific Writing</div>
<div class="roadmap-subtitle">A distributed system of slow-burning LLM agents that write papers.</div>

<span class="tag tag-systems">SYSTEMS</span>
<span class="tag tag-nlp">NLP</span>
<span class="tag tag-risk-med">MEDIUM RISK</span>

<div class="hypothesis-box">
<strong>Core Hypothesis:</strong> Scientific writing can be decomposed into a graph of agents.

Each agent:
- Owns a paragraph + state slice
- Runs iteratively, refining its piece
- Coordinates via message passing

Managers enforce: consistency, citations, numerics.
Output: A coherent, verified scientific article.
</div>

**The Idea:** Current LLM usage is single-prompt, single-response. Scientific writing requires iteration, consistency checking, and coordination across sections. Build a system where agents specialize (intro agent, methods agent, results agent), each maintaining state, iteratively improving, coordinated by formal verification layers.

**Why This Is Exciting:**
- Novel architecture beyond single-agent LLMs
- Practical tool for research
- Formalizable (can prove properties about coordination)
- Clojure implementation fits your preferences

<ul class="phase-list">
<li><strong>Phase 1:</strong> Single-agent loop with state atom</li>
<li><strong>Phase 2:</strong> Multi-agent graph with message passing</li>
<li><strong>Phase 3:</strong> Manager layer enforcing formal properties</li>
<li><strong>Phase 4:</strong> Evaluate on real research task</li>
</ul>

<div class="advisor-fit">
<strong>Advisor fit:</strong> Multi-agent systems researchers, or self-directed (open source tool)
</div>

</div>

---

<div class="roadmap-card">

<div class="roadmap-title">Roadmap E: Information-Theoretic Bounds on Cross-Lingual Transfer</div>
<div class="roadmap-subtitle">How much can you learn about one language from another?</div>

<span class="tag tag-theory">THEORY</span>
<span class="tag tag-nlp">NLP</span>
<span class="tag tag-risk-high">HIGH RISK</span>

<div class="hypothesis-box">
<strong>Core Hypothesis:</strong> Cross-lingual transfer has information-theoretic limits.

Transfer capacity ≤ f(linguistic_distance, shared_structure)

Where:
- linguistic_distance = typological + phylogenetic similarity
- shared_structure = mutual information of representations

These limits are achievable and computable.
</div>

**The Idea:** Zero-shot cross-lingual transfer (train on English, test on German) works surprisingly well. But how well *can* it work? Derive fundamental limits from information theory. Model transfer as a noisy channel; compute capacity. Compare to empirical transfer performance.

**Why This Is Exciting:**
- Fundamental theory of multilingual AI
- Connects linguistics to information theory
- Practical implications for low-resource languages
- Novel theoretical contribution

<ul class="phase-list">
<li><strong>Phase 1:</strong> Formalize transfer as information channel</li>
<li><strong>Phase 2:</strong> Derive capacity bounds from linguistic features</li>
<li><strong>Phase 3:</strong> Compare to empirical transfer on 50+ language pairs</li>
<li><strong>Phase 4:</strong> Design transfer-optimal training schemes</li>
</ul>

<div class="advisor-fit">
<strong>Advisor fit:</strong> Soudry (theory), multilingual NLP researchers
</div>

</div>

---

## Comparison Matrix

| Roadmap | Physics | Theory | Systems | Risk | Time to First Result |
|---------|---------|--------|---------|------|----------------------|
| A. Statistical Mechanics | ★★★ | ★★★ | ★ | High | 6 months |
| B. Phase Transitions | ★★★ | ★★ | ★ | Medium | 3 months |
| C. Implicit Bias | ★ | ★★★ | ★ | High | 9 months |
| D. Hyle Multi-Agent | ★ | ★ | ★★★ | Medium | 2 months |
| E. Transfer Bounds | ★★ | ★★★ | ★ | High | 6 months |

---

## Roadmap Visualizations

### Roadmap A: Statistical Mechanics

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   PHYSICAL SYSTEM                          TRAINING SYSTEM                  │
│                                                                             │
│   Temperature T  ─────────────────────►   learning_rate × noise             │
│   Energy E       ─────────────────────►   loss L(θ)                         │
│   Entropy S      ─────────────────────►   model_uncertainty H(θ)            │
│   Free energy F  ─────────────────────►   L + T·complexity                  │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                                                                     │   │
│   │       HIGH T                                                        │   │
│   │         │                                                           │   │
│   │         │  ← random exploration                                     │   │
│   │         │                                                           │   │
│   │         ▼                                                           │   │
│   │      ANNEALING ────► convergence to minimum                         │   │
│   │         │                                                           │   │
│   │         │  ← structured search                                      │   │
│   │         │                                                           │   │
│   │         ▼                                                           │   │
│   │       LOW T ────► generalization (or overfitting)                   │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   RESEARCH QUESTIONS:                                                       │
│   • When does cooling lead to generalization vs. overfitting?               │
│   • What determines the "melting point" of a model?                         │
│   • Can we derive optimal annealing schedules?                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Roadmap B: Phase Transitions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   TRAINING LOSS OVER TIME                                                   │
│                                                                             │
│   Loss                                                                      │
│    │                                                                        │
│    │  ████                                                                  │
│    │      ████                                                              │
│    │          ████████████████████████████                                  │
│    │                                     │                                  │
│    │                                     │  ← PHASE TRANSITION              │
│    │                                     │    (grokking)                    │
│    │                                     ▼                                  │
│    │                                     ████████████████████               │
│    │                                                                        │
│    └────────────────────────────────────────────────────────────► Time      │
│                                                                             │
│           │◄──── memorization ────►│◄── transition ─►│◄─ generalization ─►│ │
│                                                                             │
│   ORDER PARAMETER: What changes at the transition?                          │
│   • Representation structure                                                │
│   • Weight distribution                                                     │
│   • Effective dimensionality                                                │
│                                                                             │
│   CRITICAL EXPONENTS: How does transition scale?                            │
│   • Transition sharpness ~ N^α                                              │
│   • Time to transition ~ N^β                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Roadmap D: Hyle Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                        ┌─────────────────────┐                              │
│                        │   CANVAS (output)   │                              │
│                        │   Final article     │                              │
│                        └──────────▲──────────┘                              │
│                                   │                                         │
│                        ┌──────────┴──────────┐                              │
│                        │   MANAGER LAYER     │                              │
│                        │   - consistency     │                              │
│                        │   - citations       │                              │
│                        │   - numerics        │                              │
│                        └──────────▲──────────┘                              │
│                                   │                                         │
│         ┌─────────────────────────┼─────────────────────────┐               │
│         │                         │                         │               │
│   ┌─────┴─────┐            ┌──────┴──────┐           ┌──────┴─────┐         │
│   │  AGENT 1  │◄──────────►│   AGENT 2   │◄─────────►│  AGENT 3   │         │
│   │  intro    │            │   methods   │           │  results   │         │
│   │  ┌─────┐  │            │  ┌─────┐    │           │  ┌─────┐   │         │
│   │  │state│  │            │  │state│    │           │  │state│   │         │
│   │  └─────┘  │            │  └─────┘    │           │  └─────┘   │         │
│   └───────────┘            └─────────────┘           └────────────┘         │
│         │                         │                         │               │
│         └─────────────────────────┼─────────────────────────┘               │
│                                   │                                         │
│                        ┌──────────▼──────────┐                              │
│                        │   STATE ATOM        │                              │
│                        │   (shared facts,    │                              │
│                        │    measurements,    │                              │
│                        │    decisions)       │                              │
│                        └─────────────────────┘                              │
│                                                                             │
│   ITERATION: Agents run in rounds, each refining their piece                │
│   CONVERGENCE: When manager approves all sections                           │
│   OUTPUT: Coherent, internally consistent document                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Documents

### Core
- [Working Notes](/docs/working-notes-quantization/) — Epistemic layers, marginalia
- [Research Seeds](/docs/research-seeds/) — 48 PhD proposal ideas

### Ledgers
- [Resources](/docs/ledger-resources/) — Datasets, models, APIs
- [Reading](/docs/ledger-reading/) — Papers, key takeaways
- [Contacts](/docs/ledger-contacts/) — Advisors, labs
- [Questions](/docs/ledger-questions/) — Open problems
- [Terminology](/docs/ledger-terminology/) — Cross-domain translations

### Infrastructure
- [Lab Harness](/docs/lab-harness/) — Logging, experiment tracking
- [Friction Ledger](/docs/friction-ledger/) — Workflow pain points
- [Attention Taxonomy](/docs/attention-taxonomy/) — Idea lifecycle

---

## Annotation Key

```
[○] observation    [△] hypothesis    [●] confirmed    [⊥] falsified
[p≈0.9] high confidence              [p≈0.5] uncertain
[TODO] required    [NEXT] immediate  [WAIT] blocked
```

---

<div style="font-family: monospace; font-size: 0.85em; color: #888; margin-top: 3em;">
Last updated: 2026-01-02 | Status: exploring | Pick your path
</div>
