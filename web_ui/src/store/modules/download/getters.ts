import { GetterTree } from "vuex";

import { RootState } from "@/store";
import { State } from "./state";

export type Getters = {
  StatueCode(state: State): number;
  Download__IsSingleFile(state: State): boolean;
  AuthRequired(state: State): boolean;
  AuthSuccess(state: State): Boolean;
};

export const getters: GetterTree<State, RootState> = {
  StatueCode: (state) => state.statueSharing.statueCode,
  AuthRequired: (state) => state.statueSharing.auth.required,
  AuthSuccess: (state) => state.statueSharing.auth.state == "SUCCESS",
  Download__IsSingleFile: (state) => state.files.length == 1,
};
