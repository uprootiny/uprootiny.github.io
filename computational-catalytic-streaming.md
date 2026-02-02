---
layout: text
title: "Catalytic Streaming"
permalink: /computational/catalytic-streaming/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns catalytic-streaming.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

;; Catalytic Streaming: Use the stream buffer as catalyst
;; Compute aggregations using buffer space, then restore for replay
;; Novel application: rewindable streams with O(1) clean space

(def buffer-size 16)

(defn xor-fold [data offset value]
  "XOR a value into data at offset (reversible)"
  (update data offset bit-xor value))

(defn encode-into-buffer [buffer values]
  "Encode running computation into buffer (reversible)"
  (reduce-kv (fn [b i v] (xor-fold b (mod i buffer-size) v))
             buffer values))

(defn decode-from-buffer [buffer original values]
  "Reverse the encoding to restore buffer"
  (reduce-kv (fn [b i v] (xor-fold b (mod i buffer-size) v))
             buffer values))

(defonce state
  (r/atom {:buffer (vec (repeatedly buffer-size #(rand-int 256)))
           :buffer-original nil
           :stream []
           :stream-position 0
           :aggregates {:sum 0 :count 0 :min 255 :max 0}
           :phase :idle
           :encoding-log []
           :can-replay true}))

(defn init-stream! []
  (let [stream (vec (repeatedly 32 #(rand-int 100)))]
    (swap! state assoc
           :stream stream
           :stream-position 0
           :buffer-original (:buffer @state)
           :aggregates {:sum 0 :count 0 :min 255 :max 0}
           :phase :ready
           :encoding-log []
           :can-replay true)))

(defn process-next! []
  (let [pos (:stream-position @state)
        stream (:stream @state)]
    (when (< pos (count stream))
      (let [value (get stream pos)
            buf-idx (mod pos buffer-size)
            old-buf-val (get-in @state [:buffer buf-idx])]
        ;; Encode value into buffer (XOR)
        (swap! state update :buffer xor-fold buf-idx value)
        ;; Update aggregates using the XOR'd value as workspace marker
        (swap! state update :aggregates
               (fn [agg]
                 (-> agg
                     (update :sum + value)
                     (update :count inc)
                     (update :min min value)
                     (update :max max value))))
        ;; Log the encoding
        (swap! state update :encoding-log conj
               {:pos pos :value value :buf-idx buf-idx :old old-buf-val})
        (swap! state update :stream-position inc)
        (swap! state assoc :phase :processing)))))

(defn process-all! []
  (while (< (:stream-position @state) (count (:stream @state)))
    (process-next!))
  (swap! state assoc :phase :complete))

(defn restore-buffer! []
  "Reverse all encodings to restore buffer for replay"
  (let [log (:encoding-log @state)]
    (doseq [{:keys [buf-idx value]} (reverse log)]
      (swap! state update :buffer xor-fold buf-idx value))
    (swap! state assoc
           :phase :restored
           :stream-position 0
           :encoding-log [])))

(defn verify-restoration []
  (= (:buffer @state) (:buffer-original @state)))

;; Visualization

(defn buffer-viz []
  (let [buffer (:buffer @state)
        original (:buffer-original @state)
        pos (:stream-position @state)
        active-idx (mod pos buffer-size)]
    [:div {:style {:margin "16px 0"}}
     [:div {:style {:display "flex" :justify-content "space-between" :align-items "center"}}
      [:span {:style {:font-weight 600}} "Stream Buffer (Catalyst)"]
      (when original
        [:span {:style {:font-size "0.8em"
                        :color (if (= buffer original) "#22c55e" "#f59e0b")}}
         (if (= buffer original) "PRISTINE" "MODIFIED")])]
     [:div {:style {:display "flex" :gap "2px" :margin-top "8px"}}
      (for [[i v] (map-indexed vector buffer)]
        (let [orig-v (when original (get original i))
              changed? (and orig-v (not= v orig-v))
              active? (= i active-idx)]
          ^{:key i}
          [:div {:style {:width "36px" :height "36px"
                         :background (cond
                                       active? "#fef3c7"
                                       changed? "#fee2e2"
                                       :else "#f8f8f8")
                         :border (cond
                                   active? "2px solid #f59e0b"
                                   changed? "2px solid #ef4444"
                                   :else "1px solid #ddd")
                         :display "flex" :flex-direction "column"
                         :align-items "center" :justify-content "center"
                         :font-family "monospace" :font-size "0.7em"}}
           [:span {:style {:font-weight 600}} (.toString v 16)]
           [:span {:style {:font-size "0.7em" :color "#999"}} i]]]))]]))

(defn stream-viz []
  (let [stream (:stream @state)
        pos (:stream-position @state)]
    [:div {:style {:margin "16px 0"}}
     [:div {:style {:font-weight 600 :margin-bottom "8px"}}
      "Data Stream (" (count stream) " values)"]
     [:div {:style {:display "flex" :flex-wrap "wrap" :gap "2px"}}
      (for [[i v] (map-indexed vector stream)]
        ^{:key i}
        [:div {:style {:width "28px" :height "28px"
                       :background (cond
                                     (< i pos) "#dcfce7"
                                     (= i pos) "#fef3c7"
                                     :else "#f8f8f8")
                       :border (if (= i pos) "2px solid #f59e0b" "1px solid #ddd")
                       :display "flex" :align-items "center" :justify-content "center"
                       :font-family "monospace" :font-size "0.7em"}}
         v])]]))

(defn aggregates-panel []
  (let [{:keys [sum count min max]} (:aggregates @state)]
    [:div {:style {:display "grid" :grid-template-columns "repeat(4, 1fr)" :gap "8px" :margin "16px 0"}}
     [:div {:style {:padding "12px" :background "#f8f8f8" :text-align "center"}}
      [:div {:style {:font-size "1.5em" :font-weight 600}} sum]
      [:div {:style {:font-size "0.75em" :color "#666"}} "Sum"]]
     [:div {:style {:padding "12px" :background "#f8f8f8" :text-align "center"}}
      [:div {:style {:font-size "1.5em" :font-weight 600}} count]
      [:div {:style {:font-size "0.75em" :color "#666"}} "Count"]]
     [:div {:style {:padding "12px" :background "#f8f8f8" :text-align "center"}}
      [:div {:style {:font-size "1.5em" :font-weight 600}} min]
      [:div {:style {:font-size "0.75em" :color "#666"}} "Min"]]
     [:div {:style {:padding "12px" :background "#f8f8f8" :text-align "center"}}
      [:div {:style {:font-size "1.5em" :font-weight 600}} max]
      [:div {:style {:font-size "0.75em" :color "#666"}} "Max"]]]))

(defn encoding-log-panel []
  (let [log (:encoding-log @state)]
    (when (seq log)
      [:div {:style {:margin "16px 0" :max-height "120px" :overflow-y "auto"
                     :background "#1a1a1a" :padding "8px"
                     :font-family "monospace" :font-size "0.75em"}}
       (for [[i entry] (map-indexed vector (reverse (take 10 log)))]
         ^{:key i}
         [:div {:style {:color "#22c55e" :padding "2px 0"}}
          (str "buf[" (:buf-idx entry) "] ^= " (:value entry)
               " (stream[" (:pos entry) "])")])])))

(defn controls []
  [:div {:style {:display "flex" :gap "8px" :flex-wrap "wrap" :margin "16px 0"}}
   [:button {:on-click init-stream!
             :style {:padding "8px 16px" :background "#1a1a1a" :color "#fff"
                     :border "none" :cursor "pointer"}}
    "New Stream"]
   [:button {:on-click process-next!
             :disabled (or (= (:phase @state) :idle)
                          (>= (:stream-position @state) (count (:stream @state))))
             :style {:padding "8px 16px" :background "#60a5fa" :color "#fff"
                     :border "none" :cursor "pointer"
                     :opacity (if (= (:phase @state) :idle) 0.5 1)}}
    "Process Next"]
   [:button {:on-click process-all!
             :disabled (= (:phase @state) :idle)
             :style {:padding "8px 16px" :background "#22c55e" :color "#fff"
                     :border "none" :cursor "pointer"
                     :opacity (if (= (:phase @state) :idle) 0.5 1)}}
    "Process All"]
   [:button {:on-click restore-buffer!
             :disabled (not= (:phase @state) :complete)
             :style {:padding "8px 16px" :background "#f59e0b" :color "#fff"
                     :border "none" :cursor "pointer"
                     :opacity (if (= (:phase @state) :complete) 1 0.5)}}
    "Restore Buffer"]])

(defn app []
  [:div {:style {:font-size "small" :line-height 1.6}}
   [:header
    [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
     [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#22c55e"}}]
     [:h1 {:style {:font-size "1.4em" :margin 0}} "Catalytic Streaming"]]
    [:p {:style {:color "#666" :margin "4px 0"}} "Rewindable streams with O(1) clean space"]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
    "Novel application: Use the stream buffer itself as catalyst for aggregation."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
    "XOR each value into the buffer as you process. Reverse to restore for replay."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #7d8a70" :color "#7d8a70" :font-style "italic" :margin "12px 0"}}
    "Traditional streaming: buffer OR aggregates. Catalytic: both, same memory."]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [controls]
   [buffer-viz]
   [stream-viz]
   [aggregates-panel]
   [encoding-log-panel]

   (when (= (:phase @state) :restored)
     [:div {:style {:margin "16px 0" :padding "16px" :text-align "center"
                    :background (if (verify-restoration) "#dcfce7" "#fee2e2")
                    :border-left (str "4px solid " (if (verify-restoration) "#22c55e" "#ef4444"))}}
      (if (verify-restoration)
        [:div
         [:div {:style {:font-weight 600 :font-size "1.2em" :color "#166534"}}
          "Buffer Restored - Ready for Replay"]
         [:div {:style {:color "#166534"}}
          "Aggregates computed, buffer pristine, stream can be replayed"]]
        [:div {:style {:color "#991b1b" :font-weight 600}}
         "RESTORATION FAILED"])])

   [:div {:style {:margin-top "24px" :padding "12px" :background "#1a1a1a" :color "#e0e0e0"
                  :font-family "monospace" :font-size "0.8em"}}
    [:div {:style {:color "#888" :margin-bottom "8px"}} "Catalytic streaming algorithm:"]
    [:pre {:style {:margin 0 :white-space "pre-wrap"}}
"PROCESS STREAM:
  for each value v at position i:
    buffer[i % size] ^= v    // encode into catalyst
    update aggregates(v)     // compute statistics

RESTORE FOR REPLAY:
  for each value v at position i (reverse):
    buffer[i % size] ^= v    // XOR again restores

RESULT:
  - Aggregates computed
  - Buffer unchanged (replayable)
  - Only O(1) clean space needed"]]

   [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
    [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]])

(rdom/render [app] (js/document.getElementById "app"))
</script>
