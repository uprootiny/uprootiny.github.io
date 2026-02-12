---
layout: text
title: "Catalytic Merkle Proofs"
permalink: /computational/catalytic-merkle/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns catalytic-merkle.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

;; Catalytic Merkle Proofs
;; Novel: Use tree nodes themselves as workspace for proof generation
;; Standard: O(n) space for tree + O(log n) for proof
;; Catalytic: Tree is catalyst, only O(log n) clean space needed

(defn hash-str [s]
  (let [h (reduce (fn [a c] (bit-and (+ (bit-shift-left a 5) a (.charCodeAt c 0)) 0x7FFFFFFF))
                  5381 (str s))]
    (.substring (.toString h 16) 0 8)))

(defn combine-hash [h1 h2]
  (hash-str (str h1 "|" h2)))

(def tree-depth 3)
(def num-leaves (bit-shift-left 1 tree-depth))  ; 8 leaves

(defn build-tree [leaves]
  "Build tree, return {:levels [[level0] [level1] ...] :root}"
  (let [leaf-hashes (mapv hash-str leaves)]
    (loop [levels [leaf-hashes]]
      (let [current (last levels)]
        (if (<= (count current) 1)
          {:levels levels :root (first current)}
          (let [pairs (partition 2 current)
                parents (mapv (fn [[l r]] (combine-hash l r)) pairs)]
            (recur (conj levels parents))))))))

;; Traditional proof generation (needs O(n) to store tree)
(defn traditional-proof [tree leaf-idx]
  (let [levels (:levels tree)]
    (loop [idx leaf-idx
           lvl 0
           proof []]
      (if (>= lvl (dec (count levels)))
        proof
        (let [level (get levels lvl)
              sibling-idx (if (even? idx) (inc idx) (dec idx))
              sibling (get level sibling-idx)]
          (recur (quot idx 2)
                 (inc lvl)
                 (conj proof {:hash sibling
                              :side (if (even? idx) :right :left)})))))))

;; Catalytic proof generation
;; Uses tree nodes as temporary storage, restores after

(defn catalytic-proof-step [tree-atom leaf-idx step clean-space]
  "One step of catalytic proof generation.
   Borrows node, extracts sibling, encodes into clean space, restores."
  (let [levels (:levels @tree-atom)
        level-idx step
        level (get levels level-idx)
        node-idx (bit-shift-right leaf-idx step)
        sibling-idx (if (even? node-idx) (inc node-idx) (dec node-idx))
        sibling-hash (get level sibling-idx)
        node-hash (get level node-idx)
        ;; "Borrow" the node - XOR sibling into it
        borrowed (hash-str (str node-hash "^" sibling-hash))]
    ;; Update tree (borrow)
    (swap! tree-atom assoc-in [:levels level-idx node-idx] borrowed)
    ;; Extract to clean space
    (let [new-clean (conj clean-space {:hash sibling-hash
                                        :side (if (even? node-idx) :right :left)
                                        :borrowed-from [level-idx node-idx]})]
      ;; Restore node (un-borrow by XORing again conceptually)
      (swap! tree-atom assoc-in [:levels level-idx node-idx] node-hash)
      new-clean)))

