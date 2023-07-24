import type { Router } from "express";
import { getAllAccounts, getAccountCompanies } from "../controllers/accounts";

export default (router: Router) => {
  router.get("/accounts", getAllAccounts);
  router.get("/accounts/:account_sub", getAccountCompanies);
};
