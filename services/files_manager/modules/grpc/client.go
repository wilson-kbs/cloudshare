package grpc

import (
	"context"
	"log"

	"github.com/wilson-kbs/cloudshare/services/files_manager/modules/grpc/meta"
	"github.com/wilson-kbs/cloudshare/services/files_manager/modules/settings"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// MetaClient :
type MetaClient struct {
	conn        *grpc.ClientConn
	metaService meta.MetaServiceClient
}

// Error :
type Error struct {
	msg      string
	httpCode int
}

func (s *Error) Error() string {
	return s.msg
}

// HTTPCode return http code error
func (s *Error) HTTPCode() int {
	return s.httpCode
}

// SetHTTPCode :
// func (s* Error) SetHTTPCode(code int) {}

const (
	errorToDial = "Error to dial with metaService"
)

var (
	metaclient MetaClient
)

// Conn return connexion to meta-service
func (s *MetaClient) Conn() error {
	var conn *grpc.ClientConn

	conn, err := grpc.Dial(settings.Getconf().GetMetadataMSgRPCAdress()+":"+settings.Getconf().GetMetadataMSgRPCPort(), grpc.WithInsecure())
	if err != nil {
		log.Println("Error: did not connect:", err)
		return err
	}
	s.conn = conn
	s.metaService = meta.NewMetaServiceClient(conn)
	return nil
}

// Close meta client connection
func (s *MetaClient) Close() {
	s.conn.Close()
}

// GetMetaUpload :
func (s *MetaClient) GetMetaUpload(id string) (*meta.MetaUpload, error) {
	response, err := s.metaService.GetMetaUpload(context.Background(), &meta.UploadId{Id: id})
	if err != nil {
		if e, ok := status.FromError(err); ok {
			switch e.Code() {
			case codes.NotFound:
				customError := Error{httpCode: 404}
				return nil, &customError
			}
		}
	}
	return response, nil
}

// GetUploadMetaFile :
func (s *MetaClient) GetUploadMetaFile(uploadID, fileID string) (*meta.MetaFile, error) {
	response, err := s.metaService.GetUploadMetaFile(context.Background(), &meta.UploadAndFileId{UploadId: uploadID, FileId: fileID})
	if err != nil {
		if e, ok := status.FromError(err); ok {
			switch e.Code() {
			case codes.NotFound:
				customError := Error{httpCode: 404}
				return nil, &customError
			}
		}
	}
	return response, nil
}

// GetUploadMetaFiles :
func (s *MetaClient) GetUploadMetaFiles(uploadID string) (*meta.UploadMetaFiles, error) {
	response, err := s.metaService.GetUploadMetaFiles(context.Background(), &meta.UploadId{Id: uploadID})
	if err != nil {
		if e, ok := status.FromError(err); ok {
			switch e.Code() {
			case codes.NotFound:
				customError := Error{httpCode: 404}
				return nil, &customError
			}
		}
	}
	return response, nil
}

// UploadIsActive check
func (s *MetaClient) UploadIsActive(uploadID string) (bool, error) {
	response, err := s.metaService.UploadIsActive(context.Background(), &meta.UploadId{Id: uploadID})
	if err != nil {
		log.Println(errorToDial, err)
		return false, err
	}
	return response.Value, nil
}

// TokenIsValid check
func (s *MetaClient) TokenIsValid(uploadID, token string) (bool, error) {
	response, err := s.metaService.TokenIsValid(context.Background(), &meta.TokenCred{UploadId: uploadID, Token: token})
	if err != nil {
		log.Println(errorToDial, err)
		return false, err
	}
	return response.Value, nil
}

// GetMetaClientConn :
func GetMetaClientConn() (*MetaClient, error) {
	metaclient = MetaClient{}
	if err := metaclient.Conn(); err != nil {
		return nil, err
	}
	return &metaclient, nil
}
