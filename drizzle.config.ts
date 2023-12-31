import type { Config } from "drizzle-kit";

import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  },
} satisfies Config;
