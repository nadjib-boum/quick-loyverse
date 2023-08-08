import db from "../../utils/db";
import APIError from "../../utils/errors";
import HTTPClient from "../../utils/http";
import {
  type IQuickbooksClient,
  type Tokens,
  type TokensExpiry,
  AuthHeaders,
} from "./types";

class QuickbooksClient implements IQuickbooksClient {
  private id: string;
  private realmId: string;
  private tokens: Tokens;
  private clientId: string;
  private clientSecret: string;
  private tokensHttpClient: HTTPClient;
  private dataHttpClient: HTTPClient;

  constructor(id: string) {
    this.id = id;
    this.realmId = "";
    this.tokens = {
      access_token: "",
      refresh_token: "",
    };
    this.clientId = process.env.INTUIT_CLIENT_ID!;
    this.clientSecret = process.env.INTUIT_CLIENT_SECRET!;
    this.tokensHttpClient = new HTTPClient(process.env.INTUIT_TOKEN_URL!);
    this.dataHttpClient = new HTTPClient(process.env.INTUIT_BASE_URL!);
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
      const { refresh_token, access_token } = await this.tokensHttpClient.post<
        Tokens,
        string
      >("/", {
        headers: {
          Accept: AuthHeaders.accept,
          "Content-Type": AuthHeaders.contentType,
          Authorization: `Basic ${this.getAuthHeader()}`,
        },
        body: HTTPClient.queryString({
          grant_type: "refresh_token",
          refresh_token: this.tokens.refresh_token,
        }),
      });
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
        `/company/${this.realmId}/query`,
        {
          headers: {
            "Content-Type": "application/text",
            Accept: "application/json",
            Authorization: `Bearer ${this.tokens.access_token}`,
          },
          body: queryStr,
        }
      );
      return data;
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

  private getAuthHeader() {
    const apiKey = `${this.clientId}:${this.clientSecret}`;
    return typeof btoa === "function"
      ? btoa(apiKey)
      : Buffer.from(apiKey).toString("base64");
  }
}

export default QuickbooksClient;
