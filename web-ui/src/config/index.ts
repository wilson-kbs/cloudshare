export const Config = {
  API_BASEPATH: process.env.VUE_APP_API_BASEPATH,
  TUS_PATH: `${process.env.VUE_APP_API_BASEPATH}/cache/`,
  UPLOAD_PATH: `${process.env.VUE_APP_API_BASEPATH}/upload`,
  AUTH_PATH: `${process.env.VUE_APP_API_BASEPATH}/auth`,
  METADATA_PATH: `${process.env.VUE_APP_API_BASEPATH}/meta`,
  DOWNLOAD_PATH: `${process.env.VUE_APP_API_BASEPATH}/d`,
};
