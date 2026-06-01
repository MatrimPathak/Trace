import { adminAuth } from "./firebase.js";

export interface AuthenticatedUser {
  uid: string;
  email: string | null;
}

export async function verifyToken(token: string): Promise<AuthenticatedUser> {
  const decoded = await adminAuth.verifyIdToken(token);
  return {
    uid: decoded.uid,
    email: decoded.email ?? null,
  };
}

export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
