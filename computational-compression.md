---
layout: text
title: "Compression Ratios"
permalink: /computational/compression/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns compression.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

;; Compression: trading computation for storage
;; Lossless: perfect reconstruction
;; Lossy: acceptable degradation
;; The art of deciding what to keep

(defn rle-encode [s]
  "Run-length encoding: compress repeated characters"
  (if (empty? s)
    ""
    (let [runs (partition-by identity s)]
      (apply str (map (fn [run]
                        (if (> (count run) 2)
                          (str (count run) (first run))
                          (apply str run)))
                      runs)))))

(defn rle-decode [s]
  "Decode run-length encoded string"
  (let [pattern #"(\d+)(.)|(.)"
        matches (re-seq pattern s)]
    (apply str (map (fn [[_ n c single]]
                      (if n
                        (apply str (repeat (js/parseInt n) c))
                        single))
                    matches))))

(defn dictionary-compress [s]
  "Simple dictionary compression using common words"
  (let [dict {"the" "①" "and" "②" "ing" "③" "tion" "④" "is" "⑤"
              "to" "⑥" "of" "⑦" "that" "⑧" "for" "⑨" "it" "⑩"}]
    (reduce (fn [text [word sym]]
              (.replace text (js/RegExp. word "gi") sym))
            s dict)))

