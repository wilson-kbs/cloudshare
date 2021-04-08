import { MutationTree } from "vuex";

import type { State } from "./state";
import type { MetaFile, ProcessState, StatueCode } from "@/@types";

import { DownloadMutationTypes as MutationTypes } from "./mutation-types";

export type Mutations<S = State> = {
  [MutationTypes.FETCHER_STATE](state: S, payload: ProcessState): void;
  [MutationTypes.ADD_FILE](state: S, payload: MetaFile): void;
  [MutationTypes.ADD_FILES](state: S, payload: Array<MetaFile>): void;
  [MutationTypes.DOWNLOAD__UPLOAD_ID](state: S, payload: string): void;
  [MutationTypes.HTTP_STATUE_CODE](state: S, payload: StatueCode): void;
  [MutationTypes.AUTH_REQUIRED](state: S, payload: boolean): void;
  [MutationTypes.AUTH_STATE](state: S, payload: ProcessState): void;
  [MutationTypes.AUTH_TOKEN](state: S, payload: string): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.FETCHER_STATE](state, value) {
    state.statueSharing.state = value;
  },
  [MutationTypes.ADD_FILE](state, file) {
    state.files.push(file);
  },
  [MutationTypes.ADD_FILES](state, files) {
    for (const file of files) {
      state.files.push(file);
    }
  },
  [MutationTypes.DOWNLOAD__UPLOAD_ID](state, id) {
    state.uploadID = id;
  },
  [MutationTypes.HTTP_STATUE_CODE](state, HTTPCode) {
    state.statueSharing.statueCode = HTTPCode;
  },
  [MutationTypes.AUTH_REQUIRED](state, value) {
    state.statueSharing.auth.required = value;
  },
  [MutationTypes.AUTH_STATE](state, value) {
    state.statueSharing.auth.state = value;
  },
  [MutationTypes.AUTH_TOKEN](state, token) {
    state.statueSharing.auth.token = token;
  },
};
