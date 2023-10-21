ALTER TABLE "account" ALTER COLUMN "transfer_limit" TYPE NUMERIC USING "transfer_limit"::numeric;--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "amount" TYPE NUMERIC USING "amount"::numeric;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "from_account_id_idx" ON "transaction" ("from_account_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "to_account_id_idx" ON "transaction" ("to_account_id");