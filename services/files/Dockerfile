## DEVELOPMENT
FROM golang:1.15.6
LABEL app_name=kabaliserv_cloudshare
LABEL stage=dev
RUN ["sh", "-c", "curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b $(go env GOPATH)/bin"]
