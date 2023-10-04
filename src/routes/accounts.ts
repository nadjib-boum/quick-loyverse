import type { Router } from "express";
import { getAllAccounts, getCompaniesByAccount } from "../controllers/accounts";
import { validateId } from "../middlewares/validate";
import { authorize } from "../middlewares/user";

export default (router: Router) => {
  router.get("/accounts", authorize, getAllAccounts);
  router.get("/accounts/:id", [authorize, validateId], getCompaniesByAccount);
};