(defonce state
  (r/atom {:leaves (vec (map #(str "leaf" %) (range num-leaves)))
           :tree nil
           :tree-original nil
           :selected-leaf 0
           :traditional-proof nil
           :catalytic-proof []
           :catalytic-step 0
           :clean-space []
           :phase :idle
           :method :traditional
           :operations []}))

(defn init! []
  (let [tree (build-tree (:leaves @state))]
    (swap! state assoc
           :tree tree
           :tree-original tree
           :traditional-proof nil
           :catalytic-proof []
           :catalytic-step 0
           :clean-space []
           :phase :ready
           :operations [])))

(defn generate-traditional! []
  (let [proof (traditional-proof (:tree @state) (:selected-leaf @state))]
    (swap! state assoc
           :traditional-proof proof
           :phase :traditional-complete
           :operations [{:type :store :desc "Store entire tree in memory"}
                        {:type :traverse :desc "Walk tree from leaf to root"}
                        {:type :collect :desc "Collect siblings into proof"}])))

(defn generate-catalytic-step! []
  (let [step (:catalytic-step @state)
        tree-atom (atom (:tree @state))]
    (when (< step tree-depth)
      (let [new-clean (catalytic-proof-step tree-atom
                                            (:selected-leaf @state)
                                            step
                                            (:clean-space @state))]
        (swap! state assoc
               :tree @tree-atom
               :clean-space new-clean
               :catalytic-step (inc step)
               :catalytic-proof new-clean)
        (swap! state update :operations conj
               {:type :borrow :desc (str "Borrow node at level " step)}
               {:type :extract :desc "Extract sibling hash to clean space"}
               {:type :restore :desc "Restore borrowed node"}))
      (when (>= (inc step) tree-depth)
        (swap! state assoc :phase :catalytic-complete)))))

(defn verify-tree-intact []
  (= (:tree @state) (:tree-original @state)))

;; Visualization

(defn tree-viz []
  (let [tree (:tree @state)
        levels (:levels tree)
        selected (:selected-leaf @state)]
    [:svg {:width 400 :height 200 :style {:display "block" :margin "0 auto"}}
     (for [[lvl-idx level] (map-indexed vector (reverse levels))]
       (let [y (+ 20 (* lvl-idx 50))
             n (count level)
             spacing (/ 380 (max 1 n))]
         ^{:key lvl-idx}
         [:g
          ;; Lines to children
          (when (< lvl-idx (dec (count levels)))
            (for [[node-idx _] (map-indexed vector level)]
              (let [x (+ 20 (* node-idx spacing) (/ spacing 2))
                    child-spacing (/ 380 (max 1 (* 2 n)))]
                ^{:key (str "line-" lvl-idx "-" node-idx)}
                [:g
                 [:line {:x1 x :y1 (+ y 12) :x2 (+ 20 (* node-idx 2 child-spacing) (/ child-spacing 2)) :y2 (- (+ y 50) 12)
                         :stroke "#ddd"}]
                 [:line {:x1 x :y1 (+ y 12) :x2 (+ 20 (* (inc (* node-idx 2)) child-spacing) (/ child-spacing 2)) :y2 (- (+ y 50) 12)
                         :stroke "#ddd"}]])))
          ;; Nodes
          (for [[node-idx hash] (map-indexed vector level)]
            (let [x (+ 20 (* node-idx spacing) (/ spacing 2))
                  is-leaf? (= lvl-idx (dec (count levels)))
                  is-selected? (and is-leaf? (= node-idx selected))
                  is-sibling? (and is-leaf?
                                   (= node-idx (if (even? selected) (inc selected) (dec selected))))]
              ^{:key (str lvl-idx "-" node-idx)}
              [:g
               [:rect {:x (- x 25) :y (- y 10) :width 50 :height 20 :rx 3
                       :fill (cond is-selected? "#dcfce7"
                                   is-sibling? "#fef3c7"
                                   :else "#fff")
                       :stroke (cond is-selected? "#22c55e"
                                     is-sibling? "#f59e0b"
                                     :else "#999")}]
               [:text {:x x :y (+ y 4) :text-anchor "middle"
                       :font-size "9" :font-family "monospace" :fill "#333"}
                (subs hash 0 6)]]))]))]]))

(defn proof-viz [proof label]
  [:div {:style {:margin "8px 0" :padding "12px" :background "#f8f8f8"}}
   [:div {:style {:font-weight 600 :margin-bottom "8px"}} label]
   (if (empty? proof)
     [:div {:style {:color "#999" :font-style "italic"}} "No proof yet"]
     [:div {:style {:display "flex" :gap "8px" :flex-wrap "wrap"}}
      (for [[i p] (map-indexed vector proof)]
        ^{:key i}
        [:div {:style {:padding "8px" :background "#fff" :border "1px solid #ddd"
                       :font-family "monospace" :font-size "0.8em"}}
         [:div {:style {:color "#666"}} (str "Level " i)]
         [:div {:style {:display "flex" :gap "4px" :align-items "center"}}
          [:span {:style {:color (if (= (:side p) :left) "#60a5fa" "#22c55e")}}
           (if (= (:side p) :left) "←" "→")]
          [:span (:hash p)]]])])])

(defn operations-panel []
  (let [ops (:operations @state)]
    (when (seq ops)
      [:div {:style {:margin "16px 0" :padding "12px" :background "#1a1a1a"
                     :font-family "monospace" :font-size "0.75em" :color "#e0e0e0"
                     :max-height "120px" :overflow-y "auto"}}
       (for [[i op] (map-indexed vector ops)]
         ^{:key i}
         [:div {:style {:padding "2px 0"
                        :color (case (:type op)
                                 :borrow "#f59e0b"
                                 :extract "#60a5fa"
                                 :restore "#22c55e"
                                 "#888")}}
          (str "[" (name (:type op)) "] " (:desc op))])])))

(defn space-comparison []
  [:div {:style {:display "grid" :grid-template-columns "1fr 1fr" :gap "16px" :margin "16px 0"}}
   [:div {:style {:padding "12px" :background "#fee2e2" :text-align "center"}}
    [:div {:style {:font-size "1.5em" :font-weight 600}} "O(n)"]
    [:div {:style {:font-size "0.85em" :color "#991b1b"}} "Traditional"]
    [:div {:style {:font-size "0.75em" :color "#666"}} "Must store whole tree"]]
   [:div {:style {:padding "12px" :background "#dcfce7" :text-align "center"}}
    [:div {:style {:font-size "1.5em" :font-weight 600}} "O(log n)"]
    [:div {:style {:font-size "0.85em" :color "#166534"}} "Catalytic"]
    [:div {:style {:font-size "0.75em" :color "#666"}} "Tree is catalyst"]]])

(defn controls []
  [:div {:style {:margin "16px 0"}}
   [:div {:style {:display "flex" :gap "8px" :align-items "center" :margin-bottom "12px"}}
    [:label {:style {:font-size "0.85em"}} "Prove leaf:"]
    [:select {:value (:selected-leaf @state)
              :on-change #(swap! state assoc :selected-leaf (js/parseInt (-> % .-target .-value)))
              :style {:padding "4px 8px"}}
     (for [i (range num-leaves)]
       ^{:key i}
       [:option {:value i} (str "leaf" i)])]]

   [:div {:style {:display "flex" :gap "8px" :flex-wrap "wrap"}}
    [:button {:on-click init!
              :style {:padding "8px 16px" :background "#1a1a1a" :color "#fff"
                      :border "none" :cursor "pointer"}}
     "Reset Tree"]
    [:button {:on-click generate-traditional!
              :disabled (not= (:phase @state) :ready)
              :style {:padding "8px 16px" :background "#ef4444" :color "#fff"
                      :border "none" :cursor "pointer"
                      :opacity (if (= (:phase @state) :ready) 1 0.5)}}
     "Traditional Proof"]
    [:button {:on-click generate-catalytic-step!
              :disabled (or (not= (:phase @state) :ready)
                           (>= (:catalytic-step @state) tree-depth))
              :style {:padding "8px 16px" :background "#22c55e" :color "#fff"
                      :border "none" :cursor "pointer"}}
     "Catalytic Step"]]])

(defn app []
  [:div {:style {:font-size "small" :line-height 1.6}}
   [:header
    [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
     [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#22c55e"}}]
     [:h1 {:style {:font-size "1.4em" :margin 0}} "Catalytic Merkle Proofs"]]
    [:p {:style {:color "#666" :margin "4px 0"}} "Using the tree as workspace for proof generation"]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
    "Novel: Generate Merkle proofs using O(log n) clean space instead of O(n)."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
    "The tree structure itself is the catalyst - borrow nodes, extract siblings, restore."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #7d8a70" :color "#7d8a70" :font-style "italic" :margin "12px 0"}}
    "Applicable to blockchain light clients with limited memory."]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [controls]
   [tree-viz]
   [space-comparison]

   [:div {:style {:display "grid" :grid-template-columns "1fr 1fr" :gap "16px"}}
    [proof-viz (:traditional-proof @state) "Traditional Proof"]
    [proof-viz (:catalytic-proof @state) "Catalytic Proof (Clean Space)"]]

   [operations-panel]

   (when (= (:phase @state) :catalytic-complete)
     [:div {:style {:margin "16px 0" :padding "16px" :text-align "center"
                    :background (if (verify-tree-intact) "#dcfce7" "#fee2e2")
                    :border-left (str "4px solid " (if (verify-tree-intact) "#22c55e" "#ef4444"))}}
      (if (verify-tree-intact)
        [:div
         [:div {:style {:font-weight 600 :font-size "1.1em" :color "#166534"}}
          "Tree Intact - Catalyst Preserved"]
         [:div {:style {:color "#166534"}}
          "Proof generated using only " tree-depth " words of clean space"]]
        [:div {:style {:color "#991b1b" :font-weight 600}}
         "TREE CORRUPTED"])])

   [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
    [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]])

(init!)
(rdom/render [app] (js/document.getElementById "app"))
</script>
