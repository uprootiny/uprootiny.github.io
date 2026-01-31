---
layout: text
title: "Provenance Chains"
permalink: /computational/provenance/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns provenance.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

;; Provenance: the chain of custody for information
;; Each transformation leaves a trace
;; At archival stratum, provenance becomes proof

(defn now [] (js/Date.now))

(defn hash-str [s]
  (let [h (reduce (fn [a c] (bit-and (+ (bit-shift-left a 5) a (.charCodeAt c 0)) 0x7FFFFFFF))
                  5381 s)]
    (.toString h 16)))

(defn make-block [content parent-hash actor action]
  (let [timestamp (now)
        data (str content "|" parent-hash "|" timestamp "|" actor "|" action)
        block-hash (hash-str data)]
    {:hash block-hash
     :parent parent-hash
     :content content
     :actor actor
     :action action
     :timestamp timestamp}))

(def genesis-block
  {:hash "0000000000"
   :parent nil
   :content "Genesis"
   :actor "System"
   :action "create"
   :timestamp 0})

(defonce state
  (r/atom {:chain [genesis-block]
           :pending-content ""
           :pending-actor ""
           :pending-action "modify"}))

(defn add-block! []
  (let [content (:pending-content @state)
        actor (:pending-actor @state)
        action (:pending-action @state)
        parent-hash (:hash (last (:chain @state)))]
    (when (and (seq content) (seq actor))
      (let [block (make-block content parent-hash actor action)]
        (swap! state update :chain conj block)
        (swap! state assoc :pending-content "")))))

(defn verify-chain []
  (let [chain (:chain @state)]
    (every? (fn [[prev curr]]
              (= (:parent curr) (:hash prev)))
            (partition 2 1 chain))))

