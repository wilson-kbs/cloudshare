package routes

import (
	"github.com/wilson-kbs/cloudshare/services/files_manager/modules/settings"

	"github.com/gorilla/mux"
)

// GetHandlerWithRoutes Web Router
func GetHandlerWithRoutes() *mux.Router {
	var router = mux.NewRouter()

	baseRoute := router.PathPrefix(settings.Getconf().GetWebBasePath()).Subrouter()

	baseRoute.PathPrefix("/cache/").Handler(CacheHandler())
	baseRoute.HandleFunc("/d", DownloadHandler).Methods("GET")

	return router
}
