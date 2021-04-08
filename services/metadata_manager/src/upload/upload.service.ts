import { Model } from 'mongoose';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Upload, UploadDocument } from '@/database/schemas/upload.schema';
import { CreateUploadDto } from '../validator/CreateUploadDto';
import { nanoid } from 'nanoid';
import { ClientGrpc } from '@nestjs/microservices';
import { DatabaseService } from '@/database/database.service';
import { MetaFile } from '@/database/schemas/metafile.schema';
import { grpc_files } from '@/proto.interface';

type Storage = 'UPLOAD' | 'CACHE';

@Injectable()
export class UploadService implements OnModuleInit {
  private filesService: grpc_files.FilesService;
  private CACHESTORE: Storage = 'CACHE';
  private UPLOADSTORE: Storage = 'UPLOAD';

  constructor(
    private databaseService: DatabaseService,
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
    @Inject('FILES_MANAGER_PACKAGE') private clientFileManager: ClientGrpc,
  ) {}

  onModuleInit() {
    this.filesService = this.clientFileManager.getService<grpc_files.FilesService>(
      'FilesService',
    );
  }

  private async filesExistInStorage(
    storage: Storage,
    filesId: string[],
  ): Promise<boolean> {
    const dataQueryExist: grpc_files.StoreFilesId = {
      store: storage,
      ids: filesId,
    };
    const res: grpc_files.BoolValue = await this.filesService
      .filesExist(dataQueryExist)
      .toPromise();
    return res.value ?? false;
  }

  async makeFile(cacheId: string): Promise<string | null> {
    let id: string;
    while (true) {
      id = nanoid();
      if (await this.databaseService.fileExist(id)) {
        continue;
      }
      break;
    }

    const queryMove: grpc_files.MoveTo = {
      fromCacheId: cacheId,
      toUploadId: id,
    };

    const bool: grpc_files.BoolValue = await this.filesService
      .moveFilesToUploadStore(queryMove)
      .toPromise();
    if (!bool.value) {
      return null;
    }
    return id;
  }

  async getMetaFileInCACHEStorage(fileId: string): Promise<MetaFile | null> {
    let metaFile = new MetaFile();
    const metaCacheFile = await this.filesService
      .getMetaCacheFile({ id: fileId })
      .toPromise();
    console.log(metaCacheFile.size, metaCacheFile.lastModified);

    metaFile.name = metaCacheFile.name;
    metaFile.type = metaCacheFile.type ?? '';
    metaFile.setSize(metaCacheFile.size);
    metaFile.setLastModified(metaCacheFile.lastModified);
    return metaFile;
  }

  async generateFilesFromCACHE(filesId: string[]): Promise<MetaFile[] | null> {
    let ids: string[] = [];
    filesId.forEach((id) => {
      let item: string = id;
      ids.push(item);
    });
    if (!(await this.filesExistInStorage(this.CACHESTORE, filesId))) {
      return null;
    }
    //let self = this;
    const metaFiles: MetaFile[] = await Promise.all(
      filesId.map(
        async (id): Promise<MetaFile> => {
          const uploadFileId = this.makeFile(id);
          const metaFile = this.getMetaFileInCACHEStorage(id);
          (await metaFile).id = await uploadFileId;
          return metaFile;
        },
      ),
    );
    return metaFiles;
  }

  async create(data: CreateUploadDto): Promise<string | null> {
    let upload = new this.uploadModel();

    try {
      // check and make files
      const files = this.generateFilesFromCACHE(data.filesID);
      // make Upload ID
      while (true) {
        let id = nanoid(10);
        let char = id.slice(-1);
        if (char == '-' || char == '_') {
          continue;
        }
        if (await this.databaseService.uploadExist(id)) {
          continue;
        }
        upload.id = id;
        break;
      }

      if (!(await files)) {
        throw 'Error from add upload data on Database';
      }
      // add data files in schema Upload
      upload.files = await files;

      // hash password with brcypt
      if (data.auth) {
        upload.auth = true;
        upload.hashPassword(data.password);
      }

      // add Expire Data
      upload.setCreateAndExpireDate(data.expire);

      // save data
      let doc = await upload.save();

      if (!doc) {
        throw 'Error from add upload data on Database';
      }

      return upload.id;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
