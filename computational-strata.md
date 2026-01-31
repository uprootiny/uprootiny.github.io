---
layout: text
title: "Stratum Morphology"
permalink: /computational/strata/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns strata.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

(def strata
  [{:id 1 :name "Ephemeral" :dur "~ms" :storage "CPU registers, stack" :boundary "Function return" :bg "#f0f0f0" :fg "#999"}
   {:id 2 :name "Volatile" :dur "~min" :storage "Heap, React state" :boundary "Page refresh" :bg "#e0e0e0" :fg "#888"}
   {:id 3 :name "Session" :dur "~hrs" :storage "sessionStorage" :boundary "Tab close" :bg "#c8c8c8" :fg "#666"}
   {:id 4 :name "Local" :dur "~days" :storage "localStorage, IndexedDB" :boundary "Clear browser data" :bg "#a0a0a0" :fg "#444"}
   {:id 5 :name "Distributed" :dur "~months" :storage "CRDTs, P2P" :boundary "Network partition" :bg "#787878" :fg "#fff"}
   {:id 6 :name "Archival" :dur "~years" :storage "IPFS, databases" :boundary "Org death" :bg "#484848" :fg "#fff"}
   {:id 7 :name "Geological" :dur "~eons" :storage "DNA, stone, space" :boundary "Civilization collapse" :bg "#1a1a1a" :fg "#fff"}])

(defonce state (r/atom {:selected nil}))

(defn stratum-card [s]
  (let [sel? (= (:id s) (:selected @state))]
    [:div {:style {:background (:bg s) :color (:fg s) :padding "12px" :margin "3px 0" :cursor "pointer"
                   :border-left (if sel? "4px solid #22c55e" "4px solid transparent")}
           :on-click #(swap! state assoc :selected (:id s))}
     [:div {:style {:display "flex" :justify-content "space-between" :align-items "center"}}
      [:span {:style {:font-weight 600}} (str (:id s) ". " (:name s))]
      [:span {:style {:font-size "0.85em" :opacity 0.8}} (:dur s)]]]))

(defn detail [s]
  [:div {:style {:background (:bg s) :color (:fg s) :padding "16px"}}
   [:h3 {:style {:margin "0 0 12px 0"}} (str (:name s) " Stratum")]
   [:div {:style {:display "grid" :grid-template-columns "1fr 1fr" :gap "12px"}}
    [:div
     [:div {:style {:font-size "0.75em" :opacity 0.7}} "Duration"]
     [:div {:style {:font-weight 500}} (:dur s)]]
    [:div
     [:div {:style {:font-size "0.75em" :opacity 0.7}} "Storage"]
     [:div {:style {:font-weight 500}} (:storage s)]]
    [:div
     [:div {:style {:font-size "0.75em" :opacity 0.7}} "Boundary"]
     [:div {:style {:font-weight 500}} (:boundary s)]]]])

(defn table []
  [:div {:style {:overflow-x "auto" :margin "12px 0"}}
   [:table {:style {:width "100%" :border-collapse "collapse" :font-size "0.85em"}}
    [:thead
     [:tr {:style {:border-bottom "2px solid #ddd"}}
      [:th {:style {:text-align "left" :padding "6px"}} "#"]
      [:th {:style {:text-align "left" :padding "6px"}} "Stratum"]
      [:th {:style {:text-align "left" :padding "6px"}} "Duration"]
      [:th {:style {:text-align "left" :padding "6px"}} "Storage"]]]
    [:tbody
     (for [s strata]
       ^{:key (:id s)}
       [:tr {:style {:border-bottom "1px solid #eee"}}
        [:td {:style {:padding "6px"}}
         [:span {:style {:display "inline-block" :width "16px" :height "16px"
                         :background (:bg s) :border-radius "2px" :vertical-align "middle"
                         :margin-right "6px"}}]
         (:id s)]
        [:td {:style {:padding "6px" :font-weight 500}} (:name s)]
        [:td {:style {:padding "6px" :color "#666"}} (:dur s)]
        [:td {:style {:padding "6px" :font-size "0.9em"}} (:storage s)]])]]])

(defn app []
  (let [sel (when-let [id (:selected @state)]
              (first (filter #(= (:id %) id) strata)))]
    [:div {:style {:font-size "small" :line-height 1.6}}
     [:header
      [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
       [:div {:style {:width "8px" :height "8px" :border-radius "50%"
                      :background "linear-gradient(to bottom, #f0f0f0, #1a1a1a)"}}]
       [:h1 {:style {:font-size "1.4em" :margin 0}} "Stratum Morphology"]]
      [:p {:style {:color "#666" :margin "4px 0"}} "The shape and structure of permanence levels"]]

     [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

     [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
      "Seven strata is not arbitrary. It emerges from natural boundaries."]
     [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
      "Each stratum is defined by its duration, storage mechanism, and destruction event."]

     [table]

     [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

     [:h2 {:style {:font-size "1.1em" :margin "0 0 8px 0"}} "Interactive Explorer"]
     [:p {:style {:font-size "0.9em" :color "#666" :margin-bottom "12px"}} "Click a stratum to explore."]

     [:div {:style {:display "grid" :grid-template-columns "1fr 1fr" :gap "12px"}}
      [:div
       (for [s strata]
         ^{:key (:id s)}
         [stratum-card s])]
      [:div
       (if sel
         [detail sel]
         [:div {:style {:padding "24px" :background "#f8f8f8" :text-align "center" :color "#888"}}
          "Select a stratum"])]]

     [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
      [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]]))

(rdom/render [app] (js/document.getElementById "app"))
</script>
