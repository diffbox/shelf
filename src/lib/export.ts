import type { Book } from "../db.js";
import { formatDay } from "./format.js";

const escape = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

/** The shelf as CSV, newest first. */
export function exportCsv(books: Book[]) {
  const rows = [...books]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((b) => [b.title, b.author, b.pages?.toString() ?? "", b.finishedAt ? formatDay(b.finishedAt) : ""]);
  return [["Title", "Author", "Pages", "Finished"], ...rows].map((r) => r.map(escape).join(",")).join("\n");
}

/** The v1 export format, still read by the importer in shelf-sync. */
export function legacyExport(books: Book[]) {
  return books.map((b) => `${b.title} by ${b.author}`).join("\n");
}