(defn corrupt-block! [idx]
  (when (> idx 0)  ; can't corrupt genesis
    (swap! state update-in [:chain idx :content] #(str % " [TAMPERED]"))))

;; Components

(defn block-card [block idx total]
  (let [is-genesis? (= idx 0)
        is-valid? (or is-genesis?
                      (= (:parent block) (:hash (nth (:chain @state) (dec idx)))))]
    [:div {:style {:background (if is-valid? "#f8f8f8" "#fee2e2")
                   :border (str "1px solid " (if is-valid? "#ddd" "#ef4444"))
                   :border-left (str "4px solid " (case (:action block)
                                                    "create" "#22c55e"
                                                    "modify" "#60a5fa"
                                                    "transfer" "#f59e0b"
                                                    "archive" "#484848"
                                                    "#888"))
                   :padding "10px" :margin "8px 0"}}
     [:div {:style {:display "flex" :justify-content "space-between" :align-items "center"}}
      [:span {:style {:font-weight 600}} (str "Block #" idx)]
      [:span {:style {:font-size "0.75em" :padding "2px 6px" :border-radius "3px"
                      :background (case (:action block)
                                    "create" "#dcfce7"
                                    "modify" "#dbeafe"
                                    "transfer" "#fef3c7"
                                    "archive" "#e5e5e5"
                                    "#f3f4f6")}}
       (:action block)]]
     [:div {:style {:font-size "0.85em" :margin "6px 0"}}
      [:div [:strong "Content: "] (:content block)]
      [:div [:strong "Actor: "] (:actor block)]
      [:div {:style {:font-family "monospace" :font-size "0.8em" :color "#666"}}
       "Hash: " (subs (:hash block) 0 12) "..."]
      (when (:parent block)
        [:div {:style {:font-family "monospace" :font-size "0.8em" :color "#888"}}
         "Parent: " (subs (:parent block) 0 12) "..."])]
     (when (and (not is-genesis?) is-valid?)
       [:button {:on-click #(corrupt-block! idx)
                 :style {:font-size "0.7em" :padding "2px 6px" :background "#fee2e2"
                         :border "1px solid #ef4444" :cursor "pointer" :margin-top "4px"}}
        "Tamper"])
     (when (not is-valid?)
       [:div {:style {:color "#ef4444" :font-size "0.8em" :margin-top "4px"}}
        "⚠ INVALID: Hash chain broken"])]))

(defn chain-viz []
  (let [chain (:chain @state)]
    [:div {:style {:display "flex" :align-items "center" :gap "4px" :margin "12px 0"
                   :padding "8px" :background "#f8f8f8" :overflow-x "auto"}}
     (for [[idx block] (map-indexed vector chain)]
       ^{:key idx}
       [:div {:style {:display "flex" :align-items "center"}}
        [:div {:style {:width "40px" :height "40px" :border-radius "4px"
                       :background (case (:action block)
                                     "create" "#22c55e"
                                     "modify" "#60a5fa"
                                     "transfer" "#f59e0b"
                                     "archive" "#484848"
                                     "#888")
                       :display "flex" :align-items "center" :justify-content "center"
                       :color "#fff" :font-weight 600 :font-size "0.8em"}}
         idx]
        (when (< idx (dec (count chain)))
          [:div {:style {:width "20px" :height "2px" :background "#888"}}])])]))

(defn add-form []
  [:div {:style {:background "#f8f8f8" :padding "12px" :margin "12px 0"}}
   [:div {:style {:font-weight 600 :margin-bottom "8px"}} "Add to Chain"]
   [:div {:style {:display "grid" :grid-template-columns "1fr 1fr" :gap "8px"}}
    [:input {:value (:pending-content @state)
             :on-change #(swap! state assoc :pending-content (-> % .-target .-value))
             :placeholder "Content..."
             :style {:padding "6px" :border "1px solid #ccc"}}]
    [:input {:value (:pending-actor @state)
             :on-change #(swap! state assoc :pending-actor (-> % .-target .-value))
             :placeholder "Actor name..."
             :style {:padding "6px" :border "1px solid #ccc"}}]]
   [:div {:style {:display "flex" :gap "8px" :margin-top "8px"}}
    [:select {:value (:pending-action @state)
              :on-change #(swap! state assoc :pending-action (-> % .-target .-value))
              :style {:padding "6px" :border "1px solid #ccc"}}
     [:option {:value "create"} "Create"]
     [:option {:value "modify"} "Modify"]
     [:option {:value "transfer"} "Transfer"]
     [:option {:value "archive"} "Archive"]]
    [:button {:on-click add-block!
              :style {:padding "6px 16px" :background "#22c55e" :border "none" :cursor "pointer"}}
     "Add Block"]]])

(defn app []
  (let [chain (:chain @state)
        valid? (verify-chain)]
    [:div {:style {:font-size "small" :line-height 1.6}}
     [:header
      [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
       [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#484848"}}]
       [:h1 {:style {:font-size "1.4em" :margin 0}} "Provenance Chains"]]
      [:p {:style {:color "#666" :margin "4px 0"}} "Chain of custody for information"]]

     [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

     [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
      "Every transformation leaves a trace. Each block links to its parent by hash."]
     [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
      "If any block is tampered with, its hash changes, breaking the chain. The corruption is immediately visible."]
     [:div {:style {:padding-left "12px" :border-left "3px solid #7d8a70" :color "#7d8a70" :font-style "italic" :margin "12px 0"}}
      "At archival stratum, provenance becomes proof. The chain is the history."]

     [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

     [:div {:style {:display "flex" :justify-content "space-between" :align-items "center"}}
      [:span "Chain length: " [:strong (count chain)]]
      [:span {:style {:padding "4px 8px" :border-radius "4px"
                      :background (if valid? "#dcfce7" "#fee2e2")
                      :color (if valid? "#166534" "#991b1b")}}
       (if valid? "✓ Valid" "✗ Corrupted")]]

     [chain-viz]
     [add-form]

     [:div {:style {:max-height "400px" :overflow-y "auto"}}
      (for [[idx block] (reverse (map-indexed vector chain))]
        ^{:key idx}
        [block-card block idx (count chain)])]

     [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
      [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]]))

(rdom/render [app] (js/document.getElementById "app"))
</script>
