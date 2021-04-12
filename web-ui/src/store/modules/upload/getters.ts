import { GetterTree } from "vuex";

import { RootState } from "@/store";
import { State } from "./state";
import { ProcessState, UploadFileItem } from "@/@types";
import { FileItem } from "@/models";

export type Getters = {
  UPLOAD__Password(state: State): string;
  UPLOAD__Expiration(state: State): number;
  UPLOAD__GetAllServerID(state: State): Array<string>;
  UPLOAD__FilesLength(state: State): number;
  UPLOAD__GetSizeOfAllFiles(state: State): number;
  UPLOAD__ProcessState(state: State): ProcessState;
  UPLOAD__ProcessCacheState(state: State): ProcessState;
  UPLOAD__NextReadyFile(state: State): FileItem | undefined;
  UPLOAD__IsAllFinish(state: State): boolean;
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
  UPLOAD__ProcessState: (state) => state.processState,
  UPLOAD__ProcessCacheState: (state) => state.processCacheState,
  UPLOAD__NextReadyFile: (state) =>
    state.files.filter((item) => item.processState.isReady)[0],
  UPLOAD__IsAllFinish: (state) =>
    state.files.every((fileItem) => fileItem.isFinish),
};
