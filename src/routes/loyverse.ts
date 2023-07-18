import type { Router } from "express";
import { loyverseAuth } from "../controllers/loyverse";

export default (router: Router) => {
  router.post("/loyverse/auth/:companyId", loyverseAuth);
};
