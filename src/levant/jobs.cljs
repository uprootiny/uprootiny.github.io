(ns levant.jobs
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]
            [ajax.core :refer [GET]]
            [hickory.core :as h]
            [hickory.select :as s]
            [clojure.string :as str]))

;; ============================================================================
;; State
;; ============================================================================

(defonce state
  (r/atom {:jobs []
           :loading? false
           :error nil
           :filter {:source nil
                    :search ""}}))

;; ============================================================================
;; Job Sources Configuration
;; ============================================================================

(def sources
  [{:id :bezalel
    :name "Bezalel Academy"
    :url "https://www.bezalel.ac.il/services/wrk4stud"
    :description "Jobs for art students and graduates"
    :region "Jerusalem"}

   {:id :icom
    :name "ICOM Israel Museums"
    :url "https://www.icom.org.il/en/node/8"
    :description "Museum jobs bulletin board"
    :region "Nationwide"}

   {:id :drushim-art
    :name "Drushim.co.il - Art"
    :url "https://www.drushim.co.il/jobs/search/אמנות/"
    :description "General job board, art category"
    :region "Nationwide"}

   {:id :taasiya-art
    :name "Taasiya - Visual Arts"
    :url "https://www.taasiya.co.il/jobs/?category=946&sub_category=951"
    :description "Plastic arts, painting, sculpture"
    :region "Nationwide"}

   {:id :muvtal
    :name "Muvtal - Arts & Culture"
    :url "https://www.muvtal.co.il/jobs?filter_categories=25"
    :description "Entertainment and culture jobs"
    :region "Nationwide"}])

;; ============================================================================
;; CORS Proxy
;; ============================================================================

(defn cors-url [url]
  (str "https://api.allorigins.win/raw?url=" (js/encodeURIComponent url)))

;; ============================================================================
;; Parsers for Different Sites
;; ============================================================================

(defmulti parse-jobs :id)

(defmethod parse-jobs :default [{:keys [name]}]
  ;; Default: return link to source
  [{:title (str "View jobs at " name)
    :organization name
    :link nil
    :type :link-only}])

(defmethod parse-jobs :bezalel [_source html]
  (let [parsed (-> html h/parse h/as-hickory)
        ;; Bezalel uses article or div elements for job listings
        job-elements (s/select (s/class "job-item") parsed)]
    (if (empty? job-elements)
      ;; Fallback: extract text content
      [{:title "Multiple positions available"
        :organization "Bezalel Academy"
        :location "Jerusalem"
        :type :summary}]
      (map (fn [el]
             {:title (-> (s/select (s/tag :h3) el) first :content first str)
              :organization "Bezalel Academy"
              :location "Jerusalem"})
           job-elements))))

(defmethod parse-jobs :icom [_source html]
  (let [parsed (-> html h/parse h/as-hickory)
        ;; ICOM uses table or list for job listings
        rows (s/select (s/tag :tr) parsed)]
    (if (< (count rows) 2)
      [{:title "Museum jobs - visit site for current listings"
        :organization "ICOM Israel"
        :type :summary}]
      (->> rows
           rest  ; skip header
           (take 10)
           (map (fn [row]
                  (let [cells (s/select (s/tag :td) row)
                        text-content #(-> % :content first str str/trim)]
                    {:title (text-content (first cells))
                     :organization (text-content (second cells))
                     :location (text-content (nth cells 2 nil))})))
           (filter #(not (str/blank? (:title %))))))))

;; ============================================================================
;; Fetching
;; ============================================================================

(defn fetch-source! [{:keys [id url] :as source}]
  (swap! state assoc :loading? true :error nil)
  (GET (cors-url url)
    {:handler (fn [response]
                (let [jobs (try
                             (parse-jobs source response)
                             (catch :default e
                               (js/console.error "Parse error:" e)
                               [{:title "Error parsing - visit source directly"
                                 :type :error}]))]
                  (swap! state update :jobs concat
                         (map #(assoc % :source-id id :source-name (:name source))
                              jobs))
                  (swap! state assoc :loading? false)))
     :error-handler (fn [error]
                      (js/console.error "Fetch error:" error)
                      (swap! state assoc
                             :loading? false
                             :error (str "Failed to fetch " (:name source))))}))

(defn fetch-all-sources! []
  (swap! state assoc :jobs [] :loading? true)
  (doseq [source sources]
    (fetch-source! source)))

;; ============================================================================
;; Filtering
;; ============================================================================

(defn filter-jobs [jobs {:keys [source search]}]
  (cond->> jobs
    source (filter #(= (:source-id %) source))
    (not (str/blank? search))
    (filter #(or (str/includes? (str/lower-case (or (:title %) ""))
                                (str/lower-case search))
                 (str/includes? (str/lower-case (or (:organization %) ""))
                                (str/lower-case search))))))

;; ============================================================================
;; Components
;; ============================================================================

(defn source-link [{:keys [name url description region]}]
  [:a.source-card {:href url :target "_blank" :rel "noopener"}
   [:div.source-name name]
   [:div.source-region region]
   [:div.source-desc description]])

(defn source-links []
  [:div.source-grid
   (for [src sources]
     ^{:key (:id src)}
     [source-link src])])

(defn job-card [{:keys [title organization location source-name type]}]
  [:div.job-card {:class (name (or type :job))}
   [:div.job-title title]
   (when organization
     [:div.job-org organization])
   (when location
     [:div.job-location location])
   [:div.job-source (str "via " source-name)]])

(defn filters-panel []
  (let [{:keys [filter]} @state]
    [:div.filters
     [:div.filter-group
      [:label "Search"]
      [:input {:type "text"
               :placeholder "Search jobs..."
               :value (:search filter)
               :on-change #(swap! state assoc-in [:filter :search]
                                  (-> % .-target .-value))}]]
     [:div.filter-group
      [:label "Source"]
      [:select {:value (or (:source filter) "")
                :on-change #(swap! state assoc-in [:filter :source]
                                   (let [v (-> % .-target .-value)]
                                     (when-not (str/blank? v)
                                       (keyword v))))}
       [:option {:value ""} "All sources"]
       (for [{:keys [id name]} sources]
         ^{:key id}
         [:option {:value (clojure.core/name id)} name])]]
     [:button.refresh-btn {:on-click fetch-all-sources!}
      "Refresh"]]))

(defn job-list []
  (let [{:keys [jobs loading? error filter]} @state
        filtered (filter-jobs jobs filter)]
    [:div.job-list
     (when loading?
       [:div.loading "Loading jobs..."])
     (when error
       [:div.error error])
     (if (empty? filtered)
       [:div.empty "No jobs found. Click Refresh to fetch latest listings."]
       (for [[idx job] (map-indexed vector filtered)]
         ^{:key idx}
         [job-card job]))]))

(defn app []
  [:div.levant-jobs
   [:h2 "Live Job Listings"]
   [:p.subtitle "Scraped from Israeli art & culture job boards"]

   [:h3 "Quick Links"]
   [source-links]

   [:h3 "Aggregated Listings"]
   [filters-panel]
   [job-list]

   [:p.disclaimer
    "Data fetched via CORS proxy. For authoritative listings, visit sources directly."]])

;; ============================================================================
;; Init
;; ============================================================================

(defn init! []
  (when-let [el (js/document.getElementById "levant-jobs-app")]
    (rdom/render [app] el)
    ;; Auto-fetch on load
    (js/setTimeout fetch-all-sources! 500)))
