import type { ProcessState, UploadFileItem } from "@/@types";
import { FileItem } from "@/models";

export type State = {
  uploadID?: string;
  uploadState?: ProcessState;
  uploadCacheState?: ProcessState;
  files: Array<FileItem>;
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
