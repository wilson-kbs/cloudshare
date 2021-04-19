package controllers

import (
	"archive/zip" //
	"bufio"
	"fmt"
	"io"
	"log" //
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/wilson-kbs/cloudshare/services/files/modules/grpc"
	"github.com/wilson-kbs/cloudshare/services/files/modules/storage"
	"github.com/wilson-kbs/cloudshare/services/files/modules/utils"
)

// Download : Controller handler
func (c CSController) Download(w http.ResponseWriter, r *http.Request) {
	queryMap := r.URL.Query()

	uploadID := queryMap.Get("u")

	if uploadID == "" {
		utils.Render(w, http.StatusBadRequest)
		return
	}

	metaService, err := grpc.GetMetaClientConn()

	if err != nil {
		utils.Render(w, http.StatusInternalServerError)
	}

	defer metaService.Close()

	metaUpload, err := metaService.GetMetaUpload(uploadID)

	if err != nil {
		e, ok := err.(*grpc.Error)

		if ok {
			utils.Render(w, e.HTTPCode())
			return
		}

		utils.Render(w, http.StatusInternalServerError)
		return
	}

	if !metaUpload.Permanent {

		if !metaUpload.Active {
			utils.Render(w, http.StatusNotFound)
			return
		}

		t, err := time.Parse(time.RFC3339, metaUpload.ExpireAt)
		if err != nil {
			utils.Render(w, http.StatusInternalServerError)
			return
		}

		if t.Unix() < time.Now().Unix() {
			utils.Render(w, http.StatusForbidden)
		}

	}

	if metaUpload.Auth {

		bearToken := r.Header.Get("Authorization")

		token := strings.Split(bearToken, " ")[1]

		if token == "" {
			utils.Render(w, http.StatusUnauthorized)
			return
		}

		ok, err := metaService.TokenIsValid(uploadID, token)

		if err != nil {
			utils.Render(w, http.StatusInternalServerError)
			return
		}

		if !ok {
			utils.Render(w, http.StatusUnauthorized)
			return
		}

	}

	if fileID := queryMap.Get("f"); fileID != "" {

		metaFile, err := metaService.GetUploadMetaFile(uploadID, fileID)

		if err != nil {
			e, ok := err.(*grpc.Error)

			if ok {
				utils.Render(w, e.HTTPCode())
				return
			}

			utils.Render(w, http.StatusInternalServerError)
			return
		}

		if !c.stores.Files.IsExist(fileID) {
			utils.Render(w, http.StatusNotFound)
		}

		src, err := c.stores.Files.Open(fileID)

		if err != nil {
			utils.Render(w, http.StatusInternalServerError)
			return
		}

		defer src.Close()

		w.Header().Set("content-type", metaFile.Type)

		w.Header().Set("Content-Length", fmt.Sprintf("%v", metaFile.Size))

		contentDisposition := "attachment; filename*=UTF-8''" + url.QueryEscape(metaFile.Name)

		w.Header().Set("Content-Disposition", contentDisposition)

		w.WriteHeader(http.StatusOK)

		io.Copy(w, src)

		return
	}

	// download all file to zip

	filesStruct, err := metaService.GetUploadMetaFiles(uploadID)
	if err != nil {
		utils.Render(w, http.StatusInternalServerError)
		return
	}

	for _, file := range filesStruct.Files {
		if !storage.ObjectStorage.Files.IsExist(file.Id) {
			utils.Render(w, http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("content-type", "application/zip")

	contentDisposition := "attachment; filename*=UTF-8''Kabaliserv-CloudShare-" + time.Now().Format("02-01-2006") + ".zip"

	w.Header().Set("Content-Disposition", contentDisposition)

	w.WriteHeader(http.StatusOK)

	buffZip := zip.NewWriter(w)

	for _, file := range filesStruct.Files {

		src, err := c.stores.Files.Open(file.Id)
		if err != nil {
			log.Println(err)
		}

		stat, err := c.stores.Files.Stat(file.Id)
		if err != nil {
			log.Println(err)
		}

		zipHeader, err := zip.FileInfoHeader(stat)
		if err != nil {
			log.Println(err)
		}

		zipHeader.Name = file.Name

		zipHeader.Modified = time.Unix(0, (file.LastModified * int64(time.Millisecond)))

		zipHeader.Flags = 0x800

		///h := &zip.FileHeader{Name: file.FileName, Method: zip.Deflate, Modified: time.Now(), Flags: 0x800}

		ziper, err := buffZip.CreateHeader(zipHeader)

		if err != nil {
			log.Println(err)
		}

		reader := bufio.NewReader(src)
		buf := make([]byte, 4*1024)

		for {
			n, err := reader.Read(buf)
			if err != nil {
				if err != io.EOF {
					log.Panic(err)
				}
				break
			}

			_, err = ziper.Write(buf[0:n])
			if err != nil {
				log.Panic(err)
			}
		}

		src.Close()
	}

	if err := buffZip.Close(); err != nil {
		log.Println(err)
	}
}
