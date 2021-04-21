## DEVELOPMENT
FROM golang:1.15.6 AS dev

RUN ["sh", "-c", "curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b $(go env GOPATH)/bin"]

## PRODUCTION
FROM golang:1.15.6 as files-service-builder
LABEL stage=builder
WORKDIR /app
COPY . .
ENV CGO_ENABLED=0
RUN go mod download
RUN go mod verify
RUN go build -o cloudshare

FROM alpine:3.13.5 AS prod
WORKDIR /app
COPY --from=files-service-builder /app/cloudshare /
ENTRYPOINT ["/cloudshare"]

