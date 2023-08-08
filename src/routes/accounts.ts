import type { Router } from "express";
import { getAllAccounts, getCompaniesByAccount } from "../controllers/accounts";
import { validateId } from "../middlewares/validate";

export default (router: Router) => {
  router.get("/accounts", getAllAccounts);
  router.get("/companies/:id", validateId, getCompaniesByAccount);
};
