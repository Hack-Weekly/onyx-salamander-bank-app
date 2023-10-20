import db from "../db/db"
import { Account } from "../db/schema";
import { IAccount } from "./account.interface";

export abstract class BaseAccount implements IAccount {
    public readonly accountNumber;

    constructor(accountNumber?: string) {
        this.accountNumber = accountNumber ?? this.generateAccountNumber();
    }
    
    public async createAccount(user_id: string): Promise<typeof Account.$inferSelect> {
        const result = await db
        .insert(Account)
        .values({
            account_id: this.accountNumber,
            user_id: user_id,
            balance: "0",
            transfer_limit: "1000"
        })
        .returning();

        return result[0]
    }

    public generateAccountNumber(): string {
        const available = "1234567890";
        let accountNumber = "";

        for (let i = 0; i < 16; i++) {
            accountNumber += available.charAt(Math.random() * 10);

            if (i == 0 && accountNumber.charAt(0) == "0") {
                i = 0;
                accountNumber = "";
            };
        }

        return accountNumber;
    }
}