export type MetaFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
};

export type APIMetaResponse = {
  files: Array<MetaFile>;
};

export type APIAuthResponse = {
  statusCode: number;
  statusMsg: string;
  token?: string;
};
