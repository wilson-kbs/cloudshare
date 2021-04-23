import { ProcessState } from "@/_utils";
import { FileItem } from "@/models";
import { Size } from "@/globals-CS";

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
  maxSizeFiles: number;
  options: UploadOptions;
};

export const state: State = {
  files: [],
  maxFiles: 5,
  maxSizeFiles: 10 * Size.GB,
  options: {
    expiration: 0,
    password: "",
  },
  processState: new ProcessState(),
  processCacheState: new ProcessState(),
  progress: 0,
  bytesUploaded: 0,
};
