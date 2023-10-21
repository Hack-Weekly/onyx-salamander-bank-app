import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  numeric,
  index,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["pending", "completed", "failed"]);

export const Transaction = pgTable(
  "transaction",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    from_account_id: text("from_account_id")
      .references(() => Account.account_id)
      .notNull(),
    to_account_id: text("to_account_id")
      .references(() => Account.account_id)
      .notNull(),
    amount: numeric("amount").notNull(),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
    status: statusEnum("status").notNull(),
    scheduled_at: timestamp("scheduled_at"), // null if not scheduled
  },
  (table) => {
    return {
      fromAccountIdIdx: index("from_account_id_idx").on(table.from_account_id),
      toAccountIdIdx: index("to_account_id_idx").on(table.to_account_id),
    };
  }
);
export const Account = pgTable(
  "account",
  {
    account_id: text("account_id").primaryKey(),
    user_id: text("user_id").notNull(),
    balance: numeric("balance").notNull(),
    transfer_limit: numeric("transfer_limit").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("user_id_idx").on(table.user_id),
    };
  }
);
