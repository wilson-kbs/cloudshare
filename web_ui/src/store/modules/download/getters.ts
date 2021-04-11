import { GetterTree } from "vuex";

import { RootState } from "@/store";
import { State } from "./state";

export type Getters = {
  DOWNLOAD__HTTPCode(state: State): number;
  DOWNLOAD__IsAuthRequired(state: State): boolean;
  DOWNLOAD__IsAuthSuccess(state: State): boolean;
  Download__IsSingleFile(state: State): boolean;
};

export const getters: GetterTree<State, RootState> = {
  DOWNLOAD__HTTPCode: (state) => state.fetch.code,
  DOWNLOAD__IsAuthRequired: (state) => state.auth.required,
  DOWNLOAD__IsAuthSuccess: (state) => state.auth.state.isSuccess,
  Download__IsSingleFile: (state) => state.files.length == 1,
};
