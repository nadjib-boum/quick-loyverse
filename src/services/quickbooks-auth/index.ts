import { Account, Company } from "@prisma/client";
import OAuthClient from "../../utils/intuit-auth";

export type CompanyData = Pick<
  Company,
  | "realmId"
  | "access_token"
  | "refresh_token"
  | "id_token"
  | "sub"
  | "access_token_expiry"
  | "refresh_token_expiry"
>;

export type AccountData = Pick<Account, "sub" | "username">;

type UserInfo = {
  companyData: CompanyData;
  accountData: AccountData;
};

interface IQuickbooksAuth {
  oauthClient: any;
  getAuthUri: () => string;
  generateAccessToken: (authCode: string) => Promise<string>;
  getUserInfo: () => Promise<UserInfo>;
}

class QuickbooksAuth implements IQuickbooksAuth {
  public oauthClient;
  constructor() {
    this.oauthClient = new OAuthClient({
      clientId: process.env.INTUIT_CLIENT_ID,
      clientSecret: process.env.INTUIT_CLIENT_SECRET,
      environment: process.env.INTUIT_ENVIRONEMENT,
      redirectUri: process.env.INTUIT_REDIRECT_URI,
    });
  }

  getAuthUri(): string {
    const authUri = this.oauthClient.authorizeUri({
      scope: [
        OAuthClient.scopes.Accounting,
        OAuthClient.scopes.OpenId,
        OAuthClient.scopes.Profile,
        OAuthClient.scopes.Email,
        OAuthClient.scopes.Phone,
        OAuthClient.scopes.Address,
      ],
      state: process.env.INTUIT_STATE,
    });
    return authUri;
  }

  async generateAccessToken(authCode: string): Promise<string> {
    const access_token = await this.oauthClient.createToken(authCode);
    return access_token;
  }

  async getUserInfo(): Promise<UserInfo> {
    const userInfo = await this.oauthClient.getUserInfo();
    const {
      token: {
        realmId,
        access_token,
        refresh_token,
        id_token,
        expires_in,
        x_refresh_token_expires_in,
      },
      json: { givenName, familyName, sub },
    } = userInfo;
    const three_min = 1000 * 60 * 3;
    const companyData: CompanyData = {
      realmId,
      access_token,
      refresh_token,
      id_token,
      sub,
      access_token_expiry: Date.now() + expires_in * 1000 - three_min,
      refresh_token_expiry:
        Date.now() + x_refresh_token_expires_in * 1000 - three_min,
    };
    const accountData: AccountData = {
      sub,
      username: `${givenName} ${familyName}`,
    };
    return { companyData, accountData };
  }
}

export default QuickbooksAuth;
