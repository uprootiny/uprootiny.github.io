---
layout: text
title: "Merkle Trees"
permalink: /computational/merkle/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns merkle.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

;; Merkle Trees: Hash trees for efficient verification
;; Each leaf is data, each parent is hash(left || right)
;; To verify one leaf, you only need O(log n) hashes

(defn hash-str [s]
  "Simple hash function (djb2 variant)"
  (let [h (reduce (fn [a c] (bit-and (+ (bit-shift-left a 5) a (.charCodeAt c 0)) 0xFFFFFFFF))
                  5381 (str s))]
    (.substring (.toString h 16) 0 8)))

(defn combine-hash [h1 h2]
  (hash-str (str h1 h2)))

(defn build-tree [leaves]
  "Build Merkle tree from leaves. Returns {:root :nodes :leaves}"
  (if (empty? leaves)
    {:root nil :nodes [] :leaves []}
    (let [leaf-hashes (mapv (fn [l] {:data l :hash (hash-str l) :type :leaf}) leaves)
          ;; Pad to power of 2
          n (count leaf-hashes)
          pow2 (loop [p 1] (if (>= p n) p (recur (* p 2))))
          padded (vec (concat leaf-hashes (repeat (- pow2 n) {:data "" :hash "0" :type :pad})))
          ;; Build levels bottom-up
          levels (loop [current padded
                        acc [padded]]
                   (if (<= (count current) 1)
                     acc
                     (let [pairs (partition 2 current)
                           parents (mapv (fn [[l r]]
                                          {:hash (combine-hash (:hash l) (:hash r))
                                           :left l :right r :type :internal})
                                        pairs)]
                       (recur parents (conj acc parents)))))]
      {:root (first (last levels))
       :levels (vec (reverse levels))
       :leaves leaf-hashes})))

(defn get-proof [tree leaf-idx]
  "Get Merkle proof for a leaf (sibling hashes needed to verify)"
  (let [levels (reverse (:levels tree))
        n-leaves (count (:leaves tree))]
    (when (< leaf-idx n-leaves)
      (loop [idx leaf-idx
             lvls (rest levels)  ; skip root
             proof []]
        (if (empty? lvls)
          proof
          (let [level (first lvls)
                sibling-idx (if (even? idx) (inc idx) (dec idx))
                sibling (get level sibling-idx)
                direction (if (even? idx) :right :left)]
            (recur (quot idx 2)
                   (rest lvls)
                   (conj proof {:hash (:hash sibling) :direction direction}))))))))

(defn verify-proof [leaf-hash proof root-hash]
  "Verify a Merkle proof"
  (let [computed (reduce (fn [h step]
                          (if (= (:direction step) :right)
                            (combine-hash h (:hash step))
                            (combine-hash (:hash step) h)))
                        leaf-hash
                        proof)]
    (= computed root-hash)))

(defonce state
  (r/atom {:items ["alpha" "beta" "gamma" "delta"]
           :new-item ""
           :selected-idx nil
           :tampered-idx nil
           :show-proof false}))

(defn add-item! []
  (let [item (:new-item @state)]
    (when (seq item)
      (swap! state update :items conj item)
      (swap! state assoc :new-item "" :selected-idx nil :tampered-idx nil))))

