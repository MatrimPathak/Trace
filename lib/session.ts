// Edge-Runtime-compatible session JWT using Web Crypto (HMAC-SHA256).
// Used by middleware (Edge) to verify sessions without firebase-admin.

const ALG = { name: "HMAC", hash: "SHA-256" };

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET env var is not set");
  const enc = new TextEncoder();
  return crypto.subtle.importKey("raw", enc.encode(secret), ALG, false, ["sign", "verify"]);
}

function base64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(str: string): string {
  return atob(str.replace(/-/g, "+").replace(/_/g, "/"));
}

export async function createSessionToken(uid: string): Promise<string> {
  const key = await getKey();
  const enc = new TextEncoder();
  const payload = base64url(enc.encode(JSON.stringify({ uid, iat: Date.now() })));
  const header = base64url(enc.encode(JSON.stringify({ alg: "HS256" })));
  const data = `${header}.${payload}`;
  const sig = await crypto.subtle.sign(ALG, key, enc.encode(data));
  return `${data}.${base64url(sig)}`;
}

export async function verifySessionToken(token: string): Promise<{ uid: string } | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, payload, sig] = parts;
    const key = await getKey();
    const enc = new TextEncoder();
    const valid = await crypto.subtle.verify(
      ALG,
      key,
      Uint8Array.from(base64urlDecode(sig), (c) => c.charCodeAt(0)),
      enc.encode(`${header}.${payload}`)
    );
    if (!valid) return null;
    const { uid } = JSON.parse(base64urlDecode(payload));
    return { uid };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "__trace_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds
