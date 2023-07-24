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
