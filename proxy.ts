import { NextResponse } from "next/server";

// ponytail: bypassed for POC without login — restore auth check when Better Auth is used
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
