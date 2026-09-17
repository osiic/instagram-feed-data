import { test, expect } from "bun:test";
import { generateOAuthState, validateOAuthState } from "../lib/security/oauth-state";
import { encryptToken, decryptToken } from "../lib/security/encryption";

test("OAuth state generation & validation works with HMAC signature", () => {
  const userId = "test_user_production";
  const state = generateOAuthState(userId);
  expect(state).toBeDefined();

  const payload = validateOAuthState(state);
  expect(payload.userId).toBe(userId);
});

test("Token encryption & decryption round-trip", () => {
  const token = "EAABxxxxxxxxxxxx_live_token";
  const encrypted = encryptToken(token);
  expect(encrypted).not.toBe(token);

  const decrypted = decryptToken(encrypted);
  expect(decrypted).toBe(token);
});
