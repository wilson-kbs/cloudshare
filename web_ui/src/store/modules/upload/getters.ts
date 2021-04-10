import { GetterTree } from "vuex";

import { RootState } from "@/store";
import { State } from "./state";
import { ProcessState, UploadFileItem } from "@/@types";

export type Getters = {
  UPLOAD__Password(state: State): string;
  UPLOAD__Expiration(state: State): number;
  UPLOAD__GetAllServerID(state: State): Array<string>;
  UPLOAD__FilesLength(state: State): number;
  UPLOAD__GetSizeOfAllFiles(state: State): number;
  uploadState(state: State): ProcessState | undefined;
  uploadCacheState(state: State): ProcessState | undefined;
  uplaodFilesLength(state: State): number;
  getOneFileNotUpload(state: State): UploadFileItem | undefined;
  AllUploadFinish(state: State): boolean;
};

export const getters: GetterTree<State, RootState> = {
  UPLOAD__FilesLength: (state) => state.files.length,
  UPLOAD__Password: (state) => state.options.password,
  UPLOAD__Expiration: (state) => state.options.expiration,
  UPLOAD__GetAllServerID: (state) => {
    return state.files.map((item) => {
      if (item.serverID) return item.serverID;
    });
  },
  UPLOAD__GetSizeOfAllFiles: (state) => {
    if (state.files.length > 0)
      return state.files
        .map((item) => item.size)
        .reduce((prev, next) => prev + next);
    else return 0;
  },
  uploadState: (state) => state.status,
  uploadCacheState: (state) => state.cacheStatus,
  uplaodFilesLength: (state) => state.files.length,
  getOneFileNotUpload: (state) => {
    const files = state.files.filter((item) => !item.status);
    if (files[0]) return files[0];
  },
  AllUploadFinish: (state) =>
    state.files.filter((item) => item.status == "SUCCESS").length ==
    state.files.length,
};
