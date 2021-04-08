package main

import (
	"github.com/wilson-kbs/cloudshare/services/files_manager/modules/grpc"
	"github.com/wilson-kbs/cloudshare/services/files_manager/modules/web"
)

func main() {
	go grpc.StartServer()
	web.StartServer()
}
