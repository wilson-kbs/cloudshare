import { createStore } from "vuex";

import {
  store as upload,
  UploadStore,
  State as UploadState,
} from "@/store/modules/upload";
import {
  store as download,
  DownloadStore,
  State as DownloadState,
} from "@/store/modules/download";

export type RootState = {
  upload: UploadState;
  download: DownloadState;
};

export type Store = UploadStore<Pick<RootState, "upload">> &
  DownloadStore<Pick<RootState, "download">>;

export const store = createStore({
  modules: {
    upload,
    download,
  },
});

export function useStore(): Store {
  return store as Store;
}
