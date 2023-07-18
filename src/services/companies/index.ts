import db, { type dbResponse } from "../../utils/db";
import type { CompanyData } from "../quickbooks-auth";
interface ICompaniesService {
  createCompany: (data: CompanyData) => Promise<dbResponse>;
  setLoyverseToken: (companyId: string, token: string) => Promise<dbResponse>;
}

class CompaniesService implements ICompaniesService {
  async createCompany(data: CompanyData): Promise<dbResponse> {
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
}

const companiesService = new CompaniesService();

export default companiesService;
