import { ProcessState } from "@/_utils";
import { FileItem } from "@/models";

export interface UploadOptions {
  expiration: number;
  password: string;
}

export type SProcessState =
  | "CREATED"
  | "READY"
  | "RUNNING"
  | "FINISH"
  | "ERROR";

export type State = {
  uploadID?: string;
  processState: ProcessState;
  processCacheState: ProcessState;
  progress: number;
  bytesUploaded: number;
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
  processState: new ProcessState(),
  processCacheState: new ProcessState(),
  progress: 0,
  bytesUploaded: 0,
};
