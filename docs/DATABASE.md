# Database Design & Caching Model

The application uses PostgreSQL with Prisma ORM (`prisma/schema.prisma`), backed by an automatic in-memory fallback store (`lib/db/memory-store.ts`) for local development without an active PostgreSQL instance.

---

## 1. Domain Models

### `InstagramAccount`
Represents a monitored Instagram account.

| Field | Type | Description |
|---|---|---|
| `id` | String (@id) | Primary key identifier |
| `userId` | String | Owner identifier (`default_user`) |
| `instagramUserId` | String (@unique) | Instagram unique handle / ID |
| `username` | String | Instagram handle |
| `name` | String? | Full name from profile |
| `profilePictureUrl` | String? | Avatar image CDN URL |
| `biography` | String? | Bio text |
| `followersCount` | Int? | Number of followers |
| `followsCount` | Int? | Number of following |
| `mediaCount` | Int? | Total post count |
| `accountType` | String? | `VERIFIED` or `PUBLIC` |
| `connectedAt` | DateTime | First added timestamp |
| `lastSyncedAt` | DateTime? | Last successful scrape timestamp |

### `InstagramMedia`
Represents an individual public media post from an account.

| Field | Type | Description |
|---|---|---|
| `id` | String (@id) | Primary key identifier |
| `instagramAccountId` | String | Foreign key to `InstagramAccount` |
| `instagramMediaId` | String | Instagram post PK or shortcode |
| `mediaType` | String? | `IMAGE`, `VIDEO`, or `CAROUSEL_ALBUM` |
| `mediaUrl` | String? | Full display CDN image URL |
| `thumbnailUrl` | String? | Thumbnail CDN image URL |
| `caption` | String? | Caption text |
| `permalink` | String? | Direct link to post on Instagram |
| `likeCount` | Int? | Number of likes |
| `commentsCount` | Int? | Number of comments |
| `timestamp` | DateTime? | Post creation timestamp |

---

## 2. Relationships & Cascades

```
InstagramAccount (1) ───◄ (many) InstagramMedia
```

- When an `InstagramAccount` record is deleted, all linked `InstagramMedia` records are automatically deleted.
- The compound constraint `[instagramAccountId, instagramMediaId]` prevents duplicate post entries across sync operations.
