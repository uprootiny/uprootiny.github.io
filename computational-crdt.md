---
layout: text
title: "CRDTs"
permalink: /computational/crdt/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns crdt.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

;; CRDTs: Conflict-free Replicated Data Types
;; Live simulation with network partitions and eventual consistency

;; Vector clocks for causality
(defn vc-inc [vc node]
  (update vc node (fnil inc 0)))

(defn vc-merge [vc1 vc2]
  (merge-with max vc1 vc2))

(defn vc-compare [vc1 vc2]
  (let [k1 (set (keys vc1))
        k2 (set (keys vc2))
        all-keys (clojure.set/union k1 k2)]
    (reduce (fn [acc k]
              (let [v1 (get vc1 k 0)
                    v2 (get vc2 k 0)]
                (cond
                  (and (= acc :equal) (= v1 v2)) :equal
                  (and (not= acc :gt) (<= v1 v2)) :lt
                  (and (not= acc :lt) (>= v1 v2)) :gt
                  :else :concurrent)))
            :equal all-keys)))

;; G-Counter with vector clock
(defn gc-new [] {:counts {} :vc {}})

(defn gc-inc [gc node]
  (-> gc
      (update-in [:counts node] (fnil inc 0))
      (update :vc vc-inc node)))

(defn gc-value [gc]
  (reduce + (vals (:counts gc))))

(defn gc-merge [gc1 gc2]
  {:counts (merge-with max (:counts gc1) (:counts gc2))
   :vc (vc-merge (:vc gc1) (:vc gc2))})

;; LWW-Map (Last Writer Wins per key)
(defn lww-new [] {:entries {} :vc {}})

(defn lww-set [lww node key value]
  (let [ts (js/Date.now)]
    (-> lww
        (assoc-in [:entries key] {:value value :ts ts :node node})
        (update :vc vc-inc node))))

(defn lww-get [lww key]
  (get-in lww [:entries key :value]))

(defn lww-merge [lww1 lww2]
  {:entries (merge-with
             (fn [e1 e2]
               (cond
                 (> (:ts e1) (:ts e2)) e1
                 (< (:ts e1) (:ts e2)) e2
                 (> (:node e1) (:node e2)) e1
                 :else e2))
             (:entries lww1) (:entries lww2))
   :vc (vc-merge (:vc lww1) (:vc lww2))})

