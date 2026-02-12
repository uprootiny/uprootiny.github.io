---
layout: text
title: "Specimen: Interactive & Live"
permalink: /specimen/interactive/
---

<div class="specimen-page">

## Interactive & Live Patterns

This page demonstrates the design vocabulary for interactive, ClojureScript-powered, and live-updating content.

---

### Permanence Strata

The 7-strata gradient represents data permanence from ephemeral to geological.

<div class="strata-demo">
  <div class="stratum-row stratum-1-bg">
    <span class="stratum-num">1</span>
    <span class="stratum-name">Ephemeral</span>
    <span class="stratum-duration">~ms</span>
    <span class="stratum-impl">Hover states, function returns</span>
  </div>
  <div class="stratum-row stratum-2-bg">
    <span class="stratum-num">2</span>
    <span class="stratum-name">Volatile</span>
    <span class="stratum-duration">~min</span>
    <span class="stratum-impl">In-memory atoms, working memory</span>
  </div>
  <div class="stratum-row stratum-3-bg">
    <span class="stratum-num">3</span>
    <span class="stratum-name">Session</span>
    <span class="stratum-duration">~hrs</span>
    <span class="stratum-impl">sessionStorage, tab-bound state</span>
  </div>
  <div class="stratum-row stratum-4-bg">
    <span class="stratum-num">4</span>
    <span class="stratum-name">Local</span>
    <span class="stratum-duration">~days</span>
    <span class="stratum-impl">localStorage, IndexedDB, SQLite</span>
  </div>
  <div class="stratum-row stratum-5-bg">
    <span class="stratum-num">5</span>
    <span class="stratum-name">Distributed</span>
    <span class="stratum-duration">~months</span>
    <span class="stratum-impl">CRDTs, P2P sync, federation</span>
  </div>
  <div class="stratum-row stratum-6-bg">
    <span class="stratum-num">6</span>
    <span class="stratum-name">Archival</span>
    <span class="stratum-duration">~years</span>
    <span class="stratum-impl">IPFS, content-addressed storage</span>
  </div>
  <div class="stratum-row stratum-7-bg">
    <span class="stratum-num">7</span>
    <span class="stratum-name">Geological</span>
    <span class="stratum-duration">~eons</span>
    <span class="stratum-impl">DNA storage, lunar archives</span>
  </div>
</div>

---

### Stratum Border Indicators

Content at different permanence levels, indicated by left border.

<div class="stratum-border-demo">
  <p class="stratum-ephemeral">Ephemeral content — here briefly, then gone</p>
  <p class="stratum-volatile">Volatile content — persists while you're here</p>
  <p class="stratum-session">Session content — survives refresh</p>
  <p class="stratum-local">Local content — stored on your device</p>
  <p class="stratum-distributed">Distributed content — shared across network</p>
  <p class="stratum-archival">Archival content — preserved for years</p>
  <p class="stratum-geological">Geological content — permanent record</p>
</div>

---

### Liveness Indicators

For content that updates in real-time or represents running processes.

<div class="liveness-demo">
  <div class="live-row">
    <span class="live-indicator"></span>
    <span class="live-active">Active</span>
    <span class="text-muted">— System running, responsive</span>
  </div>
  <div class="live-row">
    <span class="live-indicator pending"></span>
    <span class="live-pending">Pending</span>
    <span class="text-muted">— Processing, awaiting response</span>
  </div>
  <div class="live-row">
    <span class="live-indicator error"></span>
    <span class="live-error">Error</span>
    <span class="text-muted">— Failed, needs attention</span>
  </div>
  <div class="live-row">
    <span class="live-indicator idle"></span>
    <span class="live-idle">Idle</span>
    <span class="text-muted">— Dormant, ready when needed</span>
  </div>
</div>

---

### Code Wells

For displaying live ClojureScript/Scittle code.

<div class="code-well">
<span class="repl-prompt">;; A witness function in ClojureScript</span>
(defn witness!
  "Attest that a datum exists at a given stratum."
  [{:keys [content stratum context]}]
  (let [record {:hash (hash-content content)
                :stratum stratum
                :timestamp (now)}]
    (swap! app-state update-in [stratum :witnesses] conj record)
    record))
