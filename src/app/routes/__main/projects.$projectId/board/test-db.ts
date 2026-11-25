import { copyFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

/**
 * Points the app's database at a throwaway copy of the seeded `data.db`, so a
 * test can drive the routes that write (creating or editing an issue) without
 * touching the checked-in database.
 *
 * Import it before anything that reaches `@infrastructure/db`: `db.server`
 * reads `DATABASE_URL` the first time it is imported.
 */
const databasePath = join(mkdtempSync(join(tmpdir(), "jira-clone-test-db-")), "data.db");

copyFileSync(resolve(process.cwd(), "data.db"), databasePath);

process.env.DATABASE_URL = `file:${databasePath}?connection_limit=1`;
