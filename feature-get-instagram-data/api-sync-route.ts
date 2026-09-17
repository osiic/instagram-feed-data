import { NextRequest, NextResponse } from "next/server";
import { syncSlotAccount, syncAllSlots } from "@/lib/instagram/db-service";

/**
 * Route: POST /api/instagram/sync
 *
 * Supports two operations:
 * 1. Sync All: POST without slot or with ?all=true
 * 2. Sync Single Slot: POST with body { slot: 1 | 2 | 3 }
 */
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const isAll = url.searchParams.get("all") === "true";

    let slot: number | null = null;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => ({}));
      if (body.slot) slot = Number(body.slot);
    } else {
      const formData = await request.formData().catch(() => null);
      if (formData?.get("slot")) slot = Number(formData.get("slot"));
    }

    // 1. Sync All Slots
    if (isAll || !slot) {
      const results = await syncAllSlots();
      const failedCount = results.filter((r) => !r.success).length;

      if (failedCount > 0) {
        return NextResponse.redirect(
          new URL(`/dashboard?warning=sync_partial&failed=${failedCount}`, request.url),
        );
      }

      return NextResponse.redirect(new URL("/dashboard?success=synced_all", request.url));
    }

    // 2. Sync Specific Slot (1, 2, or 3)
    if (![1, 2, 3].includes(slot)) {
      return NextResponse.redirect(new URL("/dashboard?error=invalid_slot", request.url));
    }

    const updated = await syncSlotAccount(slot);
    return NextResponse.redirect(
      new URL(`/dashboard?success=synced_slot&slot=${slot}&username=${updated.username}`, request.url),
    );
  } catch (err) {
    console.error("[api/instagram/sync] Error:", err);
    const msg = (err as Error).message;

    if (msg.includes("USER_NOT_FOUND")) {
      return NextResponse.redirect(new URL("/dashboard?error=user_not_found", request.url));
    }
    if (msg.includes("ACCOUNT_PRIVATE")) {
      return NextResponse.redirect(new URL("/dashboard?error=account_private", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard?error=sync_failed", request.url));
  }
}
