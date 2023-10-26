import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";

import dotenv from "dotenv";
dotenv.config();

const migrateDB = async () => {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Drizzle migration completed");
};

migrateDB();
