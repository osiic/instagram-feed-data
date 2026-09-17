# MVP Scope

## Must have
- SaaS authentication
- Meta OAuth connection flow
- Multiple connected Instagram accounts per SaaS user
- Account switcher
- Profile summary
- Recent media
- Basic available insights
- Disconnect account
- Secure token handling
- Mock development mode
- Mobile-first dashboard
- Loading/empty/error states

## Should have
- Refresh/sync action
- Last synced timestamp
- Connection status
- Basic date range selector for insights if supported cleanly

## Could have later
- Content publishing
- Scheduling
- Content calendar
- Comment/inbox management
- Team members
- Workspaces
- Role-based access
- Client/agency mode
- Reporting/export
- AI content assistant
- Billing
- Notifications
- Background synchronization

## Must not build in MVP
- Password-based Instagram login
- Scraping
- Unofficial Instagram endpoints
- Token exposure to client
- Complex microservices
- Kubernetes
- Event-driven architecture
- Multi-tenant team permissions
- Billing infrastructure

## MVP principle
Prefer a small reliable monolith over a sophisticated architecture.