(defn lossy-compress [s level]
  "Lossy compression: remove information based on level (1-5)"
  (case level
    1 (.replace s #"[aeiou]" "")                    ; remove vowels
    2 (.replace s #"\s+" " ")                       ; collapse whitespace
    3 (.replace s #"[^a-zA-Z0-9\s]" "")            ; remove punctuation
    4 (apply str (take-nth 2 s))                    ; every other char
    5 (apply str (take (quot (count s) 3) s))      ; first third only
    s))

(defn compression-ratio [original compressed]
  (if (zero? (count original))
    0
    (* 100 (- 1 (/ (count compressed) (count original))))))

(defonce state
  (r/atom {:input "AAAAAABBBCCCCCCDDDDDDDDDD the quick brown fox and the lazy dog"
           :method :rle
           :lossy-level 1}))

;; Components

(defn method-selector []
  [:div {:style {:display "flex" :gap "6px" :margin "12px 0" :flex-wrap "wrap"}}
   (for [[k label] [[:rle "Run-Length (RLE)"]
                    [:dictionary "Dictionary"]
                    [:lossy "Lossy"]]]
     ^{:key k}
     [:button {:on-click #(swap! state assoc :method k)
               :style {:padding "6px 12px"
                       :background (if (= (:method @state) k) "#333" "#e0e0e0")
                       :color (if (= (:method @state) k) "#fff" "#333")
                       :border "none" :cursor "pointer"}}
      label])])

(defn compression-viz [original compressed ratio]
  [:div {:style {:margin "12px 0"}}
   [:div {:style {:display "flex" :gap "8px" :align-items "flex-end" :margin-bottom "8px"}}
    [:div {:style {:flex 1}}
     [:div {:style {:font-size "0.8em" :color "#666"}} "Original"]
     [:div {:style {:height "30px" :background "#ef4444" :border-radius "2px"
                    :display "flex" :align-items "center" :justify-content "center"
                    :color "#fff" :font-size "0.8em"}}
      (str (count original) " chars")]]
    [:div {:style {:flex (max 0.1 (- 1 (/ ratio 100)))}}
     [:div {:style {:font-size "0.8em" :color "#666"}} "Compressed"]
     [:div {:style {:height "30px" :background "#22c55e" :border-radius "2px"
                    :display "flex" :align-items "center" :justify-content "center"
                    :color "#fff" :font-size "0.8em" :min-width "40px"}}
      (str (count compressed) " chars")]]]
   [:div {:style {:text-align "center" :font-size "1.2em" :font-weight 600
                  :color (cond (> ratio 50) "#22c55e" (> ratio 20) "#f59e0b" :else "#ef4444")}}
    (.toFixed ratio 1) "% reduction"]])

(defn lossy-controls []
  (when (= (:method @state) :lossy)
    [:div {:style {:margin "12px 0" :padding "12px" :background "#fef3c7" :border-left "3px solid #f59e0b"}}
     [:div {:style {:font-size "0.9em" :font-weight 600 :margin-bottom "8px"}}
      "Lossy Level: " (:lossy-level @state)]
     [:input {:type "range" :min 1 :max 5 :value (:lossy-level @state)
              :on-change #(swap! state assoc :lossy-level (js/parseInt (-> % .-target .-value)))
              :style {:width "100%"}}]
     [:div {:style {:display "flex" :justify-content "space-between" :font-size "0.75em" :color "#666"}}
      [:span "Remove vowels"]
      [:span "Collapse space"]
      [:span "No punctuation"]
      [:span "Every other"]
      [:span "First third"]]
     [:div {:style {:font-size "0.8em" :color "#92400e" :margin-top "8px"}}
      "⚠ Lossy compression cannot be reversed. Information is permanently lost."]]))

(defn generate-examples! [type]
  (swap! state assoc :input
         (case type
           :repeated "AAAAAAAAAAAABBBBBBBBBBBCCCCCCCCCDDDDDDDDD"
           :text "the quick brown fox jumps over the lazy dog and the cow jumped over the moon"
           :mixed "AAAA the BBB and CCC for DDD the EEE"
           :random (apply str (repeatedly 50 #(char (+ 65 (rand-int 26))))))))

(defn app []
  (let [input (:input @state)
        method (:method @state)
        compressed (case method
                     :rle (rle-encode input)
                     :dictionary (dictionary-compress input)
                     :lossy (lossy-compress input (:lossy-level @state))
                     input)
        ratio (compression-ratio input compressed)]
    [:div {:style {:font-size "small" :line-height 1.6}}
     [:header
      [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
       [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#22c55e"}}]
       [:h1 {:style {:font-size "1.4em" :margin 0}} "Compression Ratios"]]
      [:p {:style {:color "#666" :margin "4px 0"}} "Trading computation for storage"]]

     [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

     [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
      "Compression exploits patterns. The more predictable, the more compressible."]
     [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
      "Lossless preserves everything—you can perfectly reconstruct. Lossy trades fidelity for size."]
     [:div {:style {:padding-left "12px" :border-left "3px solid #7d8a70" :color "#7d8a70" :font-style "italic" :margin "12px 0"}}
      "The limit is entropy: truly random data cannot be compressed at all."]

     [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

     [method-selector]
     [lossy-controls]

     [:div {:style {:margin "12px 0"}}
      [:div {:style {:display "flex" :gap "6px" :margin-bottom "8px"}}
       [:button {:on-click #(generate-examples! :repeated)
                 :style {:padding "4px 8px" :font-size "0.8em" :background "#e0e0e0" :border "none" :cursor "pointer"}}
        "Repeated"]
       [:button {:on-click #(generate-examples! :text)
                 :style {:padding "4px 8px" :font-size "0.8em" :background "#e0e0e0" :border "none" :cursor "pointer"}}
        "Natural text"]
       [:button {:on-click #(generate-examples! :random)
                 :style {:padding "4px 8px" :font-size "0.8em" :background "#e0e0e0" :border "none" :cursor "pointer"}}
        "Random"]]
      [:textarea {:value input
                  :on-change #(swap! state assoc :input (-> % .-target .-value))
                  :rows 3
                  :style {:width "100%" :padding "8px" :font-family "monospace"
                          :border "1px solid #ccc"}}]]

     [compression-viz input compressed ratio]

     [:div {:style {:display "grid" :grid-template-columns "1fr 1fr" :gap "12px" :margin "12px 0"}}
      [:div {:style {:padding "12px" :background "#f8f8f8" :border "1px solid #ddd"}}
       [:div {:style {:font-size "0.8em" :color "#666" :margin-bottom "4px"}} "Original"]
       [:div {:style {:font-family "monospace" :font-size "0.85em" :word-break "break-all"}}
        input]]
      [:div {:style {:padding "12px" :background "#f0fdf4" :border "1px solid #22c55e"}}
       [:div {:style {:font-size "0.8em" :color "#666" :margin-bottom "4px"}} "Compressed"]
       [:div {:style {:font-family "monospace" :font-size "0.85em" :word-break "break-all"}}
        compressed]]]

     (when (and (= method :rle) (> ratio 0))
       [:div {:style {:padding "12px" :background "#eff6ff" :border "1px solid #60a5fa" :margin "12px 0"}}
        [:div {:style {:font-size "0.8em" :color "#666" :margin-bottom "4px"}} "Decoded (verification)"]
        [:div {:style {:font-family "monospace" :font-size "0.85em"}}
         (rle-decode compressed)]])

     [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
      [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]]))

(rdom/render [app] (js/document.getElementById "app"))
</script>
