import { HttpError, type Request, type Response } from "./http.js";

type Handler = (req: Request) => Promise<Response> | Response;
type Route = { method: string; pattern: RegExp; keys: string[]; handler: Handler };

const routes: Route[] = [];

/** Registers a route; `:name` segments become params. */
export function route(method: string, path: string, handler: Handler) {
  const keys: string[] = [];
  const pattern = new RegExp(
    "^" +
      path.replace(/:([a-zA-Z]+)/g, (_, key: string) => {
        keys.push(key);
        return "([^/]+)";
      }) +
      "$",
  );
  routes.push({ method, pattern, keys, handler });
}

export async function dispatch(req: Omit<Request, "params">): Promise<Response> {
  for (const r of routes) {
    if (r.method !== req.method) continue;
    const m = r.pattern.exec(req.path);
    if (!m) continue;
    const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
    return r.handler({ ...req, params });
  }
  throw new HttpError(404, "Not found");
}
