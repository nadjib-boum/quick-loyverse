import { type Request, type Response, type Router } from "express";
const OAuthClient = require("intuit-oauth");

let oauthClient: any = null;

export default (router: Router) => {
  router.get("/quickbooks", (req: Request, res: Response) => {
    res.send("Quickbooks API");
  });

  router.get("/quickbooks/authorize", (req: Request, res: Response) => {
    oauthClient = new OAuthClient({
      clientId: process.env.INTUIT_CLIENT_ID,
      clientSecret: process.env.INTUIT_CLIENT_SECRET,
      environment: process.env.INTUIT_ENVIRONEMENT,
      redirectUri: process.env.INTUIT_REDIRECT_URI,
    });
    const authUri = oauthClient.authorizeUri({
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
    res.status(200).send({ status: "success", data: { authUri } });
  });

  router.get("/quickbooks/callback", (req: Request, res: Response) => {
    if (oauthClient) {
      oauthClient
        .createToken(req.url)
        .then(function (authResponse: any) {
          res.status(200).send(authResponse.getJson());
        })
        .catch(function (e: any) {
          console.error(e);
          res.status(500).send("ERROR");
        });
    }
  });

  router.get("/quickbooks/getCompanyInfo", (req: Request, res: Response) => {
    if (oauthClient) {
      const companyID = oauthClient.getToken().realmId;

      const url =
        oauthClient.environment == "sandbox"
          ? OAuthClient.environment.sandbox
          : OAuthClient.environment.production;

      oauthClient
        .makeApiCall({
          url: `${url}v3/company/${companyID}/companyinfo/${companyID}`,
        })
        .then(function (authResponse: any) {
          res.send(JSON.parse(authResponse.text()));
        })
        .catch(function (e: any) {
          console.error(e);
        });
    }
  });

  router.get("/quickbooks/items", (req: Request, res: Response) => {
    const companyID = oauthClient.getToken().realmId;

    const url =
      oauthClient.environment == "sandbox"
        ? OAuthClient.environment.sandbox
        : OAuthClient.environment.production;

    oauthClient
      .makeApiCall({
        url: `${url}v3/company/${companyID}/query?query=select * from Item`,
      })
      .then(function (authResponse: any) {
        res.send(JSON.parse(authResponse.text()));
      })
      .catch(function (e: any) {
        console.error(e);
      });
  });

  router.get("/quickbooks/profile", (req: Request, res: Response) => {
    if (oauthClient) {
      oauthClient
        .getUserInfo()
        .then(function (response: any) {
          res.status(200).send(response.json);
        })
        .catch(function (e: any) {
          console.log(e);
          res.status(500).send("SERVER ERROR");
        });
    }
  });
};
