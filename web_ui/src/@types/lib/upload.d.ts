import {} from "tus-js-client";

type StartUpload = () => void;

export type UploadFileItem = {
  data: File;
  localID: string;
  serverID?: string;
  name: string;
  size: number;
  error: boolean;
  pending: boolean;
  finish: boolean;
  progress: number;
  uploader(): Function;
};

export type UploadJSONSend = {
  auth: boolean;
  password: string;
  expire: number;
  filesID: Array<string>;
};
