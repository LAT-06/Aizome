# Aizome Architecture

## Status

Accepted on 2026-07-01.

This document records the target architecture for Aizome. It defines the
boundaries for future implementation; no application code is introduced by
this decision.

## System Overview

Aizome is a centralized media posting tool for IteaLab. A user writes one
post, selects Facebook, LinkedIn, or both, and submits it through the web
application.

The system will use a TypeScript monorepo with these primary locations:

```txt
apps/
  web/              Vue 3 frontend
  api/              Express backend
packages/
  shared/           Shared TypeScript types, added when needed
```

The selected stack is:

- `apps/web`: Vue 3, Composition API, TypeScript, and Vite
- `apps/api`: Node.js, Express, and TypeScript
- Database: PostgreSQL
- `packages/shared`: future shared request, response, and domain types

The primary request path will be:

```txt
Browser
  -> Vue web application
    -> Express API
      -> posting service
        -> Facebook adapter
        -> LinkedIn adapter
      -> PostgreSQL
```

Platform adapters will be mocked during local development and automated
testing. Real adapters will be introduced only after credentials, OAuth,
permissions, and operational policies are defined.

## Local Development Architecture

Local development will run the web application, API, and PostgreSQL as
separate processes:

```txt
Vue/Vite development server
  -> local Express API
    -> local PostgreSQL
    -> mock Facebook and LinkedIn adapters
```

- Vite will serve `apps/web` and provide the frontend development workflow.
- Express will serve `apps/api` and own the application API.
- PostgreSQL will run locally, preferably through Docker Compose.
- Mock platform adapters will be the default and must not make external
  Facebook or LinkedIn requests.
- Local configuration will use environment variables documented in
  `.env.example`; real credentials are not required for the mock harness.

The local harness described in `docs/harness.md` remains the behavioral
reference for post validation, platform dispatch, persistence, and
per-platform results.

## Production Architecture

The intended production topology is:

```txt
User browser
  -> Vercel-hosted Vue application
    -> Railway-hosted Express API
      -> managed PostgreSQL
      -> Facebook Graph API
      -> LinkedIn API
```

- Vercel will host the built static frontend.
- Railway will host the Node.js API.
- PostgreSQL will be a managed production database. The provider and network
  configuration will be selected before deployment.
- Only the API will communicate with PostgreSQL and external social platform
  APIs.
- The web application will communicate with the API over HTTPS.

Production must not use mock adapters. Startup configuration should fail
safely if production is configured with mock adapter mode.

## Backend Responsibility

`apps/api` will be responsible for:

- Exposing the application API, including post submission.
- Authenticating and authorizing posting requests when authentication is
  introduced.
- Validating post content and selected platforms as the source of truth.
- Persisting posts and per-platform posting results.
- Dispatching submissions through Facebook and LinkedIn adapter interfaces.
- Owning OAuth flows, access tokens, refresh tokens, and platform secrets.
- Normalizing external API responses and errors for the frontend.
- Handling retries, rate limits, idempotency, audit logs, and permission
  checks when real integrations are implemented.

The API must not expose platform credentials or raw sensitive platform
responses to the frontend.

## Frontend Responsibility

`apps/web` will be responsible for:

- Rendering the post composer and post preview.
- Allowing users to select Facebook, LinkedIn, or both.
- Performing basic client-side validation for immediate feedback.
- Submitting posts only to the Express API.
- Displaying loading, success, failure, and partial-success states.
- Presenting normalized per-platform results returned by the API.

Frontend validation improves usability but does not replace backend
validation. The frontend must never call Facebook or LinkedIn APIs directly
and must never store platform credentials.

## Database Role

PostgreSQL will be the system of record for application data. It will
eventually store:

- Posts and their content.
- Selected target platforms.
- Overall posting status.
- Per-platform posting status and external post identifiers.
- Safe error metadata.
- Created and updated timestamps.
- Audit records required for posting accountability.

The initial schema and migration tool remain separate implementation
decisions. Platform access tokens must not be stored until an encryption,
access-control, and rotation strategy has been reviewed.

## Shared Types

`packages/shared` may be added when both applications exist and share stable
contracts. It is intended for narrow TypeScript types such as API request and
response shapes, supported platform names, and normalized posting statuses.

It must not contain server-only configuration, database models, secrets,
Express-specific code, or browser-specific code. Until duplication becomes a
real maintenance issue, types should remain in the application that owns
them.

## External API Boundary

Facebook Graph API and LinkedIn API are backend-only dependencies:

```txt
apps/web
  -> apps/api
    -> platform adapter interface
      -> mock adapter in local development and tests
      -> real adapter in approved production integration
```

This adapter boundary keeps external SDKs, credentials, permission checks,
rate-limit behavior, and provider-specific errors out of the frontend and
core posting flow. Real platform integrations require a separate decision
covering developer app ownership, target page and organization, OAuth
scopes, token storage, retry behavior, and audit requirements.

## Security Notes

- Never place access tokens, refresh tokens, client secrets, or private keys
  in `apps/web`.
- Never commit `.env` files or real credentials.
- Use HTTPS for browser-to-API and API-to-provider traffic in production.
- Validate and authorize every posting request on the backend.
- Encrypt sensitive tokens at rest before any real token persistence is
  implemented.
- Do not log tokens, authorization codes, cookies, or full OAuth responses.
- Restrict database access to the API and use least-privilege credentials.
- Add request validation, rate limiting, CSRF protection where applicable,
  and an auditable posting trail before production integration.
- Prevent duplicate external posts with an idempotency strategy before
  enabling retries.
- Ensure mock adapter mode cannot be enabled accidentally in production.

Authentication, OAuth, token persistence, and real Facebook or LinkedIn
posting are explicitly outside the current implementation phase.
