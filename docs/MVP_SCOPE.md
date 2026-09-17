# MVP Scope — Instagram Multi-Account Public Scraper

## In-Scope (Implemented)

- **Add Public Account**: Simple input form accepting any public `@username`.
- **Multi-Account Monitoring**: Support for tracking multiple accounts on a single dashboard.
- **Profile Summary**: Displays avatar, name, handle, bio, verified badge, followers, following, and post counts.
- **Recent Feed Grid**: 12 most recent timeline posts with image preview, video/carousel badges, and direct links.
- **Database Caching**: Initial page loads read from the local database without hitting Instagram.
- **Manual Sync Actions**:
  - Individual account sync to update statistics and feed.
  - Global "Sync All" button to refresh all monitored accounts in one action.
- **Account Removal**: Single-click account deletion that cleans up cached media.
- **Responsive Layout**: Mobile-first design styled with Tailwind CSS v4.
- **Dedicated Porting Package**: Standalone 3-slot implementation documented in `./feature-get-instagram-data/`.

## Out-of-Scope (Deferred / Intentional Exclusions)

- Private account scraping (requires Instagram credentials / session cookies).
- Historical post pagination beyond the first 12 posts.
- Publishing, scheduling, or story posting.
- Direct messages or comment moderation.
- Meta Graph API or Facebook Login integration.
