package controllers

import (
	"net/http"
	"net/url"

	rpcClient "github.com/wilson-kbs/cloudshare/services/files/modules/grpc/client"
	"github.com/wilson-kbs/cloudshare/services/files/modules/setting"
	"github.com/wilson-kbs/cloudshare/services/files/modules/storage"

	"github.com/gin-gonic/gin"
)

type KSController struct {
	stores     *storage.LocalStorage
	rpcMetaSRV *rpcClient.MetaClient
}

func NewControler() KSController {
	return KSController{
		stores: storage.ObjectStorage,
	}
}

func (k KSController) sendError(c *gin.Context, code int) {
	c.PureJSON(code, gin.H{
		"status": code,
		"msg":    http.StatusText(code),
	})
}

func (k KSController) redirectToWEBFront(c *gin.Context, mode string) {
	uploadID := c.Query(qUploadIDKey)
	filesID := c.QueryArray(qFileIDKey)

	baseURL, err := url.Parse(setting.WEBFrontURL)
	if err != nil {
		k.sendError(c, http.StatusInternalServerError)
		return
	}

	redirectLocation, err := baseURL.Parse(frontFilesPath)
	if err != nil {
		k.sendError(c, http.StatusInternalServerError)
		return
	}
	q := redirectLocation.Query()
	q.Add(qUploadIDKey, uploadID)
	for _, v := range filesID {
		q.Add(qFileIDKey, v)
	}
	if mode == qModeValueDownload {
		q.Add(qModeKey, qModeValueDownload)
	}

	redirectLocation.RawQuery = q.Encode()

	c.Redirect(http.StatusSeeOther, redirectLocation.String())
}

func (k *KSController) redirectOrSendError(c *gin.Context, httpCodeOrRedirectMode interface{}) {
	reqTrigger := c.GetHeader("KSCS-Request-Trigger")
	if reqTrigger == ajaxRequestTrigger {
		httpCode, ok := httpCodeOrRedirectMode.(int)
		if ok {
			k.sendError(c, httpCode)
		}
	} else {
		redirectMode, _ := httpCodeOrRedirectMode.(string)
		k.redirectToWEBFront(c, redirectMode)
	}
}

func (k *KSController) sendErrorOrRedirectToFrontForDownload(c *gin.Context, httpCode int) {
	reqTrigger := c.GetHeader("KSCS-Request-Trigger")
	if reqTrigger == ajaxRequestTrigger {
		k.sendError(c, httpCode)
	} else {
		k.redirectToWEBFront(c, qModeValueDownload)
	}
}
