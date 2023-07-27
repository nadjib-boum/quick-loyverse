import fetch from "node-fetch";
import queryString from "query-string";

type Headers = {
  [key: string]: string;
};

type RequestProps = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Headers;
  format?: "json" | "text" | "blob";
};

type RequestOptions = Omit<RequestProps, "method">;

class HTTPClient {
  private baseURL: string;
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request(
    endpoint: string,
    { method, body, headers, format = "json" }: RequestProps
  ) {
    let formattedBody: string | undefined;
    if (typeof body != "string") {
      formattedBody = JSON.stringify(body);
    } else {
      formattedBody = body;
    }

    try {
      const res = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: formattedBody,
      });
      if (format == "text") {
        return await res.text();
      }
      if (format == "blob") {
        return await res.blob();
      }
      return await res.json();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async get<T = any>(
    endpoint: string,
    { headers }: RequestOptions
  ): Promise<T> {
    try {
      const data = await this.request(endpoint, {
        method: "GET",
        headers,
      });
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async post<T = any, D = any>(
    endpoint: string,
    options: RequestOptions
  ): Promise<T> {
    try {
      const data = await this.request(endpoint, {
        method: "POST",
        ...options,
      });
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async put<T = any, D = any>(
    endpoint: string,
    options: RequestOptions
  ): Promise<T> {
    try {
      const data = await this.request(endpoint, {
        method: "POST",
        ...options,
      });
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async delete<T = any>(
    endpoint: string,
    options: RequestOptions
  ): Promise<T> {
    try {
      const data = await this.request(endpoint, {
        method: "GET",
        ...options,
      });
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static queryString(data: object) {
    return queryString.stringify(data);
  }
}
export default HTTPClient;
