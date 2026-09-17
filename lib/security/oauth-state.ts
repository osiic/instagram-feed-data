import { createHmac, randomBytes } from "node:crypto";

const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getHmacSecret(): string {
  return process.env.BETTER_AUTH_SECRET || "fallback-secret-minimum-16-characters";
}

export interface OAuthStatePayload {
  userId: string;
  nonce: string;
  timestamp: number;
}

/**
 * Generates signed, tamper-evident OAuth state token.
 * Format: base64(userId:nonce:timestamp:signature)
 */
export function generateOAuthState(userId: string): string {
  const nonce = randomBytes(16).toString("hex");
  const timestamp = Date.now();
  const data = `${userId}:${nonce}:${timestamp}`;

  const signature = createHmac("sha256", getHmacSecret())
    .update(data)
    .digest("hex");

  return Buffer.from(`${data}:${signature}`).toString("base64url");
}

/**
 * Validates OAuth state token.
 * Returns userId if valid, throws if invalid or expired.
 */
export function validateOAuthState(stateToken: string): OAuthStatePayload {
  let decoded: string;
  try {
    decoded = Buffer.from(stateToken, "base64url").toString("utf8");
  } catch {
    throw new Error("OAUTH_STATE_INVALID");
  }

  const parts = decoded.split(":");
  if (parts.length !== 4) {
    throw new Error("OAUTH_STATE_INVALID");
  }

  const [userId, nonce, timestampStr, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) {
    throw new Error("OAUTH_STATE_INVALID");
  }

  if (Date.now() - timestamp > STATE_TTL_MS) {
    throw new Error("OAUTH_STATE_EXPIRED");
  }

  const data = `${userId}:${nonce}:${timestamp}`;
  const expectedSignature = createHmac("sha256", getHmacSecret())
    .update(data)
    .digest("hex");

  if (providedSignature !== expectedSignature) {
    throw new Error("OAUTH_STATE_TAMPERED");
  }

  return { userId, nonce, timestamp };
}
