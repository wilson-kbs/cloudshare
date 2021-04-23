import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from './schemas/upload.schema';

type FilesStore = 'FilesStore';

@Injectable()
export class DatabaseService {
  private filesStoreService: filespb.FilesStoreService;

  get FILES_STORE(): FilesStore {
    return 'FilesStore';
  }

  constructor(
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
    @Inject('FILES_MANAGER_PACKAGE') private clientFilesManager: ClientGrpc,
  ) {}

  onModuleInit() {
    this.filesStoreService = this.clientFilesManager.getService<filespb.FilesStoreService>(
      this.FILES_STORE,
    );
  }

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

  async getAllActiveUpload(): Promise<UploadDocument[]> {
    return this.uploadModel.find({ active: true }, '-pwd').exec();
  }

  // CRON

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'clean-sharings',
  })
  async cleanSharings() {
    try {
      const sharings = await this.getAllActiveUpload();
      sharings.forEach((item) => {
        if (!item.isActive()) {
          item.files.forEach(async (file) => {
            await this.filesStoreService.delete({ id: file.id }).toPromise();
          });
          item.active = false;
          item.save();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
