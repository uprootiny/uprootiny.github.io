---
layout: text
title: "Catalytic Computation"
permalink: /computational/catalytic/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns catalytic.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

;; Catalytic Computation
;; Use memory that's already "occupied" by arbitrary data (the catalyst)
;; Compute using that space, then restore it perfectly
;; Like borrowing from permanence but returning everything pristine

;; Memory model:
;; [clean work space | catalyst (must be restored) | input/output]

(def catalyst-size 16)
(def work-size 4)

(defn random-catalyst []
  (vec (repeatedly catalyst-size #(rand-int 256))))

(defn xor-with [data key-data]
  (vec (map bit-xor data (cycle key-data))))

(defonce state
  (r/atom {:phase :idle
           :step 0
           :catalyst-original (random-catalyst)
           :catalyst-current nil
           :work-space (vec (repeat work-size 0))
           :input [5 3]  ; a + b
           :output nil
           :history []
           :algorithm :add}))

;; Catalytic addition algorithm
;; Uses catalyst as scratch space, then reverses all operations

(def add-steps
  [{:name "Initialize"
    :desc "Copy catalyst, prepare work space"
    :action (fn [s]
              (assoc s
                     :catalyst-current (:catalyst-original s)
                     :work-space (vec (repeat work-size 0))
                     :output nil))}

   {:name "Encode input into catalyst"
    :desc "XOR input values into catalyst (reversible)"
    :action (fn [s]
              (let [[a b] (:input s)]
                (-> s
                    (update :catalyst-current xor-with [a 0 0 0])
                    (update :catalyst-current xor-with [0 b 0 0]))))}

   {:name "Extract for computation"
    :desc "Copy encoded values to work space"
    :action (fn [s]
              (assoc s :work-space
                     [(bit-xor (get-in s [:catalyst-current 0]) (first (:input s)))
                      (bit-xor (get-in s [:catalyst-current 1]) (second (:input s)))
                      (first (:input s))
                      (second (:input s))]))}

   {:name "Compute result"
    :desc "Perform addition in work space"
    :action (fn [s]
              (let [[a b] (:input s)]
                (-> s
                    (assoc :output (+ a b))
                    (assoc-in [:work-space 0] (+ a b)))))}

   {:name "Reverse catalyst encoding"
    :desc "XOR same values to restore catalyst (a XOR a = 0)"
    :action (fn [s]
              (let [[a b] (:input s)]
                (-> s
                    (update :catalyst-current xor-with [a 0 0 0])
                    (update :catalyst-current xor-with [0 b 0 0]))))}

   {:name "Verify restoration"
    :desc "Catalyst should match original exactly"
    :action (fn [s]
              (assoc s :verified
                     (= (:catalyst-original s) (:catalyst-current s))))}])

(defn run-step! []
  (let [step (:step @state)
        steps add-steps]
    (when (< step (count steps))
      (let [step-fn (:action (nth steps step))]
        (swap! state step-fn)
        (swap! state update :history conj
               {:step step
                :name (:name (nth steps step))
                :catalyst (vec (take 8 (:catalyst-current @state)))
                :work (:work-space @state)})
        (swap! state update :step inc)
        (swap! state assoc :phase :running)))))

(defn reset-computation! []
  (swap! state assoc
         :phase :idle
         :step 0
         :catalyst-original (random-catalyst)
         :catalyst-current nil
         :work-space (vec (repeat work-size 0))
         :output nil
         :history []
         :verified nil))

(defn run-all! []
  (reset-computation!)
  (swap! state assoc :catalyst-current (:catalyst-original @state))
  (dotimes [_ (count add-steps)]
    (run-step!)))

;; Visualization

(defn memory-cell [value highlight?]
  [:div {:style {:width "28px" :height "28px"
                 :background (cond
                               highlight? "#fef3c7"
                               (zero? value) "#f8f8f8"
                               :else "#e0e0e0")
                 :border (if highlight? "2px solid #f59e0b" "1px solid #ccc")
                 :display "flex" :align-items "center" :justify-content "center"
                 :font-family "monospace" :font-size "0.7em"}}
   (if (zero? value) "·" (.toString value 16))])

(defn memory-strip [label cells color highlights]
  [:div {:style {:margin "8px 0"}}
   [:div {:style {:font-size "0.75em" :color "#666" :margin-bottom "4px"}}
    label " (" (count cells) " bytes)"]
   [:div {:style {:display "flex" :gap "2px" :padding "4px"
                  :background color :border-radius "4px"}}
    (for [[i c] (map-indexed vector cells)]
      ^{:key i}
      [memory-cell c (contains? highlights i)])]])

(defn catalyst-comparison []
  (let [orig (:catalyst-original @state)
        curr (:catalyst-current @state)]
    (when curr
      [:div {:style {:margin "16px 0"}}
       [:div {:style {:font-size "0.85em" :font-weight 600 :margin-bottom "8px"}}
        "Catalyst Integrity Check"]
       [:div {:style {:display "grid" :grid-template-columns "1fr 1fr" :gap "8px"}}
        [:div
         [:div {:style {:font-size "0.75em" :color "#666"}} "Original"]
         [:div {:style {:display "flex" :gap "1px" :flex-wrap "wrap"}}
          (for [[i v] (map-indexed vector (take 16 orig))]
            ^{:key i}
            [:div {:style {:width "20px" :height "20px" :font-size "0.6em"
                           :background "#22c55e" :color "#fff"
                           :display "flex" :align-items "center" :justify-content "center"
                           :font-family "monospace"}}
             (.toString v 16)])]]
        [:div
         [:div {:style {:font-size "0.75em" :color "#666"}} "Current"]
         [:div {:style {:display "flex" :gap "1px" :flex-wrap "wrap"}}
          (for [[i v] (map-indexed vector (take 16 curr))]
            (let [matches? (= v (get orig i))]
              ^{:key i}
              [:div {:style {:width "20px" :height "20px" :font-size "0.6em"
                             :background (if matches? "#22c55e" "#ef4444") :color "#fff"
                             :display "flex" :align-items "center" :justify-content "center"
                             :font-family "monospace"}}
               (.toString v 16)]))]]]])))

(defn step-panel []
  (let [step (:step @state)
        steps add-steps]
    [:div {:style {:margin "16px 0"}}
     [:div {:style {:display "flex" :gap "4px" :flex-wrap "wrap"}}
      (for [[i s] (map-indexed vector steps)]
        ^{:key i}
        [:div {:style {:padding "8px" :min-width "100px"
                       :background (cond
                                     (< i step) "#dcfce7"
                                     (= i step) "#fef3c7"
                                     :else "#f8f8f8")
                       :border (if (= i step) "2px solid #f59e0b" "1px solid #ddd")
                       :font-size "0.75em"}}
         [:div {:style {:font-weight 600}} (str (inc i) ". " (:name s))]
         [:div {:style {:color "#666" :font-size "0.9em"}} (:desc s)]])]]))

(defn controls []
  (let [[a b] (:input @state)]
    [:div {:style {:margin "16px 0"}}
     [:div {:style {:display "flex" :gap "8px" :align-items "center" :margin-bottom "12px"}}
      [:span {:style {:font-size "0.85em"}} "Input:"]
      [:input {:type "number" :value a :min 0 :max 255
               :on-change #(swap! state assoc-in [:input 0] (js/parseInt (-> % .-target .-value)))
               :style {:width "60px" :padding "4px"}}]
      [:span "+"]
      [:input {:type "number" :value b :min 0 :max 255
               :on-change #(swap! state assoc-in [:input 1] (js/parseInt (-> % .-target .-value)))
               :style {:width "60px" :padding "4px"}}]
      (when (:output @state)
        [:span {:style {:font-weight 600 :margin-left "8px"}}
         "= " (:output @state)])]

     [:div {:style {:display "flex" :gap "8px"}}
      [:button {:on-click run-step!
                :disabled (>= (:step @state) (count add-steps))
                :style {:padding "8px 16px" :background "#60a5fa" :color "#fff"
                        :border "none" :cursor "pointer"
                        :opacity (if (>= (:step @state) (count add-steps)) 0.5 1)}}
       "Step"]
      [:button {:on-click run-all!
                :style {:padding "8px 16px" :background "#22c55e" :color "#fff"
                        :border "none" :cursor "pointer"}}
       "Run All"]
      [:button {:on-click reset-computation!
                :style {:padding "8px 16px" :background "#888" :color "#fff"
                        :border "none" :cursor "pointer"}}
       "Reset"]]]))

(defn app []
  [:div {:style {:font-size "small" :line-height 1.6}}
   [:header
    [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
     [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#f59e0b"}}]
     [:h1 {:style {:font-size "1.4em" :margin 0}} "Catalytic Computation"]]
    [:p {:style {:color "#666" :margin "4px 0"}} "Borrowing memory, returning it pristine"]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
    "The catalyst is memory already full of arbitrary data. We borrow it, compute, then restore it exactly."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
    "XOR is the key: a XOR b XOR b = a. Encode, compute, reverse."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #7d8a70" :color "#7d8a70" :font-style "italic" :margin "12px 0"}}
    "Like ephemeral computation at the archival stratum - maximum borrowing, zero trace."]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [controls]

   [:div {:style {:margin "16px 0"}}
    [memory-strip "Work Space (clean)" (:work-space @state) "#e0f2fe" #{}]
    [memory-strip "Catalyst (must restore)"
     (or (:catalyst-current @state) (:catalyst-original @state))
     (if (and (:verified @state)) "#dcfce7" "#fef3c7")
     (case (:step @state) 1 #{0 1} 2 #{0 1} 4 #{0 1} #{})]]

   [step-panel]
   [catalyst-comparison]

   (when (:verified @state)
     [:div {:style {:margin "16px 0" :padding "16px" :text-align "center"
                    :background (if (:verified @state) "#dcfce7" "#fee2e2")
                    :border-left (str "4px solid " (if (:verified @state) "#22c55e" "#ef4444"))}}
      (if (:verified @state)
        [:div
         [:div {:style {:font-weight 600 :font-size "1.2em" :color "#166534"}}
          "Catalyst Restored"]
         [:div {:style {:color "#166534"}} "All borrowed memory returned to original state"]]
        [:div {:style {:color "#991b1b" :font-weight 600}} "CATALYST CORRUPTED"])])

   [:div {:style {:margin-top "24px" :padding "12px" :background "#1a1a1a" :color "#e0e0e0"
                  :font-family "monospace" :font-size "0.8em"}}
    [:div {:style {:color "#888" :margin-bottom "8px"}} "Catalytic computation model:"]
    [:pre {:style {:margin 0 :white-space "pre-wrap"}}
"┌─────────────┬──────────────────┬───────────┐
│ Work Space  │ Catalyst (full)  │ I/O       │
│ (O(log n))  │ (arbitrary data) │           │
└─────────────┴──────────────────┴───────────┘

1. Catalyst starts with arbitrary data C
2. Encode input into catalyst: C' = C XOR input
3. Compute using encoded values
4. Reverse encoding: C' XOR input = C
5. Catalyst restored exactly"]]

   [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
    [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]])

(rdom/render [app] (js/document.getElementById "app"))
</script>
