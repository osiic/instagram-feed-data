# Security & Rate Limiting Considerations

## 1. Credentials & Secrets
- No Meta App Secret, App ID, or OAuth tokens are used or required by this project.
- Never commit `.env` files containing production database connection strings.

## 2. Instagram Rate Limiting & Anti-Abuse
- **Server-Side Only**: Scraping is performed entirely server-side. Client browsers never make direct CORS-violating requests to Instagram.
- **Cache-First Protection**: Loading the home page (`app/page.tsx`) queries the local database and never touches Instagram. This completely shields the server IP from being rate-limited during regular page traffic.
- **User-Agent Management**: Inbound requests to Instagram use modern Chrome desktop headers to avoid being blocked with login redirects.
- **CDN Hotlinking & Expiry**: Instagram CDN image URLs (`scontent.cdninstagram.com`) contain signed expiry tokens (`oe=...`) valid for 2-4 weeks. Triggering a manual "Sync" refreshes these image URLs in the database.

## 3. Input Sanitization
- All usernames are trimmed, lowercase-normalized, and stripped of leading `@` symbols before being used in URL formation or database queries.
- SQL injection is prevented by utilizing Prisma ORM parameterized queries.
