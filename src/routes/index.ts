import express, { type Router } from "express";
import quickbooksRouter from "./quickbooks";

const router: Router = express.Router();

export default (): Router => {
  quickbooksRouter(router);
  return router;
};
