import { NextResponse } from "next/server";
import { ErrorCode } from "@/types/api";

const SAFE_MESSAGES: Record<string, string> = {
  [ErrorCode.UNAUTHORIZED]: "Authentication required.",
  [ErrorCode.FORBIDDEN]: "Access denied.",
  [ErrorCode.NOT_FOUND]: "Resource not found.",
  [ErrorCode.ACCOUNT_NOT_FOUND]: "The requested Instagram account was not found.",
  [ErrorCode.INSTAGRAM_API_UNAVAILABLE]:
    "Instagram data is temporarily unavailable. Please try again.",
  [ErrorCode.INSIGHTS_UNAVAILABLE]:
    "Insights aren't available for this account.",
  [ErrorCode.OAUTH_STATE_INVALID]: "Session expired. Please try reconnecting.",
  [ErrorCode.OAUTH_CANCELLED]: "Connection cancelled.",
  [ErrorCode.TOKEN_EXPIRED]:
    "Your Instagram session expired. Please reconnect your account.",
  [ErrorCode.RATE_LIMITED]: "Too many requests. Please wait and try again.",
  [ErrorCode.INTERNAL_ERROR]: "Something went wrong. Please try again.",
};

export function safeError(code: string, statusCode: number) {
  const message = SAFE_MESSAGES[code] || SAFE_MESSAGES[ErrorCode.INTERNAL_ERROR];
  return NextResponse.json({ error: { code, message } }, { status: statusCode });
}
