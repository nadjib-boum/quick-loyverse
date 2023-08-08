import type { Router } from "express";
import {
  getAllCompanies,
  loyverseAuth,
  getCompanyInvoices,
} from "../controllers/companies";
import { validate_loyverseAuth } from "../middlewares/companies";

export default (router: Router) => {
  router.get("/companies", getAllCompanies);
  router.post(
    "/companies/loyverse/:companyId",
    validate_loyverseAuth,
    loyverseAuth
  );
  router.get("/companies/:id/invoices", getCompanyInvoices);
};
