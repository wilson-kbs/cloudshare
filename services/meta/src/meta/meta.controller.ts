import {
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { DatabaseService } from '@database/service';
import { MetadataRender } from '@/interfaces/REST-API.interface';
import { MetaService } from './meta.service';
import { grpc_meta } from '@/proto.interface';
import { status } from 'grpc';

@Controller('meta')
export class MetaController {
  constructor(
    private databaseService: DatabaseService,
    private metaservice: MetaService,
  ) {}

  @Get()
  async getMetaFiles(
    @Query('u') uploadID: string,
    @Query('f') fileID: string,
    @Headers('Authorization') authHead: string,
  ): Promise<MetadataRender> {
    console.log('ta mere');

    const upload = await this.databaseService.findUploadById(uploadID);
    if (upload == null) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    if (fileID && fileID !== '') {
      if (upload.getDataFileById(fileID).length == 0) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
    }

    if (!upload.isActive()) {
      throw new HttpException('Expired', HttpStatus.FORBIDDEN);
    }

    if (upload.auth && !this.metaservice.validAuth(authHead, uploadID)) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return {
      files:
        fileID && fileID !== '' ? upload.getDataFileById(fileID) : upload.files,
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////

  @GrpcMethod('MetaService', 'GetMetaUpload')
  async getMetaUpload(data: grpc_meta.UploadId): Promise<grpc_meta.MetaUpload> {
    const upload = await this.databaseService.findDataUploadById(data.id);
    if (upload == null) {
      throw new RpcException({ code: status.NOT_FOUND });
    }
    return {
      id: upload.id,
      active: upload.active,
      auth: upload.auth,
      expireAt: upload.expireAt,
      permanent: upload.permanante,
    };
  }

  @GrpcMethod('MetaService', 'GetUploadMetaFile')
  async getUploadMetaFile(
    data: grpc_meta.UploadAndFileId,
  ): Promise<grpc_meta.MetaFile> {
    const upload = await this.databaseService.findUploadById(data.uploadId);
    if (upload == null) {
      throw new RpcException({ code: status.NOT_FOUND });
    }
    let files = upload.getDataFileById(data.fileId);
    if (files.length == 0) {
      throw new RpcException({ code: status.NOT_FOUND });
    }
    let file = files[0];
    return {
      id: file.id,
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    };
  }

  @GrpcMethod('MetaService', 'GetUploadMetaFiles')
  async getUploadMetaFiles(
    data: grpc_meta.UploadId,
  ): Promise<grpc_meta.UploadMetaFiles> {
    const upload = await this.databaseService.findUploadById(data.id);
    if (upload == null) {
      throw new RpcException({ code: status.NOT_FOUND });
    }
    let resp: grpc_meta.UploadMetaFiles = { files: [] };
    upload.files.forEach((file) => {
      resp.files.push({
        id: file.id,
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      });
    });
    return resp;
  }

  @GrpcMethod('MetaService', 'UploadIsActive')
  async uploadIsActive(data: grpc_meta.UploadId): Promise<grpc_meta.BoolValue> {
    const upload = await this.databaseService.findUploadById(data.id);
    if (upload == null) {
      throw new RpcException({ code: status.NOT_FOUND });
    }
    return { value: upload.active };
  }

  @GrpcMethod('MetaService', 'TokenIsValid')
  tokenIsValid(data: grpc_meta.TokenCred): grpc_meta.BoolValue {
    console.log(data);

    return { value: this.metaservice.validToken(data.token, data.uploadId) };
  }
}
