import { FileItem } from "@/models";
import { ProcessState as AuthState, ProcessState } from "@/_utils";

type CredState = {
  required: boolean;
  state: ProcessState;
  token: string;
};

interface FetcherState {
  state: ProcessState;
  code: number; // HTTPCode
}

export type State = {
  uploadID: string;
  directDownloadMode: boolean;
  files: Array<FileItem>;
  fetch: FetcherState;
  auth: CredState;
};

export const state: State = {
  uploadID: "",
  directDownloadMode: false,
  files: [],
  fetch: {
    state: new ProcessState(),
    code: 0,
  },
  auth: {
    required: false,
    state: new AuthState(),
    token: "",
  },
};
