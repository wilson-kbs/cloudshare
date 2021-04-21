package server

import (
	"log"
	"net"

	"github.com/wilson-kbs/cloudshare/services/files/modules/grpc/pb/files"
	"github.com/wilson-kbs/cloudshare/services/files/modules/grpc/server/controllers"
	"github.com/wilson-kbs/cloudshare/services/files/modules/setting"

	grpc "google.golang.org/grpc"
)

// Start gRPC server
func Start() {
	lis, err := net.Listen("tcp", setting.GRPCLocalURL)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()

	files.RegisterFilesStoreServer(grpcServer, &controllers.FileStoreController{})
	files.RegisterCacheStoreServer(grpcServer, &controllers.CacheStoreController{})

	log.Printf("Listen gRPC Server: %v", setting.GRPCLocalURL)

	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %s", err)
	}
}
