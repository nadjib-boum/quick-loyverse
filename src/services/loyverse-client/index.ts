// @ts-nocheck

import HTTPClient from "../../utils/http";

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
    this.loyverseHttpClient = new HTTPClient(process.env.LOYVERSE_BASE_URL!);
  }
  async getCategories() {
    const res = await fetch("https://api.loyverse.com/v1.0/categories", {
      method: "GET",
      headers: {
        Authorization: `Bearer a9c0eb82c69147ab8d7cd9010601f627`,
      },
    });
    const categories = await res.json();
    /*
    const categories = await this.loyverseHttpClient.get("/categories", {
      Authorization: this.authHeader,
    });
    */
    return categories;
  }

  async getCustomers() {
    try {
      /*
      const res = await fetch("https://api.loyverse.com/v1.0/customers", {
        method: "GET",
        headers: {
          Authorization: `Bearer 49cbb595580c46b09041cbe60b30a451`,
        },
      });
      const customers = await res.json();
      */
      const customers = await this.loyverseHttpClient.get("/customers", {
        Authorization: this.authHeader,
        Accept: "*/*",
      });

      return customers;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default LoyverseClient;
