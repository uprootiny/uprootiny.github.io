---
layout: text
title: "Nidra: Payment Rails Walkthrough"
permalink: /computational/nidra/
---

<div id="app"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/scittle@0.6.15/dist/scittle.reagent.js"></script>

<script type="application/x-scittle">
(ns nidra.core
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]))

;; Payment Rails Walkthrough
;; Trace the full flow: setup → product → checkout → webhook → access
;; Both buyer and seller perspectives

(defonce state
  (r/atom {:step 0
           :mode :test
           :config {:api-base "http://173.212.203.211:8090"
                    :stripe-pk ""
                    :connected false}
           :product {:name "Digital Artifact"
                     :price 24
                     :currency "EUR"
                     :resource "artifact:001"}
           :checkout {:session-id nil
                      :url nil
                      :status :idle}
           :webhook {:events []}
           :access {:grants []
                    :token nil
                    :verified nil}
           :log []}))

(defn log! [category msg]
  (swap! state update :log
         #(vec (take 50 (cons {:at (js/Date.now)
                               :category category
                               :msg msg} %)))))

(defn api-call [method path body on-success on-error]
  (let [base (get-in @state [:config :api-base])
        opts (cond-> {:method method
                      :headers {"Content-Type" "application/json"}}
               body (assoc :body (js/JSON.stringify (clj->js body))))]
    (log! :api (str method " " path))
    (-> (js/fetch (str base path) (clj->js opts))
        (.then #(.json %))
        (.then (fn [data]
                 (let [d (js->clj data :keywordize-keys true)]
                   (log! :response (pr-str d))
                   (on-success d))))
        (.catch (fn [e]
                  (log! :error (.-message e))
                  (when on-error (on-error e)))))))

;; Step components

(defn step-indicator [n label active?]
  [:div {:style {:display "flex" :align-items "center" :gap "8px"
                 :opacity (if active? 1 0.4)
                 :margin "4px 0"}}
   [:div {:style {:width "24px" :height "24px" :border-radius "50%"
                  :background (if active? "#22c55e" "#ddd")
                  :color (if active? "#fff" "#888")
                  :display "flex" :align-items "center" :justify-content "center"
                  :font-size "0.8em" :font-weight 600}}
    n]
   [:span {:style {:font-size "0.9em" :color (if active? "#000" "#888")}} label]])

(defn mode-toggle []
  [:div {:style {:display "flex" :gap "8px" :margin "12px 0"}}
   (for [[m label color] [[:test "Test Mode" "#f59e0b"]
                          [:live "Live Mode" "#ef4444"]]]
     ^{:key m}
     [:button {:on-click #(swap! state assoc :mode m)
               :style {:padding "6px 12px"
                       :background (if (= (:mode @state) m) color "#eee")
                       :color (if (= (:mode @state) m) "#fff" "#666")
                       :border "none" :cursor "pointer"
                       :font-family "inherit"}}
      label])])

(defn step-0-setup []
  [:div {:style {:padding "16px" :background "#f8f8f8" :margin "12px 0"}}
   [:h3 {:style {:margin "0 0 12px 0" :font-size "1em"}} "Step 0: Configuration"]
   [:div {:style {:font-size "0.85em" :color "#666" :margin-bottom "12px"}}
    "Set up your backend URL and API keys. Test mode uses Stripe test keys."]

   [:div {:style {:margin "8px 0"}}
    [:label {:style {:display "block" :font-size "0.8em" :color "#888"}} "Backend URL"]
    [:input {:value (get-in @state [:config :api-base])
             :on-change #(swap! state assoc-in [:config :api-base] (-> % .-target .-value))
             :style {:width "100%" :padding "8px" :border "1px solid #ddd"
                     :font-family "monospace"}}]]

   [:div {:style {:margin "8px 0"}}
    [:label {:style {:display "block" :font-size "0.8em" :color "#888"}}
     "Stripe Publishable Key (optional for frontend)"]
    [:input {:value (get-in @state [:config :stripe-pk])
             :on-change #(swap! state assoc-in [:config :stripe-pk] (-> % .-target .-value))
             :placeholder "pk_test_..."
             :style {:width "100%" :padding "8px" :border "1px solid #ddd"
                     :font-family "monospace"}}]]

   [:button {:on-click (fn []
                         (api-call "GET" "/health" nil
                                   (fn [_]
                                     (swap! state assoc-in [:config :connected] true)
                                     (log! :system "Connected to backend"))
                                   (fn [_]
                                     (swap! state assoc-in [:config :connected] false))))
             :style {:margin-top "8px" :padding "8px 16px" :background "#22c55e"
                     :color "#fff" :border "none" :cursor "pointer"}}
    "Test Connection"]

   (when (get-in @state [:config :connected])
     [:div {:style {:margin-top "8px" :color "#22c55e" :font-size "0.9em"}}
      "✓ Backend connected"])])

(defn step-1-product []
  [:div {:style {:padding "16px" :background "#f8f8f8" :margin "12px 0"}}
   [:h3 {:style {:margin "0 0 12px 0" :font-size "1em"}} "Step 1: Define Product"]
   [:div {:style {:font-size "0.85em" :color "#666" :margin-bottom "12px"}}
    "Seller creates a product/price in Stripe (or use existing price IDs)."]

   [:div {:style {:display "grid" :grid-template-columns "1fr 1fr" :gap "8px"}}
    [:div
     [:label {:style {:display "block" :font-size "0.8em" :color "#888"}} "Product Name"]
     [:input {:value (get-in @state [:product :name])
              :on-change #(swap! state assoc-in [:product :name] (-> % .-target .-value))
              :style {:width "100%" :padding "8px" :border "1px solid #ddd"}}]]
    [:div
     [:label {:style {:display "block" :font-size "0.8em" :color "#888"}} "Price (cents)"]
     [:input {:type "number"
              :value (get-in @state [:product :price])
              :on-change #(swap! state assoc-in [:product :price] (js/parseInt (-> % .-target .-value)))
              :style {:width "100%" :padding "8px" :border "1px solid #ddd"}}]]
    [:div
     [:label {:style {:display "block" :font-size "0.8em" :color "#888"}} "Currency"]
     [:select {:value (get-in @state [:product :currency])
               :on-change #(swap! state assoc-in [:product :currency] (-> % .-target .-value))
               :style {:width "100%" :padding "8px" :border "1px solid #ddd"}}
      [:option {:value "EUR"} "EUR"]
      [:option {:value "USD"} "USD"]]]
    [:div
     [:label {:style {:display "block" :font-size "0.8em" :color "#888"}} "Resource ID"]
     [:input {:value (get-in @state [:product :resource])
              :on-change #(swap! state assoc-in [:product :resource] (-> % .-target .-value))
              :style {:width "100%" :padding "8px" :border "1px solid #ddd"
                      :font-family "monospace"}}]]]

   [:div {:style {:margin-top "12px" :padding "12px" :background "#1a1a1a" :color "#e0e0e0"
                  :font-family "monospace" :font-size "0.8em"}}
    [:div {:style {:color "#888"}} "Stripe API call (server-side):"]
    [:pre {:style {:margin "4px 0" :white-space "pre-wrap"}}
     (str "POST /v1/products\n"
          "  name: \"" (get-in @state [:product :name]) "\"\n\n"
          "POST /v1/prices\n"
          "  unit_amount: " (* 100 (get-in @state [:product :price])) "\n"
          "  currency: \"" (get-in @state [:product :currency]) "\"")]]])

(defn step-2-checkout []
  [:div {:style {:padding "16px" :background "#f8f8f8" :margin "12px 0"}}
   [:h3 {:style {:margin "0 0 12px 0" :font-size "1em"}} "Step 2: Create Checkout"]
   [:div {:style {:font-size "0.85em" :color "#666" :margin-bottom "12px"}}
    "Buyer initiates payment. Server creates Stripe Checkout session."]

   [:div {:style {:display "flex" :gap "8px"}}
    [:button {:on-click (fn []
                          (swap! state assoc-in [:checkout :status] :creating)
                          (api-call "POST" "/api/stripe/checkout"
                                    {:price-id (get-in @state [:product :resource])
                                     :mode "payment"
                                     :resource (get-in @state [:product :resource])}
                                    (fn [resp]
                                      (swap! state update :checkout merge
                                             {:status :created
                                              :session-id (:session-id resp)
                                              :url (:url resp)}))
                                    (fn [_]
                                      (swap! state assoc-in [:checkout :status] :error))))
              :style {:padding "8px 16px" :background "#60a5fa" :color "#fff"
                      :border "none" :cursor "pointer"}}
     "Create Stripe Session"]

    [:button {:on-click (fn []
                          (swap! state assoc-in [:checkout :status] :creating)
                          (api-call "POST" "/api/crypto/charge"
                                    {:name (get-in @state [:product :name])
                                     :amount (get-in @state [:product :price])
                                     :currency (get-in @state [:product :currency])
                                     :resource (get-in @state [:product :resource])}
                                    (fn [resp]
                                      (swap! state update :checkout merge
                                             {:status :created
                                              :url (:hosted-url resp)
                                              :code (:code resp)}))
                                    nil))
              :style {:padding "8px 16px" :background "#f7931a" :color "#fff"
                      :border "none" :cursor "pointer"}}
     "Create Crypto Charge"]]

   (when-let [url (get-in @state [:checkout :url])]
     [:div {:style {:margin-top "12px"}}
      [:div {:style {:font-size "0.85em" :color "#666"}} "Checkout URL:"]
      [:a {:href url :target "_blank"
           :style {:font-family "monospace" :font-size "0.85em" :color "#2563eb"}}
       (subs url 0 (min 60 (count url))) "..."]
      [:div {:style {:margin-top "8px"}}
       [:button {:on-click #(set! js/window.location.href url)
                 :style {:padding "10px 20px" :background "#22c55e" :color "#fff"
                         :border "none" :cursor "pointer" :font-weight 600}}
        "→ Open Checkout (Buyer View)"]]])])

(defn step-3-webhook []
  [:div {:style {:padding "16px" :background "#f8f8f8" :margin "12px 0"}}
   [:h3 {:style {:margin "0 0 12px 0" :font-size "1em"}} "Step 3: Webhook Events"]
   [:div {:style {:font-size "0.85em" :color "#666" :margin-bottom "12px"}}
    "After payment, Stripe/Coinbase sends webhook. Server verifies signature and processes."]

   [:div {:style {:padding "12px" :background "#1a1a1a" :color "#e0e0e0"
                  :font-family "monospace" :font-size "0.8em"}}
    [:div {:style {:color "#888"}} "Webhook flow:"]
    [:pre {:style {:margin "8px 0" :white-space "pre-wrap"}}
     "1. POST /api/stripe/webhook\n"
     "   Headers: stripe-signature: t=...,v1=...\n"
     "   Body: {type: 'checkout.session.completed', ...}\n\n"
     "2. Verify HMAC signature\n"
     "3. Parse event, extract customer/metadata\n"
     "4. Grant access to resource"]]

   [:div {:style {:margin-top "12px" :padding "12px" :background "#dcfce7"
                  :border-left "3px solid #22c55e"}}
    [:div {:style {:font-weight 600 :margin-bottom "4px"}} "Simulate Webhook (for testing)"]
    [:button {:on-click (fn []
                          (api-call "POST" "/api/access/token"
                                    {:identity "test@example.com"
                                     :resource (get-in @state [:product :resource])
                                     :tier "subscription"}
                                    (fn [resp]
                                      (swap! state update :webhook
                                             update :events conj
                                             {:type "checkout.session.completed"
                                              :at (js/Date.now)})
                                      (swap! state assoc-in [:access :token] (:token resp))
                                      (swap! state update :access
                                             update :grants conj (:grant resp)))
                                    nil))
              :style {:padding "8px 16px" :background "#22c55e" :color "#fff"
                      :border "none" :cursor "pointer" :margin-top "4px"}}
     "Simulate Successful Payment"]]])

(defn step-4-access []
  [:div {:style {:padding "16px" :background "#f8f8f8" :margin "12px 0"}}
   [:h3 {:style {:margin "0 0 12px 0" :font-size "1em"}} "Step 4: Access Verification"]
   [:div {:style {:font-size "0.85em" :color "#666" :margin-bottom "12px"}}
    "Client uses JWT token to access protected resources."]

   (when-let [token (get-in @state [:access :token])]
     [:div {:style {:margin-bottom "12px"}}
      [:div {:style {:font-size "0.8em" :color "#888"}} "Access Token:"]
      [:div {:style {:font-family "monospace" :font-size "0.75em" :word-break "break-all"
                     :padding "8px" :background "#fff" :border "1px solid #ddd"}}
       token]])

   [:div {:style {:display "flex" :gap "8px"}}
    [:button {:on-click (fn []
                          (when-let [token (get-in @state [:access :token])]
                            (api-call "GET" (str "/api/access/check?token=" token
                                                 "&resource=" (get-in @state [:product :resource]))
                                      nil
                                      (fn [resp]
                                        (swap! state assoc-in [:access :verified] resp))
                                      nil)))
              :disabled (nil? (get-in @state [:access :token]))
              :style {:padding "8px 16px" :background "#2563eb" :color "#fff"
                      :border "none" :cursor "pointer"
                      :opacity (if (get-in @state [:access :token]) 1 0.5)}}
     "Verify Token"]

    [:button {:on-click #(api-call "GET" "/api/access/grants?identity=test@example.com" nil
                                   (fn [resp]
                                     (swap! state assoc-in [:access :grants] (:grants resp)))
                                   nil)
              :style {:padding "8px 16px" :background "#888" :color "#fff"
                      :border "none" :cursor "pointer"}}
     "List Grants"]]

   (when-let [verified (get-in @state [:access :verified])]
     [:div {:style {:margin-top "12px" :padding "12px"
                    :background (if (:access verified) "#dcfce7" "#fee2e2")
                    :border-left (str "3px solid " (if (:access verified) "#22c55e" "#ef4444"))}}
      [:div {:style {:font-weight 600}}
       (if (:access verified) "✓ Access Granted" "✗ Access Denied")]
      (when (:claims verified)
        [:pre {:style {:font-size "0.8em" :margin-top "8px"}}
         (js/JSON.stringify (clj->js (:claims verified)) nil 2)])])

   (when (seq (get-in @state [:access :grants]))
     [:div {:style {:margin-top "12px"}}
      [:div {:style {:font-size "0.85em" :color "#666" :margin-bottom "4px"}} "Active Grants:"]
      (for [g (get-in @state [:access :grants])]
        ^{:key (:id g)}
        [:div {:style {:padding "8px" :background "#fff" :border "1px solid #ddd"
                       :margin "4px 0" :font-size "0.85em"}}
         [:span {:style {:font-weight 600}} (:resource g)]
         [:span {:style {:color "#888" :margin-left "8px"}} (str "(" (name (:tier g)) ")")]])])])

