import axios, { AxiosRequestConfig } from "axios";
import store from "@/store";
const http = axios.create({
  baseURL: process.env.VUE_APP_URL_BASE,
});
http.interceptors.request.use(
  (config: any) => {
    if (/\/plague\/list/.test(config.url) && config.method === "get") {
      return config;
    }
    if (store.getters["auth/token"]) {
      const hasExpired =
        Date.now() >= store.getters["auth/timeLogin"] + 3600000;
      if (hasExpired) {
        store.dispatch("auth/LOGOUT");
        return false;
      }
    }
    config.headers.Authorization = `Bearer ${store.getters["auth/token"]}`;
    return config;
  },
  (error: any) => {
    console.log("aqui");
    Promise.reject(error);
  }
);
export default http;

export async function axiosCall<T>(config: AxiosRequestConfig): Promise<any> {
  try {
    const { data } = await http.request<T>(config);
    return [null, data];
  } catch (error) {
    return [error];
  }
}
