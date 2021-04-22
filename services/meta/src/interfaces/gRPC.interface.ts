import { Observable } from 'rxjs';

export interface Int {
  low: number;
  high: number;
  unsigned: boolean;
}

export interface FileId {
  id: string;
}

export interface StoreFilesId {
  store: string;
  ids: Array<FileId>;
}
export interface Ok {
  ok: boolean;
}

export interface MoveFile {
  cacheId: FileId;
  UploadId: FileId;
}

export interface MetadataFile {
  name: string;
  type: string;
  size: Int | number;
  last_modified: Int | number;
}

export interface FileService {
  filesExist(data: StoreFilesId): Observable<Ok>;
  deleteFiles(data: StoreFilesId): Observable<Ok>;
  moveFilesToUploadStore(data: MoveFile): Observable<Ok>;
  getMetaCacheFile(data: FileId): Observable<MetadataFile>;
}
