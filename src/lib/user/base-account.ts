import { db } from "@/server/db";
import { Account, Transaction, statusEnum } from "../../server/db/schema";
import { AccountDetails, IAccount } from "./account.interface";
import { eq, sql } from "drizzle-orm";
import { IPerference, type preference } from "./preference.interface";

export abstract class BaseAccount implements IAccount, IPerference {
  public readonly account_id;

  constructor(account_id?: string) {
    this.account_id = account_id ?? this.generateAccountNumber();
  }

  public async createAccount(
    user_id: string
  ): Promise<typeof Account.$inferSelect> {
    const result = await db
      .insert(Account)
      .values({
        account_id: this.account_id,
        user_id: user_id,
        balance: "0",
        transfer_limit: "1000",
      })
      .returning();

    return result[0];
  }

  public async getAccountDetails(): Promise<AccountDetails> {
    const result = await db
      .select({
        account_id: Account.account_id,
        user_id: Account.user_id,
        balance: Account.balance,
        created_at: Account.created_at,
      })
      .from(Account)
      .where(eq(Account.account_id, this.account_id));

    return result[0];
  }

  public async transferMoney(
    transfer_to: string,
    amount: string
  ): Promise<typeof Transaction.$inferSelect> {
    const result = await db.transaction(async (tx) => {
      const [account] = await tx
        .select({
          amount: Account.balance,
        })
        .from(Account)
        .where(eq(Account.account_id, this.account_id));

      if (Number(account.amount) < Number(amount)) return await tx.rollback();

      await tx
        .update(Account)
        .set({
          balance: sql`${Account.balance} - ${amount}`,
        })
        .where(eq(Account.account_id, this.account_id));
      await tx
        .update(Account)
        .set({
          balance: sql`${Account.balance} + ${amount}`,
        })
        .where(eq(Account.account_id, transfer_to));
      const transaction = await tx
        .insert(Transaction)
        .values({
          from_account_id: this.account_id,
          to_account_id: transfer_to,
          amount: amount,
          status: statusEnum.enumValues[1],
        })
        .returning();

      return transaction;
    });

    return result[0];
  }

  public generateAccountNumber(): string {
    const available = "1234567890";
    let account_id = "";

    for (let i = 0; i < 16; i++) {
      account_id += available.charAt(Math.random() * 10);

      if (i == 0 && account_id.charAt(0) == "0") {
        i = 0;
        account_id = "";
      }
    }

    return account_id;
  }

  public async setPreferences(
    preference: preference
  ): Promise<typeof Account.$inferSelect> {
    const result = await db
      .update(Account)
      .set(preference)
      .where(eq(Account.account_id, this.account_id))
      .returning();

    return result[0];
  }

  public async getPreferences(): Promise<preference> {
    const result = await db
      .select({
        transfer_limit: Account.transfer_limit,
      })
      .from(Account)
      .where(eq(Account.account_id, this.account_id));

    return result[0];
  }
}
