import type { ProcessState, UploadFileItem } from "@/@types";

export type State = {
  uploadID?: string;
  uploadState?: ProcessState;
  uploadCacheState?: ProcessState;
  files: Array<UploadFileItem>;
  expiration: number;
  password: string;
};

export const state: State = {
  //uploadID: "",
  //uploadState: "SUCCESS",
  files: [],
  expiration: 0,
  password: "",
};
