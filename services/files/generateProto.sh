go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
export GO111MODULE=on
protoc --go_out=. --go_opt=module=github.com/wilson-kbs/cloudshare/services/files --go-grpc_out=. --go-grpc_opt=module=github.com/wilson-kbs/cloudshare/services/files protos/*.proto
