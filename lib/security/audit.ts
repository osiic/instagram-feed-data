interface AuditEvent {
  event: "account_connect" | "account_disconnect" | "token_refresh" | "session_signin";
  userId: string;
  accountId?: string;
  timestamp: Date;
}

export function auditLog(data: Omit<AuditEvent, "timestamp">) {
  const entry: AuditEvent = { ...data, timestamp: new Date() };
  // ponytail: console sink only; forward to structured provider when observability lands.
  console.info(
    `[AUDIT] ${entry.event} user=${entry.userId} account=${entry.accountId ?? "-"} at=${entry.timestamp.toISOString()}`,
  );
}
