import type { Request, Response, NextFunction } from "express";
import CompaniesService from "../services/companies";
import LoyverseClient from "../services/loyverse-client";

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

export async function getCompanyById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  try {
    const company = await CompaniesService.getCompanyById(id);
    res.status(200).render("pages/company", { company });
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
/*
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
*/
export async function getCompanyCustomers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const company = await CompaniesService.getCompanyTokens(id);
    const lvc = new LoyverseClient({ access_token: company.loyverse_token });
    const customers = await lvc.getCustomers();
    res.status(200).send({ status: "success", data: { customers } });
  } catch (err) {
    next(err);
  }
}
