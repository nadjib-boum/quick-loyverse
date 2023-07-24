import express, { type Router } from "express";
import mainRouter from "./main";
import userRouter from "./user";
import accountsRouter from "./accounts";
import companiesRoute from "./companies";
import quickbooksRouter from "./quickbooks";
import loyversRouter from "./loyverse";

const router: Router = express.Router();

export default (): Router => {
  mainRouter(router);
  userRouter(router);
  accountsRouter(router);
  companiesRoute(router);
  quickbooksRouter(router);
  loyversRouter(router);
  return router;
};
