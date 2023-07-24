import { Company } from "@prisma/client";
import db, { type dbResponse } from "../../utils/db";
import type { CompanyData } from "../quickbooks-auth";

type CompanyItem = Pick<Company, "id" | "realmId" | "sub">;

type Tokens = {
  access_token: string;
  refresh_token: string;
};

const companySelectedFields = {
  id: true,
  realmId: true,
  sub: true,
};

interface ICompaniesService {
  createCompany: (data: CompanyData) => Promise<CompanyItem>;
  updateCompanyTokens: (id: string, tokens: Tokens) => Promise<CompanyItem>;
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
        select: companySelectedFields,
      });
      return company;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getCompanyTokens(id: string): Promise<CompanyItem & Tokens> {
    try {
      const company = await db.company.findFirst({
        where: {
          id,
        },
        select: {
          ...companySelectedFields,
          access_token: true,
          refresh_token: true,
        },
      });
      return company!;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async updateCompanyTokens(id: string, tokens: Tokens): Promise<CompanyItem> {
    try {
      const { access_token, refresh_token } = tokens;
      const company = await db.company.update({
        where: {
          id,
        },
        data: {
          access_token,
          refresh_token,
        },
        select: companySelectedFields,
      });
      return company;
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
        select: companySelectedFields,
      });
      return companies;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

const companiesService = new CompaniesService();

export default companiesService;
