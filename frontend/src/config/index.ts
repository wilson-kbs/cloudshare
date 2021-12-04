const API_URL = `http://${location.host}`
const API_BASEPATH = "/api"
export const Config = {
  API_URL: API_URL,
  API_BASEPATH: API_BASEPATH,
  TUS_PATH: `${API_BASEPATH}/cache/`,
  UPLOAD_PATH: `${API_BASEPATH}/upload`,
  AUTH_PATH: `${API_BASEPATH}/auth`,
  METADATA_PATH: `${API_BASEPATH}/meta`,
  DOWNLOAD_PATH: `${API_BASEPATH}/d`,
};
