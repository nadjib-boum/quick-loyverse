// @ts-nocheck

import HTTPClient from "../utils/http";

type AuthProps = {
  access_token: string;
};

interface ILoyverseClient {}

class LoyverseClient implements ILoyverseClient {
  private authHeader: string;
  private loyverseHttpClient: HTTPClient;
  constructor(private authProps: AuthProps) {
    this.authProps = authProps;
    this.authHeader = `Bearer ${this.authProps.access_token}`;
    this.loyverseHttpClient = HTTPClient.create({
      baseURL: "https://api.loyverse.com/v1.0",
      headers: {
        Authorization: this.authHeader,
      },
    });
  }

  async getCustomers() {
    try {
      const customers = await this.loyverseHttpClient.get("/customers");
      return customers.data;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default LoyverseClient;
