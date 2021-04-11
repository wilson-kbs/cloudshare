import { Observable } from 'rxjs';

export namespace grpc_files {
  export interface BigInt {
    low: number;
    high: number;
    unsigned: boolean;
  }

  export interface FileId {
    id: string;
  }

  export interface StoreFilesId {
    store: 'CACHE' | 'UPLOAD';
    ids: Array<string>;
  }

  export interface MoveTo {
    fromCacheId: string;
    toUploadId: string;
  }

  export interface MetaFile {
    name: string;
    type: string;
    size: BigInt | number;
    lastModified: BigInt | number;
  }

  export interface BoolValue {
    value: boolean;
  }

  export interface FilesService {
    filesExist(data: StoreFilesId): Observable<BoolValue>;
    deleteFiles(data: StoreFilesId): Observable<BoolValue>;
    moveFilesToUploadStore(data: MoveTo): Observable<BoolValue>;
    getMetaCacheFile(data: FileId): Observable<MetaFile>;
  }
}

export namespace grpc_meta {
  export interface MetaUpload {
    id: string;
    auth: boolean;
    active: boolean;
    expireAt: string;
    permanent: boolean;
  }

  export interface MetaFile {
    id: string;
    name: string;
    type: string;
    size: number;
    lastModified: number;
  }

  export interface UploadId {
    id: string;
  }

  export interface UploadMetaFiles {
    files: Array<MetaFile>;
  }

  export interface UploadAndFileId {
    uploadId: string;
    fileId: string;
  }

  export interface TokenCred {
    uploadId: string;
    token: string;
  }
  export interface BoolValue {
    value: boolean;
  }

  export interface MetaService {
    getMetaupload(data: UploadId): Observable<MetaUpload>;
    getUploadMetaFile(data: UploadAndFileId): Observable<MetaFile>;
    getUploadMetaFiles(data: UploadId): Observable<UploadMetaFiles>;
    uploadIsActive(data: UploadId): Observable<BoolValue>;
    tokenIsValid(data: TokenCred): Observable<BoolValue>;
  }
}
