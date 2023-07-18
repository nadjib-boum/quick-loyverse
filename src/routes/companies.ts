import type { Router } from "express";
import { getAllCompanies, renderApp } from "../controllers/companies";

export default (router: Router) => {
  router.get("/app", renderApp);
  router.get("/companies", getAllCompanies);
};
