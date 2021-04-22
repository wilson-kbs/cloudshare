import { Observable } from 'rxjs';

export {};

declare global {
  namespace GRPC {
    interface BigInt {
      low: number;
      high: number;
      unsigned: boolean;
    }
    interface BoolValue {
      value: boolean;
    }
    interface Empty {}
  }

  namespace filespb {
    interface ItemID {
      id: string;
    }

    interface GenerateFile {
      cacheFileID: string;
      newFileID: string;
    }

    interface MetaFile {
      name: string;
      type: string;
      size: GRPC.BigInt | number;
      lastModified: GRPC.BigInt | number;
    }

    // SERVICES
    interface FilesStoreService {
      isExist(data: ItemID): Observable<GRPC.BoolValue>;
      delete(data: ItemID): Observable<GRPC.Empty>;
      generateFileFromCache(data: GenerateFile): Observable<GRPC.Empty>;
    }

    interface CacheStoreService {
      isExist(data: ItemID): Observable<GRPC.BoolValue>;
      delete(data: ItemID): Observable<GRPC.Empty>;
      getMetadata(data: ItemID): Observable<MetaFile>;
    }
  }
}
