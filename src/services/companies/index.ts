import { Company } from "@prisma/client";
import db, { type dbResponse } from "../../utils/db";
import type { CompanyData } from "../quickbooks-auth";

type CompanyItem = Pick<Company, "id" | "realmId" | "sub">;

interface ICompaniesService {
  createCompany: (data: CompanyData) => Promise<CompanyItem>;
  setLoyverseToken: (companyId: string, token: string) => Promise<dbResponse>;
  getAllCompanies: () => Promise<CompanyItem[]>;
}

class CompaniesService implements ICompaniesService {
  async createCompany(data: CompanyData): Promise<CompanyItem> {
    const company = await db.company.upsert({
      where: {
        realmId: data.realmId,
      },
      create: {
        ...data,
      },
      update: {
        ...data,
      },
      select: {
        id: true,
        realmId: true,
        sub: true,
      },
    });
    return company;
  }
  async setLoyverseToken(
    companyId: string,
    token: string
  ): Promise<dbResponse> {
    const company = await db.company.update({
      where: {
        id: companyId,
      },
      data: {
        loyverse_token: token,
      },
      select: {
        id: true,
      },
    });
    return company;
  }
  async getAllCompanies(): Promise<CompanyItem[]> {
    const companies = await db.company.findMany({
      select: {
        id: true,
        realmId: true,
        sub: true,
      },
    });
    return companies;
  }
}

const companiesService = new CompaniesService();

export default companiesService;
