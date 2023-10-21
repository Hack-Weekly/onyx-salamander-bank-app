import { Account } from "../../server/db/schema";

export interface preference {
  transfer_limit?: string;
}

/**
 * Interface for User's bank account preferences
 *
 * @interface IPerference
 */
export interface IPerference {
  /**
   * Set preferences for user's bank account
   *
   * @param {preference} preference - Odject of preferences
   * @returns {Promise<typeof Account.$inferSelect>} Updated preferences
   */
  setPreferences: (
    preference: preference
  ) => Promise<typeof Account.$inferSelect>;

  /**
   * Get preferences for user's bank account
   *
   * @param {string} user_id - User's clerk user id
   * @returns {Promise<typeof Account.$inferSelect>} List of preferences
   */
  getPreferences: () => Promise<preference>;
}
