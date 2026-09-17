# API Contract

All endpoints are Next.js server-side Route Handlers located under `app/api/instagram/`.

---

## 1. List Accounts

### `GET /api/instagram/accounts`
Returns all monitored Instagram accounts stored in the database.

**Response `200 OK`:**
```json
{
  "accounts": [
    {
      "id": "acc_1789678177683_0bb18",
      "username": "cristiano",
      "name": "Cristiano Ronaldo",
      "profilePictureUrl": "https://...",
      "followersCount": 679695907,
      "followsCount": 635,
      "mediaCount": 4131,
      "accountType": "VERIFIED",
      "lastSyncedAt": "2026-09-17T20:50:42.500Z"
    }
  ]
}
```

---

## 2. Add or Sync an Account

### `POST /api/instagram/accounts`
Accepts a username, scrapes the public profile and recent posts from Instagram, and saves the data to the database.

**Request Body** (`application/json` or `application/x-www-form-urlencoded`):
```json
{
  "username": "cristiano"
}
```

**Responses:**
- `307 Redirect` to `/?success=added&username={username}` on success.
- `307 Redirect` to `/?error=user_not_found&username={username}` if user does not exist.
- `307 Redirect` to `/?error=account_private&username={username}` if user account is private.
- `307 Redirect` to `/?error=profile_fetch_failed` if rate-limited by Instagram.

---

## 3. Sync All Accounts

### `POST /api/instagram/accounts/sync-all`
Iterates through all monitored accounts in the database and re-scrapes their latest profiles and feed posts.

**Response:**
- `307 Redirect` to `/?success=synced_all&count={number}` on success.

---

## 4. Delete an Account

### `POST /api/instagram/accounts/{id}` or `DELETE /api/instagram/accounts/{id}`
Deletes the account and cascades deletion of all associated media posts from the database.

**Response:**
- `307 Redirect` to `/` on success (from HTML form).
- `200 OK` `{ "success": true }` (from fetch/XHR).
- `404 Not Found` `{ "error": { "code": "ACCOUNT_NOT_FOUND" } }` if account ID does not exist.
