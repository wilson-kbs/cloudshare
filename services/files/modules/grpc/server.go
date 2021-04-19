package grpc

import (
	"context"
	"log"
	"net"
	"strconv"

	"github.com/wilson-kbs/cloudshare/services/files/modules/grpc/files"
	"github.com/wilson-kbs/cloudshare/services/files/modules/setting"
	"github.com/wilson-kbs/cloudshare/services/files/modules/storage"

	"github.com/golang/protobuf/ptypes/wrappers"
	grpc "google.golang.org/grpc"
)

// Server struc implement functions for gRPC
type Server struct {
	files.UnimplementedFilesServiceServer
}

// FilesExist check if files exist in store
func (s *Server) FilesExist(ctx context.Context, data *files.StoreFilesId) (*wrappers.BoolValue, error) {
	switch data.Store.String() {
	case "UPLOAD":
		for _, id := range data.Ids {
			if !storage.ObjectStorage.Files.IsExist(id) {
				return &wrappers.BoolValue{Value: false}, nil
			}
		}
	case "CACHE":
		for _, id := range data.Ids {
			if !storage.ObjectStorage.Cache.IsExist(id) {
				return &wrappers.BoolValue{Value: false}, nil

			}
		}
	}
	return &wrappers.BoolValue{Value: true}, nil
}

// DeleteFiles remove file from store
func (s *Server) DeleteFiles(ctx context.Context, data *files.StoreFilesId) (*wrappers.BoolValue, error) {
	switch data.Store.String() {
	case "UPLOAD":
		for _, id := range data.Ids {
			if err := storage.ObjectStorage.Files.Delete(id); err != nil {
				return &wrappers.BoolValue{Value: false}, nil
			}
		}
	case "CACHE":
		return &wrappers.BoolValue{Value: false}, nil
	}
	return &wrappers.BoolValue{Value: true}, nil
}

// MoveFilesToUploadStore move cache file to upload directory with new id
func (s *Server) MoveFilesToUploadStore(ctx context.Context, data *files.MoveTo) (*wrappers.BoolValue, error) {

	if err := storage.ObjectStorage.CreateFileFromCache(data.FromCacheId, data.ToUploadId); err != nil {
		return &wrappers.BoolValue{Value: false}, nil
	}

	return &wrappers.BoolValue{Value: true}, nil
}

// GetMetaCacheFile return meta file info from cache store
func (s *Server) GetMetaCacheFile(ctx context.Context, data *files.FileId) (*files.MetaFile, error) {
	metaFileInfo, err := storage.ObjectStorage.Cache.FileInfo(data.Id)
	if err != nil {
		return &files.MetaFile{}, nil
	}
	metaFile := &files.MetaFile{}
	metaFile.Name = metaFileInfo.Metadata.Name
	metaFile.Type = metaFileInfo.Metadata.Type
	metaFile.Size = metaFileInfo.Size

	lastModified, err := strconv.ParseInt(metaFileInfo.Metadata.LastModified, 10, 64)
	if err == nil {
		metaFile.LastModified = lastModified
	}

	return metaFile, nil
}

// StartServer exec gRPC server
func StartServer() {
	lis, err := net.Listen("tcp", setting.GRPCLocalURL)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()

	files.RegisterFilesServiceServer(grpcServer, &Server{})

	log.Printf("Listen gRPC Server: %v", setting.GRPCLocalURL)

	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %s", err)
	}
}
