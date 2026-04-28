import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("src", "infrastructure", "db", "schema.prisma"),
  migrations: {
    seed: "tsx src/infrastructure/db/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./data.db?connection_limit=1",
  },
});
