import type { IncomingMessage, ServerResponse } from "node:http";

export type Request = {
  method: string;
  path: string;
  params: Record<string, string>;
  headers: IncomingMessage["headers"];
  body: unknown;
};

export type Response = { status: number; body?: unknown; headers?: Record<string, string> };

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const ok = (body: unknown): Response => ({ status: 200, body });
export const created = (body: unknown): Response => ({ status: 201, body });
export const noContent = (): Response => ({ status: 204 });

export async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  if (chunks.length === 0) return null;
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "Body must be JSON");
  }
}

export function send(res: ServerResponse, out: Response) {
  res.writeHead(out.status, { "content-type": "application/json", ...out.headers });
  res.end(out.body === undefined ? undefined : JSON.stringify(out.body));
}
