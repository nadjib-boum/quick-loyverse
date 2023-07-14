"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const OAuthClient = require("intuit-oauth");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.use((0, cors_1.default)());
app.set("view engine", "ejs");
const memoryCache = {
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
const time = new Date().toLocaleTimeString();
app.get("/", (req, res) => {
    res.status(200).send("Hello API on: " + time);
});
app.get("/authorize", (req, res) => {
    const authUri = oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.Accounting],
        state: "intuit-test",
    });
    res.status(200).send(authUri);
});
app.get("/callback", (req, res) => {
    console.log("access_token", req.url);
    oauthClient
        .createToken(req.url)
        .then(function (authResponse) {
        res
            .status(200)
            .send({
            access_token: JSON.stringify(authResponse.getJson(), null, 2),
        });
    })
        .catch(function (e) {
        console.error(e);
        res.status(500).send("ERROR");
    });
});
const { PORT } = process.env;
app.listen(PORT, async () => {
    console.log("App Is Running on Localhost, PORT:", PORT);
});
