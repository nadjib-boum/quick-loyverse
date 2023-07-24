import type { Request, Response, Router } from "express";

export default (router: Router) => {
  router.get("/", (req: Request, res: Response) => {
    res.redirect("/api/accounts");
  });
};
