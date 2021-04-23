import { MutationTree } from "vuex";

import type { State } from "./state";
import type { StatueCode } from "@/@types";
import type { ProcessStateValue } from "@/_utils";

import { DownloadMutationTypes as MutationTypes } from "./mutation-types";
import { FileItem } from "@/models";

export type Mutations<S = State> = {
  [MutationTypes.FETCH_STATE](state: S, payload: ProcessStateValue): void;
  [MutationTypes.ADD_FILE](state: S, payload: FileItem): void;
  [MutationTypes.ADD_FILES](state: S, payload: Array<FileItem>): void;
  [MutationTypes.UPLOAD_ID](state: S, payload: string): void;
  [MutationTypes.HTTP_CODE](state: S, payload: StatueCode): void;
  [MutationTypes.AUTH_REQUIRED](state: S, payload: boolean): void;
  [MutationTypes.AUTH_STATE](state: S, payload: ProcessStateValue): void;
  [MutationTypes.AUTH_TOKEN](state: S, payload: string): void;
  [MutationTypes.DIRECT_DOWNLOAD_MODE](state: S, payload: boolean): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.FETCH_STATE](state, value) {
    state.fetch.state.value = value;
  },
  [MutationTypes.ADD_FILE](state, file) {
    state.files.push(file);
  },
  [MutationTypes.ADD_FILES](state, files) {
    for (const file of files) {
      state.files.push(file);
    }
  },
  [MutationTypes.UPLOAD_ID](state, id) {
    state.uploadID = id;
  },
  [MutationTypes.HTTP_CODE](state, HTTPCode) {
    state.fetch.code = HTTPCode;
  },
  [MutationTypes.AUTH_REQUIRED](state, value) {
    state.auth.required = value;
  },
  [MutationTypes.AUTH_STATE](state, value) {
    state.auth.state.value = value;
  },
  [MutationTypes.AUTH_TOKEN](state, token) {
    state.auth.token = token;
  },
  [MutationTypes.DIRECT_DOWNLOAD_MODE](state, value) {
    state.directDownloadMode = value;
  },
};
