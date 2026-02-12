---
layout: text
title: "Topological Visualization"
permalink: /computational/topological-viz/
---

<div class="work-page">

<header class="work-header">
  <h1>Topological Visualization</h1>
  <p class="work-tagline">Persistent Homology Explorer</p>
</header>

<section class="work-meta-block">
  <div class="meta-row">
    <span class="meta-label">Status</span>
    <span class="meta-value temporal-past">Prototype</span>
  </div>
  <div class="meta-row">
    <span class="meta-label">Stack</span>
    <span class="meta-value content-data">Phoenix LiveView · Elixir · TDA Libraries</span>
  </div>
  <div class="meta-row">
    <span class="meta-label">Source</span>
    <span class="meta-value content-reference"><a href="https://github.com/uprootiny/liveview-mathematical-visualization">github.com/uprootiny/liveview-mathematical-visualization</a></span>
  </div>
</section>

---

<section class="work-description">

<h2>Concept</h2>

<p class="epistemic-fact">Interactive visualization of topological data analysis (TDA), specifically persistent homology—a method for detecting shape and structure in data across multiple scales.</p>

<h2>What is Persistent Homology?</h2>

<p class="epistemic-inference">Homology detects "holes" in data: connected components (0-dimensional), loops (1-dimensional), voids (2-dimensional). <em>Persistent</em> homology tracks how these features appear and disappear as we vary a scale parameter.</p>

<div class="concept-viz">
  <div class="concept-item">
    <span class="content-data">H₀</span>
    <span class="text-muted">Connected components — clusters, islands</span>
  </div>
  <div class="concept-item">
    <span class="content-data">H₁</span>
    <span class="text-muted">Loops — cycles, tunnels</span>
  </div>
  <div class="concept-item">
    <span class="content-data">H₂</span>
    <span class="text-muted">Voids — cavities, enclosures</span>
  </div>
</div>

<p class="epistemic-speculation">Features that persist across many scales are considered "real" structure; ephemeral features are noise. The persistence diagram becomes a signature of shape.</p>

<h2>Why LiveView?</h2>

<p>Phoenix LiveView enables real-time server-rendered interactivity. Users can manipulate parameters and immediately see how the topological features respond—without writing client-side JavaScript.</p>

<p class="affective-cool">The goal: make abstract mathematics tangible through direct manipulation.</p>

<h2>Visualization Modes</h2>

<table class="modes-table">
  <tr>
    <td class="content-data">Point Cloud</td>
    <td class="text-muted">Raw data with adjustable sampling</td>
  </tr>
  <tr>
    <td class="content-data">Rips Complex</td>
    <td class="text-muted">Simplicial complex at varying epsilon</td>
  </tr>
  <tr>
    <td class="content-data">Persistence Diagram</td>
    <td class="text-muted">Birth-death plot of features</td>
  </tr>
  <tr>
    <td class="content-data">Barcode</td>
    <td class="text-muted">Interval representation of persistence</td>
  </tr>
</table>

<h2>Artistic Resonance</h2>

<p class="epistemic-question">How does the painter's attention to "chromatic fields" relate to the mathematician's detection of topological features? Both seek structure that persists across variation.</p>

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
.concept-viz { margin: 1em 0; padding: 1em; background: rgba(0,0,0,0.03); }
.concept-item { display: flex; gap: 1em; margin: 0.5em 0; }
.modes-table { width: 100%; font-size: 0.9em; margin: 1em 0; }
.modes-table td { padding: 0.5em 0.5em 0.5em 0; border-bottom: 1px dotted var(--color-text-faint); }
</style>
