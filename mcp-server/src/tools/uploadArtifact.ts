import { z } from "zod";
import { adminDb, adminStorage } from "../firebase.js";
import { FieldValue } from "firebase-admin/firestore";
import type { AuthenticatedUser } from "../auth.js";

export const UploadArtifactInput = z.object({
  taskId: z.string().min(1),
  fileBase64: z.string().min(1),
  filename: z.string().min(1),
  mimeType: z.string().default("application/octet-stream"),
});

export async function uploadArtifact(
  user: AuthenticatedUser,
  input: z.infer<typeof UploadArtifactInput>
) {
  const ref = adminDb.collection("tasks").doc(input.taskId);
  const doc = await ref.get();
  if (!doc.exists) throw new Error("Task not found");
  if (doc.data()!.userId !== user.uid) throw new Error("Unauthorized");

  const buffer = Buffer.from(input.fileBase64, "base64");
  const path = `artifacts/${user.uid}/${input.taskId}/${Date.now()}_${input.filename}`;

  const bucket = adminStorage.bucket();
  const file = bucket.file(path);
  await file.save(buffer, { contentType: input.mimeType });
  await file.makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;

  await ref.update({ updatedAt: FieldValue.serverTimestamp() });

  return { url: publicUrl, filename: input.filename, message: "Artifact uploaded successfully" };
}
