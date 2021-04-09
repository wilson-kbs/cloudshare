import { ActionContext, ActionTree } from "vuex";
import { nanoid } from "nanoid";
import { Upload } from "tus-js-client";

import { RootState } from "@/store";

import { State } from "./state";
import { Mutations } from "./mutations";

import { UploadActionTypes as ActionTypes } from "./action-types";
import { UploadMutationTypes as MutationTypes } from "./mutation-types";
import { Getters } from "./getters";

import type { UploadFileItem, UploadJSONSend } from "@/@types";
import { Config } from "@/config";
import { FileItem, FileItemProps } from "@/models";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
} & Omit<ActionContext<State, RootState>, "commit" | "getters">;

export interface Actions {
  [ActionTypes.ADD_FILES](
    { commit }: AugmentedActionContext,
    payload: File[]
  ): void;
  [ActionTypes.START_UPLOAD](
    { commit, getters }: AugmentedActionContext,
    payload: number | undefined // number of parallal upload
  ): void;
  [ActionTypes.UPLOAD_HANDLER]({ commit }: AugmentedActionContext): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.ADD_FILES]({ commit, state, dispatch }, payload: Array<File>) {
    for (const FILE of payload) {
      const FileItemProps: FileItemProps = {
        id: "",
        mode: "UPLOAD",
      };

      for (;;) {
        const localID = nanoid(6);
        const v = state.files.filter((item) => item.id == localID);
        if (v.length == 0) {
          FileItemProps.id = localID;
          break;
        }
      }
      const fileItem = new FileItem(FileItemProps);
      fileItem.setMeta(FILE.name, FILE.size);
      fileItem.generateUploader(FILE);
      commit(MutationTypes.ADD_FILE, fileItem);
    }
  },
  [ActionTypes.START_UPLOAD]({ state }, payload) {
    const numParallalUpload = payload ?? state.files.length < 2 ? 1 : 2;

    for (let i = 0; i < numParallalUpload; i++) {
      const file = state.files[i];
      if (file.upload) file.upload();
    }
  },
  async [ActionTypes.UPLOAD_HANDLER]({ state, getters, commit }) {
    const file = getters.getOneFileNotUpload;

    if (file != undefined) {
      return file.uploader()();
    }

    if (!getters.AllUploadFinish) return;
    if (state.uploadCacheState == "SUCCESS") return;
    else commit(MutationTypes.SET_UPLOAD_CACHE_STATE, "SUCCESS");

    const body: UploadJSONSend = {
      auth: state.password.length < 4 ? false : true,
      password: state.password,
      expire: state.expiration,
      filesID: state.files.map((item) => item.serverID!),
    };

    function handleResponse(response: Response) {
      if (!response.ok) {
        commit(MutationTypes.SET_UPLOAD_STATE, "ERROR");
        throw response.status;
      }
      return response;
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const data = await fetch(Config.UPLOAD_PATH, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    })
      .then(handleResponse)
      .then((response) => response.text());
    commit(MutationTypes.SET_UPLOAD_ID, data);
    commit(MutationTypes.SET_UPLOAD_STATE, "SUCCESS");
  },
};
