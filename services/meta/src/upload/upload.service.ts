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

type FilesStore = 'FilesStore';
type CacheStore = 'CacheStore';
type Store = FilesStore | CacheStore;

@Injectable()
export class UploadService implements OnModuleInit {
  private filesStoreService: filespb.FilesStoreService;
  private cacheStoreService: filespb.CacheStoreService;

  get FILES_STORE(): FilesStore {
    return 'FilesStore';
  }

  get CACHE_STORE(): CacheStore {
    return 'CacheStore';
  }

  private IDLength: number = 15;

  get nanoid(): string {
    while (true) {
      let id = nanoid(this.IDLength);
      let char = id.slice(-1);
      if (char == '-' || char == '_') {
        continue;
      }
      return id;
    }
  }

  constructor(
    private databaseService: DatabaseService,
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
    @Inject('FILES_MANAGER_PACKAGE') private clientFilesManager: ClientGrpc,
  ) {}

  onModuleInit() {
    this.filesStoreService = this.clientFilesManager.getService<filespb.FilesStoreService>(
      this.FILES_STORE,
    );
    this.cacheStoreService = this.clientFilesManager.getService<filespb.CacheStoreService>(
      this.CACHE_STORE,
    );
  }

  private async isExistInStore(store: Store, itemID: string) {
    let value: Promise<GRPC.BoolValue>;
    switch (store) {
      case this.FILES_STORE:
        value = this.filesStoreService.isExist({ id: itemID }).toPromise();
        break;
      case this.CACHE_STORE:
        value = this.cacheStoreService.isExist({ id: itemID }).toPromise();
        break;
    }
    return value.then((val) => val.value);
  }

  private async generateFile(itemID: string): Promise<MetaFile> {
    let metaFile = new MetaFile();

    let PromiseFileInfo = this.cacheStoreService
      .getMetadata({ id: itemID })
      .toPromise();

    while (true) {
      metaFile.id = this.nanoid;
      if (await this.databaseService.fileExist(metaFile.id)) {
        continue;
      }
      break;
    }

    await this.filesStoreService
      .generateFileFromCache({
        cacheFileID: itemID,
        newFileID: metaFile.id,
      })
      .toPromise();

    const fileInfo = await PromiseFileInfo;
    metaFile.name = fileInfo.name;
    metaFile.type = fileInfo.type ?? '';
    metaFile.setSize(fileInfo.size);
    metaFile.setLastModified(fileInfo.lastModified);

    return metaFile;
  }

  async createSharing(data: CreateUploadDto): Promise<string | null> {
    let upload = new this.uploadModel();

    try {
      // check if the files are present in the cache
      for (const cacheFileID of data.filesID) {
        if (!(await this.isExistInStore(this.CACHE_STORE, cacheFileID))) {
          console.log(`Error: ${cacheFileID} is not found in cache store`);
          return null;
        }
      }
      // generate files
      const files = data.filesID.map(async (item) => this.generateFile(item));

      // generate sharing ID
      while (true) {
        upload.id = this.nanoid;
        if (await this.databaseService.uploadExist(upload.id)) {
          continue;
        }
        break;
      }

      upload.files = await Promise.all(files);

      // hash password with brcypt
      if (data.auth) {
        upload.auth = true;
        upload.hashPassword(data.password);
      }

      // set expiration date
      upload.setCreateAndExpireDate(data.expire);

      // check if the file generation has been done
      for (const metaFile of upload.files) {
        if (!(await this.isExistInStore(this.FILES_STORE, metaFile.id))) {
          console.log(`Error: ${metaFile.id} is not found in files store`);
          return null;
        }
      }

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
