# Database Design

Use PostgreSQL with Prisma.

## User
Represents the authenticated SaaS user.

Suggested fields:
- id
- email
- name nullable
- createdAt
- updatedAt

## InstagramAccount
Represents a connected Instagram Professional/Business account.

Fields:
- id
- userId
- instagramUserId
- username
- name nullable
- profilePictureUrl nullable
- biography nullable
- followersCount nullable
- followsCount nullable
- mediaCount nullable
- accountType nullable
- connectedAt
- lastSyncedAt nullable
- createdAt
- updatedAt

Constraints:
- unique provider Instagram account ID
- index userId

## InstagramToken
Stores token lifecycle information.

Fields:
- id
- instagramAccountId
- encryptedAccessToken
- expiresAt nullable
- scopes nullable
- createdAt
- updatedAt

Constraints:
- one active token record per InstagramAccount for MVP
- unique instagramAccountId

Never return token fields from API responses.

## InstagramMedia
Optional synchronized media snapshot.

Fields:
- id
- instagramAccountId
- instagramMediaId
- mediaType nullable
- mediaUrl nullable
- thumbnailUrl nullable
- caption nullable
- permalink nullable
- timestamp nullable
- likeCount nullable
- commentsCount nullable
- createdAt
- updatedAt

Constraints:
- unique `(instagramAccountId, instagramMediaId)`
- index instagramAccountId

## InstagramInsight
Optional normalized insight snapshot.

Fields:
- id
- instagramAccountId
- metric
- value
- period nullable
- startAt nullable
- endAt nullable
- fetchedAt

Index:
- instagramAccountId
- metric
- fetchedAt

## Ownership
Every account belongs to one User for MVP.

All reads/writes must verify:
`InstagramAccount.userId === authenticatedUser.id`

## Implementation note
Do not assume every API field is available. Nullable fields are intentional.

Avoid storing redundant provider data unless it is useful for the dashboard/cache.