(defn tamper! [idx]
  (swap! state update-in [:items idx] #(str % "*"))
  (swap! state assoc :tampered-idx idx))

;; Visualization

(defn node-color [node selected? tampered?]
  (cond
    tampered? "#ef4444"
    selected? "#22c55e"
    (= (:type node) :pad) "#f0f0f0"
    (= (:type node) :leaf) "#60a5fa"
    :else "#1a1a1a"))

(defn tree-viz []
  (let [tree (build-tree (:items @state))
        levels (:levels tree)
        selected (:selected-idx @state)
        tampered (:tampered-idx @state)
        proof (when selected (get-proof tree selected))
        proof-hashes (set (map :hash proof))]
    [:div {:style {:overflow-x "auto" :padding "16px 0"}}
     ;; Tree visualization
     [:svg {:width (max 400 (* (count (:items @state)) 100))
            :height (* (count levels) 60)
            :style {:display "block" :margin "0 auto"}}
      (for [[level-idx level] (map-indexed vector levels)]
        (let [y (+ 30 (* level-idx 50))
              n (count level)
              spacing (/ (max 400 (* (count (:items @state)) 100)) (inc n))]
          ^{:key level-idx}
          [:g
           ;; Lines to children
           (when (< level-idx (dec (count levels)))
             (for [[node-idx node] (map-indexed vector level)]
               (when (and (:left node) (:right node))
                 (let [x (+ spacing (* node-idx spacing))
                       child-y (+ y 50)
                       child-spacing (/ (max 400 (* (count (:items @state)) 100))
                                        (inc (count (get levels (inc level-idx)))))]
                   ^{:key (str "line-" level-idx "-" node-idx)}
                   [:g
                    [:line {:x1 x :y1 (+ y 15) :x2 (+ child-spacing (* node-idx 2 child-spacing)) :y2 (- child-y 15)
                            :stroke "#ddd" :stroke-width 1}]
                    [:line {:x1 x :y1 (+ y 15) :x2 (+ child-spacing (+ 1 (* node-idx 2)) child-spacing) :y2 (- child-y 15)
                            :stroke "#ddd" :stroke-width 1}]]))))
           ;; Nodes
           (for [[node-idx node] (map-indexed vector level)]
             (let [x (+ spacing (* node-idx spacing))
                   is-selected? (and (= level-idx (dec (count levels)))
                                     (= node-idx selected))
                   is-tampered? (and (= level-idx (dec (count levels)))
                                     (= node-idx tampered))
                   in-proof? (contains? proof-hashes (:hash node))]
               ^{:key (str level-idx "-" node-idx)}
               [:g
                [:rect {:x (- x 30) :y (- y 12) :width 60 :height 24 :rx 3
                        :fill (cond
                                is-tampered? "#fee2e2"
                                is-selected? "#dcfce7"
                                in-proof? "#fef3c7"
                                :else "#fff")
                        :stroke (node-color node is-selected? is-tampered?)
                        :stroke-width 2}]
                [:text {:x x :y (+ y 4) :text-anchor "middle"
                        :font-size "10" :font-family "monospace"
                        :fill (if (or is-selected? is-tampered?) "#000" "#666")}
                 (:hash node)]
                (when (and (= (:type node) :leaf) (:data node))
                  [:text {:x x :y (+ y 18) :text-anchor "middle"
                          :font-size "8" :fill "#888"}
                   (subs (:data node) 0 (min 8 (count (:data node))))])]))]))]

     ;; Root hash display
     [:div {:style {:text-align "center" :margin-top "12px"}}
      [:span {:style {:font-size "0.85em" :color "#666"}} "Root: "]
      [:code {:style {:background "#1a1a1a" :color "#22c55e" :padding "4px 8px"}}
       (or (:hash (:root tree)) "empty")]]]))

(defn proof-panel []
  (let [tree (build-tree (:items @state))
        selected (:selected-idx @state)
        proof (when selected (get-proof tree selected))
        leaf (when selected (get (:leaves tree) selected))
        valid? (when (and proof leaf)
                 (verify-proof (:hash leaf) proof (:hash (:root tree))))]
    (when (and selected proof)
      [:div {:style {:margin-top "16px" :padding "12px" :background "#f8f8f8"
                     :border-left (str "3px solid " (if valid? "#22c55e" "#ef4444"))}}
       [:div {:style {:font-weight 600 :margin-bottom "8px"}}
        "Merkle Proof for \"" (:data leaf) "\""]
       [:div {:style {:font-family "monospace" :font-size "0.8em"}}
        [:div [:strong "Leaf hash: "] (:hash leaf)]
        [:div {:style {:margin "8px 0"}}
         [:strong "Proof path (" (count proof) " steps):"]
         (for [[i step] (map-indexed vector proof)]
           ^{:key i}
           [:div {:style {:margin-left "12px" :color "#666"}}
            (str (inc i) ". " (name (:direction step)) ": " (:hash step))])]
        [:div {:style {:margin-top "8px" :padding "8px"
                       :background (if valid? "#dcfce7" "#fee2e2")}}
         (if valid?
           [:span {:style {:color "#166534"}} "Verified against root"]
           [:span {:style {:color "#991b1b"}} "VERIFICATION FAILED"])]]])))

(defn controls []
  [:div {:style {:margin "16px 0"}}
   [:div {:style {:display "flex" :gap "8px" :margin-bottom "12px"}}
    [:input {:value (:new-item @state)
             :on-change #(swap! state assoc :new-item (-> % .-target .-value))
             :on-key-down #(when (= (.-key %) "Enter") (add-item!))
             :placeholder "Add leaf data..."
             :style {:flex 1 :padding "8px" :border "1px solid #ccc"
                     :font-family "monospace"}}]
    [:button {:on-click add-item!
              :style {:padding "8px 16px" :background "#22c55e" :color "#fff"
                      :border "none" :cursor "pointer"}}
     "Add"]]

   [:div {:style {:font-size "0.85em" :color "#666" :margin-bottom "8px"}}
    "Click a leaf to see its proof. Click 'Tamper' to modify data."]

   [:div {:style {:display "flex" :flex-wrap "wrap" :gap "6px"}}
    (for [[idx item] (map-indexed vector (:items @state))]
      ^{:key idx}
      [:div {:style {:display "flex" :gap "2px"}}
       [:button {:on-click #(swap! state assoc :selected-idx idx)
                 :style {:padding "4px 8px"
                         :background (if (= idx (:selected-idx @state)) "#22c55e" "#f0f0f0")
                         :color (if (= idx (:selected-idx @state)) "#fff" "#333")
                         :border "1px solid #ddd" :cursor "pointer"
                         :font-family "monospace" :font-size "0.85em"}}
        item]
       [:button {:on-click #(tamper! idx)
                 :style {:padding "4px 6px" :background "#fee2e2"
                         :border "1px solid #ef4444" :cursor "pointer"
                         :font-size "0.7em" :color "#ef4444"}}
        "tamper"]])]])

(defn app []
  [:div {:style {:font-size "small" :line-height 1.6}}
   [:header
    [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
     [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#1a1a1a"}}]
     [:h1 {:style {:font-size "1.4em" :margin 0}} "Merkle Trees"]]
    [:p {:style {:color "#666" :margin "4px 0"}} "Hash trees for efficient verification"]]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600 :margin "12px 0"}}
    "Every leaf is hashed. Every parent is hash(left + right). The root commits to everything."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #4a6741" :color "#4a6741" :margin "12px 0"}}
    "To verify one leaf, you only need log(n) hashes: the siblings along the path to root."]
   [:div {:style {:padding-left "12px" :border-left "3px solid #7d8a70" :color "#7d8a70" :font-style "italic" :margin "12px 0"}}
    "Tamper with any leaf and the root changes. The tree catches corruption."]

   [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

   [controls]
   [tree-viz]
   [proof-panel]

   [:div {:style {:margin-top "24px" :padding "12px" :background "#1a1a1a" :color "#e0e0e0"
                  :font-family "monospace" :font-size "0.8em"}}
    [:div {:style {:color "#888" :margin-bottom "8px"}} "How Merkle proofs work:"]
    [:pre {:style {:margin 0 :white-space "pre-wrap"}}
"leaf:     hash(data)
parent:   hash(left || right)
root:     single hash commits to all data

proof:    [sibling hashes from leaf to root]
verify:   recompute root using leaf + proof
          if matches, leaf is authentic"]]

   [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
    [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]])

(rdom/render [app] (js/document.getElementById "app"))
</script>
