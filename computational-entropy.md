---
layout: text
title: "Entropy Gradient"
permalink: /computational/entropy/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns entropy.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

;; Entropy: the measure of disorder, uncertainty, information content.
;; High entropy = unpredictable, random, compressed
;; Low entropy = ordered, predictable, redundant

(defn now [] (js/Date.now))

(defn shannon-entropy [s]
  "Calculate Shannon entropy of a string (bits per character)"
  (if (empty? s)
    0
    (let [freq (frequencies s)
          len (count s)
          probs (map #(/ % len) (vals freq))]
      (- (reduce + (map #(* % (/ (js/Math.log %) (js/Math.log 2))) probs))))))

(defn char-distribution [s]
  "Get character frequency distribution"
  (let [freq (frequencies s)
        total (count s)]
    (->> freq
         (map (fn [[c n]] {:char (if (= c \space) "␣" (str c)) :count n :pct (/ n total)}))
         (sort-by :count >)
         (take 12))))

(defonce state
  (r/atom {:input "The quick brown fox jumps over the lazy dog"
           :history []
           :mode :text}))

(defn add-history! [s ent]
  (swap! state update :history
         #(take 20 (cons {:text (subs s 0 (min 30 (count s)))
                          :entropy ent
                          :len (count s)
                          :at (now)} %))))

(defn generate-random! [len]
  (let [chars "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        s (apply str (repeatedly len #(nth chars (rand-int (count chars)))))]
    (swap! state assoc :input s)))

(defn generate-pattern! [len]
  (let [s (apply str (take len (cycle "ABCD")))]
    (swap! state assoc :input s)))

(defn generate-mono! [len]
  (swap! state assoc :input (apply str (repeat len "A"))))

;; Components

(defn entropy-meter [ent max-ent]
  (let [pct (min 100 (* 100 (/ ent max-ent)))]
    [:div {:style {:margin "12px 0"}}
     [:div {:style {:display "flex" :justify-content "space-between" :font-size "0.8em" :margin-bottom "4px"}}
      [:span "Order"]
      [:span "Chaos"]]
     [:div {:style {:height "24px" :background "linear-gradient(to right, #22c55e, #f59e0b, #ef4444)"
                    :border-radius "4px" :position "relative"}}
      [:div {:style {:position "absolute" :left (str pct "%") :top "-4px"
                     :width "4px" :height "32px" :background "#000"
                     :transform "translateX(-50%)"}}]
      [:div {:style {:position "absolute" :left (str pct "%") :top "28px"
                     :transform "translateX(-50%)" :font-size "0.85em" :font-weight 600}}
       (.toFixed ent 3) " bits"]]]))

(defn distribution-chart [dist]
  (let [max-pct (apply max (map :pct dist))]
    [:div {:style {:display "flex" :gap "2px" :align-items "flex-end" :height "80px" :margin "12px 0"}}
     (for [d dist]
       ^{:key (:char d)}
       [:div {:style {:flex 1 :display "flex" :flex-direction "column" :align-items "center"}}
        [:div {:style {:width "100%" :background "#22c55e"
                       :height (str (* 60 (/ (:pct d) max-pct)) "px")
                       :min-height "2px"}}]
        [:div {:style {:font-size "0.7em" :margin-top "2px" :font-family "monospace"}}
         (:char d)]])]))

(defn examples-panel []
  [:div {:style {:margin "16px 0"}}
   [:div {:style {:font-size "0.9em" :font-weight 600 :margin-bottom "8px"}} "Generate Examples"]
   [:div {:style {:display "flex" :gap "6px" :flex-wrap "wrap"}}
    [:button {:on-click #(generate-mono! 40)
              :style {:padding "6px 12px" :background "#22c55e" :border "none" :cursor "pointer"
                      :font-size "0.8em"}}
     "Monotone (0 bits)"]
    [:button {:on-click #(generate-pattern! 40)
              :style {:padding "6px 12px" :background "#f59e0b" :border "none" :cursor "pointer"
                      :font-size "0.8em"}}
     "Pattern (~2 bits)"]
    [:button {:on-click #(generate-random! 40)
              :style {:padding "6px 12px" :background "#ef4444" :border "none" :cursor "pointer"
                      :font-size "0.8em"}}
     "Random (~6 bits)"]
    [:button {:on-click #(swap! state assoc :input "The quick brown fox jumps over the lazy dog")
              :style {:padding "6px 12px" :background "#888" :border "none" :cursor "pointer"
                      :font-size "0.8em"}}
     "Pangram"]]])

(defn history-panel []
  (let [hist (:history @state)]
    (when (seq hist)
      [:div {:style {:margin "16px 0"}}
       [:div {:style {:font-size "0.9em" :font-weight 600 :margin-bottom "8px"}}
        "History " [:span {:style {:color "#888" :font-weight "normal"}} (str "(" (count hist) ")")]]
       [:div {:style {:max-height "150px" :overflow-y "auto" :font-size "0.8em"}}
        (for [[i h] (map-indexed vector hist)]
          ^{:key i}
          [:div {:style {:display "flex" :gap "8px" :padding "4px 0" :border-bottom "1px solid #eee"}}
           [:span {:style {:width "50px" :color (cond
                                                   (< (:entropy h) 2) "#22c55e"
                                                   (< (:entropy h) 4) "#f59e0b"
                                                   :else "#ef4444")
                           :font-weight 500}}
            (.toFixed (:entropy h) 2)]
           [:span {:style {:flex 1 :overflow "hidden" :text-overflow "ellipsis" :white-space "nowrap"
                           :font-family "monospace"}}
            (:text h)]
           [:span {:style {:color "#888"}} (str (:len h) "ch")]])]])))

(defn app []
  (let [input (:input @state)
        ent (shannon-entropy input)
        dist (char-distribution input)
        max-theoretical (js/Math.log2 (count (set input)))]
    [:div {:style {:font-size "small" :line-height 1.6}}
     [:header
      [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
       [:span {:style {:width "8px" :height "8px" :border-radius "50%"
                       :background "linear-gradient(135deg, #22c55e, #ef4444)"}}]
       [:h1 {:style {:font-size "1.4em" :margin 0}} "Entropy Gradient"]]
      [:p {:style {:color "#666" :margin "4px 0"}} "Measuring disorder in information"]]

     [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

     [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
      "Entropy measures surprise. High entropy = hard to predict."]
     [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
      "A string of all A's has zero entropy—you know what comes next. Random text approaches maximum entropy."]
     [:div {:style {:padding-left "12px" :border-left "3px solid #7d8a70" :color "#7d8a70" :font-style "italic" :margin "12px 0"}}
      "Compression exploits low entropy. You can't compress randomness."]

     [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

     [:div
      [:label {:style {:display "block" :font-size "0.85em" :color "#666" :margin-bottom "4px"}}
       "Input text:"]
      [:textarea {:value input
                  :on-change (fn [e]
                               (let [v (-> e .-target .-value)]
                                 (swap! state assoc :input v)
                                 (when (> (count v) 5)
                                   (add-history! v (shannon-entropy v)))))
                  :rows 3
                  :style {:width "100%" :padding "8px" :font-family "monospace"
                          :border "1px solid #ccc"}}]
      [:div {:style {:display "flex" :gap "16px" :margin-top "8px" :font-size "0.85em"}}
       [:span "Length: " [:strong (count input)]]
       [:span "Unique chars: " [:strong (count (set input))]]
       [:span "Max possible: " [:strong (.toFixed max-theoretical 2) " bits"]]]]

     [entropy-meter ent 6.5]

     [:div {:style {:margin "16px 0"}}
      [:div {:style {:font-size "0.9em" :font-weight 600 :margin-bottom "4px"}} "Character Distribution"]
      [distribution-chart dist]]

     [examples-panel]
     [history-panel]

     [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
      [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]]))

(rdom/render [app] (js/document.getElementById "app"))
</script>
