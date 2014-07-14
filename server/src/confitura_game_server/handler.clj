(ns confitura-game-server.handler
  (:require [compojure.core :refer :all]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [clj-time.local :as l]
            [clj-time.coerce :as c]
            [ring.middleware.json :refer :all]
            [clj-json.core :as json]
            [clostache.parser :as clostache]
            [monger.core :as mg]
            [monger.collection :as mc]
            [monger.joda-time]
            [monger.query :refer :all :as mq]
            [taoensso.timbre :as timbre]
            [schema.core :as s]
            [ring.util.codec :as rc]
            )
  (:import  [com.mongodb MongoOptions ServerAddress]
            [org.bson.types ObjectId]
            [com.mongodb DB WriteConcern]))

(timbre/refer-timbre) ; Provides useful Timbre aliases in this ns


(def production?
  (= "production" (get (System/getenv) "APP_ENV")))

(def development?
  (not production?))

(def Data
  "Input data schema"
  {:uid s/Str
   :time long
   :score s/Int})

(def conn (mg/connect))

(defn allow-cross-origin
  "middleware function to allow crosss origin"
  [handler]
  (fn [request]
   (let [response (handler request)]
    (assoc-in (assoc-in response [:headers "Access-Control-Allow-Origin"] "*") [:headers "Access-Control-Allow-Headers"] "Content-Type")
     )))

(defn insert-score-to-mongo
  [data]
  (let [db   (mg/get-db conn "monger-test")]

    (mc/upsert db "scoreboard" {:uid (str (get data "score") (rc/url-decode (get data "uid")))} {:uid (rc/url-decode (get data "uid")) :time (c/from-long (long (get data "time"))) :score (get data "score")})
    ))

(defn get-top-scores
  []
  (let [db   (mg/get-db conn "monger-test")
        coll "scoreboard"]
    (mq/with-collection db coll
      (find {})
      ;(fields [:score :name])
      ;; it is VERY IMPORTANT to use array maps with sort
      (sort (array-map :score -1))
      (mq/limit 10)
      )
    ))

(defn render-dashboard
  []
  (info (get-top-scores))
  (clostache/render-resource "templates/dashboard.html" {:top (get-top-scores) :current-date (l/local-now)}))

(defn json-response [data & [status]]
  {:status (or status 200)
   :headers {"Content-Type" "application/json"}
   :body (json/generate-string data)})

(defn index-page
  [request]
  (render-dashboard)
  )

;(defn validate-input [input]
;  (throw (Exception. "invalid data"))
;  )

(defroutes app-routes
  (GET "/" request (index-page request))
  (OPTIONS "/score" request (json-response []))
  (POST "/score" {body :body}
        (info body)
        ;(validate-input body)
        ;(s/validate Data body)
        (insert-score-to-mongo body)
        (json-response body))
  (route/resources "/")
  (route/not-found "Not Found"))


(defn wrap-if [handler pred wrapper & args]
  (if pred
    (apply wrapper handler args)
    handler))

(defn wrap-failsafe [handler]
  (fn [req]
    (try
      (handler req)
      (catch Exception e
        (error e)
        {:status 500
         :headers {"Content-Type" "text/plain"}
         :body "We're sorry, something went wrong."}))))

(def app
  (-> (handler/site app-routes)
      wrap-json-body
      wrap-json-response
      allow-cross-origin
      wrap-failsafe
      ;(wrap-if production?  wrap-failsafe)
      ;(wrap-if development? wrap-stacktrace)
      ))

