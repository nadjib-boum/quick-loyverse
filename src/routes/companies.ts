import type { Router } from "express";
import {
  getAllCompanies,
  refreshAccessToken,
  getCompaniesByAccount,
  loyverseAuth,
} from "../controllers/companies";
import {
  validateTokenRefresh,
  validate_loyverseAuth,
} from "../middlewares/companies";

export default (router: Router) => {
  router.get("/companies", getAllCompanies);
  router.get("/companies/:account_sub", getCompaniesByAccount);
  router.post(
    "/companies/loyverse/:companyId",
    validate_loyverseAuth,
    loyverseAuth
  );
  router.put("/companies/:id", validateTokenRefresh, refreshAccessToken);
};
