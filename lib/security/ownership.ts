import { prisma } from "@/lib/db/client";

/**
 * Verifies ownership and returns account.
 * Returns null for both missing AND unowned (prevents ID enumeration).
 */
export async function requireAccountOwnership(
  accountId: string,
  userId: string,
) {
  const account = await prisma.instagramAccount.findFirst({
    where: {
      id: accountId,
      userId,
    },
  });

  return account;
}
