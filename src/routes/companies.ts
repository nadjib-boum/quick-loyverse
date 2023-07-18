import type { NextFunction, Request, Response, Router } from "express";
import { getAllCompanies } from "../controllers/companies";

export default (router: Router) => {
  router.get("/app", (req: Request, res: Response, next: NextFunction) => {
    res.render("app");
  });
  router.get("/companies", getAllCompanies);
};
