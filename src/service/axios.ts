import axios from "axios";
import store from "@/store";
const http = axios.create({
  baseURL: process.env.VUE_APP_URL_BASE,
});
http.interceptors.request.use(
  (config: any) => {
    config.headers.Authorization = `Bearer ${store.getters["auth/token"]}`;
    return config;
  },
  (error: any) => Promise.reject(error)
);

export default http;
