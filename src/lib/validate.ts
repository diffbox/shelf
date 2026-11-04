import { z } from "zod";
import { HttpError } from "../http.js";

const book = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().min(1).max(120),
  pages: z.number().int().positive().max(20_000).nullable().default(null),
});

export type BookInput = z.infer<typeof book>;

export function validateBook(body: unknown): BookInput {
  const parsed = book.safeParse(body);
  if (!parsed.success) throw new HttpError(400, parsed.error.issues.map((i) => i.message).join("; "));
  return parsed.data;
}
