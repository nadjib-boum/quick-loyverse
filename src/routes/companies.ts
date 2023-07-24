import type { Router } from "express";
import { getAllCompanies, refreshAccessToken } from "../controllers/companies";
import { validateTokenRefresh } from "../middlewares/companies";

export default (router: Router) => {
  router.get("/companies", getAllCompanies);
  router.put("/companies/:id", validateTokenRefresh, refreshAccessToken);
};
