require("dotenv").config();
import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import ErrorMiddleware from "./middlewares/errors";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/api", routes());
app.use(ErrorMiddleware.logger, ErrorMiddleware.handler);

export default server;
