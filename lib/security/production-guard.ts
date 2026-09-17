// Crash on startup if mock mode enabled in production
export function assertProductionSafe() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.MOCK_INSTAGRAM === "true"
  ) {
    throw new Error("FATAL: MOCK_INSTAGRAM cannot be true in production.");
  }
}
