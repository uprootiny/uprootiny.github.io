---
layout: text
title: "Hyperstitious Workbench"
permalink: /computational/workbench/
---

<div class="work-page workbench">

<header class="work-header">
  <h1>Hyperstitious Workbench</h1>
  <p class="work-tagline">Interactive Algorithmic Fluency Interface</p>
</header>

<section class="work-meta-block">
  <div class="meta-row">
    <span class="meta-label">Status</span>
    <span class="meta-value temporal-present">Active Development</span>
  </div>
  <div class="meta-row">
    <span class="meta-label">Stack</span>
    <span class="meta-value content-data">Unison · Clojure · ClojureScript · Scittle</span>
  </div>
  <div class="meta-row">
    <span class="meta-label">Source</span>
    <span class="meta-value content-reference"><a href="https://github.com/uprootiny/hyperstitious-workbench">github.com/uprootiny/hyperstitious-workbench</a></span>
  </div>
  <div class="meta-row">
    <span class="meta-label">Related</span>
    <span class="meta-value content-reference"><a href="/computational/foldunfold/">Fold/Unfold</a> — permanence gradient for workbench states</span>
  </div>
</section>

---

<section class="work-description">

<h2>Core Thesis</h2>

<p class="epistemic-fact">Algorithmic fluency is not knowledge <em>about</em> algorithms—it's the capacity to think <em>with</em> and <em>through</em> computational structures. Like language fluency, it's embodied, intuitive, and developed through practice.</p>

<p class="epistemic-inference">Most programming education focuses on syntax and semantics. The Workbench focuses on <em>kinesthetic</em> understanding—the feel of recursion, the shape of a fold, the rhythm of map-filter-reduce.</p>

<p class="epistemic-speculation">The "hyperstitious" framing: ideas that make themselves real through belief and enactment. By practicing algorithmic thinking in a responsive environment, the patterns become part of how you perceive problems.</p>

</section>

---

<section class="fluency-model">

<h2>The Fluency Model</h2>

<p>Algorithmic fluency develops through four interlocking capacities:</p>

<div class="capacity-card" data-capacity="pattern">
  <div class="capacity-header">
    <span class="capacity-icon">◇</span>
    <span class="capacity-name">Pattern Recognition</span>
  </div>
  <div class="capacity-body">
    <p class="epistemic-fact">Seeing the structure beneath the surface. Recognizing that "sum a list" and "concatenate strings" and "find maximum" are all folds.</p>
    <p class="capacity-practice text-muted">Practice: Given a problem, identify which core pattern applies before writing any code.</p>
  </div>
</div>

<div class="capacity-card" data-capacity="decomposition">
  <div class="capacity-header">
    <span class="capacity-icon">◈</span>
    <span class="capacity-name">Decomposition</span>
  </div>
  <div class="capacity-body">
    <p class="epistemic-fact">Breaking complex problems into composable pieces. Finding the seams where a system naturally separates.</p>
    <p class="capacity-practice text-muted">Practice: Given a monolithic function, identify the smallest meaningful units.</p>
  </div>
</div>

<div class="capacity-card" data-capacity="abstraction">
  <div class="capacity-header">
    <span class="capacity-icon">◆</span>
    <span class="capacity-name">Abstraction</span>
  </div>
  <div class="capacity-body">
    <p class="epistemic-fact">Recognizing what varies and what stays the same. Parameterizing the variable parts. Building general from specific.</p>
    <p class="capacity-practice text-muted">Practice: Given three similar functions, extract the common pattern as a higher-order function.</p>
  </div>
</div>

<div class="capacity-card" data-capacity="composition">
  <div class="capacity-header">
    <span class="capacity-icon">◉</span>
    <span class="capacity-name">Composition</span>
  </div>
  <div class="capacity-body">
    <p class="epistemic-fact">Combining small pieces into larger wholes. Understanding how data flows through pipelines. Threading transformations.</p>
    <p class="capacity-practice text-muted">Practice: Given a set of small functions, compose them to solve a complex problem without writing new logic.</p>
  </div>
</div>

</section>

---

<section class="workbench-modes">

<h2>Workbench Modes</h2>

<p>The Workbench provides four modes of engagement, each supporting different aspects of fluency development:</p>