</div>

<div class="code-well live">
<span class="repl-prompt">=></span> <span class="repl-result">{:hash "bafk..." :stratum :session :timestamp #inst "2026-01-29"}</span>
</div>

<div class="code-well error">
<span class="repl-prompt">=></span> <span class="repl-error">Error: No stratum specified for witness</span>
</div>

---

### Decay Animations

Content that fades over time, demonstrating ephemeral nature.

<div class="decay-demo" id="decay-demo">
  <p class="decay-item">This content will decay...</p>
  <button onclick="triggerDecay()">Trigger Decay</button>
</div>

<script>
function triggerDecay() {
  const item = document.querySelector('.decay-item');
  item.classList.add('decay-out');
  setTimeout(() => {
    item.classList.remove('decay-out');
    item.classList.add('emerge');
    setTimeout(() => item.classList.remove('emerge'), 300);
  }, 2000);
}
</script>

---

### Combined: Live Code with Stratum

<div class="combined-demo">
  <div class="code-context">
    <div class="code-header">
      <span class="live-indicator"></span>
      <span>foldunfold.core</span>
      <span class="stratum-3-bg stratum-badge">Session</span>
    </div>
    <div class="code-well live">
(defonce app-state
  (r/atom {:ephemeral {:hover nil}
           :volatile {:recent []}
           :session {:witnesses []}}))
    </div>
  </div>
</div>

---

### Design Principles

<div class="principles">
  <p class="epistemic-fact stratum-archival">Permanence is a spectrum, not a binary.</p>
  <p class="epistemic-inference stratum-distributed">Design should make data duration visible.</p>
  <p class="epistemic-speculation stratum-volatile">Users can develop intuition for data lifetime.</p>
  <p class="epistemic-question stratum-ephemeral">What does it mean to design for decay?</p>
</div>

</div>

<style>
.specimen-page h2 {
  font-size: 1.1em;
  font-weight: 600;
  margin: 0 0 0.5em 0;
}
.specimen-page h3 {
  font-size: 0.95em;
  font-weight: 600;
  margin: 1.5em 0 0.8em 0;
  color: var(--color-text-muted);
}
.specimen-page hr {
  border: none;
  border-top: 1px solid var(--color-text-faint);
  margin: 2em 0;
}

/* Strata demo */
.strata-demo {
  margin: 1em 0;
}
.stratum-row {
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 0.6em 1em;
  font-size: 0.9em;
}
.stratum-num {
  font-weight: 600;
  width: 1.5em;
}
.stratum-name {
  font-weight: 600;
  width: 6em;
}
.stratum-duration {
  width: 4em;
  opacity: 0.7;
}
.stratum-impl {
  flex: 1;
  font-size: 0.85em;
  opacity: 0.8;
}

/* Stratum border demo */
.stratum-border-demo p {
  margin: 0.8em 0;
  padding-left: 1em;
}

/* Liveness demo */
.liveness-demo {
  margin: 1em 0;
}
.live-row {
  display: flex;
  align-items: center;
  gap: 0.8em;
  padding: 0.5em 0;
}

/* Code context */
.code-context {
  margin: 1em 0;
}
.code-header {
  display: flex;
  align-items: center;
  gap: 0.8em;
  padding: 0.5em 1em;
  background: var(--color-stratum-5);
  color: var(--color-stratum-5-text);
  font-size: 0.85em;
}
.stratum-badge {
  padding: 0.2em 0.5em;
  font-size: 0.8em;
  margin-left: auto;
}

/* Decay demo */
.decay-demo {
  padding: 1em;
  background: rgba(0,0,0,0.02);
}
.decay-demo button {
  padding: 0.5em 1em;
  font-family: var(--font-mono);
  font-size: 0.85em;
  background: var(--color-text);
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 0.5em;
}
.decay-item {
  margin: 0.5em 0;
}

/* Principles */
.principles p {
  margin: 0.6em 0;
  padding-left: 1em;
}
</style>
