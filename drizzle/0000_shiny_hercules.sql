DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('pending', 'completed', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"account_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"balance" text NOT NULL,
	"transfer_limit" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_account_id" text NOT NULL,
	"to_account_id" text NOT NULL,
	"amount" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"status" "status" NOT NULL,
	"scheduled_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_from_account_id_account_account_id_fk" FOREIGN KEY ("from_account_id") REFERENCES "account"("account_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_to_account_id_account_account_id_fk" FOREIGN KEY ("to_account_id") REFERENCES "account"("account_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
