import type { Router } from "express";
import { getAllAccounts } from "../controllers/accounts";

export default (router: Router) => {
  router.get("/accounts", getAllAccounts);
};
