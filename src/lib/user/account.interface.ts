import { Account } from "../db/schema";

/**
 * Interface for User's bank account
 * 
 * @interface IAccount
 */
export interface IAccount {
    /**
     * Create a bank account for user
     * 
     * @param {string} user_id - User's clerk user id
     * @returns {Promise<typeof Account.$inferSelect>} Account created
     */
    createAccount: (user_id: string) => Promise<typeof Account.$inferSelect>;
}