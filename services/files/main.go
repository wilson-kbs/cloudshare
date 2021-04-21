package main

import (
	grpcServer "github.com/wilson-kbs/cloudshare/services/files/modules/grpc/server"
	"github.com/wilson-kbs/cloudshare/services/files/modules/web"
)

func main() {
	// Start GRPC Server
	go grpcServer.Start()

	// Start HTTP Server
	web.StartServer()
}
