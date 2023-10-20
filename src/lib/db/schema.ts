import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["pending", "completed", "failed"]);

export const Transaction = pgTable("transaction", {
  id: uuid("id").defaultRandom().primaryKey(),
  from_account_id: text("from_account_id")
    .references(() => Account.account_id)
    .notNull(),
  to_account_id: text("to_account_id")
    .references(() => Account.account_id)
    .notNull(),
  amount: text("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  status: statusEnum("status").notNull(),
  scheduled_at: timestamp("scheduled_at"), // null if not scheduled
});

export const Account = pgTable("account", {
  account_id: text("account_id").primaryKey(),
  user_id: text("user_id").notNull(),
  balance: text("balance").notNull(),
  transfer_limit: text("transfer_limit").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
