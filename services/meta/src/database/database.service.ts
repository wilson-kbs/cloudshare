import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from './schemas/upload.schema';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
  ) {}

  async uploadExist(id: string): Promise<boolean> {
    let result = await this.uploadModel.findOne({ id }, 'id').exec();
    if (!!result) {
      return true;
    }
    return false;
  }

  async fileExist(id: string): Promise<boolean> {
    let result = await this.uploadModel
      .findOne({ 'files.id': id }, 'files.id')
      .exec();
    if (!!result) {
      return true;
    }
    return false;
  }

  async uploadFileExist(uploadId: string, fileId: string): Promise<boolean> {
    const result = await this.uploadModel
      .find({ id: uploadId, 'files.id': fileId })
      .exec();

    if (result.length !== 0) {
      return true;
    }
    return false;
  }

  async findUploadById(id: string): Promise<UploadDocument> {
    return await this.uploadModel.findOne({ id }, '-pwd').exec();
  }

  async findDataUploadById(id: string): Promise<UploadDocument> {
    return await this.uploadModel
      .findOne({ id }, 'id active auth pwd createAt expireAt permanante')
      .exec();
  }
}
