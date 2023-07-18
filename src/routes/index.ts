import express, { type Router } from "express";
import quickbooksRouter from "./quickbooks";
import loyversRouter from "./loyverse";

const router: Router = express.Router();

export default (): Router => {
  quickbooksRouter(router);
  loyversRouter(router);
  return router;
};
