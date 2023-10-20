/**
 * Interface for User's bank account
 * 
 * @interface IAccount
 */

import { Account } from "../db/schema";

export interface IAccount {
    /**
     * 
     * @returns create an account
     * @param {string} user_id - User's clerk user id
     */
    createAccount: (user_id: string) => Promise<typeof Account.$inferSelect>;
}