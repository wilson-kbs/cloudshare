package controllers

import (
	"context"
	"log"

	filespb "github.com/wilson-kbs/cloudshare/services/files/modules/grpc/pb/files"
	"github.com/wilson-kbs/cloudshare/services/files/modules/storage"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

type FileStoreController struct {
	filespb.UnimplementedFilesStoreServer
}

// IsExist check if file exist in files store
func (f *FileStoreController) IsExist(ctx context.Context, data *filespb.ItemID) (*wrapperspb.BoolValue, error) {
	if !storage.ObjectStorage.Files.IsExist(data.GetId()) {
		return &wrapperspb.BoolValue{Value: false}, nil
	}
	return &wrapperspb.BoolValue{Value: true}, nil
}

// Delete file in files store
func (f *FileStoreController) Delete(ctx context.Context, data *filespb.ItemID) (*emptypb.Empty, error) {
	err := storage.ObjectStorage.Files.Delete(data.GetId())
	if err != nil {
		log.Printf("Error: Delete | %s", err.Error())
	}
	return &emptypb.Empty{}, nil
}

// GenerateFileFromCache create sharing file from cache upload
func (f *FileStoreController) GenerateFileFromCache(ctx context.Context, data *filespb.GenerateFile) (*emptypb.Empty, error) {
	err := storage.ObjectStorage.CreateFileFromCache(data.GetCacheFileID(), data.GetNewFileID())
	if err != nil {
		log.Printf("Error: GenerateFileFromCache | %s", err.Error())
	}
	return &emptypb.Empty{}, nil
}
