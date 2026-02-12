---
layout: text
title: "Probabilistic Catalysis"
permalink: /computational/catalytic-probabilistic/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns catalytic-probabilistic.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

;; Probabilistic Catalysis: Trade perfect restoration for computational power
;; Novel extension: Accept small probability of catalyst corruption
;; Use error-correcting codes to restore with high probability

;; Hamming(7,4) code for error correction
(def generator-matrix
  [[1 0 0 0 1 1 0]
   [0 1 0 0 1 0 1]
   [0 0 1 0 0 1 1]
   [0 0 0 1 1 1 1]])

(def parity-check
  [[1 1 0 1 1 0 0]
   [1 0 1 1 0 1 0]
   [0 1 1 1 0 0 1]])

(defn bits-to-int [bits]
  (reduce (fn [acc b] (+ (* acc 2) b)) 0 bits))

(defn int-to-bits [n size]
  (vec (for [i (range (dec size) -1 -1)]
         (bit-and (bit-shift-right n i) 1))))

(defn dot-mod2 [v1 v2]
  (mod (reduce + (map * v1 v2)) 2))

(defn encode-hamming [data-bits]
  "Encode 4 data bits into 7 Hamming bits"
  (vec (for [col (range 7)]
         (mod (reduce + (map * data-bits (map #(get % col) generator-matrix))) 2))))

(defn syndrome [codeword]
  "Compute syndrome to detect/locate errors"
  (vec (for [row parity-check]
         (dot-mod2 row codeword))))

(defn correct-hamming [codeword]
  "Correct single-bit error using syndrome"
  (let [syn (syndrome codeword)
        error-pos (dec (bits-to-int syn))]
    (if (zero? (bits-to-int syn))
      {:corrected codeword :error-pos nil :had-error false}
      {:corrected (update codeword error-pos #(mod (inc %) 2))
       :error-pos error-pos
       :had-error true})))

(defn decode-hamming [codeword]
  "Extract 4 data bits from 7-bit codeword"
  (vec (take 4 codeword)))

(def catalyst-size 28)  ; 4 Hamming codewords

(defonce state
  (r/atom {:catalyst-original nil
           :catalyst-encoded nil
           :catalyst-corrupted nil
           :catalyst-corrected nil
           :error-rate 0.1
           :computation-result nil
           :errors-introduced 0
           :errors-corrected 0
           :restoration-success nil
           :phase :idle
           :trials []}))

(defn init-catalyst! []
  (let [;; Generate random 16-bit catalyst (4 nibbles)
        raw-bits (vec (repeatedly 16 #(rand-int 2)))
        ;; Encode each nibble with Hamming
        nibbles (partition 4 raw-bits)
        encoded (vec (mapcat encode-hamming nibbles))]
    (swap! state assoc
           :catalyst-original raw-bits
           :catalyst-encoded encoded
           :catalyst-corrupted nil
           :catalyst-corrected nil
           :computation-result nil
           :errors-introduced 0
           :errors-corrected 0
           :restoration-success nil
           :phase :ready)))

(defn corrupt-catalyst! []
  "Simulate computation that may corrupt some bits"
  (let [encoded (:catalyst-encoded @state)
        error-rate (:error-rate @state)
        corrupted (vec (map-indexed
                        (fn [i b]
                          (if (< (rand) error-rate)
                            (do (swap! state update :errors-introduced inc)
                                (mod (inc b) 2))
                            b))
                        encoded))]
    (swap! state assoc
           :catalyst-corrupted corrupted
           :computation-result (* 7 13)  ; Pretend we computed something
           :phase :corrupted)))

(defn correct-catalyst! []
  "Apply error correction to restore catalyst"
  (let [corrupted (:catalyst-corrupted @state)
        codewords (partition 7 corrupted)
        corrections (map correct-hamming codewords)
        corrected (vec (mapcat :corrected corrections))
        errors-found (count (filter :had-error corrections))]
    (swap! state update :errors-corrected + errors-found)
    (swap! state assoc
           :catalyst-corrected corrected
           :phase :corrected)))

(defn verify-restoration! []
  (let [original (:catalyst-encoded @state)
        corrected (:catalyst-corrected @state)]
    (swap! state assoc :restoration-success (= original corrected))
    (swap! state assoc :phase :verified)))

(defn run-trial! []
  (init-catalyst!)
  (corrupt-catalyst!)
  (correct-catalyst!)
  (verify-restoration!)
  (let [success? (:restoration-success @state)]
    (swap! state update :trials conj
           {:errors-introduced (:errors-introduced @state)
            :errors-corrected (:errors-corrected @state)
            :success success?})))

(defn run-many-trials! [n]
  (swap! state assoc :trials [])
  (dotimes [_ n]
    (run-trial!)))

;; Visualization

(defn bit-strip [label bits highlight-fn color-fn]
  [:div {:style {:margin "8px 0"}}
   [:div {:style {:font-size "0.8em" :color "#666" :margin-bottom "4px"}} label]
   [:div {:style {:display "flex" :gap "1px"}}
    (for [[i b] (map-indexed vector (or bits []))]
      (let [is-parity? (contains? #{4 5 6 11 12 13 18 19 20 25 26 27} i)]
        ^{:key i}
        [:div {:style {:width "18px" :height "24px"
                       :background (cond
                                     (highlight-fn i) "#fef3c7"
                                     is-parity? "#e0e7ff"
                                     :else "#f8f8f8")
                       :border (str "1px solid " (color-fn i b))
                       :display "flex" :align-items "center" :justify-content "center"
                       :font-family "monospace" :font-size "0.75em"
                       :color (if is-parity? "#6366f1" "#333")}}
         b]))]])

(defn find-differences [a b]
  (if (and a b)
    (set (keep-indexed (fn [i [x y]] (when (not= x y) i)) (map vector a b)))
    #{}))

(defn catalyst-viz []
  (let [original (:catalyst-encoded @state)
        corrupted (:catalyst-corrupted @state)
        corrected (:catalyst-corrected @state)
        errors (find-differences original corrupted)
        fixes (find-differences corrupted corrected)]
    [:div {:style {:margin "16px 0" :padding "12px" :background "#f8f8f8"}}
     [:div {:style {:font-weight 600 :margin-bottom "12px"}} "Catalyst State"]

     [bit-strip "Original (Hamming encoded)"
      original
      (constantly false)
      (constantly "#ddd")]

     (when corrupted
       [bit-strip "After Computation (corrupted)"
        corrupted
        #(contains? errors %)
        #(if (contains? errors %1) "#ef4444" "#ddd")])

     (when corrected
       [bit-strip "After Error Correction"
        corrected
        #(contains? fixes %)
        #(if (contains? fixes %1) "#22c55e" "#ddd")])

     [:div {:style {:display "flex" :gap "16px" :margin-top "12px" :font-size "0.85em"}}
      [:span [:span {:style {:color "#6366f1"}} "■"] " Parity bits"]
      [:span [:span {:style {:color "#ef4444"}} "■"] " Errors"]
      [:span [:span {:style {:color "#22c55e"}} "■"] " Corrected"]]]))

(defn stats-panel []
  [:div {:style {:display "grid" :grid-template-columns "repeat(3, 1fr)" :gap "8px" :margin "16px 0"}}
   [:div {:style {:padding "12px" :background "#fee2e2" :text-align "center"}}
    [:div {:style {:font-size "1.5em" :font-weight 600 :color "#991b1b"}}
     (:errors-introduced @state)]
    [:div {:style {:font-size "0.75em" :color "#991b1b"}} "Errors Introduced"]]
   [:div {:style {:padding "12px" :background "#dcfce7" :text-align "center"}}
    [:div {:style {:font-size "1.5em" :font-weight 600 :color "#166534"}}
     (:errors-corrected @state)]
    [:div {:style {:font-size "0.75em" :color "#166534"}} "Errors Corrected"]]
   [:div {:style {:padding "12px" :text-align "center"
                  :background (case (:restoration-success @state)
                                true "#dcfce7"
                                false "#fee2e2"
                                "#f8f8f8")}]
    [:div {:style {:font-size "1.5em" :font-weight 600}}
     (case (:restoration-success @state)
       true "✓"
       false "✗"
       "?")]
    [:div {:style {:font-size "0.75em" :color "#666"}} "Restoration"]]])

(defn trials-panel []
  (let [trials (:trials @state)]
    (when (seq trials)
      (let [successes (count (filter :success trials))
            total (count trials)]
        [:div {:style {:margin "16px 0" :padding "12px" :background "#f8f8f8"}}
         [:div {:style {:font-weight 600 :margin-bottom "8px"}}
          "Trial Results: " successes "/" total " successful ("
          (.toFixed (* 100 (/ successes total)) 1) "%)"]
         [:div {:style {:display "flex" :gap "2px" :flex-wrap "wrap"}}
          (for [[i t] (map-indexed vector (take 100 trials))]
            ^{:key i}
            [:div {:style {:width "8px" :height "8px"
                           :background (if (:success t) "#22c55e" "#ef4444")}}])]]))))

(defn controls []
  [:div {:style {:margin "16px 0"}}
   [:div {:style {:display "flex" :gap "8px" :align-items "center" :margin-bottom "12px"}}
    [:label {:style {:font-size "0.85em"}} "Error rate:"]
    [:input {:type "range" :min 0 :max 0.5 :step 0.01
             :value (:error-rate @state)
             :on-change #(swap! state assoc :error-rate (js/parseFloat (-> % .-target .-value)))
             :style {:flex 1}}]
    [:span {:style {:font-family "monospace" :width "50px"}}
     (.toFixed (* 100 (:error-rate @state)) 0) "%"]]

   [:div {:style {:display "flex" :gap "8px" :flex-wrap "wrap"}}
    [:button {:on-click init-catalyst!
              :style {:padding "8px 16px" :background "#1a1a1a" :color "#fff"
                      :border "none" :cursor "pointer"}}
     "Init Catalyst"]
    [:button {:on-click corrupt-catalyst!
              :disabled (not= (:phase @state) :ready)
              :style {:padding "8px 16px" :background "#f59e0b" :color "#fff"
                      :border "none" :cursor "pointer"
                      :opacity (if (= (:phase @state) :ready) 1 0.5)}}
     "Compute (Corrupt)"]
    [:button {:on-click correct-catalyst!
              :disabled (not= (:phase @state) :corrupted)
              :style {:padding "8px 16px" :background "#22c55e" :color "#fff"
                      :border "none" :cursor "pointer"
                      :opacity (if (= (:phase @state) :corrupted) 1 0.5)}}
     "Error Correct"]
    [:button {:on-click verify-restoration!
              :disabled (not= (:phase @state) :corrected)
              :style {:padding "8px 16px" :background "#60a5fa" :color "#fff"
                      :border "none" :cursor "pointer"
                      :opacity (if (= (:phase @state) :corrected) 1 0.5)}}
     "Verify"]
    [:button {:on-click #(run-many-trials! 100)
              :style {:padding "8px 16px" :background "#6366f1" :color "#fff"
                      :border "none" :cursor "pointer"}}
     "Run 100 Trials"]]])

(defn app []
  [:div {:style {:font-size "small" :line-height 1.6}}
   [:header
    [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
     [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#6366f1"}}]
     [:h1 {:style {:font-size "1.4em" :margin 0}} "Probabilistic Catalysis"]]
    [:p {:style {:color "#666" :margin "4px 0"}} "Trading perfect restoration for computational power"]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
    "Novel extension: Accept small probability of catalyst corruption."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
    "Hamming codes can correct single-bit errors per 7-bit block. More errors = probabilistic success."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #7d8a70" :color "#7d8a70" :font-style "italic" :margin "12px 0"}}
    "Tradeoff: Higher error tolerance enables more aggressive computation."]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [controls]
   [stats-panel]
   [catalyst-viz]
   [trials-panel]

   [:div {:style {:margin-top "24px" :padding "12px" :background "#1a1a1a" :color "#e0e0e0"
                  :font-family "monospace" :font-size "0.8em"}}
    [:div {:style {:color "#888" :margin-bottom "8px"}} "Probabilistic catalysis with Hamming(7,4):"]
    [:pre {:style {:margin 0 :white-space "pre-wrap"}}
"ENCODE CATALYST:
  Split into 4-bit nibbles
  Encode each nibble: 4 data + 3 parity = 7 bits

COMPUTE (may corrupt):
  Perform computation using catalyst
  Some bits may flip (error rate p)

ERROR CORRECT:
  For each 7-bit block:
    syndrome = H * codeword
    if syndrome != 0: flip bit at syndrome position

RESULT:
  If ≤1 error per block: perfect restoration
  If >1 error in any block: probabilistic failure

  P(success) ≈ (1 - p)^n + n*p*(1-p)^(n-1)  [for n bits]"]]

   [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
    [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]])

(rdom/render [app] (js/document.getElementById "app"))
</script>
