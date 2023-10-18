import type { Config } from "drizzle-kit";
 
export default {
  schema: "./src/backend/db/schema.ts",
  out: "./drizzle",
} satisfies Config;