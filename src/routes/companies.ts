import type { Router } from "express";
import { getAllCompanies } from "../controllers/companies";

export default (router: Router) => {
  router.get("/companies", getAllCompanies);
};
