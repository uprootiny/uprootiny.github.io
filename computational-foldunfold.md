---
layout: text
title: "Fold/Unfold: 7-Strata Permanence Gradient"
permalink: /computational/foldunfold/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns foldunfold.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

;; === CONFIG ===

(def strata
  [{:id 1 :k :ephemeral   :label "Ephemeral"   :dur "~ms"     :decay 5000   :bg "#f0f0f0" :fg "#999"}
   {:id 2 :k :volatile    :label "Volatile"    :dur "~min"    :decay 30000  :bg "#e0e0e0" :fg "#888"}
   {:id 3 :k :session     :label "Session"     :dur "~hrs"    :decay nil    :bg "#c8c8c8" :fg "#666"}
   {:id 4 :k :local       :label "Local"       :dur "~days"   :decay nil    :bg "#a0a0a0" :fg "#444"}
   {:id 5 :k :distributed :label "Distributed" :dur "~months" :decay nil    :bg "#787878" :fg "#fff"}
   {:id 6 :k :archival    :label "Archival"    :dur "~years"  :decay nil    :bg "#484848" :fg "#fff"}
   {:id 7 :k :geological  :label "Geological"  :dur "~eons"   :decay nil    :bg "#1a1a1a" :fg "#fff"}])

(defn get-stratum [k]
  (first (filter #(= (:k %) k) strata)))

(defn get-stratum-by-id [id]
  (first (filter #(= (:id %) id) strata)))

;; === PERSISTENCE ===

(defn save-session! [k v]
  (try
    (.setItem js/sessionStorage (str "fu:" k) (js/JSON.stringify (clj->js v)))
    (catch :default _ nil)))

(defn load-session [k]
  (try
    (when-let [v (.getItem js/sessionStorage (str "fu:" k))]
      (js->clj (js/JSON.parse v) :keywordize-keys true))
    (catch :default _ nil)))

(defn save-local! [k v]
  (try
    (.setItem js/localStorage (str "fu:" k) (js/JSON.stringify (clj->js v)))
    (catch :default _ nil)))

(defn load-local [k]
  (try
    (when-let [v (.getItem js/localStorage (str "fu:" k))]
      (js->clj (js/JSON.parse v) :keywordize-keys true))
    (catch :default _ nil)))

;; === TIME ===

(defn now [] (js/Date.now))

(defn hash-str [s]
  (let [h (reduce (fn [a c] (bit-and (+ (bit-shift-left a 5) a (.charCodeAt c 0)) 0x7FFFFFFF))
                  5381 (str s (now)))]
    (str "baf" (.toString h 36))))

(defn ago [ms]
  (let [d (- (now) ms)]
    (cond
      (< d 1000) "now"
      (< d 60000) (str (quot d 1000) "s")
      (< d 3600000) (str (quot d 60000) "m")
      :else (str (quot d 3600000) "h"))))

(defn remaining [decay-at]
  (when decay-at (max 0 (- decay-at (now)))))

(defn fmt-ms [ms]
  (cond
    (nil? ms) "∞"
    (<= ms 0) "gone"
    (< ms 1000) (str ms "ms")
    (< ms 60000) (str (quot ms 1000) "s")
    :else (str (quot ms 60000) "m")))

;; === STATE ===

(defonce state
  (r/atom
   {:ephemeral {:mouse [0 0] :tick 0}
    :volatile {:witnesses [] :scratch "" :log []}
    :session (or (load-session "s") {:promoted [] :count 0 :start (now)})
    :local (or (load-local "l") {:visits 1 :prefs {:dark false :show-eph true}})}))

(add-watch state :persist
  (fn [_ _ old new]
    (when (not= (:session old) (:session new))
      (save-session! "s" (:session new)))
    (when (not= (:local old) (:local new))
      (save-local! "l" (:local new)))))

;; === ACTIONS ===

(defn log! [t d]
  (swap! state update-in [:volatile :log]
         #(take 30 (cons {:id (hash-str (str t)) :t t :d d :at (now)} %))))

(defn witness! [content stratum-k]
  (let [s (get-stratum stratum-k)
        w {:hash (hash-str content)
           :content content
           :stratum stratum-k
           :sid (:id s)
           :created (now)
           :decay (when-let [d (:decay s)] (+ (now) d))}]
    (log! :witness {:stratum stratum-k})
    (swap! state update-in [:volatile :witnesses] conj w)
    (swap! state update-in [:session :count] inc)))

(defn promote! [hash]
  (let [ws (get-in @state [:volatile :witnesses])
        w (first (filter #(= (:hash %) hash) ws))]
    (when (and w (< (:sid w) 7))
      (let [nid (inc (:sid w))
            ns (get-stratum-by-id nid)]
        (log! :promote {:to (:k ns)})
        (swap! state update-in [:volatile :witnesses]
               (fn [xs] (mapv #(if (= (:hash %) hash)
                                 (assoc % :stratum (:k ns) :sid nid
                                        :decay (when-let [d (:decay ns)] (+ (now) d)))
                                 %) xs)))
        (when (>= nid 3)
          (swap! state update-in [:session :promoted]
                 #(take 10 (cons {:hash hash :content (:content w) :stratum (:k ns)} %))))))))

(defn demote! [hash]
  (let [ws (get-in @state [:volatile :witnesses])
        w (first (filter #(= (:hash %) hash) ws))]
    (when (and w (> (:sid w) 1))
      (let [nid (dec (:sid w))
            ns (get-stratum-by-id nid)]
        (log! :demote {:to (:k ns)})
        (swap! state update-in [:volatile :witnesses]
               (fn [xs] (mapv #(if (= (:hash %) hash)
                                 (assoc % :stratum (:k ns) :sid nid
                                        :decay (when-let [d (:decay ns)] (+ (now) d)))
                                 %) xs)))))))

(defn forget! [hash]
  (log! :forget {:hash (subs hash 0 8)})
  (swap! state update-in [:volatile :witnesses]
         (fn [xs] (vec (remove #(= (:hash %) hash) xs)))))

(defn decay! []
  (let [n (now)
        ws (get-in @state [:volatile :witnesses])
        expired (filter #(and (:decay %) (<= (:decay %) n)) ws)]
    (doseq [w expired]
      (log! :decay {:hash (subs (:hash w) 0 8)}))
    (swap! state assoc-in [:volatile :witnesses]
           (vec (remove #(and (:decay %) (<= (:decay %) n)) ws)))))

(defn tick! []
  (swap! state update-in [:ephemeral :tick] inc)
  (decay!))

(defonce ticker (js/setInterval tick! 1000))

;; === COMPONENTS ===

(defn badge [stratum-k]
  (let [s (get-stratum stratum-k)]
    [:span {:style {:background (:bg s) :color (:fg s)
                    :padding "2px 8px" :font-size "0.7em" :font-weight 600}}
     (:label s)]))

(defn decay-bar [decay-at stratum-k]
  (let [s (get-stratum stratum-k)
        r (remaining decay-at)
        mx (or (:decay s) 30000)
        pct (if r (min 100 (* 100 (/ r mx))) 100)]
    [:div {:style {:height "3px" :background "#ddd" :margin-top "6px" :position "relative"}}
     [:div {:style {:height "100%" :width (str pct "%")
                    :background (cond (nil? r) "#666" (< pct 20) "#ef4444" (< pct 50) "#f59e0b" :else "#22c55e")
                    :transition "width 1s"}}]
     [:span {:style {:position "absolute" :right 0 :top "5px" :font-size "0.65em" :color "#888"}}
      (fmt-ms r)]]))

(defn witness-card [w]
  (let [s (get-stratum (:stratum w))]
    [:div {:style {:background "#fff" :border-left (str "4px solid " (:bg s))
                   :padding "8px" :margin "6px 0"}}
     [:div {:style {:display "flex" :gap "8px" :align-items "center" :font-size "0.8em"}}
      [badge (:stratum w)]
      [:span {:style {:color "#888"}} (ago (:created w))]
      [:span {:style {:color "#aaa" :margin-left "auto" :font-family "monospace"}}
       (subs (:hash w) 0 12)]]
     [:div {:style {:margin "6px 0" :font-size "0.9em"}} (:content w)]
     [decay-bar (:decay w) (:stratum w)]
     [:div {:style {:display "flex" :gap "4px" :margin-top "6px"}}
      (when (> (:sid w) 1)
        [:button {:on-click #(demote! (:hash w))
                  :style {:padding "2px 8px" :border "none" :background "#e0e0e0" :cursor "pointer"}}
         "↓"])
      (when (< (:sid w) 4)
        [:button {:on-click #(promote! (:hash w))
                  :style {:padding "2px 8px" :border "none" :background "#e0e0e0" :cursor "pointer"}}
         "↑"])
      [:button {:on-click #(forget! (:hash w))
                :style {:padding "2px 8px" :border "none" :background "#e0e0e0" :cursor "pointer"}}
       "×"]]]))

(defn stratum-bar []
  (let [ws (get-in @state [:volatile :witnesses])]
    [:div {:style {:display "flex" :height "28px" :margin "12px 0"}}
     (for [s strata]
       (let [cnt (count (filter #(= (:stratum %) (:k s)) ws))]
         ^{:key (:id s)}
         [:div {:style {:flex 1 :background (:bg s) :color (:fg s)
                        :display "flex" :align-items "center" :justify-content "center"
                        :font-size "0.7em" :font-weight 600}
                :title (str (:label s) ": " cnt)}
          (:id s)
          (when (pos? cnt)
            [:span {:style {:margin-left "4px" :background "rgba(0,0,0,0.2)"
                            :padding "1px 5px" :border-radius "3px"}} cnt])]))]))

(defn witness-input []
  (let [val (r/atom "")
        sel (r/atom :volatile)]
    (fn []
      [:div {:style {:display "flex" :gap "6px" :flex-wrap "wrap"}}
       [:input {:value @val
                :placeholder "Enter datum..."
                :on-change #(reset! val (-> % .-target .-value))
                :on-key-down #(when (and (= (.-key %) "Enter") (seq @val))
                                (witness! @val @sel)
                                (reset! val ""))
                :style {:flex 1 :min-width "200px" :padding "8px" :border "1px solid #ccc"
                        :font-family "monospace"}}]
       [:select {:value (name @sel)
                 :on-change #(reset! sel (keyword (-> % .-target .-value)))
                 :style {:padding "8px" :border "1px solid #ccc"}}
        (for [s (take 4 strata)]
          ^{:key (:id s)}
          [:option {:value (name (:k s))} (str (:id s) ". " (:label s))])]
       [:button {:on-click #(when (seq @val) (witness! @val @sel) (reset! val ""))
                 :style {:padding "8px 16px" :background "#22c55e" :border "none"
                         :font-weight 600 :cursor "pointer"}}
        "Witness"]])))

(defn ephemeral-panel []
  (let [{:keys [mouse tick]} (:ephemeral @state)]
    [:div {:style {:background "#f8f8f8" :border "1px solid #e0e0e0" :padding "12px"}}
     [:div {:style {:display "flex" :gap "8px" :align-items "center" :margin-bottom "8px"
                    :border-bottom "1px solid #ddd" :padding-bottom "8px"}}
      [badge :ephemeral]
      [:span {:style {:font-weight 600}} "Ephemeral"]
      [:span {:style {:color "#888" :margin-left "auto" :font-size "0.8em"}} "recomputed, never stored"]]
     [:div {:style {:font-size "0.85em"}}
      [:div {:style {:display "flex" :justify-content "space-between" :padding "4px 0" :border-bottom "1px dotted #ddd"}}
       [:span {:style {:color "#666"}} "Mouse"]
       [:span {:style {:font-family "monospace"}} (str mouse)]]
      [:div {:style {:display "flex" :justify-content "space-between" :padding "4px 0" :border-bottom "1px dotted #ddd"}}
       [:span {:style {:color "#666"}} "Tick"]
       [:span {:style {:font-family "monospace"}} tick]]
      [:div {:style {:display "flex" :justify-content "space-between" :padding "4px 0"}}
       [:span {:style {:color "#666"}} "Now"]
       [:span {:style {:font-family "monospace"}} (.toLocaleTimeString (js/Date.))]]]]))

(defn volatile-panel []
  (let [{:keys [scratch witnesses]} (:volatile @state)]
    [:div {:style {:background "#f8f8f8" :border "1px solid #e0e0e0" :padding "12px"}}
     [:div {:style {:display "flex" :gap "8px" :align-items "center" :margin-bottom "8px"
                    :border-bottom "1px solid #ddd" :padding-bottom "8px"}}
      [badge :volatile]
      [:span {:style {:font-weight 600}} "Volatile"]
      [:span {:style {:color "#888" :margin-left "auto" :font-size "0.8em"}} (str (count witnesses) " in memory")]]
     [:div
      [:textarea {:value scratch
                  :placeholder "Scratch pad (lost on refresh)..."
                  :on-change #(swap! state assoc-in [:volatile :scratch] (-> % .-target .-value))
                  :style {:width "100%" :height "50px" :padding "8px" :border "1px solid #ccc"
                          :font-family "monospace" :font-size "0.85em" :resize "vertical"}}]
      [:div {:style {:max-height "200px" :overflow-y "auto" :margin-top "8px"}}
       (if (seq witnesses)
         (for [w (reverse witnesses)]
           ^{:key (:hash w)}
           [witness-card w])
         [:div {:style {:color "#888" :font-style "italic" :text-align "center" :padding "16px"}}
          "No witnesses yet"])]]]))

(defn session-panel []
  (let [{:keys [promoted count start]} (:session @state)
        up (- (now) start)]
    [:div {:style {:background "#f8f8f8" :border "1px solid #e0e0e0" :padding "12px"}}
     [:div {:style {:display "flex" :gap "8px" :align-items "center" :margin-bottom "8px"
                    :border-bottom "1px solid #ddd" :padding-bottom "8px"}}
      [badge :session]
      [:span {:style {:font-weight 600}} "Session"]
      [:span {:style {:color "#888" :margin-left "auto" :font-size "0.8em"}} "sessionStorage"]]
     [:div {:style {:display "grid" :grid-template-columns "1fr 1fr 1fr" :gap "8px" :text-align "center"}}
      [:div {:style {:padding "8px" :background "rgba(0,0,0,0.03)"}}
       [:div {:style {:font-size "1.3em" :font-weight 600}} count]
       [:div {:style {:font-size "0.75em" :color "#888"}} "witnessed"]]
      [:div {:style {:padding "8px" :background "rgba(0,0,0,0.03)"}}
       [:div {:style {:font-size "1.3em" :font-weight 600}} (count promoted)]
       [:div {:style {:font-size "0.75em" :color "#888"}} "promoted"]]
      [:div {:style {:padding "8px" :background "rgba(0,0,0,0.03)"}}
       [:div {:style {:font-size "1.3em" :font-weight 600}} (str (quot up 60000) "m")]
       [:div {:style {:font-size "0.75em" :color "#888"}} "uptime"]]]
     (when (seq promoted)
       [:div {:style {:margin-top "12px"}}
        [:div {:style {:font-size "0.8em" :color "#666" :margin-bottom "4px"}} "Promoted:"]
        (for [p (take 3 promoted)]
          ^{:key (:hash p)}
          [:div {:style {:display "flex" :gap "6px" :align-items "center" :font-size "0.85em"
                         :padding "4px 0" :border-bottom "1px dotted #ddd"}}
           [badge (:stratum p)]
           [:span {:style {:overflow "hidden" :text-overflow "ellipsis" :white-space "nowrap"}}
            (:content p)]])])]))

(defn local-panel []
  (let [{:keys [visits prefs]} (:local @state)]
    [:div {:style {:background "#f8f8f8" :border "1px solid #e0e0e0" :padding "12px"}}
     [:div {:style {:display "flex" :gap "8px" :align-items "center" :margin-bottom "8px"
                    :border-bottom "1px solid #ddd" :padding-bottom "8px"}}
      [badge :local]
      [:span {:style {:font-weight 600}} "Local"]
      [:span {:style {:color "#888" :margin-left "auto" :font-size "0.8em"}} "localStorage"]]
     [:div {:style {:font-size "0.85em"}}
      [:div {:style {:display "flex" :justify-content "space-between" :padding "4px 0" :border-bottom "1px dotted #ddd"}}
       [:span {:style {:color "#666"}} "Visits"]
       [:span {:style {:font-family "monospace"}} visits]]
      [:div {:style {:margin-top "8px"}}
       [:div {:style {:font-size "0.8em" :color "#666" :margin-bottom "4px"}} "Preferences:"]
       [:label {:style {:display "flex" :gap "6px" :align-items "center" :padding "4px 0" :cursor "pointer"}}
        [:input {:type "checkbox" :checked (:dark prefs)
                 :on-change #(swap! state update-in [:local :prefs :dark] not)}]
        "Dark panels"]
       [:label {:style {:display "flex" :gap "6px" :align-items "center" :padding "4px 0" :cursor "pointer"}}
        [:input {:type "checkbox" :checked (:show-eph prefs)
                 :on-change #(swap! state update-in [:local :prefs :show-eph] not)}]
        "Show ephemeral"]]]]))

(defn event-log []
  (let [events (get-in @state [:volatile :log])]
    [:div {:style {:margin-top "16px"}}
     [:div {:style {:font-size "0.9em" :font-weight 600 :margin-bottom "8px"}}
      "Event Log " [:span {:style {:color "#888" :font-weight "normal"}} (str "(" (count events) ")")]]
     [:div {:style {:max-height "150px" :overflow-y "auto" :font-size "0.75em" :font-family "monospace"}}
      (for [e (take 10 events)]
        ^{:key (:id e)}
        [:div {:style {:display "flex" :gap "8px" :padding "3px 0" :border-bottom "1px solid #eee"}}
         [:span {:style {:color "#888" :width "40px"}} (ago (:at e))]
         [:span {:style {:width "50px" :color (case (:t e)
                                                :witness "#22c55e"
                                                :promote "#60a5fa"
                                                :demote "#f59e0b"
                                                :decay "#ef4444"
                                                "#888")}}
          (name (:t e))]
         [:span {:style {:color "#666"}} (pr-str (:d e))]])]]))

(defn app []
  (let [prefs (get-in @state [:local :prefs])]
    [:div {:style {:font-size "small" :line-height 1.6}
           :on-mouse-move #(swap! state assoc-in [:ephemeral :mouse]
                                  [(.-clientX %) (.-clientY %)])}
     [:header
      [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
       [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#22c55e"
                       :animation "pulse 2s infinite"}}]
       [:h1 {:style {:font-size "1.4em" :margin 0}} "Fold/Unfold"]]
      [:p {:style {:color "#666" :margin "4px 0"}} "7-Strata Permanence Gradient"]]

     [stratum-bar]

     [:div {:style {:margin "16px 0" :padding-left "12px"
                    :border-left "3px solid #2d5016" :color "#2d5016" :font-weight 600}}
      "All data has duration."]
     [:div {:style {:margin "8px 0" :padding-left "12px"
                    :border-left "3px solid #4a6741" :color "#4a6741"}}
      "Binary thinking (transient vs permanent) loses the middle."]
     [:div {:style {:margin "8px 0" :padding-left "12px"
                    :border-left "3px solid #7d8a70" :color "#7d8a70" :font-style "italic"}}
      "A 7-level gradient captures the full spectrum."]

     [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "20px 0"}}]

     [:div {:style {:display "flex" :align-items "center" :gap "8px" :margin-bottom "12px"}}
      [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#22c55e"}}]
      [:h2 {:style {:font-size "1.1em" :margin 0}} "Live Demonstration"]
      [:span {:style {:color "#22c55e" :font-size "0.85em"}} "Active"]]

     [witness-input]
     [:p {:style {:font-size "0.85em" :color "#888" :margin "8px 0"}}
      "Create witnesses at different strata. Watch decay. Promote to persist longer."]

     [:div {:style {:display "grid" :grid-template-columns "repeat(auto-fit, minmax(280px, 1fr))"
                    :gap "12px" :margin "16px 0"}}
      (when (:show-eph prefs) [ephemeral-panel])
      [volatile-panel]
      [session-panel]
      [local-panel]]

     [event-log]

     [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
      [:p "Refresh to clear volatile. Close tab to clear session. Clear browser data to reset local."]
      [:p [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back to Computational Work"]]]]))

;; === MOUNT ===

(swap! state update-in [:local :visits] inc)
(rdom/render [app] (js/document.getElementById "app"))
</script>

<style>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
