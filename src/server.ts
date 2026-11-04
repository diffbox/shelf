import { createServer } from "node:http";
import { HttpError, readBody, send } from "./http.js";
import { dispatch } from "./router.js";
import "./routes/books.js";
import "./routes/users.js";

const PORT = Number(process.env.PORT ?? 3000);

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    const out = await dispatch({
      method: req.method ?? "GET",
      path: url.pathname,
      headers: req.headers,
      body: await readBody(req),
    });
    send(res, out);
  } catch (err) {
    if (err instanceof HttpError) return send(res, { status: err.status, body: { error: err.message } });
    console.error(err);
    send(res, { status: 500, body: { error: "Something went wrong" } });
  }
});

server.listen(PORT, () => console.log(`shelf listening on http://localhost:${PORT}`));
