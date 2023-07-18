import express, { type Router } from "express";
import quickbooksRouter from "./quickbooks";
import loyversRouter from "./loyverse";
import companiesRoute from "./companies";

const router: Router = express.Router();

export default (): Router => {
  quickbooksRouter(router);
  loyversRouter(router);
  companiesRoute(router);
  return router;
};
