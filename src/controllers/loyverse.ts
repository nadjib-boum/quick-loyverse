import type { Request, Response, NextFunction } from "express";
import CompaniesService from "../services/companies";

export async function loyverseAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { companyId } = req.params;
    const { loyverse_token } = req.body;
    const company = await CompaniesService.setLoyverseToken(
      companyId,
      loyverse_token
    );
    // res.redirect("https://quick-loyverse.onrender.com/api/app");
    res.status(200).send({ status: "success", data: { company } });
  } catch (err: any) {
    next(err);
  }
}
