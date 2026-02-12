---
layout: text
title: "Witness Functions"
permalink: /computational/witness/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns witness.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

(defn now [] (js/Date.now))

(defn djb2 [s]
  (let [h (reduce (fn [a c] (bit-and (+ (bit-shift-left a 5) a (.charCodeAt c 0)) 0x7FFFFFFF))
                  5381 s)]
    (str "baf" (.toString h 36))))

(defonce state (r/atom {:witnesses [] :input ""}))

(defn witness! [content]
  (let [hash (djb2 content)]
    (swap! state update :witnesses conj
           {:hash hash :content content :at (now) :size (count content)})
    (swap! state assoc :input "")))

(defn witness-card [w]
  [:div {:style {:border-left "3px solid #484848" :padding "12px" :margin "8px 0" :background "#f8f8f8"}}
   [:div {:style {:display "flex" :justify-content "space-between" :font-size "0.8em" :color "#666"}}
    [:code (:hash w)]
    [:span (str (:size w) " bytes")]]
   [:div {:style {:margin "8px 0" :font-family "monospace" :white-space "pre-wrap"}}
    (:content w)]])

(defn app []
  [:div {:style {:font-size "small" :line-height 1.6}}
   [:header
    [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
     [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#22c55e"}}]
     [:h1 {:style {:font-size "1.4em" :margin 0}} "Witness Functions"]]
    [:p {:style {:color "#666" :margin "4px 0"}} "Content-addressing and the act of observation"]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:section
    [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
     "To witness is to observe and record, creating a binding between content and identity."]
    [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
     "In content-addressed systems, the hash IS the address. Same content = same hash."]
    [:div {:style {:padding-left "12px" :border-left "3px solid #7d8a70" :color "#7d8a70" :font-style "italic" :margin "12px 0"}}
     "What does it mean to witness something? You're asserting its existence at a moment in time."]]

   [:section {:style {:margin "16px 0"}}
    [:h3 {:style {:font-size "1em" :margin "16px 0 8px 0"}} "Properties"]
    [:ul {:style {:list-style "none" :padding 0}}
     [:li {:style {:padding "6px 0 6px 12px" :border-left "2px solid #ddd"}}
      [:strong "Deterministic: "] "Same content always produces the same hash"]
     [:li {:style {:padding "6px 0 6px 12px" :border-left "2px solid #ddd"}}
      [:strong "Collision-resistant: "] "Different content produces different hashes"]
     [:li {:style {:padding "6px 0 6px 12px" :border-left "2px solid #ddd"}}
      [:strong "One-way: "] "Cannot derive content from hash"]]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:section
    [:h2 {:style {:font-size "1.1em" :margin "0 0 12px 0"}} "Try It"]
    [:div {:style {:margin-bottom "12px"}}
     [:textarea {:value (:input @state)
                 :placeholder "Enter content to witness..."
                 :on-change #(swap! state assoc :input (-> % .-target .-value))
                 :rows 3
                 :style {:width "100%" :padding "8px" :font-family "monospace"
                         :border "1px solid #ccc"}}]
     [:div {:style {:display "flex" :gap "8px" :margin-top "8px" :align-items "center"}}
      [:button {:on-click #(when (seq (:input @state)) (witness! (:input @state)))
                :style {:padding "8px 16px" :background "#22c55e" :border "none"
                        :font-weight 600 :cursor "pointer"}}
       "Witness"]
      [:span {:style {:font-family "monospace" :color "#888" :font-size "0.85em"}}
       (str (count (:input @state)) " bytes → " (djb2 (:input @state)))]]]

    (if (seq (:witnesses @state))
      [:div
       (for [w (reverse (:witnesses @state))]
         ^{:key (:hash w)}
         [witness-card w])]
      [:p {:style {:color "#888" :font-style "italic"}} "No witnesses yet."])]

   [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
    [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]])

(rdom/render [app] (js/document.getElementById "app"))
</script>
