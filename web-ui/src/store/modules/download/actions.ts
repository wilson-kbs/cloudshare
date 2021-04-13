import { ActionContext, ActionTree, DispatchOptions } from "vuex";

import { RootState } from "@/store";

import { State } from "./state";
import { Mutations } from "./mutations";

import { DownloadActionTypes as ActionTypes } from "./action-types";
import { DownloadMutationTypes as MutationTypes } from "./mutation-types";
import { Getters } from "./getters";

import type { APIMetaResponse, APIAuthResponse, StatueCode } from "@/@types";
import { Config } from "@/config";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
} & Omit<ActionContext<State, RootState>, "commit" | "getters">;

export interface Actions {
  [ActionTypes.FETCH_METADADTA](
    { commit, getters }: AugmentedActionContext,
    payload: string
  ): void;
  [ActionTypes.GET_FILES](
    { commit, getters }: AugmentedActionContext,
    payload?: string // FilesID
  ): void;
  [ActionTypes.GET_AUTH](
    { commit, getters }: AugmentedActionContext,
    payload: string // password
  ): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.GET_AUTH]({ state, commit }, password) {
    commit(MutationTypes.AUTH_STATE, "RUNNING");
    const url = new URL(Config.AUTH_PATH, window.location.origin);
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const bodyRequest = {
      id: state.uploadID,
      pwd: password,
    };

    const initRequest: RequestInit = {
      method: "POST",
      headers: headers,
      mode: "cors",
      cache: "default",
      body: JSON.stringify(bodyRequest),
    };

    const resquest = new Request(url.toJSON(), initRequest);

    fetch(resquest).then(async (res: Response) => {
      if (!res.ok) {
        commit(MutationTypes.AUTH_STATE, "ERROR");
      } else {
        const data = (await res.json()) as APIAuthResponse;
        if (data.token) commit(MutationTypes.AUTH_TOKEN, data.token);
        commit(MutationTypes.AUTH_STATE, "SUCCESS");
      }
    });
  },
  async [ActionTypes.FETCH_METADADTA]({ state, getters, commit }, filesID) {
    commit(MutationTypes.FETCH_STATE, "RUNNING");
    const url = new URL(Config.METADATA_PATH, window.location.origin);

    url.searchParams.append("u", state.uploadID);
    if (filesID) url.searchParams.append("f", filesID);

    const headers = new Headers();

    if (getters.DOWNLOAD__IsAuthRequired && getters.DOWNLOAD__IsAuthSuccess)
      headers.append("Authorization", `Bearer ${state.auth.token}`);

    const initRequest: RequestInit = {
      method: "GET",
      headers: headers,
      mode: "cors",
      cache: "default",
    };

    const resquest = new Request(url.toJSON(), initRequest);

    fetch(resquest).then(async (res: Response) => {
      const statueCode = res.status as StatueCode;
      commit(MutationTypes.HTTP_CODE, statueCode);
      if (!res.ok) {
        if (res.status == 401) commit(MutationTypes.AUTH_REQUIRED, true);
        commit(MutationTypes.FETCH_STATE, "ERROR");
      } else {
        const data = (await res.json()) as APIMetaResponse;
        commit(MutationTypes.ADD_FILES, data.files);
        commit(MutationTypes.FETCH_STATE, "FINISH");
      }
    });
  },
  [ActionTypes.GET_FILES](_s, fileID) {
    console.log(fileID);
  },
};
