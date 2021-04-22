import { MutationTree } from "vuex";

import type { State } from "./state";
import type { ProcessState, UploadFileItem } from "@/@types";

import { UploadMutationTypes as MutationTypes } from "./mutation-types";
import { FileItem } from "@/models";

export type Mutations<S = State> = {
  [MutationTypes.PUSH_FILE](state: S, payload: FileItem): void;
  [MutationTypes.REMOVE_FILE](state: S, payload: string): void;
  [MutationTypes.UPLOAD_ID](state: S, payload: string): void;
  [MutationTypes.PROCESS_STATE](state: S, payload: ProcessState): void;
  [MutationTypes.PROCESS_CACHE_STATE](state: S, payload: ProcessState): void;
  [MutationTypes.EXPIRATION](state: S, payload: number): void;
  [MutationTypes.PASSWORD](state: S, payload: string): void;
  [MutationTypes.ADD_BYTES_UPLOADED](state: State, payload: number): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.PUSH_FILE](state, file: FileItem) {
    state.files.push(file);
  },
  [MutationTypes.REMOVE_FILE](state, payload) {
    state.files.splice(
      state.files.findIndex((item) => item.id == payload),
      1
    );
  },
  [MutationTypes.UPLOAD_ID](state, payload) {
    state.uploadID = payload;
  },
  [MutationTypes.PROCESS_STATE](state, payload) {
    state.processState.value = payload;
  },
  [MutationTypes.PROCESS_CACHE_STATE](state, payload) {
    state.processCacheState.value = payload;
  },
  [MutationTypes.EXPIRATION](state, payload: number) {
    state.options.expiration = payload;
  },
  [MutationTypes.PASSWORD](state, payload: string) {
    state.options.password = payload;
  },
  [MutationTypes.ADD_BYTES_UPLOADED](state, bytes) {
    state.bytesUploaded += bytes;
  },
};
