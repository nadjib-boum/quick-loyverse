import type { Router } from "express";
import { loyverseAuth } from "../controllers/loyverse";
import { validate_loyverseAuth } from "../middlewares/loyverse";

export default (router: Router) => {
  router.post("/loyverse/auth/:companyId", validate_loyverseAuth, loyverseAuth);
};
