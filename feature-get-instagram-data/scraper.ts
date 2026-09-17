/**
 * Standalone Public Instagram Scraper
 * No npm libraries, no API tokens, no Facebook/Meta login required.
 * Uses real browser headers to fetch profile SSR payload and 12 recent timeline posts.
 */

export interface PublicProfile {
  instagramUserId: string;
  username: string;
  name: string | null;
  biography: string | null;
  profilePictureUrl: string | null;
  followersCount: number | null;
  followsCount: number | null;
  mediaCount: number | null;
  isPrivate: boolean;
  isVerified: boolean;
}

export interface PublicPost {
  id: string;
  shortcode: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  caption: string | null;
  permalink: string;
  likeCount: number | null;
  commentsCount: number | null;
  timestamp: Date | null;
}

export interface ProfileAndPostsResult {
  profile: PublicProfile;
  posts: PublicPost[];
}

function parseCountString(str: string): number {
  const clean = str.trim().toUpperCase().replace(/,/g, "");
  if (clean.endsWith("M")) return Math.round(parseFloat(clean) * 1_000_000);
  if (clean.endsWith("K")) return Math.round(parseFloat(clean) * 1_000);
  const n = parseInt(clean, 10);
  return isNaN(n) ? 0 : n;
}

const DESKTOP_USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

/**
 * Fetches public profile and 12 recent timeline posts for any public Instagram username.
 * Throws "USER_NOT_FOUND" if the account does not exist.
 * Throws "ACCOUNT_PRIVATE" if the account is private.
 */
export async function fetchProfileAndPosts(username: string): Promise<ProfileAndPostsResult> {
  const cleanUsername = username.replace(/^@/, "").trim().toLowerCase();

  const res = await fetch(`https://www.instagram.com/${cleanUsername}/`, {
    headers: {
      "User-Agent": DESKTOP_USER_AGENT,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    },
    cache: "no-store",
  });

  if (res.status === 404) {
    throw new Error("USER_NOT_FOUND");
  }

  if (!res.ok) {
    throw new Error(`PROFILE_FETCH_FAILED_${res.status}`);
  }

  const html = await res.text();

  // 1. Private check
  const isPrivate = html.includes('"is_private":true') || html.includes("This Account is Private");
  if (isPrivate) {
    throw new Error("ACCOUNT_PRIVATE");
  }

  // 2. OpenGraph Meta Tags Fallback
  let followersCount: number | null = null;
  let followsCount: number | null = null;
  let mediaCount: number | null = null;

  const descMatch =
    html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]*)"/i) ||
    html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
  const imageMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]*)"/i);
  const titleMatch = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]*)"/i);

  if (descMatch) {
    const desc = descMatch[1];
    const followerMatch = desc.match(/([\d.,KMkm]+)\s+Followers/i);
    const followingMatch = desc.match(/([\d.,KMkm]+)\s+Following/i);
    const postsMatch = desc.match(/([\d.,KMkm]+)\s+Posts/i);

    if (followerMatch) followersCount = parseCountString(followerMatch[1]);
    if (followingMatch) followsCount = parseCountString(followingMatch[1]);
    if (postsMatch) mediaCount = parseCountString(postsMatch[1]);
  }

  let name: string | null = null;
  if (titleMatch) {
    const t = titleMatch[1];
    const parenIdx = t.indexOf("(@");
    if (parenIdx > 0) {
      name = t.slice(0, parenIdx).trim();
    }
  }

  let profilePic = imageMatch ? imageMatch[1] : null;
  let bio: string | null = null;
  let userId = cleanUsername;
  let isVerified = false;

  // 3. User JSON payload extraction (xig_user_by_igid_v2 or xig_user_by_username)
  const userMarkers = ['"xig_user_by_igid_v2":', '"xig_user_by_username":'];
  for (const marker of userMarkers) {
    const uIdx = html.indexOf(marker);
    if (uIdx !== -1) {
      const start = uIdx + marker.length;
      let depth = 0;
      let end = start;
      for (let i = start; i < html.length; i++) {
        if (html[i] === "{") depth++;
        else if (html[i] === "}") {
          depth--;
          if (depth === 0) {
            end = i + 1;
            break;
          }
        }
      }
      try {
        const u = JSON.parse(html.slice(start, end));
        userId = String(u.id || u.pk || userId);
        name = u.full_name || name;
        bio = u.biography || bio;
        profilePic = u.profile_pic_url || profilePic;
        if (typeof u.follower_count === "number") followersCount = u.follower_count;
        if (typeof u.following_count === "number") followsCount = u.following_count;
        if (typeof u.media_count === "number") mediaCount = u.media_count;
        isVerified = Boolean(u.is_verified);
        break;
      } catch {
        // Fallback to meta tags
      }
    }
  }

  const profile: PublicProfile = {
    instagramUserId: cleanUsername,
    username: cleanUsername,
    name: name || cleanUsername,
    biography: bio,
    profilePictureUrl: profilePic,
    followersCount,
    followsCount,
    mediaCount,
    isPrivate: false,
    isVerified,
  };

  // 4. Extract timeline posts from "polaris_ordered_timeline_connection"
  const posts: PublicPost[] = [];
  const connIdx = html.indexOf("polaris_ordered_timeline_connection");

  if (connIdx !== -1) {
    const marker = '"edges":[';
    const edgesIdx = html.indexOf(marker, connIdx);

    if (edgesIdx !== -1) {
      const start = edgesIdx + '"edges":'.length;
      let depth = 0;
      let end = start;
      for (let i = start; i < html.length; i++) {
        if (html[i] === "[") depth++;
        else if (html[i] === "]") {
          depth--;
          if (depth === 0) {
            end = i + 1;
            break;
          }
        }
      }

      try {
        const edges = JSON.parse(html.slice(start, end));
        for (const edge of edges) {
          const node = edge.node;
          if (!node) continue;

          const code = (node.code as string) || "";
          const rawUri = (node.display_uri as string) || "";
          const displayUri = rawUri.replace(/\\/g, "");

          const captionText =
            (node.caption?.text as string) ||
            (node.accessibility_caption as string) ||
            null;

          const mediaType =
            node.media_type === 2 || node.__typename === "XIGPolarisVideoMedia"
              ? "VIDEO"
              : node.media_type === 8 || node.__typename === "XIGPolarisCarouselMedia"
              ? "CAROUSEL_ALBUM"
              : "IMAGE";

          posts.push({
            id: String(node.pk || node.id || code),
            shortcode: code,
            mediaType,
            mediaUrl: displayUri || null,
            thumbnailUrl: displayUri || null,
            caption: captionText,
            permalink: code
              ? `https://www.instagram.com/p/${code}/`
              : `https://www.instagram.com/${cleanUsername}/`,
            likeCount: null,
            commentsCount: null,
            timestamp: null,
          });
        }
      } catch (err) {
        console.error("[fetchProfileAndPosts] JSON parse edges failed:", err);
      }
    }
  }

  return { profile, posts };
}