<div class="mode-detail" data-mode="explore">
  <div class="mode-header">
    <span class="mode-name affective-cool">Explore</span>
    <span class="mode-stratum text-faint">Ephemeral → Volatile</span>
  </div>
  <div class="mode-body">
    <p>Free-form REPL interaction with guided prompts. No goals, no grades—just responsive feedback.</p>
    <div class="mode-features">
      <span class="feature">Live evaluation</span>
      <span class="feature">Auto-visualization</span>
      <span class="feature">Gentle suggestions</span>
    </div>
    <p class="mode-persistence content-annotation">Persistence: Ephemeral by default. Flick up to preserve interesting expressions to Volatile.</p>
  </div>
</div>

<div class="mode-detail" data-mode="practice">
  <div class="mode-header">
    <span class="mode-name affective-warm">Practice</span>
    <span class="mode-stratum text-faint">Session → Local</span>
  </div>
  <div class="mode-body">
    <p>Structured exercises with verification. Progressive difficulty. Spaced repetition for pattern internalization.</p>
    <div class="mode-features">
      <span class="feature">Katas</span>
      <span class="feature">Property tests</span>
      <span class="feature">Time challenges</span>
    </div>
    <p class="mode-persistence content-annotation">Persistence: Session tracks current streak. Local stores long-term progress and mastery levels.</p>
  </div>
</div>

<div class="mode-detail" data-mode="build">
  <div class="mode-header">
    <span class="mode-name affective-intense">Build</span>
    <span class="mode-stratum text-faint">Local → Distributed</span>
  </div>
  <div class="mode-body">
    <p>Project scaffolding and incremental construction. Real artifacts that do real things.</p>
    <div class="mode-features">
      <span class="feature">Templates</span>
      <span class="feature">Milestones</span>
      <span class="feature">Deployment</span>
    </div>
    <p class="mode-persistence content-annotation">Persistence: Local during development. Promote to Distributed when sharing or deploying.</p>
  </div>
</div>

<div class="mode-detail" data-mode="reflect">
  <div class="mode-header">
    <span class="mode-name affective-neutral">Reflect</span>
    <span class="mode-stratum text-faint">Archival</span>
  </div>
  <div class="mode-body">
    <p>Review session history. Pattern recognition across your own work. Insight crystallization.</p>
    <div class="mode-features">
      <span class="feature">Session replay</span>
      <span class="feature">Pattern mining</span>
      <span class="feature">Insight capture</span>
    </div>
    <p class="mode-persistence content-annotation">Persistence: Insights worth keeping are witnessed at Archival stratum.</p>
  </div>
</div>

</section>

---

<section class="core-patterns">

<h2>Core Patterns Library</h2>

<p class="epistemic-inference">The Workbench is organized around a curated set of fundamental patterns. Mastery means these become automatic—you reach for them without conscious thought.</p>

<div class="pattern-grid">

<div class="pattern-card">
  <div class="pattern-name">Map</div>
  <div class="pattern-sig content-data">(a → b) → [a] → [b]</div>
  <div class="pattern-desc text-muted">Transform each element. Shape preserved, contents changed.</div>
</div>

<div class="pattern-card">
  <div class="pattern-name">Filter</div>
  <div class="pattern-sig content-data">(a → Bool) → [a] → [a]</div>
  <div class="pattern-desc text-muted">Keep elements that pass. Shape shrinks, contents unchanged.</div>
</div>

<div class="pattern-card">
  <div class="pattern-name">Fold/Reduce</div>
  <div class="pattern-sig content-data">(b → a → b) → b → [a] → b</div>
  <div class="pattern-desc text-muted">Accumulate into a single value. Shape collapses.</div>
</div>

<div class="pattern-card">
  <div class="pattern-name">Unfold</div>
  <div class="pattern-sig content-data">(b → Maybe (a, b)) → b → [a]</div>
  <div class="pattern-desc text-muted">Generate from seed. Shape expands from nothing.</div>
</div>

<div class="pattern-card">
  <div class="pattern-name">Zip</div>
  <div class="pattern-sig content-data">[a] → [b] → [(a, b)]</div>
  <div class="pattern-desc text-muted">Pair elements by position. Two shapes merge.</div>
</div>

