import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUploadDto } from "@/validator/CreateUploadDto";
import { DatabaseService } from '@database/service';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(
    //private databaseService: DatabaseService,
    private uploadService: UploadService,
  ) {}

  @Post()
  async addUpload(@Body() createUploadDto: CreateUploadDto): Promise<String> {
    if (createUploadDto.auth && !createUploadDto.password) {
      throw new HttpException('Password is empty', HttpStatus.BAD_REQUEST);
    }
    const uploadId = await this.uploadService.create(createUploadDto);
    if (uploadId === '' || !uploadId) {
      throw new HttpException(
        'Internal Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return uploadId;
  }
}
