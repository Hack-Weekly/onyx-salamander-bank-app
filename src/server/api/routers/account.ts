import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Account, Transaction, statusEnum } from "@/server/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { numeric } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const insertAccountPreferenceSchema = createInsertSchema(Account, {}).pick({
  account_id: true,
  transfer_limit: true,
});

const selectAccountPreferenceSchema = createSelectSchema(Account)
  .pick({
    transfer_limit: true,
  });

const generateAccountNumber = () => {
  const available = "1234567890";
  let account_id = "";

  for (let i = 0; i < 16; i++) {
    account_id += available.charAt(Math.random() * 10);

    if (i == 0 && account_id.charAt(0) == "0") {
      i = 0;
      account_id = "";
    }
  }

  return account_id;
};

export const accountRouter = createTRPCRouter({
  allAccounts: publicProcedure.query( async ({ ctx }) => {
    const result = await ctx.db
      .select()
      .from(Account);

    return result;
  }),
  list: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        account_id: Account.account_id,
      })
      .from(Account)
      .where(eq(Account.user_id, ctx.auth.userId));

    return result;
  }),
  getAccountDetail: protectedProcedure
    .input(
      z.object({
        account_id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          balance: Account.balance,
          transfer_limit: Account.transfer_limit,
        })
        .from(Account)
        .where(
          and(
            eq(Account.user_id, ctx.auth.userId),
            eq(Account.account_id, input.account_id)
          )
        )
        .limit(1);

      return result[0];
    }),
  transferMoney: protectedProcedure
    .input(
      z.object({
        transfer_from: z.string(),
        transfer_to: z.string(),
        amount: z.string()
      })
    )
    .mutation( async ({ ctx, input }) => {
      const result = await ctx.db.transaction( async (tx) => {
        const [account] = await tx
          .select({
            balance: Account.balance,
          })
          .from(Account)
          .where(eq(Account.account_id, input.transfer_from));
  
        if (Number(account.balance) < Number(input.amount)) return await tx.rollback();
  
        await tx
          .update(Account)
          .set({
            balance: sql`${Account.balance} - ${input.amount}`,
          })
          .where(eq(Account.account_id, input.transfer_from));
        await tx
          .update(Account)
          .set({
            balance: sql`${Account.balance} + ${input.amount}`,
          })
          .where(eq(Account.account_id, input.transfer_to));
        const transaction = await tx
          .insert(Transaction)
          .values({
            from_account_id: input.transfer_from,
            to_account_id: input.transfer_to,
            amount: input.amount,
            status: statusEnum.enumValues[1],
          })
          .returning();
  
        return transaction;
      });

      return result;
    }),
  createAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const result = await ctx.db
      .insert(Account)
      .values({
        account_id: generateAccountNumber(),
        user_id: ctx.auth.userId,
        balance: "0",
        transfer_limit: "1000",
      })
      .returning();

    return result[0];
  }),
  getPreferences: protectedProcedure
    .input(
      z.object({
        account_id: z.string()
      })
    )
    .output(selectAccountPreferenceSchema)
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          transfer_limit: Account.transfer_limit,
        })
        .from(Account)
        .where(eq(Account.account_id, input.account_id));

      return result[0];
    }),
  setPreferences: protectedProcedure
    .input(insertAccountPreferenceSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(Account)
        .set(input)
        .where(eq(Account.account_id, input.account_id))
        .returning();

      return result[0];
    }),
});
