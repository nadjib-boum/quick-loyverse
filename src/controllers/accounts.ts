import type { Request, Response, NextFunction } from "express";
import AccountsService from "../services/accounts";

export async function getAllAccounts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accounts = await AccountsService.getAllAccounts();
    res.render("pages/accounts", { accounts });
  } catch (err) {
    next(err);
  }
}

export async function getCompaniesByAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const account = await AccountsService.getCompaniesByAccount(id);
    res.render("pages/companies", { account });
  } catch (err: any) {
    next(err);
  }
}
