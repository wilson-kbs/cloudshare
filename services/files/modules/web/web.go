package web

import (
	"log"
	"net/http"
	"time"

	"golang.org/x/net/http2"

	"github.com/wilson-kbs/cloudshare/services/files/modules/setting"
	"github.com/wilson-kbs/cloudshare/services/files/modules/web/controllers"

	//"github.com/gorilla/mux"

	"github.com/gin-gonic/gin"
)

// getHandler Web Router
func getRouter() *gin.Engine {
	var router = gin.Default()

	baseRoute := router.Group(setting.WEBBasePath)

	controller := controllers.NewControler()

	cacheHandler := controller.GetCacheHander()

	baseRoute.Any("/cache/*any", gin.WrapH(cacheHandler))

	baseRoute.GET("/d", controller.Download)

	return router
}

// func getRouter() *mux.Router {
// 	var router = mux.NewRouter()

// 	baseRoute := router.PathPrefix(setting.WEBBasePath).Subrouter()

// 	controller := controllers.NewControler()

// 	cacheHandler := controller.GetCacheHander()

// 	baseRoute.PathPrefix("/cache/").Handler(cacheHandler)

// 	baseRoute.Path("/d").HandlerFunc(controller.Download).Methods("GET")

// 	return router
// }

// StartServer exec web server
func StartServer() {

	httpServer := http.Server{
		Handler:      getRouter(),
		Addr:         setting.LocalURL,
		WriteTimeout: 3 * time.Hour,
		ReadTimeout:  15 * time.Second,
	}
	http2Server := http2.Server{}

	if err := http2.ConfigureServer(&httpServer, &http2Server); err != nil {
		log.Fatalf("Error: %v", err)
	}

	log.Printf("Listen Web Server: http://%v:%v%v", setting.HTTPAddr, setting.HTTPPort, setting.WEBBasePath)

	log.Fatal(httpServer.ListenAndServe())
}
