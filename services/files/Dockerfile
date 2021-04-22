## DEVELOPMENT
FROM golang:1.15.6 AS dev
LABEL app_name=kabaliserv_cloudshare
LABEL stage=dev
RUN ["sh", "-c", "curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b $(go env GOPATH)/bin"]

## PRODUCTION
FROM golang:1.15.6 as files-service-builder
LABEL app_name=kabaliserv_cloudshare
LABEL stage=builder
WORKDIR /app
COPY . .
ENV CGO_ENABLED=0
RUN go mod download
RUN go mod verify
RUN go build -o cloudshare

FROM alpine:3.13.5 AS prod
ARG VERSION
LABEL app_name=kabaliserv_cloudshare
LABEL stage=prod
LABEL version=${VERSION}
WORKDIR /app
COPY --from=files-service-builder /app/cloudshare /
ENTRYPOINT ["/cloudshare"]

