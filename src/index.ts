import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import routes from "./routes";
import ErrorMiddleware from "./middlewares/errors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.set("view engine", "ejs");
app.use("/api", routes());
app.use(ErrorMiddleware.logger, ErrorMiddleware.handler);

const { PORT = 5000 } = process.env;

app.listen(PORT, async () => {
  console.log("App Is Running on Localhost, PORT:", PORT);
});
