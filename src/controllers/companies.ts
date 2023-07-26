import type { Request, Response, NextFunction } from "express";
import CompaniesService from "../services/companies";
import QuickbooksClient from "../services/quickbooks-client";
import AccountsService from "../services/accounts";

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

export async function getCompaniesByAccount(
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

export async function refreshAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const { access_token, refresh_token } =
      await CompaniesService.getCompanyTokens(id);

    const qbc = new QuickbooksClient({ access_token, refresh_token });

    const {
      access_token: updated_access_token,
      refresh_token: updated_refresh_token,
    } = await qbc.refreshToken();

    const company = await CompaniesService.updateCompanyTokens(id, {
      access_token: updated_access_token,
      refresh_token: updated_refresh_token,
    });

    res.status(200).send({ status: "success", data: { company } });
  } catch (err) {
    next(err);
  }
}
