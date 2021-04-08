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
    payload: number // number of parallal upload
  ): void;
  [ActionTypes.UPLOAD_HANDLER]({ commit }: AugmentedActionContext): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.ADD_FILES]({ commit, state, dispatch }, payload: Array<File>) {
    for (const FILE of payload) {
      const CUSTOM_FILE: UploadFileItem = {
        localID: "",
        name: FILE.name,
        size: FILE.size,
        data: FILE,
        error: false,
        finish: false,
        pending: false,
        progress: 0,
        uploader: function () {
          const upload = new Upload(this.data, {
            endpoint: Config.TUS_PATH,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            metadata: {
              filename: this.data.name,
              filetype: this.data.type,
              lastmodified: this.data.lastModified.toString(),
            },
            onError: (error) => {
              this.error = true;
              console.log("Failed because: " + error);
            },
            onProgress: (bytesUploaded, bytesTotal) => {
              this.progress = Math.floor((bytesUploaded / bytesTotal) * 100);
            },
            onSuccess: () => {
              this.pending = false;
              this.finish = true;
              this.serverID = upload.url?.split("/").pop() ?? undefined;
              dispatch(ActionTypes.UPLOAD_HANDLER);
            },
          });

          const starter = () => {
            this.pending = true;
            upload.start();
          };
          return starter;
        },
      };
      for (;;) {
        const localID = nanoid(6);
        const v = state.files.filter((item) => item.localID == localID);
        if (v.length == 0) {
          CUSTOM_FILE.localID = localID;
          break;
        }
      }
      commit(MutationTypes.ADD_FILE, CUSTOM_FILE);
    }
  },
  [ActionTypes.START_UPLOAD]({ state }, payload?) {
    const numParallalUpload = payload ?? state.files.length < 2 ? 1 : 2;

    for (let i = 0; i < numParallalUpload; i++) {
      state.files[i].uploader()();
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
