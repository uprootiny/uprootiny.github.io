---
layout: text
title: "Bloom Filters"
permalink: /computational/bloom/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns bloom.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

;; Bloom Filters: Probabilistic set membership
;; "Probably yes" or "Definitely no"
;; False positives possible, false negatives impossible

(defn hash-1 [s size]
  (mod (reduce (fn [h c] (bit-and (+ (bit-shift-left h 5) h (.charCodeAt c 0)) 0x7FFFFFFF))
               5381 (str s)) size))

(defn hash-2 [s size]
  (mod (reduce (fn [h c] (bit-and (+ (* h 33) (.charCodeAt c 0)) 0x7FFFFFFF))
               0 (str s)) size))

(defn hash-3 [s size]
  (mod (reduce (fn [h c] (bit-xor (bit-and (+ (bit-shift-left h 7) h) 0x7FFFFFFF) (.charCodeAt c 0)))
               17 (str s)) size))

(defn get-positions [item size]
  [(hash-1 item size)
   (hash-2 item size)
   (hash-3 item size)])

(defn add-to-filter [bits item size]
  (reduce #(assoc %1 %2 true) bits (get-positions item size)))

(defn maybe-contains? [bits item size]
  (every? #(get bits %) (get-positions item size)))

(def filter-size 32)

(defonce state
  (r/atom {:bits (vec (repeat filter-size false))
           :items #{}
           :new-item ""
           :query ""
           :query-result nil
           :false-positives 0
           :true-positives 0
           :true-negatives 0}))

(defn add-item! []
  (let [item (:new-item @state)]
    (when (and (seq item) (not (contains? (:items @state) item)))
      (swap! state update :bits add-to-filter item filter-size)
      (swap! state update :items conj item)
      (swap! state assoc :new-item ""))))

(defn query! []
  (let [q (:query @state)
        in-filter? (maybe-contains? (:bits @state) q filter-size)
        actually-in? (contains? (:items @state) q)]
    (swap! state assoc :query-result
           {:query q
            :filter-says in-filter?
            :actually-in actually-in?
            :verdict (cond
                       (and in-filter? actually-in?) :true-positive
                       (and in-filter? (not actually-in?)) :false-positive
                       (and (not in-filter?) (not actually-in?)) :true-negative
                       :else :false-negative)})  ; should never happen
    (case (get-in @state [:query-result :verdict])
      :true-positive (swap! state update :true-positives inc)
      :false-positive (swap! state update :false-positives inc)
      :true-negative (swap! state update :true-negatives inc)
      nil)))

(defn reset-filter! []
  (reset! state {:bits (vec (repeat filter-size false))
                 :items #{}
                 :new-item ""
                 :query ""
                 :query-result nil
                 :false-positives 0
                 :true-positives 0
                 :true-negatives 0}))

;; Visualization

(defn bit-array-viz []
  (let [bits (:bits @state)
        query-positions (when (seq (:query @state))
                          (set (get-positions (:query @state) filter-size)))]
    [:div {:style {:margin "16px 0"}}
     [:div {:style {:font-size "0.85em" :color "#666" :margin-bottom "8px"}}
      "Bit Array (" filter-size " bits, " (count (filter true? bits)) " set)"]
     [:div {:style {:display "flex" :flex-wrap "wrap" :gap "2px"}}
      (for [[i bit] (map-indexed vector bits)]
        ^{:key i}
        [:div {:style {:width "20px" :height "20px"
                       :background (cond
                                     (and bit (contains? query-positions i)) "#22c55e"
                                     (contains? query-positions i) "#fef3c7"
                                     bit "#1a1a1a"
                                     :else "#f0f0f0")
                       :border (if (contains? query-positions i)
                                 "2px solid #f59e0b"
                                 "1px solid #ddd")
                       :display "flex" :align-items "center" :justify-content "center"
                       :font-size "0.6em" :color (if bit "#fff" "#999")}}
         i])]]))

(defn hash-viz [item]
  (when (seq item)
    (let [positions (get-positions item filter-size)]
      [:div {:style {:font-family "monospace" :font-size "0.8em" :margin "8px 0"
                     :padding "8px" :background "#f8f8f8"}}
       [:div {:style {:color "#666"}} "Hash positions for \"" item "\":"]
       [:div {:style {:display "flex" :gap "8px" :margin-top "4px"}}
        (for [[i pos] (map-indexed vector positions)]
          ^{:key i}
          [:span {:style {:padding "2px 8px" :background "#60a5fa" :color "#fff"}}
           pos])]])))

(defn stats-panel []
  [:div {:style {:display "grid" :grid-template-columns "repeat(4, 1fr)" :gap "8px" :margin "16px 0"}}
   [:div {:style {:padding "12px" :background "#f8f8f8" :text-align "center"}}
    [:div {:style {:font-size "1.5em" :font-weight 600}} (count (:items @state))]
    [:div {:style {:font-size "0.75em" :color "#666"}} "Items Added"]]
   [:div {:style {:padding "12px" :background "#dcfce7" :text-align "center"}}
    [:div {:style {:font-size "1.5em" :font-weight 600 :color "#166534"}} (:true-positives @state)]
    [:div {:style {:font-size "0.75em" :color "#166534"}} "True Positives"]]
   [:div {:style {:padding "12px" :background "#fee2e2" :text-align "center"}}
    [:div {:style {:font-size "1.5em" :font-weight 600 :color "#991b1b"}} (:false-positives @state)]
    [:div {:style {:font-size "0.75em" :color "#991b1b"}} "False Positives"]]
   [:div {:style {:padding "12px" :background "#e0e7ff" :text-align "center"}}
    [:div {:style {:font-size "1.5em" :font-weight 600 :color "#3730a3"}} (:true-negatives @state)]
    [:div {:style {:font-size "0.75em" :color "#3730a3"}} "True Negatives"]]])

(defn result-panel []
  (when-let [r (:query-result @state)]
    [:div {:style {:margin "12px 0" :padding "12px"
                   :background (case (:verdict r)
                                 :true-positive "#dcfce7"
                                 :false-positive "#fee2e2"
                                 :true-negative "#e0e7ff"
                                 "#f8f8f8")
                   :border-left (str "3px solid "
                                     (case (:verdict r)
                                       :true-positive "#22c55e"
                                       :false-positive "#ef4444"
                                       :true-negative "#6366f1"
                                       "#888"))}}
     [:div {:style {:font-weight 600}}
      (case (:verdict r)
        :true-positive "TRUE POSITIVE: Filter says yes, item exists"
        :false-positive "FALSE POSITIVE: Filter says yes, but item was never added!"
        :true-negative "TRUE NEGATIVE: Filter says no, item doesn't exist"
        "Unknown")]
     [:div {:style {:font-size "0.85em" :margin-top "4px" :color "#666"}}
      "Query: \"" (:query r) "\" | Filter: " (if (:filter-says r) "maybe" "no")
      " | Actually in set: " (if (:actually-in r) "yes" "no")]]))

(defn app []
  [:div {:style {:font-size "small" :line-height 1.6}}
   [:header
    [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
     [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#6366f1"}}]
     [:h1 {:style {:font-size "1.4em" :margin 0}} "Bloom Filters"]]
    [:p {:style {:color "#666" :margin "4px 0"}} "Probabilistic set membership"]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
    "A Bloom filter answers: \"Probably yes\" or \"Definitely no.\""]
   [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
    "False positives are possible. False negatives are impossible."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #7d8a70" :color "#7d8a70" :font-style "italic" :margin "12px 0"}}
    "Space-efficient: store millions of items in kilobytes. The tradeoff is certainty."]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:display "grid" :grid-template-columns "1fr 1fr" :gap "16px"}}
    [:div
     [:div {:style {:font-weight 600 :margin-bottom "8px"}} "Add to Filter"]
     [:div {:style {:display "flex" :gap "8px"}}
      [:input {:value (:new-item @state)
               :on-change #(swap! state assoc :new-item (-> % .-target .-value))
               :on-key-down #(when (= (.-key %) "Enter") (add-item!))
               :placeholder "Item to add..."
               :style {:flex 1 :padding "8px" :border "1px solid #ccc"}}]
      [:button {:on-click add-item!
                :style {:padding "8px 16px" :background "#1a1a1a" :color "#fff"
                        :border "none" :cursor "pointer"}}
       "Add"]]
     [hash-viz (:new-item @state)]]
    [:div
     [:div {:style {:font-weight 600 :margin-bottom "8px"}} "Query Filter"]
     [:div {:style {:display "flex" :gap "8px"}}
      [:input {:value (:query @state)
               :on-change #(swap! state assoc :query (-> % .-target .-value))
               :on-key-down #(when (= (.-key %) "Enter") (query!))
               :placeholder "Item to query..."
               :style {:flex 1 :padding "8px" :border "1px solid #ccc"}}]
      [:button {:on-click query!
                :style {:padding "8px 16px" :background "#6366f1" :color "#fff"
                        :border "none" :cursor "pointer"}}
       "Query"]]
     [hash-viz (:query @state)]]]

   [result-panel]
   [bit-array-viz]
   [stats-panel]

   [:div {:style {:display "flex" :gap "8px" :flex-wrap "wrap" :margin "12px 0"}}
    [:div {:style {:font-size "0.85em" :color "#666"}} "Items in set:"]
    (for [item (:items @state)]
      ^{:key item}
      [:span {:style {:padding "2px 8px" :background "#f0f0f0" :font-family "monospace"
                      :font-size "0.85em"}}
       item])
    (when (seq (:items @state))
      [:button {:on-click reset-filter!
                :style {:padding "2px 8px" :background "#fee2e2" :border "1px solid #ef4444"
                        :cursor "pointer" :font-size "0.8em" :color "#991b1b"}}
       "Reset"])]

   [:div {:style {:margin-top "24px" :padding "12px" :background "#1a1a1a" :color "#e0e0e0"
                  :font-family "monospace" :font-size "0.8em"}}
    [:pre {:style {:margin 0 :white-space "pre-wrap"}}
"add(item):
  for each hash function h:
    bits[h(item) % size] = 1

query(item):
  for each hash function h:
    if bits[h(item) % size] == 0:
      return DEFINITELY_NOT
  return PROBABLY_YES"]]

   [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
    [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]])

(rdom/render [app] (js/document.getElementById "app"))
</script>
