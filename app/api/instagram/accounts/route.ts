import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { fetchProfileAndPosts } from "@/lib/instagram/scraper";

export async function GET() {
  const accounts = await prisma.instagramAccount.findMany({
    where: { userId: "default_user" },
    orderBy: { connectedAt: "desc" },
  });

  return NextResponse.json({ accounts });
}

export async function POST(request: NextRequest) {
  try {
    let username = "";

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      username = body.username || "";
    } else {
      const formData = await request.formData();
      username = String(formData.get("username") || "");
    }

    username = username.replace(/^@/, "").trim().toLowerCase();

    if (!username) {
      return NextResponse.redirect(new URL("/?error=empty_username", request.url));
    }

    // 1. Scrape profile & timeline posts
    let scraped;
    try {
      scraped = await fetchProfileAndPosts(username);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === "USER_NOT_FOUND") {
        return NextResponse.redirect(new URL(`/?error=user_not_found&username=${username}`, request.url));
      }
      return NextResponse.redirect(new URL(`/?error=profile_fetch_failed&username=${username}`, request.url));
    }

    const { profile, posts } = scraped;

    if (profile.isPrivate) {
      return NextResponse.redirect(new URL(`/?error=account_private&username=${username}`, request.url));
    }

    // 2. Save/update account in DB
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

    // 3. Save posts to media table
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

    return NextResponse.redirect(new URL(`/?success=added&username=${username}`, request.url));
  } catch (err) {
    console.error("[api/instagram/accounts] Error:", err);
    return NextResponse.redirect(new URL("/?error=server_error", request.url));
  }
}
