import { type AxiosRequestConfig } from "axios";

export type ApiResponse<T = any> = {
  status: "success";
  data: T;
};

export interface IHTTPClient {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}
