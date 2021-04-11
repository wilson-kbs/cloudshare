import { ActionContext, ActionTree, DispatchOptions } from "vuex";
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
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
} & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
} & Omit<ActionContext<State, RootState>, "commit" | "getters" | "dispatch">;

export interface Actions {
  [ActionTypes.ADD_FILE](
    { commit }: AugmentedActionContext,
    payload: File
  ): void;
  [ActionTypes.START_UPLOAD](
    { commit, getters }: AugmentedActionContext,
    payload: number | undefined // number of parallal upload
  ): void;
  [ActionTypes.HANDLER]({
    commit,
    getters,
    dispatch,
  }: AugmentedActionContext): void;
  [ActionTypes.SEND_OPTIONS]({ commit }: AugmentedActionContext): Promise<void>;
}

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.ADD_FILE]({ commit, state }, file) {
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
    fileItem.setMeta(file.name, file.size);
    fileItem.generateUploader(file);
    commit(MutationTypes.PUSH_FILE, fileItem);
  },
  [ActionTypes.START_UPLOAD]({ state, commit }, payload) {
    const numParallalUpload = payload ?? state.files.length < 2 ? 1 : 2;
    commit(MutationTypes.PROCESS_STATE, "RUNNING");
    for (let i = 0; i < numParallalUpload; i++) {
      const file = state.files[i];
      if (file.upload) file.upload();
    }
  },
  async [ActionTypes.HANDLER]({ state, getters, commit, dispatch }) {
    // Send next files
    const file = getters.UPLOAD__NextReadyFile;
    if (file && file.upload) return file.upload();

    // Set processCacheState to avoid multi call api
    if (!getters.UPLOAD__IsAllFinish) return;
    if (state.processCacheState.isFinish) return;
    else commit(MutationTypes.PROCESS_CACHE_STATE, "FINISH");

    dispatch(ActionTypes.SEND_OPTIONS).then(() => {
      commit(MutationTypes.PROCESS_STATE, "FINISH");
    });
  },
  async [ActionTypes.SEND_OPTIONS]({ state, getters, commit }) {
    const body: UploadJSONSend = {
      auth: getters.UPLOAD__Password.length < 4 ? false : true,
      password: getters.UPLOAD__Password,
      expire: getters.UPLOAD__Expiration,
      filesID: getters.UPLOAD__GetAllServerID,
    };

    function handleResponse(response: Response) {
      if (!response.ok) {
        commit(MutationTypes.PROCESS_STATE, "ERROR");
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
    return commit(MutationTypes.UPLOAD_ID, data);
  },
};
