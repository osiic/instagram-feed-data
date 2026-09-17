// Normalized internal Instagram domain types
// These are never raw Meta API types — always post-normalization

export interface InstagramProfile {
  id: string; // internal DB id
  instagramUserId: string;
  username: string;
  name: string | null;
  profilePictureUrl: string | null;
  biography: string | null;
  followersCount: number | null;
  followsCount: number | null;
  mediaCount: number | null;
  accountType: string | null;
  lastSyncedAt: Date | null;
}

export type MediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export interface InstagramMedia {
  id: string;
  instagramMediaId: string;
  mediaType: MediaType | null;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  caption: string | null;
  permalink: string | null;
  timestamp: Date | null;
  likeCount: number | null;
  commentsCount: number | null;
}

export type InsightPeriod = "day" | "week" | "days_28" | "month" | "lifetime";

export interface InstagramInsight {
  metric: string;
  value: number;
  period: InsightPeriod | null;
  startAt: Date | null;
  endAt: Date | null;
}

export interface InsightsResult {
  insights: InstagramInsight[];
  unavailableReason?: string;
}
