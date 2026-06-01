import { z } from "zod";
import { adminDb } from "../firebase.js";
import type { AuthenticatedUser } from "../auth.js";

export const GetTasksInput = z.object({
  type: z.enum(["bug", "story", "spike"]).optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export async function getTasks(user: AuthenticatedUser, input: z.infer<typeof GetTasksInput>) {
  let query = adminDb.collection("tasks").where("userId", "==", user.uid).orderBy("updatedAt", "desc");

  if (input.type) {
    query = query.where("type", "==", input.type) as typeof query;
  }

  const snap = await query.limit(input.limit).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
