import { PrismaClient } from "@prisma/client";
import { fetchProfileAndPosts } from "./scraper";

const prisma = new PrismaClient();

// The 3 default watched accounts for the slots
export const DEFAULT_WATCHED_ACCOUNTS = [
  { slot: 1, username: "baron_nduts" },
  { slot: 2, username: "baron_nduts_bbq" },
  { slot: 3, username: "baron_nduts.cottage" },
];

/**
 * 1. Initialize default slots if they don't exist yet in the database.
 * Run this on startup or first request.
 */
export async function ensureDefaultSlotsExist() {
  for (const item of DEFAULT_WATCHED_ACCOUNTS) {
    const existing = await prisma.watchedAccount.findUnique({
      where: { slot: item.slot },
    });

    if (!existing) {
      await prisma.watchedAccount.create({
        data: {
          slot: item.slot,
          username: item.username,
        },
      });
    }
  }
}

/**
 * 2. Get the 3 watched accounts with their cached feed posts directly from database.
 * ZERO SCRAPING on page load -> instantaneous response, zero rate limiting.
 */
export async function getWatchedAccountsWithFeed() {
  await ensureDefaultSlotsExist();

  const accounts = await prisma.watchedAccount.findMany({
    orderBy: { slot: "asc" },
    include: {
      media: {
        orderBy: { createdAt: "desc" },
        take: 12,
      },
    },
  });

  return accounts;
}

/**
 * 3. Sync a single slot account from Instagram into the database.
 * Only called when the user presses "Sync" for a specific account.
 */
export async function syncSlotAccount(slot: number) {
  if (![1, 2, 3].includes(slot)) {
    throw new Error("INVALID_SLOT: Only slots 1, 2, and 3 are allowed.");
  }

  const account = await prisma.watchedAccount.findUnique({
    where: { slot },
  });

  if (!account) {
    throw new Error(`ACCOUNT_NOT_FOUND_FOR_SLOT_${slot}`);
  }

  // 1. Scrape live data from Instagram
  const { profile, posts } = await fetchProfileAndPosts(account.username);

  // 2. Save profile data to database
  const updatedAccount = await prisma.watchedAccount.update({
    where: { slot },
    data: {
      name: profile.name,
      biography: profile.biography,
      profilePictureUrl: profile.profilePictureUrl,
      followersCount: profile.followersCount,
      followsCount: profile.followsCount,
      mediaCount: profile.mediaCount ?? (posts.length > 0 ? posts.length : null),
      isVerified: profile.isVerified,
      lastSyncedAt: new Date(),
    },
  });

  // 3. Upsert posts into database
  for (const post of posts) {
    await prisma.watchedMedia.upsert({
      where: {
        slot_instagramMediaId: {
          slot,
          instagramMediaId: post.id,
        },
      },
      create: {
        slot,
        instagramMediaId: post.id,
        mediaType: post.mediaType,
        mediaUrl: post.mediaUrl,
        thumbnailUrl: post.thumbnailUrl,
        caption: post.caption,
        permalink: post.permalink,
        likeCount: post.likeCount,
        commentsCount: post.commentsCount,
        timestamp: post.timestamp || new Date(),
      },
      update: {
        mediaType: post.mediaType,
        mediaUrl: post.mediaUrl,
        thumbnailUrl: post.thumbnailUrl,
        caption: post.caption,
        permalink: post.permalink,
        likeCount: post.likeCount,
        commentsCount: post.commentsCount,
      },
    });
  }

  return updatedAccount;
}

/**
 * 4. Sync all 3 accounts simultaneously into the database.
 * Only called when the user presses "Sync All".
 */
export async function syncAllSlots() {
  await ensureDefaultSlotsExist();
  const results = [];

  for (let slot = 1; slot <= 3; slot++) {
    try {
      const updated = await syncSlotAccount(slot);
      results.push({ slot, success: true, username: updated.username });
    } catch (err) {
      console.error(`[syncAllSlots] Slot ${slot} failed:`, err);
      results.push({ slot, success: false, error: (err as Error).message });
    }
  }

  return results;
}

/**
 * 5. Update username of a specific slot (cannot add a 4th slot).
 * Once updated, immediately syncs fresh data from Instagram into database.
 */
export async function updateSlotUsername(slot: number, newUsername: string) {
  if (![1, 2, 3].includes(slot)) {
    throw new Error("INVALID_SLOT: Only slots 1, 2, and 3 are allowed.");
  }

  const cleanUsername = newUsername.replace(/^@/, "").trim().toLowerCase();
  if (!cleanUsername) {
    throw new Error("USERNAME_CANNOT_BE_EMPTY");
  }

  // 1. Update username in slot
  await prisma.watchedAccount.update({
    where: { slot },
    data: {
      username: cleanUsername,
    },
  });

  // 2. Clear old cached media from the previous username in this slot
  await prisma.watchedMedia.deleteMany({
    where: { slot },
  });

  // 3. Immediately trigger scraping and save fresh data into database
  return await syncSlotAccount(slot);
}
