import { requireUser } from "../auth/guards.js";
import { progress, setGoal } from "../goals/goals.js";
import { ok } from "../http.js";
import { validateGoal } from "../lib/validate.js";
import { route } from "../router.js";

route("PUT", "/goals/:year", (req) => {
  const user = requireUser(req);
  const { year, target } = validateGoal({ ...(req.body as object), year: Number(req.params.year) });
  setGoal(user.id, year, target);
  return ok(progress(user.id, year));
});

route("GET", "/goals/:year", (req) => {
  const user = requireUser(req);
  return ok(progress(user.id, Number(req.params.year)));
});
