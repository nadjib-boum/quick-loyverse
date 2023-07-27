export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export enum AuthHeaders {
  accept = "application/json",
  contentType = "application/x-www-form-urlencoded",
}

export interface IQuickbooksClient {
  refreshAccessToken: () => Promise<Tokens>;
  getAuthHeader: () => string;
  validateTokens: () => void;
}

export type TokensExpiry = {
  access_token_expiry: number;
  refresh_token_expiry: number;
};
