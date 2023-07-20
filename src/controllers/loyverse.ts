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
    await CompaniesService.setLoyverseToken(companyId, loyverse_token);
    res.redirect(process.env.LOYVERSE_REDIRECT!);
  } catch (err: any) {
    next(err);
  }
}