(defn event-log []
  [:div {:style {:margin-top "24px"}}
   [:h3 {:style {:font-size "0.9em" :color "#888" :margin-bottom "8px"}}
    "Event Log (" (count (:log @state)) ")"]
   [:div {:style {:max-height "200px" :overflow-y "auto" :background "#1a1a1a"
                  :padding "8px" :font-family "monospace" :font-size "0.75em"}}
    (for [[i entry] (map-indexed vector (:log @state))]
      ^{:key i}
      [:div {:style {:padding "2px 0" :border-bottom "1px solid #333"}}
       [:span {:style {:color (case (:category entry)
                                :api "#60a5fa"
                                :response "#22c55e"
                                :error "#ef4444"
                                :system "#f59e0b"
                                "#888")}}
        (str "[" (name (:category entry)) "] ")]
       [:span {:style {:color "#e0e0e0"}} (:msg entry)]])]])

(defn app []
  (let [step (:step @state)]
    [:div {:style {:font-size "small" :line-height 1.6}}
     [:header
      [:div {:style {:display "flex" :align-items "center" :gap "8px"}}
       [:span {:style {:width "8px" :height "8px" :border-radius "50%" :background "#000"}}]
       [:h1 {:style {:font-size "1.4em" :margin 0}} "Nidra"]]
      [:p {:style {:color "#666" :margin "4px 0"}} "Payment Rails Walkthrough"]]

     [:hr {:style {:border "none" :border-top "1px solid #ddd" :margin "16px 0"}}]

     [:div {:style {:padding-left "12px" :border-left "3px solid #2d5016" :color "#2d5016"
                    :font-weight 600 :margin "12px 0"}}
      "Trace the full payment flow. Both buyer and seller perspectives."]

     [mode-toggle]

     [:div {:style {:display "flex" :gap "24px"}}
      [:div {:style {:width "200px"}}
       [step-indicator 0 "Setup" true]
       [step-indicator 1 "Product" (get-in @state [:config :connected])]
       [step-indicator 2 "Checkout" (get-in @state [:config :connected])]
       [step-indicator 3 "Webhook" (get-in @state [:checkout :url])]
       [step-indicator 4 "Access" (seq (get-in @state [:webhook :events]))]]

      [:div {:style {:flex 1}}
       [step-0-setup]
       (when (get-in @state [:config :connected])
         [:<>
          [step-1-product]
          [step-2-checkout]
          [step-3-webhook]
          [step-4-access]])]]

     [event-log]

     [:footer {:style {:text-align "center" :color "#888" :margin-top "24px" :font-size "0.85em"}}
      [:a {:href "/computational/" :style {:color "#553c9a"}} "← Back"]]]))

(rdom/render [app] (js/document.getElementById "app"))
</script>
