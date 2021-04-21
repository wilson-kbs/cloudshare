package controllers

import (
	"context"
	"log"
	"strconv"

	"github.com/wilson-kbs/cloudshare/services/files/modules/grpc/pb/files"
	filespb "github.com/wilson-kbs/cloudshare/services/files/modules/grpc/pb/files"
	"github.com/wilson-kbs/cloudshare/services/files/modules/storage"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

type CacheStoreController struct {
	files.CacheStoreServer
}

// IsExist check if file exist in cache store
func (f *CacheStoreController) IsExist(ctx context.Context, data *filespb.ItemID) (*wrapperspb.BoolValue, error) {
	if !storage.ObjectStorage.Cache.IsExist(data.GetId()) {
		return &wrapperspb.BoolValue{Value: false}, nil
	}
	return &wrapperspb.BoolValue{Value: true}, nil
}

// Delete file in cache store
func (f *CacheStoreController) Delete(ctx context.Context, data *filespb.ItemID) (*emptypb.Empty, error) {
	err := storage.ObjectStorage.Cache.Delete(data.GetId())
	if err != nil {
		log.Printf("Error: Delete | %s", err.Error())
	}
	return &emptypb.Empty{}, nil
}

// GetMetadata return Metadata file in cache upload
func (f *CacheStoreController) GetMetadata(ctx context.Context, data *filespb.ItemID) (*filespb.MetaFile, error) {
	metaFile := &files.MetaFile{}

	metaFileInfo, err := storage.ObjectStorage.Cache.FileInfo(data.Id)

	if err != nil {
		log.Printf("Error: GetMetadata | %s", err.Error())
		return metaFile, nil
	}

	metaFile.Name = metaFileInfo.Metadata.Name
	metaFile.Type = metaFileInfo.Metadata.Type
	metaFile.Size = metaFileInfo.Size

	lastModified, err := strconv.ParseInt(metaFileInfo.Metadata.LastModified, 10, 64)
	if err == nil {
		metaFile.LastModified = lastModified
	}

	return metaFile, nil
}
