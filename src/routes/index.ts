import express, { type Router } from "express";
import quickbooksRouter from "./quickbooks";
import loyversRouter from "./loyverse";
import companiesRoute from "./companies";
import userRouter from "./user";

const router: Router = express.Router();

export default (): Router => {
  quickbooksRouter(router);
  loyversRouter(router);
  companiesRoute(router);
  userRouter(router);
  return router;
};
