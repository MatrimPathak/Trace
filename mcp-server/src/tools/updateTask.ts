import { z } from "zod";
import { adminDb } from "../firebase.js";
import { FieldValue } from "firebase-admin/firestore";
import { ChangedItemSchema } from "./createTask.js";
import type { AuthenticatedUser } from "../auth.js";

export const UpdateTaskInput = z.object({
  taskId: z.string().min(1),
  title: z.string().min(1).max(300).optional(),
  summary: z.string().optional(),
  problem: z.string().optional(),
  implementation: z.string().optional(),
  impact: z.string().optional(),
  learnings: z.string().optional(),
  screenshots: z.array(z.string()).optional(),
  changedItems: z.array(ChangedItemSchema).optional(),
  tags: z.array(z.string()).optional(),
});

export async function updateTask(user: AuthenticatedUser, input: z.infer<typeof UpdateTaskInput>) {
  const { taskId, ...updates } = input;
  const ref = adminDb.collection("tasks").doc(taskId);
  const doc = await ref.get();

  if (!doc.exists) throw new Error("Task not found");
  if (doc.data()!.userId !== user.uid) throw new Error("Unauthorized");

  await ref.update({
    ...updates,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { id: taskId, message: "Task updated successfully" };
}
