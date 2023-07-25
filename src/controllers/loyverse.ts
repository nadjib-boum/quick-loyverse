import type { Request, Response, NextFunction } from "express";
import CompaniesService from "../services/companies";
import LoyverseClient from "../services/loyverse-client";

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

export async function getCatgories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cl = new LoyverseClient({
      access_token: process.env.LOYVERSE_ACCESS_TOKEN!,
    });
    const categories = await cl.getCategories();
    res.status(200).send({ categories });
  } catch (err: any) {
    next(err);
  }
}
