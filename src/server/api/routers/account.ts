import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Account } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const insertAccountPreferenceSchema = createInsertSchema(Account, {}).pick({
  transfer_limit: true,
});

const selectAccountPreferenceSchema = createSelectSchema(Account)
  .pick({
    transfer_limit: true,
  })
  .array();

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
  test: publicProcedure.query(({ ctx }) => {
    return {
      greeting: `Hello ${ctx.auth.userId}`,
    };
  }),
  list: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        account_id: Account.account_id,
        balance: Account.balance,
        transfer_limit: Account.transfer_limit,
      })
      .from(Account)
      .where(eq(Account.user_id, ctx.auth.userId));

    return result;
  }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
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
    .output(selectAccountPreferenceSchema)
    .query(async ({ ctx }) => {
      const result = await ctx.db
        .select({
          transfer_limit: Account.transfer_limit,
        })
        .from(Account)
        .where(eq(Account.account_id, ctx.auth.userId));

      return result;
    }),
  setPreferences: protectedProcedure
    .input(insertAccountPreferenceSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(Account)
        .set(input)
        .where(eq(Account.account_id, ctx.auth.userId))
        .returning();

      return result[0];
    }),
});
