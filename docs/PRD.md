# PRD — Instagram Multi-Account Manager

## 1. Product
A mobile-first SaaS dashboard that lets one application user connect multiple Instagram Professional/Business accounts and manage/view their available profile, media, and insights data.

## 2. Problem
Business owners and operators may manage several brands/accounts. Switching between Instagram accounts and understanding their current content and metrics is cumbersome.

## 3. MVP user
A business owner, operator, or small team member managing several Instagram Professional/Business accounts.

## 4. Core user journey
1. Sign in to the SaaS.
2. Open Instagram Manager.
3. Connect an Instagram account using Meta OAuth.
4. Return to the dashboard.
5. See connected accounts.
6. Switch between accounts.
7. View profile summary, recent media, and available insights.
8. Disconnect an account when needed.

## 5. MVP value
The product provides one clean place to see multiple connected Instagram accounts without storing Instagram passwords or scraping Instagram.

## 6. Functional requirements

### Authentication
- Application authentication is separate from Instagram OAuth.
- Only authenticated SaaS users can access connected-account data.

### Instagram connection
- Use official Meta OAuth.
- Never request or store Instagram passwords.
- Store only required account/token data.
- Handle cancellation, failure, revoked access, expired tokens, and missing permissions.

### Account management
- List connected accounts.
- Select an account.
- View account profile information.
- Disconnect an account.
- Prevent cross-user data access.

### Media
Show available:
- image/media URL
- media type
- caption when available
- timestamp
- permalink when available
- engagement metrics when available

### Insights
Show only metrics supported by the chosen official API and account type.
If unavailable, show a clear unavailable state.

## 7. Non-functional requirements
- Mobile-first.
- Responsive desktop layout.
- Accessible.
- Fast perceived performance.
- Server-side secrets.
- TypeScript strict.
- Graceful loading, empty, and error states.

## 8. Success criteria
A user can authenticate, connect multiple supported Instagram accounts, switch accounts, view available profile/media/insight data, and disconnect accounts without exposing credentials or tokens.

## 9. Explicit non-goals
- Instagram password login.
- Instagram scraping.
- Unofficial APIs.
- Full social media scheduler.
- Auto-posting unless later verified and explicitly scoped.
- Team/workspace permissions.
- Billing/subscriptions.
- Advanced analytics.
- Social inbox.
- Comment management.
- Elaborate background job infrastructure.
