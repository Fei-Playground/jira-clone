import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const databaseUrl = process.env.DATABASE_URL ?? "file:./data.db?connection_limit=1";

const createClient = () => {
  const url = databaseUrl.replace(/^file:/, "").replace(/\?.*$/, "");
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
};

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  db = createClient();
} else {
  if (!globalThis.__db) {
    globalThis.__db = createClient();
  }
  db = globalThis.__db;
}

export { db };
