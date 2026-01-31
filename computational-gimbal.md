---
layout: text
title: "Latent Gimbal"
permalink: /computational/gimbal/
---

<div class="work-page">

<header class="work-header">
  <h1>Latent Gimbal</h1>
  <p class="work-tagline">Physical Control Surface for LLM Generation</p>
</header>

<section class="work-meta-block">
  <div class="meta-row">
    <span class="meta-label">Status</span>
    <span class="meta-value temporal-future">Speculative Design</span>
  </div>
  <div class="meta-row">
    <span class="meta-label">Domain</span>
    <span class="meta-value content-data">Hardware · HCI · Generative AI</span>
  </div>
</section>

---

<section class="work-description">

<h2>Concept</h2>

<p class="epistemic-speculation">A physical gimbal—like a gearshift handle—that moves across a convex surface etched with pathways and nodes representing the latent space of a language model.</p>

<p class="epistemic-inference">Dragging the handle maps to design directions, pace, and granularity over iterated LLM generations. The body knows before the mind articulates.</p>

<h2>Physical Interface</h2>

<div class="component-list">
  <div class="component">
    <span class="component-name affective-warm">Gimbal</span>
    <p class="text-muted">6DOF handle with sub-millimeter position tracking. Pressure-sensitive. Weighted for proprioceptive feedback.</p>
  </div>
  <div class="component">
    <span class="component-name affective-cool">Convex Surface</span>
    <p class="text-muted">Geodesic dome segment with laser-etched pathways. Raised ridges at constraint boundaries. Tactile detents at key nodes.</p>
  </div>
  <div class="component">
    <span class="component-name affective-intense">Haptic Feedback</span>
    <p class="text-muted">Resistance increases near edges. Vibration signals transitions. The surface pushes back.</p>
  </div>
</div>

<h2>Movement Mapping</h2>

<table class="mapping-table">
  <tr>
    <td class="content-data">X-axis</td>
    <td class="text-muted">Semantic drift vector</td>
  </tr>
  <tr>
    <td class="content-data">Y-axis</td>
    <td class="text-muted">Stylistic transformation</td>
  </tr>
  <tr>
    <td class="content-data">Z-pressure</td>
    <td class="text-muted">Constraint adherence strength</td>
  </tr>
  <tr>
    <td class="content-data">Velocity</td>
    <td class="text-muted">Generation iteration frequency</td>
  </tr>
  <tr>
    <td class="content-data">Tilt</td>
    <td class="text-muted">Perspective / voice modulation</td>
  </tr>
  <tr>
    <td class="content-data">Rotation</td>
    <td class="text-muted">Temporal / causal direction</td>
  </tr>
</table>

<h2>Granularity Modes</h2>

<div class="mode-list">
  <div class="mode">
    <span class="mode-name">Macro</span>
    <span class="mode-desc text-muted">Broad conceptual shifts. Sweeping gestures across semantic highways.</span>
  </div>
  <div class="mode">
    <span class="mode-name">Micro</span>
    <span class="mode-desc text-muted">Token-level refinements. Fine adjustments within a region.</span>
  </div>
  <div class="mode">
    <span class="mode-name">Snap</span>
    <span class="mode-desc text-muted">Discrete state transitions. The handle finds the nearest node.</span>
  </div>
  <div class="mode">
    <span class="mode-name">Flow</span>
    <span class="mode-desc text-muted">Continuous interpolation. Smooth drift through parameter space.</span>
  </div>
</div>

<h2>Questions</h2>

<ul class="question-list">
  <li class="epistemic-question">Can embodied gesture recover what prompt engineering loses?</li>
  <li class="epistemic-question">What does it mean to <em>feel</em> the constraints of a model?</li>
  <li class="epistemic-question">How might physical fatigue shape creative output?</li>
</ul>

<h2>Precedents</h2>

<p class="content-reference">Tangible interfaces (Ishii). Embodied cognition (Varela). Musical controllers (Buchla, Haken Continuum). Drawing machines (Tinguely).</p>

</section>

</div>

<style>
.work-page h1 { font-size: 1.4em; font-weight: 600; margin: 0; }
.work-page h2 { font-size: 1em; font-weight: 600; margin: 1.5em 0 0.5em 0; color: var(--color-text-muted); }
.work-tagline { font-style: italic; color: var(--color-text-muted); margin: 0.3em 0 0 0; }
.work-page hr { border: none; border-top: 1px solid var(--color-text-faint); margin: 1.5em 0; }
.work-meta-block { margin: 1.5em 0; font-size: 0.9em; }
.meta-row { display: flex; margin: 0.4em 0; }
.meta-label { width: 5em; color: var(--color-text-faint); }
.meta-value { flex: 1; }
.component-list, .mode-list { margin: 1em 0; }
.component, .mode { margin: 1em 0; padding-left: 1em; border-left: 3px solid currentColor; }
.component-name, .mode-name { font-weight: 600; display: block; }
.component p, .mode-desc { margin: 0.3em 0 0 0; font-size: 0.9em; }
.mapping-table { width: 100%; font-size: 0.9em; margin: 1em 0; }
.mapping-table td { padding: 0.5em 0.5em 0.5em 0; border-bottom: 1px dotted var(--color-text-faint); }
.question-list { list-style: none; padding: 0; display: block; }
.question-list li { margin: 0.5em 0; padding-left: 1em; border-left: 2px solid var(--color-question); }
</style>
