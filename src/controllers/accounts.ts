import type { Request, Response, NextFunction } from "express";
import AccountsService from "../services/accounts";

export async function getAllAccounts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accounts = await AccountsService.getAllAccounts();
  res.render("pages/accounts", { accounts });
}

export async function getAccountCompanies(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { account_sub } = req.params;
    const companies = await AccountsService.getCompaniesByAccount(account_sub);
    res.render("pages/companies", { companies });
  } catch (err: any) {
    next(err);
  }
}
