package controllers

import (
	"io/ioutil"
	"log"
	"net/http"
	"path"

	"github.com/wilson-kbs/cloudshare/services/files/modules/setting"

	"github.com/tus/tusd/pkg/filestore"
	tusd "github.com/tus/tusd/pkg/handler"
)

// GetCacheHander return new tus handler
func (c *CSController) GetCacheHander() http.Handler {

	// tusd mounting point url
	tusdURL := path.Join(setting.WEBBasePath, "/cache") + "/"

	// Tus Init
	storeTUS := filestore.New(c.stores.Cache.PathStore())

	composer := tusd.NewStoreComposer()
	storeTUS.UseIn(composer)

	config := tusd.Config{
		BasePath:                tusdURL,
		StoreComposer:           composer,
		Logger:                  &log.Logger{},
		RespectForwardedHeaders: true,
	}

	config.Logger.SetOutput(ioutil.Discard)

	handler, err := tusd.NewHandler(config)
	if err != nil {
		log.Fatal(err)
	}

	return http.StripPrefix(tusdURL, handler)
}
