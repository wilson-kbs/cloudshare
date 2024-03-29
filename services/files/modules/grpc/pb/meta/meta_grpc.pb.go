// Code generated by protoc-gen-go-grpc. DO NOT EDIT.

package meta

import (
	context "context"
	wrappers "github.com/golang/protobuf/ptypes/wrappers"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// MetaServiceClient is the client API for MetaService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type MetaServiceClient interface {
	GetMetaUpload(ctx context.Context, in *UploadId, opts ...grpc.CallOption) (*MetaUpload, error)
	GetUploadMetaFile(ctx context.Context, in *UploadAndFileId, opts ...grpc.CallOption) (*MetaFile, error)
	GetUploadMetaFiles(ctx context.Context, in *UploadId, opts ...grpc.CallOption) (*UploadMetaFiles, error)
	UploadIsActive(ctx context.Context, in *UploadId, opts ...grpc.CallOption) (*wrappers.BoolValue, error)
	TokenIsValid(ctx context.Context, in *TokenCred, opts ...grpc.CallOption) (*wrappers.BoolValue, error)
}

type metaServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewMetaServiceClient(cc grpc.ClientConnInterface) MetaServiceClient {
	return &metaServiceClient{cc}
}

func (c *metaServiceClient) GetMetaUpload(ctx context.Context, in *UploadId, opts ...grpc.CallOption) (*MetaUpload, error) {
	out := new(MetaUpload)
	err := c.cc.Invoke(ctx, "/meta.MetaService/GetMetaUpload", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *metaServiceClient) GetUploadMetaFile(ctx context.Context, in *UploadAndFileId, opts ...grpc.CallOption) (*MetaFile, error) {
	out := new(MetaFile)
	err := c.cc.Invoke(ctx, "/meta.MetaService/GetUploadMetaFile", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *metaServiceClient) GetUploadMetaFiles(ctx context.Context, in *UploadId, opts ...grpc.CallOption) (*UploadMetaFiles, error) {
	out := new(UploadMetaFiles)
	err := c.cc.Invoke(ctx, "/meta.MetaService/GetUploadMetaFiles", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *metaServiceClient) UploadIsActive(ctx context.Context, in *UploadId, opts ...grpc.CallOption) (*wrappers.BoolValue, error) {
	out := new(wrappers.BoolValue)
	err := c.cc.Invoke(ctx, "/meta.MetaService/UploadIsActive", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *metaServiceClient) TokenIsValid(ctx context.Context, in *TokenCred, opts ...grpc.CallOption) (*wrappers.BoolValue, error) {
	out := new(wrappers.BoolValue)
	err := c.cc.Invoke(ctx, "/meta.MetaService/TokenIsValid", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// MetaServiceServer is the server API for MetaService service.
// All implementations must embed UnimplementedMetaServiceServer
// for forward compatibility
type MetaServiceServer interface {
	GetMetaUpload(context.Context, *UploadId) (*MetaUpload, error)
	GetUploadMetaFile(context.Context, *UploadAndFileId) (*MetaFile, error)
	GetUploadMetaFiles(context.Context, *UploadId) (*UploadMetaFiles, error)
	UploadIsActive(context.Context, *UploadId) (*wrappers.BoolValue, error)
	TokenIsValid(context.Context, *TokenCred) (*wrappers.BoolValue, error)
	mustEmbedUnimplementedMetaServiceServer()
}

// UnimplementedMetaServiceServer must be embedded to have forward compatible implementations.
type UnimplementedMetaServiceServer struct {
}

func (UnimplementedMetaServiceServer) GetMetaUpload(context.Context, *UploadId) (*MetaUpload, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetMetaUpload not implemented")
}
func (UnimplementedMetaServiceServer) GetUploadMetaFile(context.Context, *UploadAndFileId) (*MetaFile, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetUploadMetaFile not implemented")
}
func (UnimplementedMetaServiceServer) GetUploadMetaFiles(context.Context, *UploadId) (*UploadMetaFiles, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetUploadMetaFiles not implemented")
}
func (UnimplementedMetaServiceServer) UploadIsActive(context.Context, *UploadId) (*wrappers.BoolValue, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UploadIsActive not implemented")
}
func (UnimplementedMetaServiceServer) TokenIsValid(context.Context, *TokenCred) (*wrappers.BoolValue, error) {
	return nil, status.Errorf(codes.Unimplemented, "method TokenIsValid not implemented")
}
func (UnimplementedMetaServiceServer) mustEmbedUnimplementedMetaServiceServer() {}

// UnsafeMetaServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to MetaServiceServer will
// result in compilation errors.
type UnsafeMetaServiceServer interface {
	mustEmbedUnimplementedMetaServiceServer()
}

func RegisterMetaServiceServer(s grpc.ServiceRegistrar, srv MetaServiceServer) {
	s.RegisterService(&MetaService_ServiceDesc, srv)
}

func _MetaService_GetMetaUpload_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UploadId)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MetaServiceServer).GetMetaUpload(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/meta.MetaService/GetMetaUpload",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MetaServiceServer).GetMetaUpload(ctx, req.(*UploadId))
	}
	return interceptor(ctx, in, info, handler)
}

func _MetaService_GetUploadMetaFile_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UploadAndFileId)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MetaServiceServer).GetUploadMetaFile(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/meta.MetaService/GetUploadMetaFile",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MetaServiceServer).GetUploadMetaFile(ctx, req.(*UploadAndFileId))
	}
	return interceptor(ctx, in, info, handler)
}

func _MetaService_GetUploadMetaFiles_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UploadId)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MetaServiceServer).GetUploadMetaFiles(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/meta.MetaService/GetUploadMetaFiles",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MetaServiceServer).GetUploadMetaFiles(ctx, req.(*UploadId))
	}
	return interceptor(ctx, in, info, handler)
}

func _MetaService_UploadIsActive_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UploadId)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MetaServiceServer).UploadIsActive(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/meta.MetaService/UploadIsActive",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MetaServiceServer).UploadIsActive(ctx, req.(*UploadId))
	}
	return interceptor(ctx, in, info, handler)
}

func _MetaService_TokenIsValid_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(TokenCred)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MetaServiceServer).TokenIsValid(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/meta.MetaService/TokenIsValid",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MetaServiceServer).TokenIsValid(ctx, req.(*TokenCred))
	}
	return interceptor(ctx, in, info, handler)
}

// MetaService_ServiceDesc is the grpc.ServiceDesc for MetaService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var MetaService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "meta.MetaService",
	HandlerType: (*MetaServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetMetaUpload",
			Handler:    _MetaService_GetMetaUpload_Handler,
		},
		{
			MethodName: "GetUploadMetaFile",
			Handler:    _MetaService_GetUploadMetaFile_Handler,
		},
		{
			MethodName: "GetUploadMetaFiles",
			Handler:    _MetaService_GetUploadMetaFiles_Handler,
		},
		{
			MethodName: "UploadIsActive",
			Handler:    _MetaService_UploadIsActive_Handler,
		},
		{
			MethodName: "TokenIsValid",
			Handler:    _MetaService_TokenIsValid_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "protos/meta.proto",
}
