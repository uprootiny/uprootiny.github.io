---
layout: text
title: "Consensus Mechanisms"
permalink: /computational/consensus/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns consensus.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

;; Consensus: How distributed systems agree on truth
;; At stratum 5 (distributed), data must achieve consensus to persist
;; Byzantine fault tolerance: agreement despite malicious actors

(defn now [] (js/Date.now))

(def node-states [:proposal :voting :committed :failed])

(defn make-node [id]
  {:id id
   :state :idle
   :value nil
   :votes #{}
   :byzantine? (< (rand) 0.1)  ; 10% chance of being byzantine
   :x (+ 50 (* 80 (mod id 4)))
   :y (+ 50 (* 80 (quot id 4)))})

(defonce state
  (r/atom {:nodes (vec (map make-node (range 9)))
           :proposal nil
           :round 0
           :log []
           :threshold 6  ; need 2/3 + 1 for BFT
           :speed 1000}))

(defn log! [msg]
  (swap! state update :log #(take 20 (cons {:msg msg :at (now)} %))))

(defn propose! [value]
  (log! (str "Round " (inc (:round @state)) ": Proposing '" value "'"))
  (swap! state assoc :proposal value :round (inc (:round @state)))
  (swap! state update :nodes
         (fn [nodes]
           (mapv #(assoc % :state :proposal :value value :votes #{}) nodes))))

(defn vote! []
  (swap! state update :nodes
         (fn [nodes]
           (mapv (fn [n]
                   (if (:byzantine? n)
                     ;; Byzantine nodes vote randomly or maliciously
                     (let [vote (if (< (rand) 0.5) (:value n) "EVIL")]
                       (log! (str "Node " (:id n) " (byzantine) votes: " vote))
                       (assoc n :state :voting :vote vote))
                     ;; Honest nodes vote for the proposal
                     (do
                       (log! (str "Node " (:id n) " votes: " (:value n)))
                       (assoc n :state :voting :vote (:value n)))))
                 nodes))))

(defn tally! []
  (let [nodes (:nodes @state)
        votes (frequencies (map :vote nodes))
        winner (first (apply max-key val votes))
        count-for (get votes winner 0)
        threshold (:threshold @state)]
    (log! (str "Tally: " (pr-str votes)))
    (if (>= count-for threshold)
      (do
        (log! (str "CONSENSUS REACHED: '" winner "' with " count-for "/" (count nodes) " votes"))
        (swap! state update :nodes
               (fn [ns] (mapv #(assoc % :state :committed :final winner) ns))))
      (do
        (log! (str "NO CONSENSUS: needed " threshold ", got " count-for " for '" winner "'"))
        (swap! state update :nodes
               (fn [ns] (mapv #(assoc % :state :failed) ns)))))))

(defn reset-nodes! []
  (swap! state assoc
         :nodes (vec (map make-node (range 9)))
         :proposal nil
         :log []))

;; Components

(defn node-viz [n]
  (let [color (case (:state n)
                :idle "#888"
                :proposal "#f59e0b"
                :voting "#60a5fa"
                :committed "#22c55e"
                :failed "#ef4444"
                "#888")]
    [:g {:key (:id n)}
     [:circle {:cx (:x n) :cy (:y n) :r 25
               :fill color
               :stroke (if (:byzantine? n) "#ef4444" "#333")
               :stroke-width (if (:byzantine? n) 3 1)}]
     [:text {:x (:x n) :y (+ (:y n) 5) :text-anchor "middle"
             :font-size "12" :fill (if (= (:state n) :committed) "#fff" "#000")}
      (str (:id n))]
     (when (:byzantine? n)
       [:text {:x (:x n) :y (- (:y n) 30) :text-anchor "middle"
               :font-size "10" :fill "#ef4444"}
        "byzantine"])]))

(defn network-viz []
  [:svg {:width "350" :height "300" :style {:background "#f8f8f8" :border "1px solid #ddd"}}
   ;; Draw connections
   (for [i (range 9)
         j (range (inc i) 9)]
     (let [n1 (nth (:nodes @state) i)
           n2 (nth (:nodes @state) j)]
       ^{:key (str i "-" j)}
       [:line {:x1 (:x n1) :y1 (:y n1) :x2 (:x n2) :y2 (:y n2)
               :stroke "#ddd" :stroke-width 1}]))
   ;; Draw nodes
   (for [n (:nodes @state)]
     ^{:key (:id n)}
     [node-viz n])])

(defn controls []
  (let [input (r/atom "hello")]
    (fn []
      [:div {:style {:margin "12px 0"}}
       [:div {:style {:display "flex" :gap "6px" :margin-bottom "8px"}}
        [:input {:value @input
                 :on-change #(reset! input (-> % .-target .-value))
                 :placeholder "Value to propose..."
                 :style {:flex 1 :padding "6px" :border "1px solid #ccc"}}]
        [:button {:on-click #(when (seq @input) (propose! @input))
                  :style {:padding "6px 12px" :background "#f59e0b" :border "none" :cursor "pointer"}}
         "Propose"]]
       [:div {:style {:display "flex" :gap "6px"}}
        [:button {:on-click vote!
                  :disabled (nil? (:proposal @state))
                  :style {:padding "6px 12px" :background "#60a5fa" :border "none" :cursor "pointer"
                          :opacity (if (:proposal @state) 1 0.5)}}
         "Vote"]
        [:button {:on-click tally!
                  :style {:padding "6px 12px" :background "#22c55e" :border "none" :cursor "pointer"}}
         "Tally"]
        [:button {:on-click reset-nodes!
                  :style {:padding "6px 12px" :background "#888" :border "none" :cursor "pointer"}}
         "Reset"]]])))

(defn log-panel []
  [:div {:style {:margin "12px 0" :max-height "150px" :overflow-y "auto"
                 :font-size "0.8em" :font-family "monospace" :background "#1a1a1a"
                 :color "#22c55e" :padding "8px"}}
   (for [[i entry] (map-indexed vector (:log @state))]
     ^{:key i}
     [:div {:style {:padding "2px 0" :border-bottom "1px solid #333"}}
      (:msg entry)])])

(defn legend []
  [:div {:style {:display "flex" :gap "12px" :font-size "0.8em" :margin "8px 0"}}
   [:span [:span {:style {:display "inline-block" :width "12px" :height "12px"
                          :background "#888" :border-radius "50%" :margin-right "4px"}}] "Idle"]
   [:span [:span {:style {:display "inline-block" :width "12px" :height "12px"
                          :background "#f59e0b" :border-radius "50%" :margin-right "4px"}}] "Proposal"]
   [:span [:span {:style {:display "inline-block" :width "12px" :height "12px"
                          :background "#60a5fa" :border-radius "50%" :margin-right "4px"}}] "Voting"]
   [:span [:span {:style {:display "inline-block" :width "12px" :height "12px"
                          :background "#22c55e" :border-radius "50%" :margin-right "4px"}}] "Committed"]
   [:span [:span {:style {:display "inline-block" :width "12px" :height "12px"
                          :background "#ef4444" :border-radius "50%" :margin-right "4px"}}] "Failed/Byzantine"]])

(defn app []
  [:div {:style {:font-size "small" :line-height 1.6}}
   [:header
    [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
     [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#787878"}}]
     [:h1 {:style {:font-size "1.4em" :margin 0}} "Consensus Mechanisms"]]
    [:p {:style {:color "#666" :margin "4px 0"}} "How distributed systems agree on truth"]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
    "At Stratum 5 (Distributed), data must achieve consensus to persist."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
    "Byzantine Fault Tolerance: reaching agreement even when some nodes lie or fail. Requires 2/3 + 1 honest nodes."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #7d8a70" :color "#7d8a70" :font-style "italic" :margin "12px 0"}}
    "Red-ringed nodes are byzantine—they may vote maliciously. Can the network still reach consensus?"]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:display "grid" :grid-template-columns "1fr 1fr" :gap "16px"}}
    [:div
     [network-viz]
     [legend]]
    [:div
     [:div {:style {:font-size "0.9em" :margin-bottom "8px"}}
      "Round: " [:strong (:round @state)]
      " | Threshold: " [:strong (:threshold @state) "/9"]
      " | Byzantine: " [:strong (count (filter :byzantine? (:nodes @state)))]]
     [controls]
     [log-panel]]]

   [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
    [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]]])

(rdom/render [app] (js/document.getElementById "app"))
</script>
