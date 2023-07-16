const OAuthClient = require("intuit-oauth");

interface IQuickBooks {
  oauthClient: any;
  getAuthUri: () => string;
  generateAccessToken: (authCode: string) => Promise<string>;
  getUserInfo: () => Promise<any>;
}

class Quickbooks implements IQuickBooks {
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

  async getUserInfo(): Promise<any> {
    const userInfo = await this.oauthClient.getUserInfo();
    return userInfo;
  }
}

export default Quickbooks;
