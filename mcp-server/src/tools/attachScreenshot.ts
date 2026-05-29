import { z } from "zod";
import { adminDb, adminStorage } from "../firebase.js";
import { FieldValue } from "firebase-admin/firestore";
import type { AuthenticatedUser } from "../auth.js";

export const AttachScreenshotInput = z.object({
  taskId: z.string().min(1),
  imageBase64: z.string().min(1),
  filename: z.string().min(1),
  mimeType: z.string().default("image/png"),
});

export async function attachScreenshot(
  user: AuthenticatedUser,
  input: z.infer<typeof AttachScreenshotInput>
) {
  const ref = adminDb.collection("tasks").doc(input.taskId);
  const doc = await ref.get();
  if (!doc.exists) throw new Error("Task not found");
  if (doc.data()!.userId !== user.uid) throw new Error("Unauthorized");

  const buffer = Buffer.from(input.imageBase64, "base64");
  const path = `screenshots/${user.uid}/${input.taskId}/${Date.now()}_${input.filename}`;

  const bucket = adminStorage.bucket();
  const file = bucket.file(path);
  await file.save(buffer, { contentType: input.mimeType });
  await file.makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;

  await ref.update({
    screenshots: FieldValue.arrayUnion(publicUrl),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { url: publicUrl, message: "Screenshot attached successfully" };
}
