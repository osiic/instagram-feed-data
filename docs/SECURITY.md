# Security Requirements

## Secrets
- Never commit `.env`.
- Never hardcode Meta app secrets.
- Never send `META_APP_SECRET` to the browser.
- Never log access tokens.

## OAuth
- Use official Meta OAuth.
- Use cryptographically secure state.
- Validate state on callback.
- Handle callback errors.
- Do not trust client-provided account ownership.
- Keep token exchange server-side.

## Token storage
Access tokens are credentials.

Preferred MVP approach:
- encrypt tokens at rest using a server-only encryption key, or use an established secure credential-storage mechanism.
- keep encryption/decryption isolated in `lib/security/`.
- never return decrypted tokens through API responses.
- never store them in localStorage/sessionStorage.

If implementing application-level encryption, use authenticated encryption (for example AES-GCM) with a strong random key stored only in environment/secret management. Do not invent cryptography.

Add an environment variable such as:
`TOKEN_ENCRYPTION_KEY=`

Document key rotation before production.

## Authorization
Every connected account operation must verify authenticated user ownership.

Bad:
`findUnique({ where: { id: accountId } })`

Safe conceptual pattern:
find account by ID AND authenticated user ID.

## Client/server boundaries
Meta API calls and token handling belong on the server.

Client components receive only safe normalized data.

## Input validation
Validate:
- route parameters
- query parameters
- OAuth callback parameters
- API payloads

Use Zod or equivalent.

## Provider data
Treat all external API data as untrusted input.

Normalize and validate before rendering.

## Logging
Safe to log:
- request correlation ID
- internal account ID
- operation name
- non-sensitive provider error category

Never log:
- access tokens
- client secrets
- authorization codes
- cookies/session secrets

## Production checklist
- HTTPS
- secure cookies
- secure secret management
- production OAuth redirect URI
- least-privilege Meta permissions
- database backups
- rate limiting where appropriate
- audit logging for sensitive account actions
- error monitoring without credential capture
