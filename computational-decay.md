---
layout: text
title: "Decay Patterns"
permalink: /computational/decay/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns decay.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

(defn now [] (js/Date.now))

(def patterns
  [{:id :linear :name "Linear" :fn (fn [t mx] (- 1 (/ t mx)))}
   {:id :exponential :name "Exponential" :fn (fn [t mx] (js/Math.exp (- (/ (* t 3) mx))))}
   {:id :sigmoid :name "Sigmoid" :fn (fn [t mx] (/ 1 (+ 1 (js/Math.exp (- (* 10 (- (/ t mx) 0.5)))))))}
   {:id :stepped :name "Stepped" :fn (fn [t mx] (let [s 5] (/ (- s (js/Math.floor (* s (/ t mx)))) s)))}])

(defonce state
  (r/atom {:particles []
           :pattern :linear
           :decay-ms 5000
           :paused false}))

(defn spawn! []
  (let [p (first (filter #(= (:id %) (:pattern @state)) patterns))]
    (swap! state update :particles conj
           {:id (str (random-uuid))
            :born (now)
            :decay-fn (:fn p)
            :max-life (:decay-ms @state)
            :x (+ 20 (* 260 (js/Math.random)))})))

(defn update-particles! []
  (let [n (now)]
    (swap! state update :particles
           (fn [ps]
             (->> ps
                  (map (fn [p]
                         (let [age (- n (:born p))
                               life ((:decay-fn p) age (:max-life p))]
                           (assoc p :life life :age age))))
                  (filter #(> (:life %) 0.01))
                  vec)))))

(defonce ticker
  (js/setInterval
   (fn []
     (when-not (:paused @state)
       (update-particles!)
       (when (and (< (count (:particles @state)) 30) (< (js/Math.random) 0.3))
         (spawn!))))
   100))

(defn particle-viz []
  [:div {:style {:position "relative" :height "180px" :background "#1a1a1a"
                 :border "1px solid #333" :overflow "hidden"}}
   (for [p (:particles @state)]
     ^{:key (:id p)}
     [:div {:style {:position "absolute"
                    :left (str (:x p) "px")
                    :top (str (+ 10 (* (- 1 (:life p)) 150)) "px")
                    :width "6px" :height "6px" :border-radius "50%"
                    :background (str "rgba(34, 197, 94, " (:life p) ")")}}])
   [:div {:style {:position "absolute" :bottom "4px" :left "8px" :color "#666" :font-size "0.7em"}}
    (str (count (:particles @state)) " particles")]])

(defn controls []
  [:div {:style {:display "flex" :flex-wrap "wrap" :gap "12px" :margin "12px 0" :align-items "center"}}
   [:div
    [:label {:style {:display "block" :font-size "0.75em" :color "#666"}} "Pattern"]
    [:select {:value (name (:pattern @state))
              :on-change #(swap! state assoc :pattern (keyword (-> % .-target .-value)))
              :style {:padding "6px"}}
     (for [p patterns]
       ^{:key (:id p)}
       [:option {:value (name (:id p))} (:name p)])]]
   [:div
    [:label {:style {:display "block" :font-size "0.75em" :color "#666"}} "Decay time"]
    [:input {:type "range" :min 1000 :max 10000 :step 500
             :value (:decay-ms @state)
             :on-change #(swap! state assoc :decay-ms (js/parseInt (-> % .-target .-value)))}]
    [:span {:style {:font-size "0.8em" :color "#888" :margin-left "6px"}}
     (str (/ (:decay-ms @state) 1000) "s")]]
   [:button {:on-click #(swap! state update :paused not)
             :style {:padding "6px 12px" :background (if (:paused @state) "#22c55e" "#ef4444")
                     :border "none" :cursor "pointer"}}
    (if (:paused @state) "Resume" "Pause")]])

(defn app []
  [:div {:style {:font-size "small" :line-height 1.6}}
   [:header
    [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
     [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#ef4444"}}]
     [:h1 {:style {:font-size "1.4em" :margin 0}} "Decay Patterns"]]
    [:p {:style {:color "#666" :margin "4px 0"}} "The art of graceful forgetting"]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
    "Decay is not destruction. It is transformation."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
    "Controlled decay—intentional forgetting—creates space for renewal."]

   [:section {:style {:margin "16px 0"}}
    [:h3 {:style {:font-size "1em"}} "Four Patterns"]
    [:div {:style {:display "grid" :grid-template-columns "1fr 1fr" :gap "8px"}}
     [:div {:style {:padding "8px" :border-left "3px solid #f0f0f0"}}
      [:strong "Linear"] [:br] [:span {:style {:font-size "0.85em" :color "#666"}} "Constant rate. A candle."]]
     [:div {:style {:padding "8px" :border-left "3px solid #c8c8c8"}}
      [:strong "Exponential"] [:br] [:span {:style {:font-size "0.85em" :color "#666"}} "Half-life. Memory."]]
     [:div {:style {:padding "8px" :border-left "3px solid #787878"}}
      [:strong "Sigmoid"] [:br] [:span {:style {:font-size "0.85em" :color "#666"}} "Sudden collapse. Phase transition."]]
     [:div {:style {:padding "8px" :border-left "3px solid #1a1a1a"}}
      [:strong "Stepped"] [:br] [:span {:style {:font-size "0.85em" :color "#666"}} "Discrete levels. Tiers."]]]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:h2 {:style {:font-size "1.1em" :margin "0 0 8px 0"}} "Visualization"]
   [controls]
   [particle-viz]

   [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
    [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]])

(rdom/render [app] (js/document.getElementById "app"))
</script>
