(defproject confitura-game-server "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [compojure "1.1.8"]
                 [ring/ring-json "0.3.1"]
                 [ring/ring-codec "1.0.0"]
                 [de.ubercode.clostache/clostache "1.4.0"]
                 [clj-time "0.7.0"]
                 [clj-json "0.5.3"]
                 [com.novemberain/monger "2.0.0"]
                 [com.taoensso/timbre "3.2.0"]
                 [prismatic/schema "0.2.4"]]
  :plugins [[lein-ring "0.8.11"]]
  :ring {:handler confitura-game-server.handler/app}
  :profiles
  {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]
                        [ring-mock "0.1.5"]]}})
