import type { Router } from "express";
import {
  getAllCompanies,
  loyverseAuth,
  getCompanyById,
  getCompanyCustomers,
  getCompanyInvoices,
} from "../controllers/companies";
import { validate_loyverseAuth } from "../middlewares/companies";

export default (router: Router) => {
  router.get("/company", getAllCompanies);
  router.post(
    "/company/loyverse/:companyId",
    validate_loyverseAuth,
    loyverseAuth
  );
  router.get("/company/:id", getCompanyById);
  router.get("/companies/:id/invoices", getCompanyInvoices);
  router.get("/company/:id/customers", getCompanyCustomers);
};
