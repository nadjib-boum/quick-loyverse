import db from "../utils/db";
import APIError from "../utils/errors";
import HTTPClient from "../utils/http";

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export enum AuthHeaders {
  accept = "application/json",
  contentType = "application/x-www-form-urlencoded",
}

export interface IQuickbooksClient {}

export type TokensExpiry = {
  access_token_expiry: number;
  refresh_token_expiry: number;
};

type QuickbooksCustomerData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zip_code: string;
  notes: string;
};

class QuickbooksClient implements IQuickbooksClient {
  private id: string;
  private realmId: string;
  private tokens: Tokens;
  private clientId: string;
  private clientSecret: string;
  private clientHeaders: { [key: string]: string };
  private tokensHttpClient;
  private dataHttpClient;

  constructor(id: string) {
    this.id = id;
    this.realmId = "";
    this.tokens = {
      access_token: "",
      refresh_token: "",
    };
    this.clientId = process.env.INTUIT_CLIENT_ID!;
    this.clientSecret = process.env.INTUIT_CLIENT_SECRET!;
    this.clientHeaders = {
      Accept: AuthHeaders.accept,
      "Content-Type": AuthHeaders.contentType,
      Authorization: `Basic ${this.getAuthHeader()}`,
    };
    this.tokensHttpClient = HTTPClient.create({
      baseURL: process.env.INTUIT_TOKEN_URL!,
      headers: this.clientHeaders,
    });
    this.dataHttpClient = HTTPClient.create({
      baseURL: process.env.INTUIT_BASE_URL!,
      headers: this.clientHeaders,
    });
  }

  public async init() {
    const { access_token, refresh_token, realmId } =
      (await db.company.findFirst({
        where: {
          id: this.id,
        },
        select: {
          access_token: true,
          refresh_token: true,
          realmId: true,
        },
      })) as Tokens & { realmId: string };
    this.tokens.access_token = access_token;
    this.tokens.refresh_token = refresh_token;
    this.realmId = realmId;
  }

  private async refreshAccessToken(): Promise<Tokens> {
    try {
      const {
        data: { refresh_token, access_token },
      } = await this.tokensHttpClient.post(
        "/",
        JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: this.tokens.refresh_token,
        })
      );
      await db.company.update({
        where: {
          id: this.id,
        },
        data: {
          access_token,
          refresh_token,
        },
      });
      this.tokens = { refresh_token, access_token };
      return { refresh_token, access_token };
    } catch (err) {
      return Promise.reject(err);
    }
  }

  private async validateTokens() {
    try {
      const { access_token_expiry, refresh_token_expiry } =
        (await db.company.findFirst({
          where: {
            id: this.id,
          },
          select: {
            access_token_expiry: true,
            refresh_token_expiry: true,
          },
        })) as TokensExpiry;

      if (!refresh_token_expiry || !access_token_expiry) {
        throw new APIError({
          label: "QUICKBOOKS_TOKEN_VALIDATE_FAILED",
          description: "company does not exist",
          code: 400,
        });
      }

      if (Date.now() >= refresh_token_expiry!) {
        throw new APIError({
          label: "QUICKBOOKS_TOKEN_VALIDATE_FAILED",
          description: "refresh token exprired",
          code: 400,
        });
      }

      if (Date.now() >= access_token_expiry!) {
        await this.refreshAccessToken();
      }
    } catch (err: any) {
      return Promise.reject(err);
    }
  }

  private async query<T = any>(queryStr: string): Promise<T> {
    try {
      await this.validateTokens();
      const data = await this.dataHttpClient.post(
        `/${this.realmId}/query`,
        queryStr
      );
      return data as T;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getInvoices() {
    try {
      const invoices = await this.query("select * from Invoice");
      return invoices;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async insertCustomers(
    companyid: string,
    data: QuickbooksCustomerData
  ) {
    this.dataHttpClient.post(`/${companyid}/customers`, {
      DisplayName: data.name,
      Notes: data.notes,
      PrimaryEmailAddr: {
        Address: data.email,
      },
      PrimaryPhone: {
        FreeFormNumber: data.phone,
      },
      BillAddr: {
        City: data.city,
        PostalCode: data.zip_code,
        Country: data.country,
      },
    });
  }

  private getAuthHeader() {
    const apiKey = `${this.clientId}:${this.clientSecret}`;
    return typeof btoa === "function"
      ? btoa(apiKey)
      : Buffer.from(apiKey).toString("base64");
  }
}

export default QuickbooksClient;
