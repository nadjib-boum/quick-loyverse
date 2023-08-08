import type { Request, Response, NextFunction } from "express";
import QuickbooksAuth from "../services/quickbooks-auth";
import AccountService from "../services/accounts";
import CompaniesService from "../services/companies";
import APIError from "../utils/errors";

let qb: any = null;

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    qb = new QuickbooksAuth();
    const authUri = qb.getAuthUri();
    res.status(200).send({ status: "success", data: { authUri } });
  } catch (err: any) {
    next(err);
  }
};

export const generateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!qb) {
      throw new APIError({
        code: 401,
        label: "ADDING_CAOMPANY_FAILED",
        description: "Action Unauthorized",
      });
    }
    await qb.generateAccessToken(req.url);
    const { companyData, accountData } = await qb.getUserInfo();
    const account = await AccountService.createAccount(accountData);
    const company = await CompaniesService.createCompany({
      ...companyData,
      accountId: account.id,
    });
    qb = null;
    res.render("pages/loyverse", { id: company.id });
  } catch (err: any) {
    next(err);
  }
};
