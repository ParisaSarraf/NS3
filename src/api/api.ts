import axios from "axios";

export let BASEURL = import.meta.env.VITE_API_URL;
if (window.location.pathname === "/map") {
  BASEURL = import.meta.env.VITE_API_URL_BACKEND_Map;
}
if (window.location.pathname === "/login") {
  BASEURL = import.meta.env.VITE_LOGIN;
}
if (window.location.pathname === "/fleet-twin") {
  BASEURL = import.meta.env.VITE_API_URL_BACKEND;
}
if (window.location.pathname === "/") {
  BASEURL = import.meta.env.VITE_API_URL;
}

export const myAxios = axios.create({
  baseURL: BASEURL,
  timeout: 30000,
  headers: {
    Accept: "*/*",
  },
});
