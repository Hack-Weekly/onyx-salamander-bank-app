import { Account, Transaction } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { desc, eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { clerkClient } from "@clerk/nextjs";

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

    const newResult = await Promise.all(
      result.map(async (transaction) => {
        const from_user = await clerkClient.users.getUser(
          transaction.from.user_id,
        );
        const to_user = await clerkClient.users.getUser(transaction.to.user_id);

        return {
          ...transaction,
          from: {
            ...transaction.from,
            user: from_user,
          },
          to: {
            ...transaction.to,
            user: to_user,
          },
        };
      }),
    );

    return newResult;
  }),
});
