---
layout: text
title: "Cellular Automata"
permalink: /computational/automata/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns automata.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

;; Cellular Automata: Simple rules, emergent complexity
;; Each cell's next state depends only on current neighborhood
;; Rule 110 is Turing complete

(def width 80)
(def max-generations 60)

(defn rule-to-bits [rule-num]
  "Convert rule number (0-255) to 8-bit lookup table"
  (vec (for [i (range 8)]
         (bit-and (bit-shift-right rule-num i) 1))))

(defn neighborhood-index [left center right]
  "Convert 3-cell neighborhood to index (0-7)"
  (+ (* left 4) (* center 2) right))

(defn next-cell [rule-bits left center right]
  (get rule-bits (neighborhood-index left center right)))

(defn next-generation [rule-bits row]
  (let [n (count row)]
    (vec (for [i (range n)]
           (let [left (get row (mod (dec i) n))
                 center (get row i)
                 right (get row (mod (inc i) n))]
             (next-cell rule-bits left center right))))))

(defn evolve [rule-num initial-row generations]
  (let [rule-bits (rule-to-bits rule-num)]
    (loop [rows [initial-row]
           gen 0]
      (if (>= gen generations)
        rows
        (recur (conj rows (next-generation rule-bits (last rows)))
               (inc gen))))))

(defn single-cell-row [w]
  (assoc (vec (repeat w 0)) (quot w 2) 1))

