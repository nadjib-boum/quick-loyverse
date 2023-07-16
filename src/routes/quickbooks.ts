import {
  NextFunction,
  type Request,
  type Response,
  type Router,
} from "express";

import QuickbooksAuth from "../services/quickbooks-auth";

let qb: any = null;

export default (router: Router) => {
  router.get(
    "/quickbooks",
    (req: Request, res: Response, next: NextFunction) => {
      try {
        res.send("Quickbooks API");
      } catch (err: any) {
        next(err);
      }
    }
  );

  router.get(
    "/quickbooks/auth",
    (req: Request, res: Response, next: NextFunction) => {
      try {
        qb = new QuickbooksAuth();
        const authUri = qb.getAuthUri();
        res.status(200).send({ status: "success", data: { authUri } });
      } catch (err: any) {
        next(err);
      }
    }
  );

  router.get(
    "/quickbooks/auth/callback",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (qb) {
          await qb.generateAccessToken(req.url);
          const { companyData, accountData } = await qb.getUserInfo();
          res
            .status(200)
            .send({ status: "success", data: { companyData, accountData } });
          qb = null;
        } else {
          res
            .status(401)
            .send({ status: "error", error: "Action Unauthorized" });
        }
      } catch (err: any) {
        next(err);
      }
    }
  );

  /*

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
    } else {
      res.status(401).send({ status: "error", error: "Action Unauthorized" });
    }
  });

  router.get("/quickbooks/items", (req: Request, res: Response) => {
    if (oauthClient) {
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
    } else {
      res.status(401).send({ status: "error", error: "Action Unauthorized" });
    }
  });

  */
};