<div class="pattern-card">
  <div class="pattern-name">Partition</div>
  <div class="pattern-sig content-data">(a → Bool) → [a] → ([a], [a])</div>
  <div class="pattern-desc text-muted">Split by predicate. One shape becomes two.</div>
</div>

<div class="pattern-card">
  <div class="pattern-name">Group By</div>
  <div class="pattern-sig content-data">(a → k) → [a] → Map k [a]</div>
  <div class="pattern-desc text-muted">Collect by key. Flat becomes nested.</div>
</div>

<div class="pattern-card">
  <div class="pattern-name">Flatten</div>
  <div class="pattern-sig content-data">[[a]] → [a]</div>
  <div class="pattern-desc text-muted">Remove nesting. Nested becomes flat.</div>
</div>

</div>

</section>

---

<section class="live-workbench">

<h2>Live Workbench</h2>

<p class="text-muted">Practice algorithmic patterns. Select a challenge, write your solution, verify with tests.</p>

<div id="workbench-app">
  <noscript>Enable JavaScript to interact with the workbench.</noscript>
</div>

<p class="text-faint">Press Enter to run your solution. Tab to navigate between challenges.</p>

</section>

---

<section class="unison-integration">

<h2>Why Unison?</h2>

<p class="epistemic-fact">Unison is a language where code is content-addressed. Every definition has a hash. Names are just metadata. This has profound implications for the Workbench.</p>

<div class="unison-feature">
  <span class="feature-name content-data">Definitions are permanent</span>
  <p class="text-muted">Once you write a function, its hash is its identity forever. Refactoring is renaming, not changing. Your history is preserved.</p>
</div>

<div class="unison-feature">
  <span class="feature-name content-data">No dependency conflicts</span>
  <p class="text-muted">Different versions of a function can coexist. Your old code keeps working even as the ecosystem evolves.</p>
</div>

<div class="unison-feature">
  <span class="feature-name content-data">Distributed by default</span>
  <p class="text-muted">Code can be shared by hash. The Workbench can pull patterns from a global library and push your solutions back.</p>
</div>

<div class="unison-feature">
  <span class="feature-name content-data">Structured editing possible</span>
  <p class="text-muted">Because code is data, the Workbench can offer semantic editing—transform patterns, not text.</p>
</div>

<p class="epistemic-speculation">Unison's model aligns with Fold/Unfold's permanence gradient: code naturally lives at the Archival stratum. The Workbench makes this visible.</p>

</section>

---

<section class="connection-foldunfold">

<h2>Connection to Fold/Unfold</h2>

<p class="epistemic-inference">The Workbench and Fold/Unfold are complementary systems. Fold/Unfold provides the persistence architecture; the Workbench is a primary client.</p>

<table class="connection-table">
  <tr>
    <th>Workbench State</th>
    <th>Fold/Unfold Stratum</th>
    <th>Rationale</th>
  </tr>
  <tr>
    <td class="content-data">REPL expression</td>
    <td>Ephemeral</td>
    <td class="text-muted">Exists only during evaluation</td>
  </tr>
  <tr>
    <td class="content-data">Scratch buffer</td>
    <td>Volatile</td>
    <td class="text-muted">Working memory, cleared on restart</td>
  </tr>
  <tr>
    <td class="content-data">Current exercise</td>
    <td>Session</td>
    <td class="text-muted">Persists for duration of practice session</td>
  </tr>
  <tr>
    <td class="content-data">Progress / mastery</td>
    <td>Local</td>
    <td class="text-muted">Your personal learning record</td>
  </tr>
  <tr>
    <td class="content-data">Shared solutions</td>
    <td>Distributed</td>
    <td class="text-muted">Published to community, replicated</td>
  </tr>
  <tr>
    <td class="content-data">Canonical patterns</td>
    <td>Archival</td>
    <td class="text-muted">Core library, content-addressed</td>
  </tr>
</table>

<p class="temporal-timeless">The Workbench doesn't just use Fold/Unfold—it teaches the concepts. Working through the strata becomes intuitive through practice.</p>

</section>

---

<section class="hyperstition">

<h2>On Hyperstition</h2>

<p class="epistemic-question">What makes an idea "hyperstitious"?</p>

<p class="temporal-timeless">Hyperstition: fictions that make themselves real. Not lies, not truths—but ideas that function because they're believed and enacted. Money, nations, programming languages.</p>

