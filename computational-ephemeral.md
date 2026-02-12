---
layout: text
title: "Ephemeral Computing"
permalink: /computational/ephemeral/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns ephemeral.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

(defn now [] (js/Date.now))

(defonce state
  (r/atom {:mouse [0 0]
           :trail []
           :tick 0
           :comps []}))

(defn tick! []
  (swap! state update :tick inc)
  (swap! state update :comps
         #(take 8 (cons {:tick (:tick @state)
                         :rand (.toFixed (js/Math.random) 4)
                         :time (now)} %))))

(defonce ticker (js/setInterval tick! 200))

(defn capture-mouse! [e]
  (let [x (.-clientX e)
        y (.-clientY e)]
    (swap! state assoc :mouse [x y])
    (swap! state update :trail #(take 40 (cons {:x x :y y :t (now)} %)))))

(defn trail-viz []
  [:svg {:style {:position "fixed" :top 0 :left 0 :width "100%" :height "100%"
                 :pointer-events "none" :z-index 1000}}
   (for [[i p] (map-indexed vector (:trail @state))]
     ^{:key i}
     [:circle {:cx (:x p) :cy (:y p)
               :r (max 1 (- 6 (/ i 6)))
               :fill (str "rgba(34, 197, 94, " (- 1 (/ i 40)) ")")}])])

(defn stats []
  (let [[mx my] (:mouse @state)]
    [:div {:style {:font-family "monospace" :font-size "0.85em" :background "rgba(0,0,0,0.85)"
                   :color "#22c55e" :padding "12px" :margin "12px 0"}}
     [:div {:style {:display "grid" :grid-template-columns "1fr 1fr" :gap "6px"}}
      [:div "Mouse: " [:span {:style {:color "#fff"}} (str "[" mx ", " my "]")]]
      [:div "Tick: " [:span {:style {:color "#fff"}} (:tick @state)]]
      [:div "Trail: " [:span {:style {:color "#fff"}} (count (:trail @state))]]
      [:div "Time: " [:span {:style {:color "#fff"}} (.toLocaleTimeString (js/Date.))]]]
     [:div {:style {:margin-top "8px" :font-size "0.8em" :color "#888"}}
      "All of this disappears when you refresh."]]))

(defn comp-stream []
  [:div {:style {:font-family "monospace" :font-size "0.75em" :margin "12px 0"}}
   [:div {:style {:color "#666" :margin-bottom "6px"}} "Ephemeral computations:"]
   (for [[i c] (map-indexed vector (:comps @state))]
     ^{:key i}
     [:div {:style {:padding "4px" :border-left "2px solid #22c55e" :margin "3px 0"
                    :background "rgba(34,197,94,0.05)" :opacity (- 1 (* i 0.1))}}
      (str "tick:" (:tick c) " rand:" (:rand c))])])

(defn app []
  [:div {:style {:font-size "small" :line-height 1.6}
         :on-mouse-move capture-mouse!}
   [trail-viz]

   [:header
    [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
     [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#f0f0f0"
                     :border "2px solid #22c55e" :animation "pulse 1s infinite"}}]
     [:h1 {:style {:font-size "1.4em" :margin 0}} "Ephemeral Computing"]]
    [:p {:style {:color "#666" :margin "4px 0"}} "Computation that exists only in the moment"]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
    "Ephemerality is not a failure mode. It is the ground state."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
    "Your mouse position right now exists only in this moment. These computations are performed and forgotten."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #7d8a70" :color "#7d8a70" :font-style "italic" :margin "12px 0"}}
    "What if permanence required justification, not transience?"]

   [:section {:style {:margin "16px 0"}}
    [:h3 {:style {:font-size "1em"}} "Properties"]
    [:ul {:style {:list-style "none" :padding 0}}
     [:li {:style {:padding "6px 0 6px 12px" :border-left "2px solid #f0f0f0"}}
      [:strong "Zero Storage: "] "Nothing written, nothing to clean up"]
     [:li {:style {:padding "6px 0 6px 12px" :border-left "2px solid #f0f0f0"}}
      [:strong "Perfect Privacy: "] "What is never stored cannot be leaked"]
     [:li {:style {:padding "6px 0 6px 12px" :border-left "2px solid #f0f0f0"}}
      [:strong "Graceful Failure: "] "Crash and restart with no corruption"]]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:h2 {:style {:font-size "1.1em" :margin "0 0 8px 0"}} "Live Ephemeral State"]
   [stats]
   [comp-stream]

   [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
    [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]])

(rdom/render [app] (js/document.getElementById "app"))
</script>

<style>
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
</style>
