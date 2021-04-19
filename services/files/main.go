package main

import (
	"github.com/wilson-kbs/cloudshare/services/files/modules/grpc"
	"github.com/wilson-kbs/cloudshare/services/files/modules/web"
)

func main() {
	// Start GRPC Server
	go grpc.StartServer()

	// Start HTTP Server
	web.StartServer()
}
