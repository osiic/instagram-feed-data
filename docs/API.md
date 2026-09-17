# API Contract

All application API endpoints are server-side.

## Authentication
Use the application's auth mechanism for all protected routes.

## Instagram OAuth

### GET `/api/instagram/connect`
Starts Meta OAuth.

Responsibilities:
- require authenticated SaaS user
- generate cryptographically secure OAuth state
- persist/associate state safely
- redirect to official Meta authorization URL

### GET `/api/instagram/callback`
Handles OAuth callback.

Responsibilities:
- validate state
- handle OAuth errors/cancellation
- exchange authorization result server-side
- retrieve/validate supported Instagram account
- securely store token
- create/update InstagramAccount
- redirect to account dashboard

Never expose the access token in the redirect URL.

## Accounts

### GET `/api/instagram/accounts`
Returns connected accounts for current user.

Response shape:
```json
{
  "accounts": [
    {
      "id": "internal-id",
      "username": "@example",
      "name": "Example",
      "profilePictureUrl": null,
      "followersCount": 0,
      "mediaCount": 0,
      "accountType": "PROFESSIONAL"
    }
  ]
}
```

### GET `/api/instagram/accounts/:id`
Returns one account after ownership validation.

### DELETE `/api/instagram/accounts/:id`
Disconnects account after ownership validation.

It must revoke/delete local token data as appropriate and remove the connected account from the SaaS database.

## Media

### GET `/api/instagram/accounts/:id/media`
Returns normalized media for the owned account.

Potential response:
```json
{
  "media": [
    {
      "id": "internal-id",
      "mediaType": "IMAGE",
      "mediaUrl": "...",
      "thumbnailUrl": null,
      "caption": "...",
      "permalink": "...",
      "timestamp": "...",
      "likeCount": 0,
      "commentsCount": 0
    }
  ]
}
```

Only include fields actually available.

## Insights

### GET `/api/instagram/accounts/:id/insights`
Returns normalized available metrics.

Potential response:
```json
{
  "insights": [
    {
      "metric": "reach",
      "value": 0,
      "period": "day",
      "startAt": "...",
      "endAt": "..."
    }
  ]
}
```

Do not fabricate unsupported metrics.

## Error format

Use a consistent safe shape:

```json
{
  "error": {
    "code": "INSTAGRAM_API_UNAVAILABLE",
    "message": "Instagram data is temporarily unavailable."
  }
}
```

Do not return raw provider errors, secrets, access tokens, or internal stack traces.

## Service API

Prefer internal functions such as:
- `getInstagramAccount(accountId, userId)`
- `getInstagramMedia(accountId, userId)`
- `getInstagramInsights(accountId, userId)`
- `disconnectInstagramAccount(accountId, userId)`
- `refreshInstagramToken(accountId)`

The service layer owns provider-specific implementation details.
