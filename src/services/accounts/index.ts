import db from "../../utils/db";
import type { AccountData } from "../quickbooks-auth";

const selectAccountFields = {
  id: true,
  sub: true,
  username: true,
};

type AccountDBData = {
  id: string;
  sub: string;
  username: string;
};

interface IAccountsService {
  createAccount: (data: AccountData) => Promise<AccountDBData>;
  getAllAccounts: () => Promise<AccountDBData[]>;
  getCompaniesByAccount: (account_sub: string) => Promise<any>;
}

class AccountsService implements IAccountsService {
  async createAccount(data: AccountData): Promise<AccountDBData> {
    const account = await db.account.upsert({
      where: {
        sub: data.sub,
      },
      create: {
        ...data,
      },
      update: {
        ...data,
      },
      select: selectAccountFields,
    });
    return account;
  }
  async getAllAccounts(): Promise<AccountDBData[]> {
    const accounts = await db.account.findMany({
      select: selectAccountFields,
    });
    return accounts;
  }
  async getCompaniesByAccount(account_sub: string): Promise<any> {
    const companies = await db.company.findMany({
      where: {
        sub: account_sub,
      },
      select: {
        id: true,
        realmId: true,
        sub: true,
      },
    });
    return companies;
  }
}

const accountsService = new AccountsService();

export default accountsService;
