import { NextRequest, NextResponse } from "next/server";
import { updateSlotUsername } from "@/lib/instagram/db-service";

/**
 * Route: POST /api/instagram/slots
 *
 * Allows updating the Instagram handle of any of the 3 fixed slots.
 * Strict Constraint: Only slots 1, 2, and 3 are allowed. No 4th slot can ever be added.
 */
export async function POST(request: NextRequest) {
  try {
    let slot = 0;
    let username = "";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => ({}));
      slot = Number(body.slot);
      username = String(body.username || "");
    } else {
      const formData = await request.formData().catch(() => null);
      if (formData) {
        slot = Number(formData.get("slot"));
        username = String(formData.get("username") || "");
      }
    }

    // Constraint: only 3 fixed slots
    if (![1, 2, 3].includes(slot)) {
      return NextResponse.redirect(
        new URL("/dashboard?error=invalid_slot_limit", request.url),
      );
    }

    const cleanUsername = username.replace(/^@/, "").trim().toLowerCase();
    if (!cleanUsername) {
      return NextResponse.redirect(
        new URL(`/dashboard?error=empty_username&slot=${slot}`, request.url),
      );
    }

    // Updates slot and immediately scrapes/caches in database
    await updateSlotUsername(slot, cleanUsername);

    return NextResponse.redirect(
      new URL(`/dashboard?success=slot_updated&slot=${slot}&username=${cleanUsername}`, request.url),
    );
  } catch (err) {
    console.error("[api/instagram/slots] Error:", err);
    const msg = (err as Error).message;

    if (msg.includes("USER_NOT_FOUND")) {
      return NextResponse.redirect(new URL("/dashboard?error=user_not_found", request.url));
    }
    if (msg.includes("ACCOUNT_PRIVATE")) {
      return NextResponse.redirect(new URL("/dashboard?error=account_private", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard?error=update_failed", request.url));
  }
}
