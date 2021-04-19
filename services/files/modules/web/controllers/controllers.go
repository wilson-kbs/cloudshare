package controllers

import "github.com/wilson-kbs/cloudshare/services/files/modules/storage"

type CSController struct {
	stores *storage.LocalStorage
}

func NewControler() CSController {
	return CSController{
		stores: storage.ObjectStorage,
	}
}
