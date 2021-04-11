package grpc

import (
	"context"
	"fmt"
	"log"
	"net"

	"github.com/wilson-kbs/cloudshare/services/files_manager/modules/grpc/files"
	"github.com/wilson-kbs/cloudshare/services/files_manager/modules/settings"
	"github.com/wilson-kbs/cloudshare/services/files_manager/modules/storage"

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
			if !storage.UploadStore().FileExist(id) {
				return &wrappers.BoolValue{Value: false}, nil
			}
		}
	case "CACHE":
		for _, id := range data.Ids {
			if !storage.CacheStore().FileExist(id) {
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
			if err := storage.UploadStore().RemoveFile(id); err != nil {
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

	if !storage.CacheStore().FileExist(data.FromCacheId) {
		return &wrappers.BoolValue{Value: false}, nil
	}

	if err := storage.UploadStore().FileMoveFromCache(data.FromCacheId, data.ToUploadId); err != nil {
		return &wrappers.BoolValue{Value: false}, nil
	}

	if !storage.UploadStore().FileExist(data.ToUploadId) {
		return &wrappers.BoolValue{Value: false}, nil
	}

	return &wrappers.BoolValue{Value: true}, nil
}

// GetMetaCacheFile return meta file info from cache store
func (s *Server) GetMetaCacheFile(ctx context.Context, data *files.FileId) (*files.MetaFile, error) {
	meta, err := storage.CacheStore().GetMetaFile(data.Id)
	if err != nil {
		return &files.MetaFile{}, nil
	}
	return &files.MetaFile{
		Name:         meta.Name,
		Type:         meta.Type,
		Size:         meta.Size,
		LastModified: meta.LastModified,
	}, nil
}

// StartServer exec gRPC server
func StartServer() {
	gRPCAddress := fmt.Sprintf("%v:%v", settings.Getconf().GetgRPCAddress(), settings.Getconf().GetgRPCPort())
	lis, err := net.Listen("tcp", gRPCAddress)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()

	files.RegisterFilesServiceServer(grpcServer, &Server{})

	log.Printf("Listen gRPC Server: %v", gRPCAddress)

	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %s", err)
	}
}
