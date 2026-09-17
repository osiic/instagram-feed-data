import { getWatchedAccountsWithFeed } from "@/lib/instagram/db-service";
import { RefreshCw, Edit3, Film, Layers, ImageIcon, AlertCircle, CheckCircle2 } from "lucide-react";

interface WatchedDashboardProps {
  searchParams?: Promise<{
    success?: string;
    error?: string;
    warning?: string;
    slot?: string;
    username?: string;
    failed?: string;
  }>;
}

function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return "-";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

function getTimeAgo(date: Date | string | null | undefined): string {
  if (!date) return "Not synced yet";
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
}

/**
 * Server Component for the Dashboard.
 *
 * Architecture:
 * - 100% Database Reads on initial page load (Zero Instagram scraping latency).
 * - Only 3 Fixed Watched Slots (@baron_nduts, @baron_nduts_bbq, @baron_nduts.cottage).
 * - Slots can be edited to point to another Instagram handle, but NO new slot can be added.
 * - Scraping ONLY occurs when "Sync All" or a single account "Sync" is triggered.
 */
export default async function WatchedInstagramDashboard({ searchParams }: WatchedDashboardProps) {
  const params = searchParams ? await searchParams : {};

  // Instant DB Query: Fetch all 3 slots and their cached media posts
  const accounts = await getWatchedAccountsWithFeed();

  return (
    <div className="w-full text-neutral-100">
      {/* Dashboard Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Watched Instagram Accounts</h2>
          <p className="text-sm text-neutral-400">
            Monitoring 3 dedicated accounts. Cached in database and updated on sync.
          </p>
        </div>

        {/* Global Sync All Action */}
        <form action="/api/instagram/sync" method="POST">
          <input type="hidden" name="all" value="true" />
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow transition shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
            Sync All 3 Accounts
          </button>
        </form>
      </div>

      {/* Notifications */}
      {params.success === "synced_all" && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-800 bg-green-950/40 px-4 py-3 text-sm text-green-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>All 3 watched accounts have been synced and saved to the database!</span>
        </div>
      )}
      {params.success === "slot_updated" && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-800 bg-green-950/40 px-4 py-3 text-sm text-green-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Slot {params.slot} updated to @{params.username} and synced!</span>
        </div>
      )}
      {params.error && (
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Error processing Instagram account: {params.error}</span>
        </div>
      )}

      {/* 3 Fixed Slots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <div
            key={`slot_${acc.slot}`}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden flex flex-col justify-between shadow-sm"
          >
            {/* Slot Header Card */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="rounded bg-purple-950/80 border border-purple-800/60 px-2 py-0.5 text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                  Slot #{acc.slot}
                </span>

                {/* Slot Actions: Edit Handle & Sync */}
                <div className="flex items-center gap-1">
                  {/* Sync Single Account */}
                  <form action="/api/instagram/sync" method="POST">
                    <input type="hidden" name="slot" value={acc.slot} />
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                      title="Sync this account now"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Account Details */}
              <div className="flex items-center gap-3 mb-3">
                {acc.profilePictureUrl ? (
                  <img
                    src={acc.profilePictureUrl}
                    alt={acc.username}
                    className="h-14 w-14 rounded-full object-cover border-2 border-neutral-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-neutral-700 text-white text-xl font-bold shrink-0">
                    {acc.username[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://www.instagram.com/${acc.username}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sm hover:text-purple-400 truncate transition"
                    >
                      @{acc.username}
                    </a>
                    {acc.isVerified && <span className="text-blue-400 text-xs font-bold">✓</span>}
                  </div>
                  {acc.name && <p className="text-xs text-neutral-400 truncate">{acc.name}</p>}
                </div>
              </div>

              {acc.biography && (
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                  {acc.biography}
                </p>
              )}

              {/* Edit Username Inline Form */}
              <details className="group mb-2">
                <summary className="cursor-pointer text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 select-none font-medium">
                  <Edit3 className="h-3 w-3" />
                  <span>Edit Instagram Handle</span>
                </summary>
                <form action="/api/instagram/slots" method="POST" className="mt-2.5 flex gap-1.5">
                  <input type="hidden" name="slot" value={acc.slot} />
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs select-none">@</span>
                    <input
                      type="text"
                      name="username"
                      defaultValue={acc.username}
                      placeholder="new_username"
                      required
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-md pl-6 pr-2 py-1 text-xs text-neutral-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-neutral-800 hover:bg-neutral-700 text-white px-2.5 py-1 rounded-md text-xs font-semibold transition"
                  >
                    Save
                  </button>
                </form>
              </details>
            </div>

            {/* Account Stats */}
            <div className="grid grid-cols-3 border-t border-b border-neutral-800 divide-x divide-neutral-800 text-center py-2.5 bg-neutral-950/40">
              <div>
                <div className="text-xs font-bold">{formatNumber(acc.followersCount)}</div>
                <div className="text-[9px] uppercase tracking-wider text-neutral-500">Followers</div>
              </div>
              <div>
                <div className="text-xs font-bold">{formatNumber(acc.followsCount)}</div>
                <div className="text-[9px] uppercase tracking-wider text-neutral-500">Following</div>
              </div>
              <div>
                <div className="text-xs font-bold">{formatNumber(acc.mediaCount)}</div>
                <div className="text-[9px] uppercase tracking-wider text-neutral-500">Posts</div>
              </div>
            </div>

            {/* Media Posts Grid (from Database Cache) */}
            <div className="p-1 flex-1">
              {acc.media.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-neutral-500">
                  <ImageIcon className="h-6 w-6 mb-1 text-neutral-600" />
                  <span>No cached posts yet</span>
                  <span className="text-[10px] text-neutral-600 mt-0.5">Click &quot;Sync&quot; to fetch</span>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-0.5">
                  {acc.media.map((post) => (
                    <a
                      key={`${acc.slot}_${post.instagramMediaId}`}
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square bg-neutral-800 overflow-hidden block"
                    >
                      {post.mediaUrl ? (
                        <img
                          src={post.mediaUrl}
                          alt={post.caption?.slice(0, 40) || "Post"}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-neutral-700">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}

                      {post.mediaType === "VIDEO" && (
                        <span className="absolute right-1 top-1 rounded bg-black/60 p-0.5 text-white">
                          <Film className="h-3 w-3" />
                        </span>
                      )}
                      {post.mediaType === "CAROUSEL_ALBUM" && (
                        <span className="absolute right-1 top-1 rounded bg-black/60 p-0.5 text-white">
                          <Layers className="h-3 w-3" />
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Sync Timestamp Footer */}
            <div className="px-4 py-2 border-t border-neutral-800 text-[10px] text-neutral-500 text-right bg-neutral-950/20">
              Last synced: {getTimeAgo(acc.lastSyncedAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
