// Single-owner tool: no login required
export const DEFAULT_USER = { id: "default_user", name: "Owner", email: "owner@local" };

export async function getCurrentUser() {
  return DEFAULT_USER;
}

export async function requireAuth() {
  return DEFAULT_USER;
}
