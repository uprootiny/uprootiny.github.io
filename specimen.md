---
layout: text
title: Design Specimens
permalink: /specimen/
---

<div class="specimen-index">

## Design Language Specimens

Pages demonstrating the vocabulary of this design system.

<nav class="specimen-nav">

<a href="/specimen/prose/" class="specimen-link">
  <span class="specimen-name">Prose & Annotation</span>
  <span class="specimen-desc text-muted">Epistemic colors, temporal layers, reference styles</span>
</a>

<a href="/specimen/exhibition/" class="specimen-link">
  <span class="specimen-name">Exhibition</span>
  <span class="specimen-desc text-muted">Work listings, status indicators, press quotes</span>
</a>

<a href="/specimen/process/" class="specimen-link">
  <span class="specimen-name">Process</span>
  <span class="specimen-desc text-muted">Tables, phases, material inventory, affect grid</span>
</a>

<a href="/specimen/reading/" class="specimen-link">
  <span class="specimen-name">Reading List</span>
  <span class="specimen-desc text-muted">Structured references, categories, annotations</span>
</a>

<a href="/computational/" class="specimen-link">
  <span class="specimen-name">Computational Work</span>
  <span class="specimen-desc text-muted">Code-based art, systems, speculative interfaces</span>
</a>

<a href="/specimen/interactive/" class="specimen-link">
  <span class="specimen-name">Interactive & Live</span>
  <span class="specimen-desc text-muted">Permanence strata, liveness indicators, decay animations</span>
</a>

</nav>

---

## Tokens in Use

<div class="token-demo">
  <h3>Epistemic Gradient</h3>
  <p class="epistemic-fact">Fact — verified, grounded</p>
  <p class="epistemic-inference">Inference — reasoned, derived</p>
  <p class="epistemic-speculation">Speculation — tentative, exploratory</p>
  <p class="epistemic-question">Question — open, unresolved</p>
</div>

<div class="token-demo">
  <h3>Temporal Markers</h3>
  <p class="temporal-past">Past — completed, receding</p>
  <p class="temporal-present">Present — current, active</p>
  <p class="temporal-future">Future — planned, approaching</p>
  <p class="temporal-timeless">Timeless — persistent, anchored</p>
</div>

<div class="token-demo">
  <h3>Content Types</h3>
  <p class="content-prose">Prose — readable body text</p>
  <p class="content-data">Data — structured information</p>
  <p class="content-reference">Reference — external links</p>
  <p class="content-annotation">Annotation — marginal notes</p>
</div>

<div class="token-demo">
  <h3>Affective Register</h3>
  <p class="affective-neutral">Neutral — balanced</p>
  <p class="affective-warm">Warm — embodied</p>
  <p class="affective-cool">Cool — distant</p>
  <p class="affective-intense">Intense — urgent</p>
</div>

</div>

<style>
.specimen-index h2 {
  font-size: 1.1em;
  font-weight: 600;
  margin: 0 0 0.5em 0;
}
.specimen-index h3 {
  font-size: 0.95em;
  font-weight: 600;
  margin: 0 0 0.5em 0;
  color: var(--color-text-muted);
}
.specimen-index hr {
  border: none;
  border-top: 1px solid var(--color-text-faint);
  margin: 2em 0;
}
.specimen-nav {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin: 1.5em 0;
}
.specimen-link {
  display: block;
  padding: 1em;
  border: 1px solid var(--color-text-faint);
  transition: border-color var(--transition-fast);
}
.specimen-link:hover {
  border-color: var(--color-text-muted);
  box-shadow: none;
}
.specimen-name {
  display: block;
  font-weight: 600;
}
.specimen-desc {
  display: block;
  font-size: 0.85em;
  margin-top: 0.2em;
}
.token-demo {
  margin: 1.5em 0;
}
.token-demo p {
  margin: 0.3em 0;
}
</style>
