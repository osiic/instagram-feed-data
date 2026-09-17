import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { requireAccountOwnership } from "@/lib/security/ownership";
import { prisma } from "@/lib/db/client";

type RouteProps = { params: Promise<{ id: string }> };

export async function GET(_req: Request, props: RouteProps) {
  const user = await getCurrentUser();
  const { id } = await props.params;
  const account = await requireAccountOwnership(id, user.id);

  if (!account) {
    return NextResponse.json(
      { error: { code: "ACCOUNT_NOT_FOUND", message: "Account not found." } },
      { status: 404 },
    );
  }

  return NextResponse.json({ account });
}

async function deleteAccount(id: string, userId: string) {
  const account = await requireAccountOwnership(id, userId);
  if (!account) return null;

  // Delete related media first (cascade in memory store)
  await (prisma as unknown as Record<string, { deleteMany?: (args: unknown) => Promise<unknown> }>)
    .instagramMedia?.deleteMany?.({ where: { instagramAccountId: account.id } });

  await prisma.instagramAccount.delete({ where: { id: account.id } });
  return account;
}

export async function DELETE(_req: Request, props: RouteProps) {
  const user = await getCurrentUser();
  const { id } = await props.params;
  const deleted = await deleteAccount(id, user.id);
  if (!deleted) {
    return NextResponse.json(
      { error: { code: "ACCOUNT_NOT_FOUND", message: "Account not found." } },
      { status: 404 },
    );
  }
  return NextResponse.json({ success: true });
}

// Handle form-based delete (POST from HTML form)
export async function POST(req: NextRequest, props: RouteProps) {
  const user = await getCurrentUser();
  const { id } = await props.params;
  const deleted = await deleteAccount(id, user.id);
  if (!deleted) return NextResponse.redirect(new URL("/?error=account_not_found", req.url));
  return NextResponse.redirect(new URL("/", req.url));
}
