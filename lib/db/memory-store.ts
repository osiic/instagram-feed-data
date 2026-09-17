// In-memory Prisma-compatible store for mock mode
// Allows running without a PostgreSQL database

export interface MockInstagramAccount {
  id: string;
  userId: string;
  instagramUserId: string;
  username: string;
  name: string | null;
  profilePictureUrl: string | null;
  biography: string | null;
  followersCount: number | null;
  followsCount: number | null;
  mediaCount: number | null;
  accountType: string | null;
  connectedAt: Date;
  lastSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockInstagramToken {
  id: string;
  instagramAccountId: string;
  encryptedAccessToken: string;
  expiresAt: Date | null;
  scopes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockInstagramMedia {
  id: string;
  instagramAccountId: string;
  instagramMediaId: string;
  mediaType: string | null;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  caption: string | null;
  permalink: string | null;
  timestamp: Date | null;
  likeCount: number | null;
  commentsCount: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockInstagramInsight {
  id: string;
  instagramAccountId: string;
  metric: string;
  value: number;
  period: string | null;
  startAt: Date | null;
  endAt: Date | null;
  fetchedAt: Date;
}

// Production mode: store starts empty until real OAuth connection
const initialAccounts: MockInstagramAccount[] = [];

class MemoryStore {
  accounts = new Map<string, MockInstagramAccount>();
  tokens = new Map<string, MockInstagramToken>();
  media = new Map<string, MockInstagramMedia>();
  insights: MockInstagramInsight[] = [];

  constructor() {
    for (const acc of initialAccounts) {
      this.accounts.set(acc.id, acc);
    }
  }

  instagramAccount = {
    findMany: async (args?: {
      where?: { userId?: string };
      orderBy?: { connectedAt?: "asc" | "desc" };
      select?: Record<string, boolean>;
    }) => {
      let res = Array.from(this.accounts.values());
      if (args?.where?.userId) {
        res = res.filter((a) => a.userId === args.where!.userId);
      }
      return res;
    },

    findFirst: async (args: { where: { id?: string; userId?: string } }) => {
      for (const acc of this.accounts.values()) {
        const matchId = !args.where.id || acc.id === args.where.id;
        const matchUser = !args.where.userId || acc.userId === args.where.userId;
        if (matchId && matchUser) return acc;
      }
      return null;
    },

    delete: async (args: { where: { id: string } }) => {
      this.accounts.delete(args.where.id);
      return { id: args.where.id };
    },

    upsert: async (args: {
      where: { instagramUserId: string };
      create: Record<string, unknown>;
      update: Record<string, unknown>;
    }) => {
      let existing: MockInstagramAccount | undefined;
      for (const acc of this.accounts.values()) {
        if (acc.instagramUserId === args.where.instagramUserId) {
          existing = acc;
          break;
        }
      }

      if (existing) {
        const updated: MockInstagramAccount = {
          ...existing,
          ...args.update,
          updatedAt: new Date(),
        };
        this.accounts.set(existing.id, updated);
        return updated;
      }

      const id = `acc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const created = {
        id,
        ...args.create,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as MockInstagramAccount;
      this.accounts.set(id, created);
      return created;
    },
  };

  instagramToken = {
    findUnique: async (args: { where: { instagramAccountId: string } }) => {
      return this.tokens.get(args.where.instagramAccountId) || null;
    },

    upsert: async (args: {
      where: { instagramAccountId: string };
      create: Record<string, unknown>;
      update: Record<string, unknown>;
    }) => {
      const existing = this.tokens.get(args.where.instagramAccountId);
      if (existing) {
        const updated: MockInstagramToken = {
          ...existing,
          ...args.update,
          updatedAt: new Date(),
        };
        this.tokens.set(args.where.instagramAccountId, updated);
        return updated;
      }

      const id = `tok_${Date.now()}`;
      const created = {
        id,
        ...args.create,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as MockInstagramToken;
      this.tokens.set(args.where.instagramAccountId, created);
      return created;
    },
  };

  instagramMedia = {
    findMany: async (args?: {
      where?: { instagramAccountId?: string };
      orderBy?: { timestamp?: "asc" | "desc" };
      take?: number;
    }) => {
      let res = Array.from(this.media.values());
      if (args?.where?.instagramAccountId) {
        res = res.filter((m) => m.instagramAccountId === args.where!.instagramAccountId);
      }
      if (args?.orderBy?.timestamp === "desc") {
        res.sort((a, b) => (b.timestamp?.getTime() ?? 0) - (a.timestamp?.getTime() ?? 0));
      }
      if (args?.take) {
        res = res.slice(0, args.take);
      }
      return res;
    },

    deleteMany: async (args: { where: { instagramAccountId: string } }) => {
      let count = 0;
      for (const [key, val] of this.media.entries()) {
        if (val.instagramAccountId === args.where.instagramAccountId) {
          this.media.delete(key);
          count++;
        }
      }
      return { count };
    },

    upsert: async (args: {
      where: {
        instagramAccountId_instagramMediaId: {
          instagramAccountId: string;
          instagramMediaId: string;
        };
      };
      create: Record<string, unknown>;
      update: Record<string, unknown>;
    }) => {
      const key = `${args.where.instagramAccountId_instagramMediaId.instagramAccountId}_${args.where.instagramAccountId_instagramMediaId.instagramMediaId}`;
      const existing = this.media.get(key);
      if (existing) {
        const updated = {
          ...existing,
          ...args.update,
          updatedAt: new Date(),
        } as MockInstagramMedia;
        this.media.set(key, updated);
        return updated;
      }

      const mediaId = args.where.instagramAccountId_instagramMediaId.instagramMediaId;
      const id = `media_${mediaId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const created = {
        id,
        ...args.create,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as MockInstagramMedia;
      this.media.set(key, created);
      return created;
    },
  };

  instagramInsight = {
    create: async (args: { data: Omit<MockInstagramInsight, "id"> }) => {
      const created: MockInstagramInsight = {
        id: `ins_${Date.now()}`,
        ...args.data,
      };
      this.insights.push(created);
      return created;
    },
  };
}

// Global singleton so state persists across hot-reloads in memory
declare global {
  var __memoryStore: MemoryStore | undefined;
}

export const memoryStore = globalThis.__memoryStore ?? new MemoryStore();
if (process.env.NODE_ENV !== "production") {
  globalThis.__memoryStore = memoryStore;
}
