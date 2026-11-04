import { z } from "zod";
import { HttpError } from "../http.js";

const book = z.object({
  title: z.string().trim().min(1).max(500),
  author: z.string().trim().min(1).max(120),
  pages: z.number().int().positive().max(20_000).nullable().default(null),
});

export type BookInput = z.infer<typeof book>;

export function validateBook(body: unknown): BookInput {
  return parse(book, body);
}

const goal = z.object({
  year: z.number().int().min(2000).max(2100),
  target: z.number().int().positive().max(1000),
});

export function validateGoal(body: unknown) {
  return parse(goal, body);
}

function parse<T extends z.ZodTypeAny>(schema: T, body: unknown): z.infer<T> {
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new HttpError(400, parsed.error.issues.map((i) => i.message).join("; "));
  return parsed.data;
}
