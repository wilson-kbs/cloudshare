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

	rpcClient "github.com/wilson-kbs/cloudshare/services/files/modules/grpc/client"
	metapb "github.com/wilson-kbs/cloudshare/services/files/modules/grpc/pb/meta"

	///"github.com/wilson-kbs/cloudshare/services/files/modules/setting"

	// "github.com/wilson-kbs/cloudshare/services/files/modules/storage"
	// "github.com/wilson-kbs/cloudshare/services/files/modules/utils"

	"github.com/gin-gonic/gin"
)

const (
	ajaxRequestTrigger = "ajax"
	frontFilesPath     = "/files"

	// const query params
	qUploadIDKey = "u"
	qFileIDKey   = "f"
	qTokenKey    = "token"
	qModeKey     = "mode"

	//
	qModeValueDownload = "download"
)

// Download : Controller handler
func (k KSController) Download(c *gin.Context) {

	reqTrigger := c.GetHeader("KSCS-Request-Trigger")

	uploadID := c.Query(qUploadIDKey)
	filesID := c.QueryArray(qFileIDKey)

	if uploadID == "" {
		k.redirectOrSendError(c, http.StatusBadRequest)
		return
	}

	rpc, err := rpcClient.GetMetaClientConn()

	if err != nil {
		k.sendError(c, http.StatusInternalServerError)
		return
	}
	k.rpcMetaSRV = rpc

	defer rpc.Close()

	metaUpload, err := rpc.GetMetaUpload(uploadID)

	if err != nil {
		err, ok := err.(*rpcClient.Error)

		if ok {
			log.Println("Error:", err)
		}

		k.sendError(c, http.StatusInternalServerError)
		return
	}

	if !metaUpload.Active {
		k.redirectOrSendError(c, http.StatusNotFound)
		return
	}

	if !metaUpload.Permanent {

		t, err := time.Parse(time.RFC3339, metaUpload.ExpireAt)
		if err != nil {
			k.sendError(c, http.StatusInternalServerError)
			return
		}

		if t.Unix() < time.Now().Unix() {
			k.redirectOrSendError(c, http.StatusForbidden)
			return
		}

	}

	if metaUpload.Auth {
		// if web front request from ajax
		var token string
		if reqTrigger == ajaxRequestTrigger {
			bearToken := c.GetHeader("Authorization")
			token = strings.Split(bearToken, " ")[1]
		} else {
			token = c.Query(qTokenKey)
		}
		log.Println(token)
		if token == "" {
			k.sendErrorOrRedirectToFrontForDownload(c, http.StatusUnauthorized)
			return
		}
		isValidToken, err := rpc.TokenIsValid(uploadID, token)

		if err != nil {
			k.sendError(c, http.StatusInternalServerError)
			return
		}

		log.Println("is ok token:", isValidToken)

		if !isValidToken {
			k.sendErrorOrRedirectToFrontForDownload(c, http.StatusUnauthorized)
			return
		}
	}

	if len(filesID) == 1 {
		if fileID := filesID[0]; fileID != "" {
			k.sendFile(c, fileID)
		} else {
			k.redirectOrSendError(c, http.StatusBadRequest)
		}
	} else {
		k.sendZipFile(c)
	}
	// download all file to zip

}

func (k *KSController) sendFile(c *gin.Context, fileID string) {
	uploadID := c.Query(qUploadIDKey)

	metaFile, err := k.rpcMetaSRV.GetUploadMetaFile(uploadID, fileID)

	if err != nil {
		err, ok := err.(*rpcClient.Error)

		if ok {
			log.Println("Error:", err)
		}
		k.sendError(c, http.StatusInternalServerError)
		return
	}

	if !k.stores.Files.IsExist(fileID) {
		k.redirectOrSendError(c, http.StatusNotFound)
	}

	src, err := k.stores.Files.Open(fileID)
	if err != nil {
		k.sendError(c, http.StatusInternalServerError)
		return
	}
	defer src.Close()

	c.Header("content-type", metaFile.Type)
	// w.Header().Set("content-type", metaFile.Type)

	c.Header("Content-Length", fmt.Sprintf("%v", metaFile.Size))
	// w.Header().Set("Content-Length", fmt.Sprintf("%v", metaFile.Size))

	contentDisposition := fmt.Sprintf("attachment; filename*=UTF-8''%s", url.QueryEscape(metaFile.Name))

	c.Header("Content-Disposition", contentDisposition)
	// w.Header().Set("Content-Disposition", contentDisposition)
	c.Status(http.StatusOK)
	// w.WriteHeader(http.StatusOK)

	io.Copy(c.Writer, src)
}

// sendZipFile return file zip
func (k *KSController) sendZipFile(c *gin.Context) {
	uploadID := c.Query(qUploadIDKey)
	filesID := c.QueryArray(qFileIDKey)

	var metaFiles []*metapb.MetaFile

	if len(filesID) > 0 {
		for _, fileID := range filesID {
			if fileID != "" {
				metaFile, err := k.rpcMetaSRV.GetUploadMetaFile(uploadID, fileID)
				if err != nil {
					k.sendError(c, http.StatusInternalServerError)
					return
				}
				if !k.stores.Files.IsExist(metaFile.Id) {
					k.sendError(c, http.StatusInternalServerError)
					return
				}
				metaFiles = append(metaFiles, metaFile)
			}
		}
	} else {
		uploadMetaFiles, err := k.rpcMetaSRV.GetUploadMetaFiles(uploadID)
		if err != nil {
			k.sendError(c, http.StatusInternalServerError)
			return
		}
		if len(uploadMetaFiles.Files) == 1 {
			fileID := uploadMetaFiles.Files[0].Id
			log.Println(fileID)
			k.sendFile(c, fileID)
			return
		}
		for _, metaFile := range uploadMetaFiles.Files {
			if !k.stores.Files.IsExist(metaFile.Id) {
				k.sendError(c, http.StatusInternalServerError)
				return
			}
			metaFiles = append(metaFiles, metaFile)
		}
	}

	c.Header("content-type", "application/zip")

	contentDisposition := fmt.Sprintf("attachment; filename*=UTF-8''Kabaliserv-CloudShare-%s-%s.zip", uploadID, time.Now().Format("02-01-2006"))
	c.Header("Content-Disposition", contentDisposition)

	c.Status(http.StatusOK)

	buffZip := zip.NewWriter(c.Writer)

	for _, metaFile := range metaFiles {

		src, err := k.stores.Files.Open(metaFile.Id)
		if err != nil {
			log.Println(err)
		}

		stat, err := k.stores.Files.Stat(metaFile.Id)
		if err != nil {
			log.Println(err)
		}

		zipHeader, err := zip.FileInfoHeader(stat)
		if err != nil {
			log.Println(err)
		}

		zipHeader.Name = metaFile.Name

		zipHeader.Modified = time.Unix(0, (metaFile.LastModified * int64(time.Millisecond)))

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
