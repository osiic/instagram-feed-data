import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { fetchProfileAndPosts } from "@/lib/instagram/scraper";

export async function POST() {
  try {
    const accounts = await prisma.instagramAccount.findMany({
      where: { userId: "default_user" },
    });

    if (accounts.length === 0) {
      return NextResponse.redirect(new URL("/?error=no_accounts", "http://localhost:3000"));
    }

    let syncedCount = 0;

    for (const account of accounts) {
      try {
        const { profile, posts } = await fetchProfileAndPosts(account.username);

        const savedAccount = await prisma.instagramAccount.upsert({
          where: { instagramUserId: profile.instagramUserId },
          create: {
            userId: "default_user",
            instagramUserId: profile.instagramUserId,
            username: profile.username,
            name: profile.name,
            profilePictureUrl: profile.profilePictureUrl,
            biography: profile.biography,
            followersCount: profile.followersCount,
            followsCount: profile.followsCount,
            mediaCount: profile.mediaCount ?? (posts.length > 0 ? posts.length : null),
            accountType: profile.isVerified ? "VERIFIED" : "PUBLIC",
            connectedAt: new Date(),
            lastSyncedAt: new Date(),
          },
          update: {
            username: profile.username,
            name: profile.name,
            profilePictureUrl: profile.profilePictureUrl,
            biography: profile.biography,
            followersCount: profile.followersCount,
            followsCount: profile.followsCount,
            mediaCount: profile.mediaCount ?? (posts.length > 0 ? posts.length : null),
            accountType: profile.isVerified ? "VERIFIED" : "PUBLIC",
            lastSyncedAt: new Date(),
          },
        });

        for (const post of posts) {
          await (prisma as unknown as Record<string, { upsert: (args: unknown) => Promise<unknown> }>)
            .instagramMedia?.upsert({
              where: {
                instagramAccountId_instagramMediaId: {
                  instagramAccountId: savedAccount.id,
                  instagramMediaId: post.id,
                },
              },
              create: {
                instagramAccountId: savedAccount.id,
                instagramMediaId: post.id,
                mediaType: post.mediaType,
                mediaUrl: post.mediaUrl,
                thumbnailUrl: post.thumbnailUrl,
                caption: post.caption,
                permalink: post.permalink,
                timestamp: post.timestamp || new Date(),
                likeCount: post.likeCount,
                commentsCount: post.commentsCount,
              },
              update: {
                mediaType: post.mediaType,
                mediaUrl: post.mediaUrl,
                thumbnailUrl: post.thumbnailUrl,
                caption: post.caption,
                permalink: post.permalink,
                timestamp: post.timestamp || new Date(),
                likeCount: post.likeCount,
                commentsCount: post.commentsCount,
              },
            });
        }
        syncedCount++;
      } catch (err) {
        console.error(`[sync-all] Failed for @${account.username}:`, err);
      }
    }

    return NextResponse.redirect(new URL(`/?success=synced_all&count=${syncedCount}`, "http://localhost:3000"));
  } catch (err) {
    console.error("[sync-all] Server error:", err);
    return NextResponse.redirect(new URL("/?error=server_error", "http://localhost:3000"));
  }
}