;; OR-Set (Observed-Remove Set)
(defn ors-new [] {:adds {} :removes #{} :vc {}})

(defn ors-add [ors node item]
  (let [tag (str node "-" (js/Date.now) "-" (rand-int 1000))]
    (-> ors
        (update-in [:adds item] (fnil conj #{}) tag)
        (update :vc vc-inc node))))

(defn ors-remove [ors item]
  (let [tags (get-in ors [:adds item] #{})]
    (update ors :removes clojure.set/union tags)))

(defn ors-contains? [ors item]
  (let [adds (get-in ors [:adds item] #{})
        removes (:removes ors)]
    (seq (clojure.set/difference adds removes))))

(defn ors-elements [ors]
  (set (filter #(ors-contains? ors %) (keys (:adds ors)))))

(defn ors-merge [ors1 ors2]
  {:adds (merge-with clojure.set/union (:adds ors1) (:adds ors2))
   :removes (clojure.set/union (:removes ors1) (:removes ors2))
   :vc (vc-merge (:vc ors1) (:vc ors2))})

;; Network simulation
(defonce state
  (r/atom {:crdt-type :g-counter
           :nodes {:A {:data (gc-new) :inbox [] :online true}
                   :B {:data (gc-new) :inbox [] :online true}
                   :C {:data (gc-new) :inbox [] :online true}}
           :network-partition false
           :messages []
           :log []
           :tick 0}))

(defn log! [msg]
  (swap! state update :log #(vec (take 30 (cons {:msg msg :tick (:tick @state)} %)))))

(defn get-new-crdt []
  (case (:crdt-type @state)
    :g-counter (gc-new)
    :lww-map (lww-new)
    :or-set (ors-new)))

(defn get-value [data]
  (case (:crdt-type @state)
    :g-counter (gc-value data)
    :lww-map (count (:entries data))
    :or-set (count (ors-elements data))))

(defn merge-crdt [d1 d2]
  (case (:crdt-type @state)
    :g-counter (gc-merge d1 d2)
    :lww-map (lww-merge d1 d2)
    :or-set (ors-merge d1 d2)))

;; Operations
(defn operate! [node-id op & args]
  (let [current (get-in @state [:nodes node-id :data])]
    (swap! state assoc-in [:nodes node-id :data]
           (case (:crdt-type @state)
             :g-counter (gc-inc current node-id)
             :lww-map (lww-set current node-id (first args) (second args))
             :or-set (if (= op :add)
                       (ors-add current node-id (first args))
                       (ors-remove current (first args)))))
    (log! (str node-id " performed " op))))

;; Network messaging
(defn broadcast! [from-node]
  (let [data (get-in @state [:nodes from-node :data])]
    (doseq [to-node [:A :B :C]]
      (when (and (not= from-node to-node)
                 (not (:network-partition @state)))
        (swap! state update :messages conj
               {:from from-node
                :to to-node
                :data data
                :deliver-at (+ (:tick @state) (+ 2 (rand-int 5)))})
        (log! (str from-node " → " to-node " (queued)"))))))

(defn deliver-messages! []
  (let [tick (:tick @state)
        ready (filter #(<= (:deliver-at %) tick) (:messages @state))
        pending (remove #(<= (:deliver-at %) tick) (:messages @state))]
    (doseq [{:keys [from to data]} ready]
      (when (get-in @state [:nodes to :online])
        (let [current (get-in @state [:nodes to :data])
              merged (merge-crdt current data)]
          (swap! state assoc-in [:nodes to :data] merged)
          (log! (str to " received from " from " and merged")))))
    (swap! state assoc :messages (vec pending))))

(defn tick! []
  (swap! state update :tick inc)
  (deliver-messages!))

(defonce ticker (js/setInterval tick! 500))

(defn toggle-partition! []
  (swap! state update :network-partition not)
  (log! (if (:network-partition @state)
          "NETWORK PARTITIONED"
          "Network restored")))

(defn set-type! [t]
  (swap! state assoc
         :crdt-type t
         :nodes {:A {:data (get-new-crdt) :inbox [] :online true}
                 :B {:data (get-new-crdt) :inbox [] :online true}
                 :C {:data (get-new-crdt) :inbox [] :online true}}
         :messages []
         :log []))

;; Input state for operations
(defonce input-state (r/atom {:key "" :value "" :item ""}))

;; Visualization
(defn divergence-indicator []
  (let [nodes (:nodes @state)
        values (map #(get-value (:data %)) (vals nodes))
        diverged? (not (apply = values))]
    [:div {:style {:display "flex" :align-items "center" :gap "8px" :margin "12px 0"
                   :padding "12px"
                   :background (if diverged? "#fef3c7" "#dcfce7")
                   :border-left (str "3px solid " (if diverged? "#f59e0b" "#22c55e"))}}
     [:div {:style {:width "12px" :height "12px" :border-radius "50%"
                    :background (if diverged? "#f59e0b" "#22c55e")
                    :animation (if diverged? "pulse 1s infinite" "none")}}]
     [:div
      [:div {:style {:font-weight 600}}
       (if diverged? "Replicas Diverged" "Replicas Converged")]
      [:div {:style {:font-size "0.85em" :color "#666"}}
       "Values: " (clojure.string/join " / " values)]]]))

(defn message-queue-viz []
  (let [msgs (:messages @state)
        tick (:tick @state)]
    [:div {:style {:margin "12px 0"}}
     [:div {:style {:font-size "0.85em" :color "#666" :margin-bottom "4px"}}
      "In-flight messages (" (count msgs) ")"]
     [:div {:style {:display "flex" :gap "4px" :flex-wrap "wrap" :min-height "30px"
                    :padding "8px" :background "#f8f8f8"}}
      (if (empty? msgs)
        [:span {:style {:color "#999" :font-style "italic"}} "No pending messages"]
        (for [[i m] (map-indexed vector msgs)]
          ^{:key i}
          [:div {:style {:padding "4px 8px" :background "#60a5fa" :color "#fff"
                         :font-size "0.75em" :border-radius "4px"
                         :animation "slideIn 0.3s"}}
           (str (:from m) "→" (:to m) " (T+" (- (:deliver-at m) tick) ")")]))]]))

(defn node-panel [node-id]
  (let [node (get-in @state [:nodes node-id])
        data (:data node)
        value (get-value data)
        partitioned? (:network-partition @state)]
    [:div {:style {:padding "16px" :background "#fff" :border "2px solid #ddd"
                   :border-color (if partitioned? "#ef4444" "#ddd")
                   :min-width "200px" :position "relative"}}
     (when partitioned?
       [:div {:style {:position "absolute" :top "-10px" :right "-10px"
                      :background "#ef4444" :color "#fff" :padding "2px 8px"
                      :font-size "0.7em" :border-radius "4px"}}
        "ISOLATED"])

     [:div {:style {:display "flex" :justify-content "space-between" :align-items "center"}}
      [:span {:style {:font-weight 600 :font-size "1.2em"}}
       (str "Node " (name node-id))]
      [:span {:style {:font-family "monospace" :font-size "0.75em" :color "#888"}}
       "vc:" (pr-str (:vc data))]]

     [:div {:style {:font-size "2.5em" :font-weight 600 :text-align "center"
                    :margin "16px 0" :font-family "monospace"}}
      (case (:crdt-type @state)
        :g-counter value
        :lww-map (str value " keys")
        :or-set (str value " items"))]

     ;; Type-specific display
     (case (:crdt-type @state)
       :g-counter
       [:div {:style {:font-size "0.75em" :color "#666" :margin-bottom "8px"}}
        "Slots: " (pr-str (:counts data))]

       :lww-map
       [:div {:style {:font-size "0.75em" :max-height "60px" :overflow "auto"
                      :margin-bottom "8px" :font-family "monospace"}}
        (for [[k v] (:entries data)]
          ^{:key k}
          [:div (str k ": " (:value v))])]

       :or-set
       [:div {:style {:font-size "0.75em" :max-height "60px" :overflow "auto"
                      :margin-bottom "8px"}}
        (clojure.string/join ", " (ors-elements data))])

     ;; Operations
     (case (:crdt-type @state)
       :g-counter
       [:div {:style {:display "flex" :gap "4px"}}
        [:button {:on-click #(operate! node-id :inc)
                  :style {:flex 1 :padding "8px" :background "#22c55e" :color "#fff"
                          :border "none" :cursor "pointer" :font-size "1.2em"}}
         "+1"]
        [:button {:on-click #(broadcast! node-id)
                  :style {:padding "8px 12px" :background "#60a5fa" :color "#fff"
                          :border "none" :cursor "pointer"}}
         "Sync"]]

       :lww-map
       [:div
        [:div {:style {:display "flex" :gap "4px" :margin-bottom "4px"}}
         [:input {:value (:key @input-state)
                  :on-change #(swap! input-state assoc :key (-> % .-target .-value))
                  :placeholder "key"
                  :style {:flex 1 :padding "4px" :font-size "0.85em"}}]
         [:input {:value (:value @input-state)
                  :on-change #(swap! input-state assoc :value (-> % .-target .-value))
                  :placeholder "value"
                  :style {:flex 1 :padding "4px" :font-size "0.85em"}}]]
        [:div {:style {:display "flex" :gap "4px"}}
         [:button {:on-click #(when (seq (:key @input-state))
                               (operate! node-id :set (:key @input-state) (:value @input-state)))
                   :style {:flex 1 :padding "6px" :background "#22c55e" :color "#fff"
                           :border "none" :cursor "pointer"}}
          "Set"]
         [:button {:on-click #(broadcast! node-id)
                   :style {:padding "6px 12px" :background "#60a5fa" :color "#fff"
                           :border "none" :cursor "pointer"}}
          "Sync"]]]

       :or-set
       [:div
        [:div {:style {:display "flex" :gap "4px" :margin-bottom "4px"}}
         [:input {:value (:item @input-state)
                  :on-change #(swap! input-state assoc :item (-> % .-target .-value))
                  :placeholder "item"
                  :style {:flex 1 :padding "4px" :font-size "0.85em"}}]]
        [:div {:style {:display "flex" :gap "4px"}}
         [:button {:on-click #(when (seq (:item @input-state))
                               (operate! node-id :add (:item @input-state)))
                   :style {:flex 1 :padding "6px" :background "#22c55e" :color "#fff"
                           :border "none" :cursor "pointer"}}
          "Add"]
         [:button {:on-click #(when (seq (:item @input-state))
                               (operate! node-id :remove (:item @input-state)))
                   :style {:flex 1 :padding "6px" :background "#ef4444" :color "#fff"
                           :border "none" :cursor "pointer"}}
          "Remove"]
         [:button {:on-click #(broadcast! node-id)
                   :style {:padding "6px 12px" :background "#60a5fa" :color "#fff"
                           :border "none" :cursor "pointer"}}
          "Sync"]]])]))

(defn log-panel []
  [:div {:style {:margin-top "16px" :max-height "150px" :overflow-y "auto"
                 :background "#1a1a1a" :padding "8px"
                 :font-family "monospace" :font-size "0.75em"}}
   (for [[i entry] (map-indexed vector (:log @state))]
     ^{:key i}
     [:div {:style {:color "#22c55e" :padding "2px 0" :border-bottom "1px solid #333"}}
      [:span {:style {:color "#888"}} (str "T" (:tick entry) " ")]
      (:msg entry)])])

(defn app []
  [:div {:style {:font-size "small" :line-height 1.6}}
   [:header
    [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
     [:span {:style {:width "8px" :height "8px" :border-radius "50%"
                     :background (if (:network-partition @state) "#ef4444" "#22c55e")
                     :animation "pulse 1s infinite"}}]
     [:h1 {:style {:font-size "1.4em" :margin 0}} "CRDTs"]
     [:span {:style {:font-size "0.85em" :color "#888" :margin-left "auto"}}
      "Tick: " (:tick @state)]]
    [:p {:style {:color "#666" :margin "4px 0"}} "Conflict-free Replicated Data Types - Live Network Simulation"]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
    "Replicas operate independently. Merging is always deterministic."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
    "Try: Partition the network, make conflicting changes, then restore. Watch convergence."]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:display "flex" :gap "8px" :flex-wrap "wrap" :margin "12px 0"}}
    (for [[t label] [[:g-counter "G-Counter"] [:lww-map "LWW-Map"] [:or-set "OR-Set"]]]
      ^{:key t}
      [:button {:on-click #(set-type! t)
                :style {:padding "6px 12px"
                        :background (if (= (:crdt-type @state) t) "#1a1a1a" "#f0f0f0")
                        :color (if (= (:crdt-type @state) t) "#fff" "#333")
                        :border "none" :cursor "pointer"}}
       label])
    [:button {:on-click toggle-partition!
              :style {:padding "6px 12px" :margin-left "auto"
                      :background (if (:network-partition @state) "#ef4444" "#f59e0b")
                      :color "#fff" :border "none" :cursor "pointer"}}
     (if (:network-partition @state) "Restore Network" "Partition Network")]]

   [divergence-indicator]
   [message-queue-viz]

   [:div {:style {:display "grid" :grid-template-columns "repeat(auto-fit, minmax(220px, 1fr))"
                  :gap "16px" :margin "16px 0"}}
    [node-panel :A]
    [node-panel :B]
    [node-panel :C]]

   [log-panel]

   [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
    [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]])

(rdom/render [app] (js/document.getElementById "app"))
</script>

<style>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes slideIn {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
