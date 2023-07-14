import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const OAuthClient = require("intuit-oauth");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.set("view engine", "ejs");

type MemoryCache = {
  auth_code: string;
  access_token: string;
};

const memoryCache: MemoryCache = {
  auth_code: "",
  access_token: "",
};

// https://developer.intuit.com/v2/OAuth2Playground/RedirectUrl

const oauthClient = new OAuthClient({
  clientId: process.env.INTUIT_CLIENT_ID,
  clientSecret: process.env.INTUIT_CLIENT_SECRET,
  environment: process.env.INTUIT_ENVIRONEMENT,
  redirectUri: process.env.INTUIT_REDIRECT_URI,
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello API");
});

app.get("/authorize", (req: Request, res: Response) => {
  const authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: "intuit-test",
  });
  res.status(200).send(authUri);
});

app.get("/callback", (req: Request, res: Response) => {
  console.log("access_token", req.url);
  res.status(200).send(req.url);
  /*
  oauthClient
    .createToken(req.url)
    .then(function (authResponse: any) {
      res.status(200).send(JSON.stringify(authResponse.getJson(), null, 2));
    })
    .catch(function (e: any) {
      console.error(e);
      res.status(500).send("ERROR");
    });
    */
});

const { PORT } = process.env;

app.listen(PORT, async () => {
  console.log("App Is Running on Localhost, PORT:", PORT);
});
