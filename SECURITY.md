# Security Policy

## Supported Versions

This repository currently supports the latest code on the default branch.

## Reporting a Vulnerability

Do not commit secrets, API keys, database URIs, or SMTP credentials.

Use GitHub private vulnerability reporting if it is enabled for this repository. If it is not enabled, open a minimal public issue asking for a private contact path and do not include exploit details, secrets, tokens, database URIs, or personally identifiable information.

## Current Security Controls

- JWT authentication uses an HTTP-only cookie.
- Production cookies are marked `secure`.
- Admin routes enforce role authorization.
- Auth, password reset, and payment routes have basic in-memory rate limiting.
- API responses use centralized error handling.
- CI runs a repository secret-pattern scan.
- Local environment files are ignored by git.

## Current Security Scope

- Rate limiting is process-local and intended for the current single Render web service deployment model.
- Dependency vulnerability review would be handled during dependency upgrade cycles.