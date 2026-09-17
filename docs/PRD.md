# PRD — Instagram Multi-Account Public Profile & Feed Scraper

## 1. Product Summary
A single-page, multi-account Instagram viewer and scraper that lets users monitor public Instagram profiles and recent feeds simply by providing Instagram handles (`@username`).

## 2. Problem Statement
Official Meta Graph API access requires Facebook app reviews, business verification, and permissions that are difficult or impossible for small teams and personal projects to obtain. Frequent `Feature Unavailable` errors and strict OAuth gating make building simple public brand monitors via the official API unreliable.

## 3. Solution
- Direct server-side scraping of public Instagram profile pages using standard browser headers.
- Extracting public profile statistics (Followers, Following, Posts count, Bio, Avatar) and 12 recent timeline posts.
- Saving scraped data into a persistent local database (PostgreSQL / Prisma).
- Serving page requests purely from the local database cache to eliminate loading delay and prevent Instagram rate limits.
- Providing manual "Sync" and "Sync All" triggers to fetch fresh data on demand.

## 4. Core User Journeys

1. **Add Account**: User enters an Instagram handle in the input box and clicks "Add Account". Server scrapes the public profile and recent posts, saves them to the database, and renders the account card and media grid.
2. **View Multi-Account Feed**: User views multiple brand accounts on a single page, seeing followers, following, bio, and recent posts for each account.
3. **Sync Account**: User clicks the "Sync" icon on any account card to refresh its statistics and feed from Instagram.
4. **Sync All**: User clicks "Sync All" at the top of the page to refresh all monitored accounts in a single batch.
5. **Remove Account**: User clicks the "Remove" icon to delete an account and its cached media from the system.
