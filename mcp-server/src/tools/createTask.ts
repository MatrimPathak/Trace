import { z } from "zod";
import { adminDb, adminAuth } from "../firebase.js";
import { FieldValue } from "firebase-admin/firestore";
import type { AuthenticatedUser } from "../auth.js";

export const ChangedItemSchema = z.object({
  name: z.string(),
  type: z.enum(["file", "rule", "component", "other"]),
});

export const CreateTaskInput = z.object({
  type: z.enum(["bug", "story", "spike"]),
  title: z.string().min(1).max(300),
  summary: z.string().default(""),
  problem: z.string().default(""),
  implementation: z.string().default(""),
  impact: z.string().default(""),
  learnings: z.string().default(""),
  screenshots: z.array(z.string()).default([]),
  changedItems: z.array(ChangedItemSchema).default([]),
  tags: z.array(z.string()).default([]),
  source: z.enum(["AgileStudio", "manual"]).default("AgileStudio"),
});

export async function createTask(user: AuthenticatedUser, input: z.infer<typeof CreateTaskInput>) {
  const ref = adminDb.collection("tasks").doc();
  await ref.set({
    ...input,
    userId: user.uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return { id: ref.id, message: "Task created successfully" };
}
