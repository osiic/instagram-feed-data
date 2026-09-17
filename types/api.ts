// Standard API response envelope and error contracts

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  error: ApiError;
}

export type ApiSuccessResponse<T> = T;

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Common error codes
export const ErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  ACCOUNT_NOT_FOUND: "ACCOUNT_NOT_FOUND",
  INSTAGRAM_API_UNAVAILABLE: "INSTAGRAM_API_UNAVAILABLE",
  INSIGHTS_UNAVAILABLE: "INSIGHTS_UNAVAILABLE",
  OAUTH_STATE_INVALID: "OAUTH_STATE_INVALID",
  OAUTH_CANCELLED: "OAUTH_CANCELLED",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
