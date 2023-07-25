import HTTPClient from "../../utils/http";

type Tokens = {
  access_token: string;
  refresh_token: string;
};

enum AuthHeaders {
  accept = "Accept",
  contentType = "application/x-www-form-urlencoded",
}

interface IQuickbooksClient {
  refreshToken: () => Promise<Tokens>;
  getAuthHeader: () => string;
  isTokenValid(): boolean;
}

class QuickbooksClient implements IQuickbooksClient {
  private tokens: Tokens;
  private tokensHttpClient: HTTPClient;
  private clientId: string;
  private clientSecret: string;
  constructor(props: Tokens) {
    this.tokens = {
      access_token: props.access_token,
      refresh_token: props.refresh_token,
    };
    this.tokensHttpClient = new HTTPClient(process.env.INTUIT_TOKEN_URL!);
    this.clientId = process.env.INTUIT_CLIENT_ID!;
    this.clientSecret = process.env.INTUIT_CLIENT_SECRET!;
  }
  getAuthHeader() {
    const apiKey = `${this.clientId}:${this.clientSecret}`;
    return typeof btoa === "function"
      ? btoa(apiKey)
      : Buffer.from(apiKey).toString("base64");
  }
  async refreshToken(): Promise<Tokens> {
    const { refresh_token, access_token } =
      await this.tokensHttpClient.post<Tokens>(
        "/",
        HTTPClient.queryString({
          grant_type: "refresh_token",
          refresh_token: this.tokens.refresh_token,
        }),
        {
          Accept: AuthHeaders.accept,
          "Content-Type": AuthHeaders.contentType,
          authorization: `Basic ${this.getAuthHeader()}`,
        }
      );
    return { refresh_token, access_token };
  }
  isTokenValid(): boolean {
    return false;
  }
}

export default QuickbooksClient;
