import db, { type dbResponse } from "../../utils/db";
import type { AccountData, CompanyData } from "../quickbooks-auth";
interface IAccountsService {
  createAccount: (data: AccountData) => Promise<dbResponse>;
}

class AccountsService implements IAccountsService {
  async createAccount(data: AccountData): Promise<dbResponse> {
    return await db.account.upsert({
      where: {
        sub: data.sub,
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

const accountService = new AccountsService();

export default accountService;
