import { GetterTree } from "vuex";

import { RootState } from "@/store";
import { State } from "./state";
import { ProcessState, UploadFileItem } from "@/@types";

export type Getters = {
  uploadState(state: State): ProcessState | undefined;
  uploadCacheState(state: State): ProcessState | undefined;
  uplaodFilesLength(state: State): number;
  getOneFileNotUpload(state: State): UploadFileItem | undefined;
  AllUploadFinish(state: State): boolean;
};

export const getters: GetterTree<State, RootState> = {
  uploadState: (state) => state.uploadState,
  uploadCacheState: (state) => state.uploadCacheState,
  uplaodFilesLength: (state) => state.files.length,
  getOneFileNotUpload: (state) => {
    const files = state.files.filter(
      (item) => !item.finish && !item.pending && !item.error
    );
    if (files[0]) return files[0];
  },
  AllUploadFinish: (state) =>
    state.files.filter((item) => item.finish).length == state.files.length,
};
