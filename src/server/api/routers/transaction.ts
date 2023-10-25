import { Account, Transaction } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq, or } from "drizzle-orm";
import { z } from "zod";
import { alias } from "drizzle-orm/pg-core";
import { clerkClient } from "@clerk/nextjs";

export const transactionRouter = createTRPCRouter({
  getTransactionsHistory: protectedProcedure
    .input(
      z.object({
        account_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
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
            eq(Transaction.from_account_id, input.account_id),
            eq(Transaction.to_account_id, input.account_id),
          ),
        )
        .innerJoin(from, eq(Transaction.from_account_id, from.account_id))
        .innerJoin(to, eq(Transaction.from_account_id, to.account_id))
        .orderBy(Transaction.timestamp);

      const newResult = await Promise.all(
        result.map(async (transaction) => {
          const from_user = await clerkClient.users.getUser(
            transaction.from.user_id,
          );
          const to_user = await clerkClient.users.getUser(
            transaction.to.user_id,
          );

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
