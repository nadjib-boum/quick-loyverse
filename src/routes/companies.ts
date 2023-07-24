import type { Router } from "express";
import {
  getAllCompanies,
  refreshAccessToken,
  getCompaniesByAccount,
} from "../controllers/companies";
import { validateTokenRefresh } from "../middlewares/companies";

export default (router: Router) => {
  router.get("/companies", getAllCompanies);
  router.get("/companies/:account_sub", getCompaniesByAccount);
  router.put("/companies/:id", validateTokenRefresh, refreshAccessToken);
};
