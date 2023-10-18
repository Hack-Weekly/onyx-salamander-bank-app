import 'dotenv/config'
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";


const connectionString = process.env.POSTGRES_URL + "?sslmode=require";
if (!connectionString) throw new Error("POSTGRES_URL does not exists in .env");

const sql = postgres(connectionString, { max: 1 })
const db = drizzle(sql);
 
await migrate(db, { migrationsFolder: "drizzle" });