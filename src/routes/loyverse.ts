import type { Router } from "express";
import { getCatgories, loyverseAuth } from "../controllers/loyverse";
import { validate_loyverseAuth } from "../middlewares/loyverse";

export default (router: Router) => {
  router.post("/loyverse/auth/:companyId", validate_loyverseAuth, loyverseAuth);
  router.get("/loyverse/categories", getCatgories);
};
