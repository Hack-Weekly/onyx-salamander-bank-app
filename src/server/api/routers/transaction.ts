import { Account, Transaction } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { desc, eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const transactionRouter = createTRPCRouter({
  getTransactionsHistory: protectedProcedure.query(async ({ ctx }) => {
    const from = alias(Account, "from");
    const to = alias(Account, "to");

    const result = await ctx.db
      .select({
        id: Transaction.id,
        amount: Transaction.amount,
        timestamp: Transaction.timestamp,
        status: Transaction.status,
        from: {
          user_id: from.user_id,
          account_id: Transaction.from_account_id,
        },
        to: {
          user_id: to.user_id,
          account_id: Transaction.to_account_id,
        },
      })
      .from(Transaction)
      .where(
        or(
          eq(Transaction.from_account_id, ctx.account!),
          eq(Transaction.to_account_id, ctx.account!),
        ),
      )
      .innerJoin(from, eq(Transaction.from_account_id, from.account_id))
      .innerJoin(to, eq(Transaction.from_account_id, to.account_id))
      .orderBy(desc(Transaction.timestamp));

    return result;
  }),
});
