import db, { type dbResponse } from "../../utils/db";
import type { CompanyData } from "../quickbooks-auth";
interface ICompaniesService {
  createCompany: (data: CompanyData) => Promise<dbResponse>;
}

class CompaniesService implements ICompaniesService {
  async createCompany(data: CompanyData): Promise<dbResponse> {
    return await db.company.upsert({
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
  }
}

const companiesService = new CompaniesService();

export default companiesService;
