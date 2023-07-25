import fetch from "node-fetch";
import queryString from "query-string";

type RequestProps = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: object;
};

class HTTPClient {
  private baseURL: string;
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request(endpoint: string, { method, body, headers }: RequestProps) {
    try {
      const res = await fetch(`${this.baseURL}/${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        throw new Error("error");
      }
      return await res.json();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async get<T = any>(endpoint: string, headers?: object): Promise<T> {
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
    body?: D,
    headers?: object
  ): Promise<T> {
    try {
      const data = await this.request(endpoint, {
        method: "POST",
        headers,
        body,
      });
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async put<T = any, D = any>(
    endpoint: string,
    body?: D,
    headers?: object
  ): Promise<T> {
    try {
      const data = await this.request(endpoint, {
        method: "POST",
        headers,
        body,
      });
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async delete<T = any>(endpoint: string, headers?: object): Promise<T> {
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

  static queryString(data: object) {
    return queryString.stringify(data);
  }
}
export default HTTPClient;
