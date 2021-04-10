import type { ProcessState } from "@/@types";
import { FileItem } from "@/models";

export interface UploadOptions {
  expiration: number;
  password: string;
}

export type State = {
  uploadID?: string;
  status?: ProcessState;
  cacheStatus?: ProcessState;
  progress: number;
  files: Array<FileItem>;
  maxFiles: number;
  options: UploadOptions;
};

export const state: State = {
  files: [],
  maxFiles: 5,
  options: {
    expiration: 0,
    password: "",
  },
  progress: 0,
};
