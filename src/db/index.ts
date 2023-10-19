import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { sql } from "@vercel/postgres";
import "dotenv/config";
require("dotenv").config();

const migrateDB = async () => {
  const db = drizzle(sql);

  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Drizzle migration completed");
};

migrateDB();
