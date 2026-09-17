import { prisma } from "@/lib/db/client";
import { ImageIcon, Film, Layers, RefreshCw, Trash2, Plus, AlertCircle, CheckCircle2, Search } from "lucide-react";

interface MediaPost {
  id: string;
  instagramMediaId: string;
  permalink: string | null;
  mediaType: string | null;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  caption: string | null;
  likeCount: number | null;
  commentsCount: number | null;
  timestamp: Date | string | null;
}

interface PageProps {
  searchParams: Promise<{
    success?: string;
    error?: string;
    username?: string;
    count?: string;
  }>;
}

const ERROR_MESSAGES: Record<string, string> = {
  empty_username: "Username cannot be empty.",
  user_not_found: "Instagram account not found. Please check the username.",
  account_private: "This account is private and cannot be viewed.",
  profile_fetch_failed: "Failed to fetch profile. Instagram may be rate limiting. Please try again in a few minutes.",
  server_error: "A server error occurred. Please try again.",
  no_accounts: "No accounts to sync. Add an account first.",
};

function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return "-";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

function getTimeAgo(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31104000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31104000)}y ago`;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const accounts = await prisma.instagramAccount.findMany({
    where: { userId: "default_user" },
    orderBy: { connectedAt: "desc" },
  });

  // Fetch media for each account
  const accountsWithMedia = await Promise.all(
    accounts.map(async (account) => {
      const mediaStore = (prisma as unknown as Record<string, { findMany?: (args: unknown) => Promise<MediaPost[]> }>).instagramMedia;
      const media: MediaPost[] = (await mediaStore?.findMany?.({
        where: { instagramAccountId: account.id },
        orderBy: { timestamp: "desc" },
        take: 12,
      })) ?? [];
      return { account, media };
    }),
  );

  const errorMsg = params.error && ERROR_MESSAGES[params.error]
    ? (params.username ? `@${params.username}: ${ERROR_MESSAGES[params.error]}` : ERROR_MESSAGES[params.error])
    : null;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Instagram Feed</h1>
            <p className="text-sm text-neutral-500">Enter Instagram usernames to view public profiles and feeds</p>
          </div>

          {/* Sync All Button */}
          {accounts.length > 0 && (
            <form action="/api/instagram/accounts/sync-all" method="POST" className="self-start sm:self-auto">
              <button
                type="submit"
                className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg px-3.5 py-2 text-xs font-semibold transition shadow-sm"
                title="Refresh and sync all connected accounts"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Sync All
              </button>
            </form>
          )}
        </div>

        {/* Input Form */}
        <form action="/api/instagram/accounts" method="POST" className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm select-none">@</span>
              <input
                type="text"
                name="username"
                placeholder="username"
                required
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-8 pr-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 transition"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition shrink-0 shadow"
            >
              <Plus className="h-4 w-4" />
              Add Account
            </button>
          </div>
        </form>

        {/* Alerts */}
        {params.success === "added" && params.username && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-800 bg-green-950/40 px-4 py-3 text-sm text-green-300">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>@{params.username} added successfully!</span>
          </div>
        )}
        {params.success === "synced_all" && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-800 bg-green-950/40 px-4 py-3 text-sm text-green-300">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>All accounts ({params.count ?? "all"}) synced successfully!</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Empty State */}
        {accounts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/40 py-20 text-center">
            <div className="mb-4 rounded-full bg-neutral-800 p-5">
              <Search className="h-8 w-8 text-neutral-500" />
            </div>
            <p className="text-base font-medium text-neutral-300">No accounts added yet</p>
            <p className="mt-1 text-sm text-neutral-500 max-w-xs">
              Enter an Instagram username above to view public profile and feed posts
            </p>
          </div>
        )}

        {/* Account List */}
        <div className="space-y-8">
          {accountsWithMedia.map(({ account, media }) => (
            <div key={account.id} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
              {/* Profile Card */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Avatar */}
                    {account.profilePictureUrl ? (
                      <img
                        src={account.profilePictureUrl}
                        alt={account.username}
                        className="h-16 w-16 rounded-full object-cover border-2 border-neutral-700 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-neutral-700 text-white text-2xl font-bold flex-shrink-0">
                        {account.username[0].toUpperCase()}
                      </div>
                    )}

                    {/* Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={`https://www.instagram.com/${account.username}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-base hover:text-purple-400 transition"
                        >
                          @{account.username}
                        </a>
                        {account.accountType === "VERIFIED" && (
                          <span className="text-blue-400 text-sm font-semibold" title="Verified">✓</span>
                        )}
                      </div>
                      {account.name && account.name !== account.username && (
                        <p className="text-sm text-neutral-400 truncate">{account.name}</p>
                      )}
                      {account.biography && (
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed line-clamp-2 whitespace-pre-line">
                          {account.biography}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Sync Account */}
                    <form action="/api/instagram/accounts" method="POST">
                      <input type="hidden" name="username" value={account.username} />
                      <button
                        type="submit"
                        className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-800 hover:text-purple-400 transition"
                        title="Sync account"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </form>

                    {/* Remove Account */}
                    <form action={`/api/instagram/accounts/${account.id}`} method="POST">
                      <button
                        type="submit"
                        className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-800 hover:text-red-400 transition"
                        title="Remove account"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 border-t border-b border-neutral-800 divide-x divide-neutral-800">
                {[
                  { label: "Followers", value: formatNumber(account.followersCount) },
                  { label: "Following", value: formatNumber(account.followsCount) },
                  { label: "Posts", value: formatNumber(account.mediaCount) },
                ].map(({ label, value }) => (
                  <div key={label} className="py-3 text-center">
                    <div className="text-base font-bold">{value}</div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Media Feed */}
              {media.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-neutral-600">
                  No public posts available
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-0.5 p-0.5">
                  {media.map((post: MediaPost) => (
                    <a
                      key={`${account.id}_${post.instagramMediaId || post.id}`}
                      href={post.permalink || `https://www.instagram.com/p/${post.instagramMediaId}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square overflow-hidden bg-neutral-800 block"
                    >
                      {(post.mediaUrl || post.thumbnailUrl) ? (
                        <img
                          src={post.mediaUrl || post.thumbnailUrl || ""}
                          alt={post.caption?.slice(0, 60) || "Post"}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-neutral-700">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      )}

                      {/* Type Badge */}
                      {post.mediaType === "VIDEO" && (
                        <span className="absolute right-1.5 top-1.5 rounded bg-black/60 p-1">
                          <Film className="h-3 w-3 text-white" />
                        </span>
                      )}
                      {post.mediaType === "CAROUSEL_ALBUM" && (
                        <span className="absolute right-1.5 top-1.5 rounded bg-black/60 p-1">
                          <Layers className="h-3 w-3 text-white" />
                        </span>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 group-hover:opacity-100 transition">
                        <div className="flex items-center gap-3">
                          {post.likeCount !== null && (
                            <span className="text-xs font-bold text-white">❤ {formatNumber(post.likeCount)}</span>
                          )}
                          {post.commentsCount !== null && (
                            <span className="text-xs font-bold text-white">💬 {formatNumber(post.commentsCount)}</span>
                          )}
                        </div>
                        {post.timestamp && (
                          <span className="text-[10px] text-neutral-300">{getTimeAgo(post.timestamp)}</span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="px-4 py-2 border-t border-neutral-800/60 text-[11px] text-neutral-600 text-right">
                Synced: {account.lastSyncedAt ? getTimeAgo(account.lastSyncedAt) : "Not synced yet"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
