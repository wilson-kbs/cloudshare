package web

import (
	"log"
	"net/http"
	"time"

	"golang.org/x/net/http2"

	"github.com/wilson-kbs/cloudshare/services/files_manager/modules/settings"
	"github.com/wilson-kbs/cloudshare/services/files_manager/modules/web/routes"
)

// StartServer exec web server
func StartServer() {
	handler := routes.GetHandlerWithRoutes()

	httpServer := http.Server{
		Handler:      handler,
		Addr:         settings.Getconf().GetWebAddress() + ":" + settings.Getconf().GetWebPort(),
		WriteTimeout: 3 * time.Hour,
		ReadTimeout:  15 * time.Second,
	}
	http2Server := http2.Server{}

	if err := http2.ConfigureServer(&httpServer, &http2Server); err != nil {
		log.Fatalf("Error: %v", err)
	}

	log.Printf("Listen Web Server: http://%v:%v%v", settings.Getconf().GetWebAddress(), settings.Getconf().GetWebPort(), settings.Getconf().GetWebBasePath())

	log.Fatal(httpServer.ListenAndServe())
}
