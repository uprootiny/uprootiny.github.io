---
layout: text
title: Research Proposal
permalink: /research-proposal/
---

<style>
.research-header {
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
.status-box {
  display: inline-block;
  padding: 0.2em 0.6em;
  border-radius: 3px;
  font-size: 0.8em;
  font-family: monospace;
}
.status-active { background: #2d5a27; color: #a8e6a0; }
.status-pending { background: #5a4a27; color: #e6d6a0; }
.status-future { background: #3a3a5a; color: #a0a0e6; }
.ledger-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1em;
  margin: 2em 0;
}
.ledger-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1em;
  background: #fafafa;
}
.ledger-card h4 {
  margin: 0 0 0.5em 0;
  font-family: monospace;
}
.ledger-card p {
  font-size: 0.9em;
  color: #666;
  margin: 0;
}
.annotation-key {
  background: #f5f5f5;
  padding: 1em;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85em;
  margin: 1em 0;
}
.hypothesis-table {
  width: 100%;
  font-family: monospace;
  font-size: 0.85em;
  border-collapse: collapse;
}
.hypothesis-table th, .hypothesis-table td {
  padding: 0.5em;
  border: 1px solid #ddd;
  text-align: left;
}
.hypothesis-table th {
  background: #f0f0f0;
}
</style>

<div class="research-header">┌─────────────────────────────────────────────────────────────────────────────┐
│  RESEARCH PROPOSAL: Linguistic Typology & LLM Quantization                  │
│  status: accumulating                                      rev. 2026-01-02  │
│  target: Soudry Lab, Technion                                               │
│  entry: Fall 2026                                                           │
└─────────────────────────────────────────────────────────────────────────────┘</div>

## Core Question

**Why do some languages degrade more under quantization than others?**

Marchisio et al. (EMNLP 2024) found Japanese at W4 quantization: automatic metrics show -1.7% degradation, human evaluation shows **-16.0%**. A 10× gap. Non-Latin scripts consistently suffer more than Latin-script languages.

<span class="status-box status-active">H0</span> Languages with higher information density per token are more sensitive to quantization noise.

---

## Hypotheses

<table class="hypothesis-table">
<tr><th>ID</th><th>Claim</th><th>p</th><th>Status</th><th>Test</th></tr>
<tr><td>H0</td><td>Info density/token → quant sensitivity</td><td>0.70</td><td>[△]</td><td>A03</td></tr>
<tr><td>H1</td><td>Fertility is proxy, not causal</td><td>0.60</td><td>[△]</td><td>A04</td></tr>
<tr><td>H2</td><td>Morphological complexity is true predictor</td><td>0.65</td><td>[△]</td><td>A03,A04</td></tr>
<tr><td>H3</td><td>Script has independent effect</td><td>0.55</td><td>[△]</td><td>A03</td></tr>
<tr><td>H4</td><td>Threshold function b*(L) is predictive</td><td>0.50</td><td>[△]</td><td>A10,A11</td></tr>
<tr><td>H5</td><td>Layer sensitivity varies by language type</td><td>0.45</td><td>[◇]</td><td>Phase 2</td></tr>
</table>

---

## The Deliverable

A **threshold function** predicting minimum bit-width per language:

```
b*(L) = b_base + α·fertility(L) + β·complexity(L) + γ·I(non-Latin)
```

| Language | Fertility | Complexity | Predicted b* |
|----------|-----------|------------|--------------|
| English  | 1.2       | -12        | 3.2 bits     |
| German   | 1.6       | -8         | 3.6 bits     |
| Hebrew   | 2.0       | -4         | **4.2 bits** |
| Arabic   | 2.8       | -3         | **4.5 bits** |
| Finnish  | 2.4       | -2         | 4.1 bits     |

**Implication:** W4 quantization is systematically unfair to morphologically rich languages.

---

## Documents

<div class="ledger-grid">

<div class="ledger-card">
<h4>[PROPOSAL]</h4>
<p><a href="/docs/proposal-draft-soudry">Full PhD Proposal Draft</a></p>
<p>Formal hypotheses, SOTA, detailed protocols, timeline.</p>
<span class="status-box status-active">ready</span>
</div>

<div class="ledger-card">
<h4>[WORKING NOTES]</h4>
<p><a href="/docs/working-notes-quantization">Working Notes</a></p>
<p>Epistemic layers, marginalia, hypothesis development.</p>
<span class="status-box status-active">accumulating</span>
</div>

<div class="ledger-card">
<h4>[SEEDS]</h4>
<p><a href="/docs/research-seeds">Research Seeds</a></p>
<p>48 PhD proposal ideas across 10 themes.</p>
<span class="status-box status-pending">reference</span>
</div>

<div class="ledger-card">
<h4>[TAXONOMY]</h4>
<p><a href="/docs/attention-taxonomy">Attention Taxonomy</a></p>
<p>Lifecycle from conversation to verified result.</p>
<span class="status-box status-pending">framework</span>
</div>

</div>

---

## Ledgers

<div class="ledger-grid">

<div class="ledger-card">
<h4>[RESOURCES]</h4>
<p><a href="/docs/ledger-resources">Resource Ledger</a></p>
<p>Datasets, models, APIs, compute, credentials.</p>
</div>

<div class="ledger-card">
<h4>[READING]</h4>
<p><a href="/docs/ledger-reading">Reading Ledger</a></p>
<p>Papers, key takeaways, reading queue.</p>
</div>

<div class="ledger-card">
<h4>[CONTACTS]</h4>
<p><a href="/docs/ledger-contacts">Contacts Ledger</a></p>
<p>Advisors, labs, email templates.</p>
</div>

<div class="ledger-card">
<h4>[FRICTION]</h4>
<p><a href="/docs/friction-ledger">Friction Ledger</a></p>
<p>Workflow pain points, mitigations.</p>
</div>

</div>

---

## Annotation System

<div class="annotation-key">
<strong>Epistemic:</strong> [○] observation  [△] hypothesis  [◇] conjecture  [●] confirmed  [⊥] falsified

<strong>Confidence:</strong> [p≈0.9] high  [p≈0.7] moderate  [p≈0.5] uncertain  [p≈0.3] skeptical

<strong>Actionable:</strong> [TODO] required  [NEXT] immediate  [WAIT] blocked  [DONE] complete

<strong>Relational:</strong> [ref:N] reference  [requires:N] depends on  [enables:N] unlocks

<strong>Source:</strong> [src:1°] primary  [src:2°] secondary  [src:llm] AI-generated
</div>

---

## Critical Path

```
A01 Extract Marchisio tables     [NEXT]
 │
 └─► A02 Merge with WALS         [WAIT]
      │
      └─► A03 Correlation        [WAIT]  ──► Go/No-Go on H1-H3
           │
           └─► A04 Mediation     [WAIT]
                │
                └─► A05 Decision [WAIT]  ──► A10 Fit threshold
                                              │
                                              └─► A11 Validate
                                                   │
                                                   └─► A12 Contact Soudry
```

---

## Background

<a href="/israeli-academia">Full Israeli Academia Document</a> — Contains Part 0 (Reasoning Epistemology), Part I (Empirical Foundation), Part II (Hypotheses), Part III (Zero-Cost Analysis), and Hyle Architecture.

---

<div style="font-family: monospace; font-size: 0.85em; color: #888; margin-top: 3em;">
Last updated: 2026-01-02 | Status: accumulating | Confidence: provisional
</div>
