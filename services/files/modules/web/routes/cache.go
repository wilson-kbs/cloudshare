package routes

import (
	"log"
	"net/http"
	"path"

	"github.com/tus/tusd/pkg/filestore"
	"github.com/wilson-kbs/cloudshare/services/files_manager/modules/settings"
	"github.com/wilson-kbs/cloudshare/services/files_manager/modules/storage"

	tusd "github.com/tus/tusd/pkg/handler"
)

// CacheHandler return new tus handler
func CacheHandler() http.Handler {

	// tusd running url
	tusdURL := path.Join(settings.Getconf().GetWebBasePath(), "/cache") + "/"
	log.Println(tusdURL)

	// Tus Init
	cacheStore := storage.CacheStore()
	storeTUS := filestore.New(cacheStore.GetPath())

	composer := tusd.NewStoreComposer()
	storeTUS.UseIn(composer)

	config := tusd.Config{
		BasePath:      tusdURL,
		StoreComposer: composer,
		//RespectForwardedHeaders: true,
	}

	handler, err := tusd.NewHandler(config)
	if err != nil {
		log.Fatal(err)
	}

	return http.StripPrefix(tusdURL, handler)
}
