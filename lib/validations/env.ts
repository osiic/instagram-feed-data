import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z.string().min(16, "BETTER_AUTH_SECRET must be at least 16 chars"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
  META_APP_ID: z.string().optional().default(""),
  META_APP_SECRET: z.string().optional().default(""),
  META_REDIRECT_URI: z.string().optional().default(""),
  TOKEN_ENCRYPTION_KEY: z.string().min(1, "TOKEN_ENCRYPTION_KEY is required"),
  MOCK_INSTAGRAM: z
    .string()
    .optional()
    .default("false")
    .transform((v) => v === "true"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    z.treeifyError(parsed.error),
  );
  throw new Error("Invalid environment variables");
}

const envData = parsed.data;

// ponytail: key format fixed to 32-byte base64; KMS-backed rotation when multi-instance.
const keyBuffer = Buffer.from(envData.TOKEN_ENCRYPTION_KEY, "base64");
if (keyBuffer.length !== 32) {
  throw new Error(
    "TOKEN_ENCRYPTION_KEY must be 32 bytes encoded as base64 (generate: openssl rand -base64 32)",
  );
}

if (envData.NODE_ENV === "production" && envData.MOCK_INSTAGRAM === true) {
  throw new Error("FATAL: MOCK_INSTAGRAM cannot be true in production.");
}

export const env = envData;
