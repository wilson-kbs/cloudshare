import { MetaFile, ProcessState, StatueCode } from "@/@types";

type Auth = {
  required: boolean;
  state?: ProcessState;
  token?: string;
};

type StatueSharing = {
  statueCode?: StatueCode;
  state?: ProcessState;
  auth: Auth;
};

export type State = {
  uploadID: string;
  files: Array<MetaFile>;
  statueSharing: StatueSharing;
};

export const state: State = {
  uploadID: "",
  files: [],
  statueSharing: {
    auth: { required: false },
  },
};
