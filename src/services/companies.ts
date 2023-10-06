import { Company } from "@prisma/client";
import db, { type dbResponse } from "../utils/db";
import type { CompanyData } from "./quickbooks-auth";

type CompanyItem = Pick<Company, "id" | "realmId" | "sub">;

type Tokens = {
  access_token: string;
  refresh_token: string;
  loyverse_token: string;
};

interface ICompaniesService {
  createCompany: (data: CompanyData) => Promise<CompanyItem>;
  getCompanyById: (id: string) => Promise<CompanyItem>;
  setLoyverseToken: (companyId: string, token: string) => Promise<dbResponse>;
  getAllCompanies: () => Promise<CompanyItem[]>;
}

class CompaniesService implements ICompaniesService {
  async createCompany(data: CompanyData): Promise<CompanyItem> {
    try {
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
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getCompanyById(id: string): Promise<CompanyItem> {
    try {
      const company = await db.company.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          realmId: true,
          sub: true,
        },
      });
      return company!;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getCompanyTokens(id: string): Promise<Tokens & { realmId: string }> {
    try {
      const company = await db.company.findFirst({
        where: {
          id,
        },
        select: {
          access_token: true,
          refresh_token: true,
          loyverse_token: true,
          realmId: true,
        },
      });
      return company!;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async setLoyverseToken(
    companyId: string,
    token: string
  ): Promise<dbResponse> {
    try {
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
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getAllCompanies(): Promise<CompanyItem[]> {
    try {
      const companies = await db.company.findMany({
        select: {
          id: true,
          realmId: true,
          sub: true,
        },
      });
      return companies;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

const companiesService = new CompaniesService();

export default companiesService;
