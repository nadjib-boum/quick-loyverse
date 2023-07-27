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

    const { access_token, refresh_token, realmId } =
      await CompaniesService.getCompanyTokens(id);

    const qbc = new QuickbooksClient(id);

    await qbc.init();

    await qbc.refreshAccessToken();

    res.status(200).send({ status: "success" });
  } catch (err) {
    next(err);
  }
}

export async function getCompanyInvoices(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const qbc = new QuickbooksClient(id);
    await qbc.init();
    const invoices = await qbc.getInvoices();
    res.status(200).send({ status: "success", data: { invoices } });
  } catch (err) {
    next(err);
  }
}
