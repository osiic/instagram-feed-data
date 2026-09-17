# Instagram Feed — Multi-Account Public Scraper

A modern, fast, and dependency-free application to track and display public Instagram feeds and profiles for multiple accounts.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Bun**.

---

## Features

- **No API Keys or OAuth Needed**: Simply enter any public Instagram handle (e.g. `@cristiano`, `@jokowi`, `@baron_nduts`) to fetch their profile and recent feed.
- **Multi-Account Support**: Add and monitor multiple public Instagram accounts simultaneously.
- **Database-First Caching**:
  - Page loads are **100% database reads** for instantaneous response and zero Instagram rate limiting.
  - Scraping only triggers when adding an account, clicking an individual account's **Sync** button, or clicking **Sync All**.
- **Rich Media Grid**: 12 recent public posts per account with image thumbnails, video and carousel indicators, and hover overlays with captions and post times.
- **Account Management**: Update/sync data at any time or remove accounts with a single click.
- **Porting Package Included**: Pre-packaged in `./feature-get-instagram-data/` with documentation and components for a 3-slot dedicated dashboard.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Prisma ORM (includes transparent in-memory store fallback for local development)
- **Package Manager & Runtime**: Bun

---

## Getting Started

### 1. Installation

```bash
bun install
```

### 2. Environment Variables

Create `.env` based on `.env.example`:

```env
DATABASE_URL="postgresql://developer:developer@localhost:5432/instagram_feed?schema=public"
```

### 3. Run Development Server

```bash
# Starts Next.js on port 3000
bun dev -- --port 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

```bash
# Type-check
bunx tsc --noEmit

# Lint
bun lint

# Run tests
bun test

# Production build
bunx next build
```

---

## Documentation for Other Projects

If you want to integrate this Instagram scraping and caching feature into your own dashboard project with 3 dedicated watched slots (`@baron_nduts`, `@baron_nduts_bbq`, `@baron_nduts.cottage`), see the complete guide in:

👉 [`./feature-get-instagram-data/README.md`](./feature-get-instagram-data/README.md)
