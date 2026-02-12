---
layout: text
title: "Archive Anxiety"
permalink: /computational/archive/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns archive.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

(def items-pool
  ["Old email" "Screenshot" "Downloaded PDF" "Note to self" "Project backup"
   "Config file" "Draft document" "Photo duplicate" "Log file" "Cached data"])

(defonce state
  (r/atom {:items []
           :deleted 0
           :kept 0
           :hesitated 0}))

(defn random-item []
  {:id (str (random-uuid))
   :content (rand-nth items-pool)
   :size (+ 100 (rand-int 10000))
   :days-old (+ 30 (rand-int 700))})

(defn spawn! []
  (dotimes [_ (+ 3 (rand-int 4))]
    (swap! state update :items conj (random-item))))

(defn delete! [id]
  (swap! state update :items #(vec (remove (fn [i] (= (:id i) id)) %)))
  (swap! state update :deleted inc))

(defn keep! [id]
  (swap! state update :kept inc))

(defn hesitate! []
  (swap! state update :hesitated inc))

(defn fmt-size [b]
  (cond
    (< b 1024) (str b " B")
    (< b 1048576) (str (.toFixed (/ b 1024) 1) " KB")
    :else (str (.toFixed (/ b 1048576) 1) " MB")))

(defn item-card [item]
  (let [old? (> (:days-old item) 365)]
    [:div {:style {:background (if old? "#fff5f5" "#f8f8f8")
                   :border-left (str "3px solid " (if old? "#ef4444" "#ddd"))
                   :padding "10px" :margin "6px 0"}}
     [:div {:style {:display "flex" :justify-content "space-between"}}
      [:span {:style {:font-weight 500}} (:content item)]
      [:span {:style {:color "#888" :font-size "0.85em"}} (fmt-size (:size item))]]
     [:div {:style {:font-size "0.8em" :color "#888" :margin "4px 0"}}
      (str "Last accessed: " (:days-old item) " days ago")]
     [:div {:style {:display "flex" :gap "6px" :margin-top "6px"}}
      [:button {:on-click #(delete! (:id item))
                :style {:padding "4px 10px" :font-size "0.8em" :background "#ef4444"
                        :color "#fff" :border "none" :cursor "pointer"}} "Delete"]
      [:button {:on-click #(keep! (:id item))
                :style {:padding "4px 10px" :font-size "0.8em" :background "#22c55e"
                        :border "none" :cursor "pointer"}} "Keep"]
      [:button {:on-click hesitate!
                :style {:padding "4px 10px" :font-size "0.8em" :background "#f59e0b"
                        :border "none" :cursor "pointer"}} "Later..."]]]))

(defn stats []
  [:div {:style {:display "grid" :grid-template-columns "repeat(4, 1fr)" :gap "8px" :margin "12px 0"}}
   [:div {:style {:text-align "center" :padding "10px" :background "#f8f8f8"}}
    [:div {:style {:font-size "1.4em" :font-weight 600}} (count (:items @state))]
    [:div {:style {:font-size "0.75em" :color "#888"}} "Pending"]]
   [:div {:style {:text-align "center" :padding "10px" :background "#fee2e2"}}
    [:div {:style {:font-size "1.4em" :font-weight 600}} (:deleted @state)]
    [:div {:style {:font-size "0.75em" :color "#888"}} "Deleted"]]
   [:div {:style {:text-align "center" :padding "10px" :background "#fef3c7"}}
    [:div {:style {:font-size "1.4em" :font-weight 600}} (:hesitated @state)]
    [:div {:style {:font-size "0.75em" :color "#888"}} "Hesitations"]]
   [:div {:style {:text-align "center" :padding "10px" :background "#dcfce7"}}
    [:div {:style {:font-size "1.4em" :font-weight 600}} (:kept @state)]
    [:div {:style {:font-size "0.75em" :color "#888"}} "Kept"]]])

(defn app []
  [:div {:style {:font-size "small" :line-height 1.6}}
   [:header
    [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
     [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#f59e0b"}}]
     [:h1 {:style {:font-size "1.4em" :margin 0}} "Archive Anxiety"]]
    [:p {:style {:color "#666" :margin "4px 0"}} "The pathology of keeping everything"]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
    "Archives without curation become landfills."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
    "The fear of losing something valuable leads us to keep everything. But when we keep everything, nothing is findable."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #7d8a70" :color "#7d8a70" :font-style "italic" :margin "12px 0"}}
    "What if deletion was a ritual of care?"]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:h2 {:style {:font-size "1.1em" :margin "0 0 8px 0"}} "Practice Letting Go"]
   [:button {:on-click spawn!
             :style {:padding "8px 16px" :background "#888" :border "none" :cursor "pointer" :margin-bottom "12px"}}
    "Generate Items"]

   [stats]

   [:div {:style {:max-height "300px" :overflow-y "auto"}}
    (if (seq (:items @state))
      (for [item (:items @state)]
        ^{:key (:id item)}
        [item-card item])
      [:p {:style {:color "#888" :font-style "italic" :text-align "center" :padding "20px"}}
       "No items. Click 'Generate Items' above."])]

   [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
    [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]])

(rdom/render [app] (js/document.getElementById "app"))
</script>
