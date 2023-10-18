import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const User = pgTable("user", {
    id: uuid("id").defaultRandom().primaryKey(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull()
});

export const Transaction = pgTable("transaction", {
    id: uuid("id").defaultRandom().primaryKey(),
    from: text("from").references( () => Account.account_number),
    to: text("to").references( () => Account.account_number),
    amount: text("amount").notNull(),
    timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const Account = pgTable("account", {
    account_number: text("account_number").primaryKey(),
    id: uuid("id").references( () => User.id),
    money: text("money").notNull(),
    transfer_limit: text("transfer_limit").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull()
});