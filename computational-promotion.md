---
layout: text
title: "Promotion Rituals"
permalink: /computational/promotion/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns promotion.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

(def strata
  [{:id 1 :name "Ephemeral" :bg "#f0f0f0" :fg "#999"}
   {:id 2 :name "Volatile" :bg "#e0e0e0" :fg "#888"}
   {:id 3 :name "Session" :bg "#c8c8c8" :fg "#666"}
   {:id 4 :name "Local" :bg "#a0a0a0" :fg "#444"}
   {:id 5 :name "Distributed" :bg "#787878" :fg "#fff"}
   {:id 6 :name "Archival" :bg "#484848" :fg "#fff"}
   {:id 7 :name "Geological" :bg "#1a1a1a" :fg "#fff"}])

(defonce state
  (r/atom {:datum "Your idea here"
           :level 1
           :history []}))

(defn promote! []
  (when (< (:level @state) 7)
    (swap! state update :history conj {:action :promote :from (:level @state) :to (inc (:level @state))})
    (swap! state update :level inc)))

(defn demote! []
  (when (> (:level @state) 1)
    (swap! state update :history conj {:action :demote :from (:level @state) :to (dec (:level @state))})
    (swap! state update :level dec)))

(defn reset! []
  (swap! state assoc :level 1 :history []))

(defn ladder []
  [:div {:style {:display "flex" :flex-direction "column-reverse" :gap "2px"}}
   (for [s strata]
     (let [active? (= (:id s) (:level @state))
           passed? (< (:id s) (:level @state))]
       ^{:key (:id s)}
       [:div {:style {:display "flex" :align-items "center" :gap "8px" :padding "10px"
                      :background (if active? (:bg s) (if passed? "rgba(34,197,94,0.1)" "transparent"))
                      :border-left (str "4px solid " (:bg s))}}
        [:span {:style {:width "20px" :font-weight 600 :color (if active? (:fg s) "#aaa")}} (:id s)]
        [:span {:style {:flex 1 :color (if active? (:fg s) "#888")}} (:name s)]
        (when active?
          [:span {:style {:background "rgba(0,0,0,0.2)" :padding "2px 8px" :font-size "0.7em"
                          :border-radius "3px" :color (:fg s)}} "current"])]))])

(defn app []
  [:div {:style {:font-size "small" :line-height 1.6}}
   [:header
    [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
     [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#22c55e"}}]
     [:h1 {:style {:font-size "1.4em" :margin 0}} "Promotion Rituals"]]
    [:p {:style {:color "#666" :margin "4px 0"}} "The intentional act of increasing permanence"]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
    "Promotion requires intention. Each level demands more commitment."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
    "Moving from ephemeral to volatile is trivial. Moving to distributed requires consensus."]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:display "grid" :grid-template-columns "1fr 1fr" :gap "16px"}}
    [:div
     [:label {:style {:display "block" :font-size "0.8em" :color "#666" :margin-bottom "4px"}} "Your datum:"]
     [:input {:type "text" :value (:datum @state)
              :on-change #(swap! state assoc :datum (-> % .-target .-value))
              :style {:width "100%" :padding "8px" :font-family "monospace" :border "1px solid #ccc"}}]
     [:div {:style {:display "flex" :gap "6px" :margin-top "12px"}}
      [:button {:on-click demote! :disabled (= (:level @state) 1)
                :style {:padding "6px 12px" :background "#f59e0b" :border "none" :cursor "pointer"
                        :opacity (if (= (:level @state) 1) 0.5 1)}} "↓ Demote"]
      [:button {:on-click promote! :disabled (= (:level @state) 7)
                :style {:padding "6px 12px" :background "#22c55e" :border "none" :cursor "pointer"
                        :opacity (if (= (:level @state) 7) 0.5 1)}} "↑ Promote"]
      [:button {:on-click reset!
                :style {:padding "6px 12px" :background "#888" :border "none" :cursor "pointer"}} "Reset"]]
     (when (seq (:history @state))
       [:div {:style {:margin-top "12px" :font-size "0.8em" :max-height "100px" :overflow-y "auto"}}
        (for [[i h] (map-indexed vector (reverse (:history @state)))]
          ^{:key i}
          [:div {:style {:color (if (= (:action h) :promote) "#22c55e" "#f59e0b")}}
           (str (name (:action h)) " " (:from h) " → " (:to h))])])]
    [:div
     [ladder]]]

   [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
    [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]])

(rdom/render [app] (js/document.getElementById "app"))
</script>
