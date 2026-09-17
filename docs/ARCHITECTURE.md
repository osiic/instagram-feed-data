# System Architecture & Data Flow

## 1. High-Level Architecture

```
[Browser / User]
       │
       ▼
[Next.js App Router (app/page.tsx)]
       │
       ├─ (1) Initial Page View ──────────────► [Local Database / Prisma]
       │                                        • Instantaneous read (< 10ms)
       │                                        • Zero calls to Instagram
       │
       └─ (2) Explicit Actions ("Add" / "Sync" / "Sync All")
              │
              ▼
       [API Routes (/api/instagram/accounts/*)]
              │
              ▼
       [Scraper Service (lib/instagram/scraper.ts)]
              │
              ├─ HTTP GET with Desktop Browser Headers
              ▼
       [Instagram Web (https://www.instagram.com/{username}/)]
              │
              ▼
       [Extract SSR JSON & OpenGraph Meta]
              │
              ▼
       [Save / Upsert Profile & Media to Database]
              │
              ▼
       [Redirect & Revalidate Home Page (/)]
```

## 2. Scraping Mechanism

Instagram serves server-side rendered (SSR) JSON data to modern desktop browser User-Agents.
- Target URL: `https://www.instagram.com/{username}/`
- User-Agent: `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36`
- Profile data extracted from:
  - `"xig_user_by_username":{...}` or `"xig_user_by_igid_v2":{...}`
  - Fallback: `<meta property="og:description">`, `<meta property="og:image">`, `<meta property="og:title">`
- Recent posts extracted from:
  - `"polaris_ordered_timeline_connection":{"edges": [...]}`
  - Extracts 12 recent timeline posts containing shortcode, display URI, media type, and captions.

## 3. Database Caching Layer

- All initial requests read from the local store (`prisma.instagramAccount` and `prisma.instagramMedia`).
- Because requests do not trigger outbound HTTP calls to Instagram, page loads are not subject to rate limits or IP blocks.
- When an account is removed, related media records are cascaded and deleted immediately.