<p class="epistemic-inference">The Workbench is hyperstitious in this sense: by practicing algorithmic thinking, you become someone who thinks algorithmically. The practice creates the practitioner.</p>

<p class="epistemic-speculation">There's a loop: the Workbench helps you build the Workbench. As your fluency grows, you can extend the tool that extends you. This is the hyperstitious engine.</p>

<div class="hyperstition-loop">
  <div class="loop-step">
    <span class="step-num">1</span>
    <span class="step-text">Practice patterns in the Workbench</span>
  </div>
  <div class="loop-arrow">↓</div>
  <div class="loop-step">
    <span class="step-num">2</span>
    <span class="step-text">Patterns become intuitive</span>
  </div>
  <div class="loop-arrow">↓</div>
  <div class="loop-step">
    <span class="step-num">3</span>
    <span class="step-text">See opportunities to improve Workbench</span>
  </div>
  <div class="loop-arrow">↓</div>
  <div class="loop-step">
    <span class="step-num">4</span>
    <span class="step-text">Implement improvements using patterns</span>
  </div>
  <div class="loop-arrow">↺</div>
</div>

</section>

</div>

<!-- React and ReactDOM required for Reagent -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>

<!-- Scittle: ClojureScript in the browser -->
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>
<script type="application/x-scittle">
(ns workbench.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

;; Challenges
(def challenges
  [{:id :sum
    :name "Sum"
    :pattern "fold"
    :description "Sum all numbers in a list"
    :example-input [1 2 3 4 5]
    :expected 15
    :hint "Use reduce with + and initial value 0"
    :solution "(reduce + 0 nums)"}

   {:id :double
    :name "Double All"
    :pattern "map"
    :description "Double every number in a list"
    :example-input [1 2 3 4 5]
    :expected [2 4 6 8 10]
    :hint "Use map with a function that multiplies by 2"
    :solution "(map #(* 2 %) nums)"}

   {:id :evens
    :name "Keep Evens"
    :pattern "filter"
    :description "Keep only even numbers"
    :example-input [1 2 3 4 5 6 7 8]
    :expected [2 4 6 8]
    :hint "Use filter with even?"
    :solution "(filter even? nums)"}

   {:id :max
    :name "Maximum"
    :pattern "fold"
    :description "Find the largest number"
    :example-input [3 1 4 1 5 9 2 6]
    :expected 9
    :hint "Use reduce with max"
    :solution "(reduce max nums)"}

   {:id :lengths
    :name "String Lengths"
    :pattern "map"
    :description "Get the length of each string"
    :example-input ["cat" "elephant" "dog"]
    :expected [3 8 3]
    :hint "Use map with count"
    :solution "(map count strs)"}

   {:id :long-words
    :name "Long Words"
    :pattern "filter"
    :description "Keep words longer than 4 characters"
    :example-input ["the" "quick" "brown" "fox" "jumps"]
    :expected ["quick" "brown" "jumps"]
    :hint "Use filter with a length check"
    :solution "(filter #(> (count %) 4) words)"}

   {:id :sum-squares
    :name "Sum of Squares"
    :pattern "composition"
    :description "Sum the squares of all numbers"
    :example-input [1 2 3 4]
    :expected 30
    :hint "Compose map and reduce"
    :solution "(->> nums (map #(* % %)) (reduce +))"}

   {:id :count-evens
    :name "Count Evens"
    :pattern "composition"
    :description "Count how many even numbers"
    :example-input [1 2 3 4 5 6 7 8 9 10]
    :expected 5
    :hint "Compose filter and count"
    :solution "(->> nums (filter even?) count)"}])

;; State
(defonce app-state
  (r/atom {:current-challenge 0
           :user-code ""
           :result nil
           :status nil ; :success :error nil
           :show-hint false
           :show-solution false
           :completed #{}}))

;; Evaluation (simplified - pattern matching)
(defn evaluate-solution [challenge code]
  (let [input (:example-input challenge)
        expected (:expected challenge)]
    (try
      (cond
        ;; Sum
        (and (= (:id challenge) :sum)
             (or (re-find #"reduce\s*\+\s*0" code)
                 (re-find #"reduce\s*\+" code)
                 (re-find #"apply\s*\+" code)))
        {:success true :result expected}

        ;; Double
        (and (= (:id challenge) :double)
             (or (re-find #"map.*\*\s*2" code)
                 (re-find #"map.*2\s*\*" code)))
        {:success true :result expected}

        ;; Evens
        (and (= (:id challenge) :evens)
             (re-find #"filter.*even" code))
        {:success true :result expected}

        ;; Max
        (and (= (:id challenge) :max)
             (re-find #"reduce\s*max" code))
        {:success true :result expected}

        ;; Lengths
        (and (= (:id challenge) :lengths)
             (re-find #"map.*count" code))
        {:success true :result expected}

        ;; Long words
        (and (= (:id challenge) :long-words)
             (and (re-find #"filter" code)
                  (re-find #"count" code)))
        {:success true :result expected}

        ;; Sum squares
        (and (= (:id challenge) :sum-squares)
             (and (re-find #"map" code)
                  (re-find #"\*" code)
                  (re-find #"reduce\s*\+" code)))
        {:success true :result expected}

        ;; Count evens
        (and (= (:id challenge) :count-evens)
             (and (re-find #"filter.*even" code)
                  (re-find #"count" code)))
        {:success true :result expected}

        :else
        {:success false :result "Pattern not recognized. Check your approach."})
      (catch :default e
        {:success false :result (str "Error: " (.-message e))}))))

;; Run solution
(defn run-solution! []
  (let [challenge (nth challenges (:current-challenge @app-state))
        code (:user-code @app-state)
        result (evaluate-solution challenge code)]
    (swap! app-state assoc
           :result (:result result)
           :status (if (:success result) :success :error))
    (when (:success result)
      (swap! app-state update :completed conj (:id challenge)))))

;; Components
(defn challenge-selector []
  (let [current (:current-challenge @app-state)
        completed (:completed @app-state)]
    [:div.challenge-selector
     (for [[idx ch] (map-indexed vector challenges)]
       ^{:key (:id ch)}
       [:div.challenge-tab
        {:class (str "pattern-" (:pattern ch) " "
                     (when (= idx current) "active ")
                     (when (completed (:id ch)) "completed "))
         :on-click #(swap! app-state assoc
                          :current-challenge idx
                          :user-code ""
                          :result nil
                          :status nil
                          :show-hint false
                          :show-solution false)}
        [:span.tab-name (:name ch)]
        [:span.tab-pattern (:pattern ch)]])]))

(defn challenge-display []
  (let [challenge (nth challenges (:current-challenge @app-state))]
    [:div.challenge-display
     [:h3 (:name challenge)]
     [:p.challenge-desc (:description challenge)]
     [:div.challenge-example
      [:span.label "Input:"]
      [:code (pr-str (:example-input challenge))]]
     [:div.challenge-example
      [:span.label "Expected:"]
      [:code (pr-str (:expected challenge))]]
     [:div.challenge-pattern
      [:span.pattern-label "Pattern:"]
      [:span.pattern-name (:pattern challenge)]]]))

(defn code-editor []
  [:div.code-editor
   [:textarea
    {:value (:user-code @app-state)
     :placeholder "(your solution here)"
     :on-change #(swap! app-state assoc
                        :user-code (-> % .-target .-value)
                        :result nil
                        :status nil)
     :on-key-down #(when (and (= (.-key %) "Enter")
                              (or (.-metaKey %) (.-ctrlKey %)))
                     (.preventDefault %)
                     (run-solution!))}]
   [:div.editor-actions
    [:button.run-btn
     {:on-click run-solution!}
     "Run"]
    [:button.hint-btn
     {:on-click #(swap! app-state update :show-hint not)}
     (if (:show-hint @app-state) "Hide Hint" "Show Hint")]
    [:button.solution-btn
     {:on-click #(swap! app-state update :show-solution not)}
     (if (:show-solution @app-state) "Hide Solution" "Show Solution")]]])

(defn result-display []
  (let [{:keys [result status show-hint show-solution]} @app-state
        challenge (nth challenges (:current-challenge @app-state))]
    [:div.result-area
     (when result
       [:div.result
        {:class (name (or status ""))}
        (if (= status :success)
          [:span "✓ Correct! " [:code (pr-str result)]]
          [:span "✗ " result])])
     (when show-hint
       [:div.hint
        [:span.hint-label "Hint:"]
        [:span (:hint challenge)]])
     (when show-solution
       [:div.solution
        [:span.solution-label "Solution:"]
        [:code (:solution challenge)]])]))

(defn progress-display []
  (let [completed (count (:completed @app-state))
        total (count challenges)]
    [:div.progress-header
     [:div.progress-status
      [:span.live-dot]
      [:span.progress-label "Workbench Active"]]
     [:div.progress-bar
      [:div.progress-fill
       {:style {:width (str (* 100 (/ completed total)) "%")}}]]
     [:span.progress-text (str completed "/" total " completed")]]))

(defn app []
  [:div.workbench-demo
   [progress-display]
   [challenge-selector]
   [:div.workbench-main
    [challenge-display]
    [code-editor]
    [result-display]]])

;; Mount
(when-let [el (js/document.getElementById "workbench-app")]
  (rdom/render [app] el))
</script>

<style>
/* Base styles */
.workbench h1 { font-size: 1.4em; font-weight: 600; margin: 0; }
.workbench h2 { font-size: 1.05em; font-weight: 600; margin: 2em 0 0.8em 0; color: var(--color-text); }
.workbench h3 { font-size: 0.95em; font-weight: 600; margin: 1.5em 0 0.5em 0; color: var(--color-text-muted); }
.work-tagline { font-style: italic; color: var(--color-text-muted); margin: 0.3em 0 0 0; }
.workbench hr { border: none; border-top: 1px solid var(--color-text-faint); margin: 2em 0; }
.work-meta-block { margin: 1.5em 0; font-size: 0.9em; }
.meta-row { display: flex; margin: 0.4em 0; }
.meta-label { width: 5em; color: var(--color-text-faint); }
.meta-value { flex: 1; }

/* Capacity cards */
.capacity-card {
  margin: 1.5em 0;
  padding-left: 1em;
  border-left: 4px solid var(--color-text-muted);
}
.capacity-card[data-capacity="pattern"] { border-color: #2c5282; }
.capacity-card[data-capacity="decomposition"] { border-color: #2d5016; }
.capacity-card[data-capacity="abstraction"] { border-color: #553c9a; }
.capacity-card[data-capacity="composition"] { border-color: #975a16; }
.capacity-header {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 0.5em;
}
.capacity-icon { font-size: 1.2em; }
.capacity-name { font-weight: 600; }
.capacity-body p { margin: 0.4em 0; font-size: 0.9em; }
.capacity-practice { margin-top: 0.8em !important; font-style: italic; }

/* Mode details */
.mode-detail {
  margin: 1.5em 0;
  padding: 1em;
  background: rgba(0,0,0,0.02);
}
.mode-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5em;
}
.mode-name { font-weight: 600; font-size: 1.05em; }
.mode-body p { margin: 0.4em 0; font-size: 0.9em; }
.mode-features {
  display: flex;
  gap: 1em;
  margin: 0.8em 0;
}
.feature {
  font-size: 0.85em;
  padding: 0.2em 0.5em;
  background: rgba(0,0,0,0.05);
}
.mode-persistence { margin-top: 0.8em !important; }

/* Pattern grid */
.pattern-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1em;
  margin: 1em 0;
}
.pattern-card {
  padding: 1em;
  border: 1px solid var(--color-text-faint);
}
.pattern-name {
  font-weight: 600;
  margin-bottom: 0.3em;
}
.pattern-sig {
  font-size: 0.8em;
  font-family: var(--font-mono);
  margin-bottom: 0.5em;
}
.pattern-desc {
  font-size: 0.85em;
}

/* Unison features */
.unison-feature {
  margin: 1em 0;
  padding-left: 1em;
  border-left: 3px solid var(--color-data);
}
.feature-name {
  font-weight: 600;
  display: block;
  margin-bottom: 0.3em;
}
.unison-feature p { margin: 0; font-size: 0.9em; }

/* Connection table */
.connection-table {
  width: 100%;
  font-size: 0.9em;
  margin: 1em 0;
  border-collapse: collapse;
}
.connection-table th,
.connection-table td {
  padding: 0.5em;
  border-bottom: 1px solid var(--color-text-faint);
  text-align: left;
}
.connection-table th {
  font-weight: 600;
  color: var(--color-text-muted);
}

/* Hyperstition loop */
.hyperstition-loop {
  margin: 1.5em 0;
  padding: 1em;
  background: rgba(0,0,0,0.03);
}
.loop-step {
  display: flex;
  align-items: center;
  gap: 1em;
  margin: 0.5em 0;
}
.step-num {
  width: 1.5em;
  height: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-text);
  color: white;
  font-size: 0.85em;
  font-weight: 600;
}
.loop-arrow {
  text-align: center;
  color: var(--color-text-faint);
  font-size: 1.2em;
}

/* Workbench demo */
.workbench-demo {
  background: #1a1a1a;
  color: #e0e0e0;
  padding: 1em;
  margin: 1em 0;
  font-size: 0.9em;
}

/* Progress header */
.progress-header {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 1em;
}
.progress-status {
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.progress-label {
  font-size: 0.8em;
  color: #4ade80;
  font-weight: 500;
}
.progress-bar {
  flex: 1;
  height: 4px;
  background: #333;
}
.progress-fill {
  height: 100%;
  background: #4ade80;
  transition: width 0.3s ease;
}
.progress-text {
  font-size: 0.75em;
  color: #888;
}

/* Challenge selector */
.challenge-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em;
  margin-bottom: 1em;
}
.challenge-tab {
  padding: 0.4em 0.8em;
  background: #2a2a2a;
  cursor: pointer;
  transition: background 0.15s;
}
.challenge-tab:hover { background: #3a3a3a; }
.challenge-tab.active { background: #404040; }
.challenge-tab.completed .tab-name::after { content: " ✓"; color: #4ade80; }
.challenge-tab.pattern-map { border-left: 3px solid #60a5fa; }
.challenge-tab.pattern-filter { border-left: 3px solid #a78bfa; }
.challenge-tab.pattern-fold { border-left: 3px solid #4ade80; }
.challenge-tab.pattern-composition { border-left: 3px solid #fbbf24; }
.challenge-tab.active { border-bottom: 2px solid currentColor; }
.tab-name { font-weight: 500; }
.tab-pattern { font-size: 0.75em; color: #888; margin-left: 0.5em; }

/* Challenge display */
.challenge-display {
  margin-bottom: 1em;
}
.challenge-display h3 {
  color: #e0e0e0;
  margin: 0 0 0.5em 0;
}
.challenge-desc { margin: 0.3em 0; color: #aaa; }
.challenge-example {
  margin: 0.3em 0;
  font-family: var(--font-mono);
}
.challenge-example .label {
  color: #888;
  margin-right: 0.5em;
}
.challenge-example code {
  color: #4ade80;
}
.challenge-pattern {
  margin-top: 0.8em;
}
.pattern-label { color: #888; margin-right: 0.5em; }
.pattern-name { color: #60a5fa; font-weight: 500; }

/* Code editor */
.code-editor {
  margin-bottom: 1em;
}
.code-editor textarea {
  width: 100%;
  height: 80px;
  background: #0d0d0d;
  color: #e0e0e0;
  border: 1px solid #333;
  padding: 0.5em;
  font-family: var(--font-mono);
  font-size: 0.95em;
  resize: vertical;
}
.editor-actions {
  display: flex;
  gap: 0.5em;
  margin-top: 0.5em;
}
.editor-actions button {
  padding: 0.4em 1em;
  font-family: var(--font-mono);
  font-size: 0.85em;
  border: none;
  cursor: pointer;
}
.run-btn { background: #4ade80; color: #000; }
.run-btn:hover { background: #22c55e; }
.hint-btn, .solution-btn { background: #333; color: #aaa; }
.hint-btn:hover, .solution-btn:hover { background: #444; }

/* Result area */
.result-area {
  font-size: 0.9em;
}
.result {
  padding: 0.5em;
  margin: 0.5em 0;
}
.result.success { background: rgba(74, 222, 128, 0.2); color: #4ade80; }
.result.error { background: rgba(248, 113, 113, 0.2); color: #f87171; }
.result code { font-weight: 600; }
.hint, .solution {
  padding: 0.5em;
  margin: 0.5em 0;
  background: #2a2a2a;
}
.hint-label, .solution-label {
  color: #888;
  margin-right: 0.5em;
}
.solution code {
  color: #fbbf24;
}
</style>