(defn random-row [w]
  (vec (repeatedly w #(rand-int 2))))

(defonce state
  (r/atom {:rule 110
           :initial :single
           :generations []
           :running false
           :speed 100}))

(defn generate! []
  (let [initial (case (:initial @state)
                  :single (single-cell-row width)
                  :random (random-row width))]
    (swap! state assoc :generations (evolve (:rule @state) initial max-generations))))

(defn set-rule! [n]
  (swap! state assoc :rule (max 0 (min 255 n)))
  (generate!))

;; Interesting rules
(def notable-rules
  [{:num 110 :name "Rule 110" :desc "Turing complete, complex"}
   {:num 30 :name "Rule 30" :desc "Chaotic, used for randomness"}
   {:num 90 :name "Rule 90" :desc "Sierpinski triangle"}
   {:num 184 :name "Rule 184" :desc "Traffic flow model"}
   {:num 250 :name "Rule 250" :desc "Replication"}
   {:num 0 :name "Rule 0" :desc "All die"}
   {:num 255 :name "Rule 255" :desc "All live"}])

;; Visualization

(defn rule-viz []
  (let [rule-bits (rule-to-bits (:rule @state))]
    [:div {:style {:margin "12px 0"}}
     [:div {:style {:font-size "0.85em" :color "#666" :margin-bottom "8px"}}
      "Rule " (:rule @state) " lookup table:"]
     [:div {:style {:display "flex" :gap "4px" :flex-wrap "wrap"}}
      (for [i (reverse (range 8))]
        (let [[l c r] [(bit-and (bit-shift-right i 2) 1)
                       (bit-and (bit-shift-right i 1) 1)
                       (bit-and i 1)]
              result (get rule-bits i)]
          ^{:key i}
          [:div {:style {:text-align "center" :padding "4px" :background "#f8f8f8"
                         :border "1px solid #ddd" :min-width "40px"}}
           [:div {:style {:display "flex" :justify-content "center" :gap "1px"}}
            [:div {:style {:width "10px" :height "10px"
                           :background (if (= l 1) "#1a1a1a" "#fff")
                           :border "1px solid #999"}}]
            [:div {:style {:width "10px" :height "10px"
                           :background (if (= c 1) "#1a1a1a" "#fff")
                           :border "1px solid #999"}}]
            [:div {:style {:width "10px" :height "10px"
                           :background (if (= r 1) "#1a1a1a" "#fff")
                           :border "1px solid #999"}}]]
           [:div {:style {:margin-top "4px"}}
            [:div {:style {:width "10px" :height "10px" :margin "0 auto"
                           :background (if (= result 1) "#22c55e" "#fff")
                           :border "1px solid #999"}}]]]))]]))

(defn grid-viz []
  (let [gens (:generations @state)]
    [:div {:style {:overflow-x "auto" :margin "16px 0"}}
     [:div {:style {:display "flex" :flex-direction "column" :gap "0px"
                    :background "#fff" :border "1px solid #ddd" :padding "4px"}}
      (for [[row-idx row] (map-indexed vector gens)]
        ^{:key row-idx}
        [:div {:style {:display "flex" :gap "0px"}}
         (for [[col-idx cell] (map-indexed vector row)]
           ^{:key col-idx}
           [:div {:style {:width "6px" :height "6px"
                          :background (if (= cell 1) "#1a1a1a" "#fff")}}])])]]))

(defn controls []
  [:div {:style {:margin "16px 0"}}
   [:div {:style {:display "flex" :gap "8px" :align-items "center" :margin-bottom "12px"}}
    [:label {:style {:font-size "0.85em" :color "#666"}} "Rule (0-255):"]
    [:input {:type "number" :min 0 :max 255
             :value (:rule @state)
             :on-change #(set-rule! (js/parseInt (-> % .-target .-value)))
             :style {:width "80px" :padding "6px" :border "1px solid #ccc"}}]
    [:input {:type "range" :min 0 :max 255
             :value (:rule @state)
             :on-change #(set-rule! (js/parseInt (-> % .-target .-value)))
             :style {:flex 1}}]]

   [:div {:style {:display "flex" :gap "8px" :margin-bottom "12px"}}
    [:span {:style {:font-size "0.85em" :color "#666"}} "Initial:"]
    [:button {:on-click #(do (swap! state assoc :initial :single) (generate!))
              :style {:padding "4px 12px"
                      :background (if (= (:initial @state) :single) "#1a1a1a" "#f0f0f0")
                      :color (if (= (:initial @state) :single) "#fff" "#333")
                      :border "none" :cursor "pointer"}}
     "Single cell"]
    [:button {:on-click #(do (swap! state assoc :initial :random) (generate!))
              :style {:padding "4px 12px"
                      :background (if (= (:initial @state) :random) "#1a1a1a" "#f0f0f0")
                      :color (if (= (:initial @state) :random) "#fff" "#333")
                      :border "none" :cursor "pointer"}}
     "Random"]]

   [:div {:style {:display "flex" :gap "6px" :flex-wrap "wrap"}}
    (for [r notable-rules]
      ^{:key (:num r)}
      [:button {:on-click #(set-rule! (:num r))
                :title (:desc r)
                :style {:padding "4px 8px" :font-size "0.8em"
                        :background (if (= (:rule @state) (:num r)) "#22c55e" "#f0f0f0")
                        :color (if (= (:rule @state) (:num r)) "#fff" "#333")
                        :border "none" :cursor "pointer"}}
       (:name r)])]])

(defn app []
  [:div {:style {:font-size "small" :line-height 1.6}}
   [:header
    [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
     [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#1a1a1a"}}]
     [:h1 {:style {:font-size "1.4em" :margin 0}} "Cellular Automata"]]
    [:p {:style {:color "#666" :margin "4px 0"}} "Simple rules, emergent complexity"]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
    "Each cell looks at itself and its neighbors. A rule determines its next state."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
    "256 possible rules. Some create chaos, some create order, some are Turing complete."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #7d8a70" :color "#7d8a70" :font-style "italic" :margin "12px 0"}}
    "Rule 110 can compute anything. Complexity from simplicity."]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [controls]
   [rule-viz]
   [grid-viz]

   [:div {:style {:margin-top "24px" :padding "12px" :background "#1a1a1a" :color "#e0e0e0"
                  :font-family "monospace" :font-size "0.8em"}}
    [:div {:style {:color "#888" :margin-bottom "8px"}} "Elementary cellular automaton:"]
    [:pre {:style {:margin 0 :white-space "pre-wrap"}}
"for each cell at position i:
  neighborhood = [cell[i-1], cell[i], cell[i+1]]
  index = left*4 + center*2 + right  (0-7)
  next_state = bit(rule_number, index)

Rule 110 in binary: 01101110
  111→0, 110→1, 101→1, 100→0
  011→1, 010→1, 001→1, 000→0"]]

   [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
    [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]])

;; Initialize
(generate!)

(rdom/render [app] (js/document.getElementById "app"))
</script>
