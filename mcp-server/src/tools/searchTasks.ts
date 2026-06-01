import { z } from "zod";
import { adminDb } from "../firebase.js";
import type { AuthenticatedUser } from "../auth.js";

export const SearchTasksInput = z.object({
  query: z.string().min(1).max(200),
  type: z.enum(["bug", "story", "spike"]).optional(),
  limit: z.number().int().min(1).max(50).default(10),
});

export async function searchTasks(user: AuthenticatedUser, input: z.infer<typeof SearchTasksInput>) {
  let q = adminDb.collection("tasks").where("userId", "==", user.uid).orderBy("updatedAt", "desc");
  if (input.type) {
    q = q.where("type", "==", input.type) as typeof q;
  }

  const snap = await q.limit(100).get();
  type TaskDoc = { id: string; [key: string]: unknown };
  const all: TaskDoc[] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const lower = input.query.toLowerCase();
  const filtered = all.filter((t) => {
    const title = ((t["title"] as string | undefined) ?? "").toLowerCase();
    const summary = ((t["summary"] as string | undefined) ?? "").toLowerCase();
    const tags = ((t["tags"] as string[] | undefined) ?? []).join(" ").toLowerCase();
    return title.includes(lower) || summary.includes(lower) || tags.includes(lower);
  });

  return filtered.slice(0, input.limit);
}
