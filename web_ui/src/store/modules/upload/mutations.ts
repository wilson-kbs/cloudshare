import { MutationTree } from "vuex";

import type { State } from "./state";
import type { UploadFileItem } from "@/@types";

import { UploadMutationTypes as MutationTypes } from "./mutation-types";
import { FileItem } from "@/models";

export type Mutations<S = State> = {
  [MutationTypes.PUSH_FILE](state: S, payload: FileItem): void;
  [MutationTypes.REMOVE_FILE](state: S, payload: string): void;
  [MutationTypes.UPLOAD_ID](state: S, payload: string): void;
  [MutationTypes.STATUS](
    state: S,
    payload: "PENDING" | "SUCCESS" | "ERROR" | undefined
  ): void;
  [MutationTypes.CACHE_STATUS](
    state: S,
    payload: "PENDING" | "SUCCESS" | "ERROR" | undefined
  ): void;
  [MutationTypes.EXPIRATION](state: S, payload: number): void;
  [MutationTypes.PASSWORD](state: S, payload: string): void;
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
  [MutationTypes.STATUS](state, payload) {
    state.status = payload;
  },
  [MutationTypes.CACHE_STATUS](state, payload) {
    state.cacheStatus = payload;
  },
  [MutationTypes.EXPIRATION](state, payload: number) {
    state.options.expiration = payload;
  },
  [MutationTypes.PASSWORD](state, payload: string) {
    state.options.password = payload;
  },
};
