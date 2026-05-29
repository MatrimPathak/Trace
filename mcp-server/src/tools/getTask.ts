import { z } from "zod";
import { adminDb } from "../firebase.js";
import type { AuthenticatedUser } from "../auth.js";

export const GetTaskInput = z.object({
  taskId: z.string().min(1),
});

export async function getTask(user: AuthenticatedUser, input: z.infer<typeof GetTaskInput>) {
  const doc = await adminDb.collection("tasks").doc(input.taskId).get();
  if (!doc.exists) throw new Error("Task not found");

  const data = doc.data()!;
  if (data.userId !== user.uid) throw new Error("Unauthorized");

  return { id: doc.id, ...data };
}
