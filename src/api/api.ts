import axios from "axios";

// export const BASEURL = window._env_.API_URL;
export const BASEURL = "http://localhost:3000";

export const myAxios = axios.create({
  baseURL: BASEURL,
  timeout: 30000,
  headers: {
    Accept: "*/*",
  },
});
