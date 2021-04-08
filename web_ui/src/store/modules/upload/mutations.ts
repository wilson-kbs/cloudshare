import { MutationTree } from "vuex";

import type { State } from "./state";
import type { UploadFileItem } from "@/@types";

import { UploadMutationTypes as MutationTypes } from "./mutation-types";

export type Mutations<S = State> = {
  [MutationTypes.ADD_FILE](state: S, payload: UploadFileItem): void;
  [MutationTypes.REMOVE_FILE](state: S, payload: string): void;
  [MutationTypes.SET_UPLOAD_ID](state: S, payload: string): void;
  [MutationTypes.SET_UPLOAD_STATE](
    state: S,
    payload: "PENDING" | "SUCCESS" | "ERROR" | undefined
  ): void;
  [MutationTypes.SET_UPLOAD_CACHE_STATE](
    state: S,
    payload: "PENDING" | "SUCCESS" | "ERROR" | undefined
  ): void;
  [MutationTypes.UPDATE_EXPIRATION](state: S, payload: number): void;
  [MutationTypes.UPDATE_PASSWORD](state: S, payload: string): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.ADD_FILE](state, payload: UploadFileItem) {
    state.files.push(payload);
  },
  [MutationTypes.REMOVE_FILE](state, payload) {
    state.files.splice(
      state.files.findIndex((item) => item.localID == payload),
      1
    );
  },
  [MutationTypes.SET_UPLOAD_ID](state, payload) {
    state.uploadID = payload;
  },
  [MutationTypes.SET_UPLOAD_STATE](state, payload) {
    state.uploadState = payload;
  },
  [MutationTypes.SET_UPLOAD_CACHE_STATE](state, payload) {
    state.uploadCacheState = payload;
  },
  [MutationTypes.UPDATE_EXPIRATION](state, payload: number) {
    state.expiration = payload;
  },
  [MutationTypes.UPDATE_PASSWORD](state, payload: string) {
    state.password = payload;
  },
};
