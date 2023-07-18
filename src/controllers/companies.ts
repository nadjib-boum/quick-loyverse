import type { Request, Response, NextFunction } from "express";
import CompaniesService from "../services/companies";

export async function getAllCompanies(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const companies = await CompaniesService.getAllCompanies();
    res.status(200).send({ status: "success", data: { companies } });
  } catch (err: any) {
    next(err);
  }
}
