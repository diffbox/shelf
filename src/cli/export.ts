import { booksFor } from "../db.js";
import { exportCsv, legacyExport } from "../lib/export.js";

// npm run export -- <userId> [--legacy]
const [userId, flag] = process.argv.slice(2);
if (!userId) {
  console.error("usage: npm run export -- <userId> [--legacy]");
  process.exit(1);
}
const books = booksFor(userId);
process.stdout.write((flag === "--legacy" ? legacyExport(books) : exportCsv(books)) + "\n");
