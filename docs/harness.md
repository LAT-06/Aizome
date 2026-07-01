# Aizome Harness

## Purpose

This document defines the local full-stack harness for Aizome.

Aizome is a centralized media posting tool for IteaLab. The core flow is:

```txt
Write one post
  -> Select target platforms
  -> Submit
  -> Backend receives the post request
  -> Backend sends the post to platform adapters
  -> Platform adapters publish or simulate publishing
  -> Frontend displays per-platform results
```

The harness exists to test this flow safely and repeatedly without calling real Facebook or LinkedIn APIs.

## Harness Architecture

The local harness uses this architecture:

```txt
Vue frontend
  -> Backend API
    -> Post service
      -> Facebook adapter
      -> LinkedIn adapter
    -> Database
```

For local development and automated tests:

```txt
Vue frontend
  -> Backend API
    -> Post service
      -> Mock Facebook adapter
      -> Mock LinkedIn adapter
    -> Test database
```

The harness must verify the real internal application flow while replacing external platform calls with controlled mocks.

## Scope

The harness covers:

* Frontend post composer
* Platform selection
* Backend post creation endpoint
* Backend post validation
* Backend platform dispatch logic
* Mock Facebook fanpage posting
* Mock LinkedIn company posting
* Database persistence
* Success state
* Failure state
* Partial success state
* API error handling
* Type checking and build verification

The harness does not cover:

* Real Facebook Graph API posting
* Real LinkedIn API posting
* Real OAuth flow
* Real access tokens
* Production token refresh
* Production audit log retention
* Real platform rate limits
* Real page or organization permissions

Those belong to the production integration phase.

## Backend Stack Decision

The backend stack is not finalized yet.

Allowed backend options:

* Node.js with Express
* Python with FastAPI

Do not implement both.

Before backend implementation starts, choose one backend stack and document the decision in:

```txt
docs/architecture.md
```

Recommended initial choice:

```txt
Node.js + Express + TypeScript
```

Reason:

* Same language family as Vue frontend
* Easier shared types later
* Simple deployment to Railway
* Lower project complexity for a small internal tool

FastAPI is still acceptable if the backend will later need Python-heavy processing.

## Database Decision

Allowed database options:

* PostgreSQL
* MongoDB

Do not implement both.

Recommended initial choice:

```txt
PostgreSQL
```

Reason:

* Posts, platforms, users, tokens, and audit logs are relational
* Better fit for status tracking
* Better fit for future reporting
* Stronger consistency for publishing workflows

## Local Harness Components

### Frontend

Expected responsibilities:

* Render post composer
* Validate basic form state
* Let the user select Facebook, LinkedIn, or both
* Send post request to backend
* Display backend response
* Display per-platform posting result

The frontend must not call Facebook or LinkedIn APIs directly.

### Backend API

Expected responsibilities:

* Receive post submission
* Validate content
* Validate selected platforms
* Persist the post
* Dispatch posting jobs to platform adapters
* Persist platform results
* Return normalized result to frontend

### Platform Adapters

The backend must use adapters for platform posting.

Expected adapter shape:

```txt
FacebookAdapter
LinkedInAdapter
```

Each adapter should have a real implementation later and a mock implementation for the harness.

The harness must use mock adapters by default.

### Database

The harness should use a local test database or a dedicated local development database.

The database should store:

* Posts
* Selected platforms
* Per-platform post status
* Error messages
* Created timestamp
* Updated timestamp

Do not store real access tokens in the harness database.

## Safety Rules

Never use real credentials in the harness.

Never commit:

* Facebook access tokens
* LinkedIn access tokens
* OAuth client secrets
* API keys
* Cookies
* Private keys
* `.env` files with real values

The frontend must not contain:

* Platform access tokens
* OAuth client secrets
* Backend secrets
* Direct Facebook Graph API calls
* Direct LinkedIn API calls

The backend must not log:

* Access tokens
* Refresh tokens
* OAuth authorization codes
* Full platform API responses containing sensitive data

## Environment Variables

Use `.env.example` to document required environment variables.

Initial harness variables:

```env
APP_ENV=local
API_PORT=3000
DATABASE_URL=postgresql://aizome:aizome@localhost:5432/aizome_dev
PLATFORM_ADAPTER_MODE=mock
```

If using FastAPI, the backend port may still remain `3000` or be changed to `8000`, but the chosen value must be documented.

No real platform secrets are required for the harness.

Future production variables may include:

```env
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
```

These must not be needed for the local mock harness.

## API Contract

### Create Post

Endpoint:

```http
POST /api/posts
```

Request body:

```json
{
  "content": "Hello from Aizome.",
  "platforms": ["facebook", "linkedin"]
}
```

Response body:

```json
{
  "postId": "post_123",
  "status": "partial_success",
  "results": [
    {
      "platform": "facebook",
      "status": "success",
      "externalPostId": "mock_fb_123"
    },
    {
      "platform": "linkedin",
      "status": "failed",
      "errorCode": "MOCK_RATE_LIMIT",
      "errorMessage": "LinkedIn mock adapter rejected the post."
    }
  ]
}
```

Allowed post status values:

```txt
draft
posting
success
failed
partial_success
```

Allowed platform values:

```txt
facebook
linkedin
```

## Backend Domain Types

Expected domain model:

```ts
type Platform = 'facebook' | 'linkedin'

type PostStatus =
  | 'draft'
  | 'posting'
  | 'success'
  | 'failed'
  | 'partial_success'

type PlatformPostStatus =
  | 'pending'
  | 'success'
  | 'failed'

type PlatformPostResult = {
  platform: Platform
  status: PlatformPostStatus
  externalPostId?: string
  errorCode?: string
  errorMessage?: string
}

type MediaPost = {
  id: string
  content: string
  platforms: Platform[]
  status: PostStatus
  results: PlatformPostResult[]
  createdAt: string
  updatedAt: string
}
```

If the backend uses Python, define equivalent Pydantic models.

## Mock Adapter Behavior

### Facebook Mock Adapter

The Facebook mock adapter simulates posting to the IteaLab Facebook fanpage.

Expected behavior:

* Accept valid content
* Return success in default mock mode
* Return controlled failure when configured
* Return a mock external post ID
* Never call Facebook Graph API

Example success result:

```json
{
  "platform": "facebook",
  "status": "success",
  "externalPostId": "mock_fb_123"
}
```

Example failure result:

```json
{
  "platform": "facebook",
  "status": "failed",
  "errorCode": "MOCK_FACEBOOK_ERROR",
  "errorMessage": "Facebook mock adapter rejected the post."
}
```

### LinkedIn Mock Adapter

The LinkedIn mock adapter simulates posting to the IteaLab LinkedIn company page.

Expected behavior:

* Accept valid content
* Return success in default mock mode
* Return controlled failure when configured
* Return a mock external post ID
* Never call LinkedIn API

Example success result:

```json
{
  "platform": "linkedin",
  "status": "success",
  "externalPostId": "mock_li_123"
}
```

Example failure result:

```json
{
  "platform": "linkedin",
  "status": "failed",
  "errorCode": "MOCK_LINKEDIN_ERROR",
  "errorMessage": "LinkedIn mock adapter rejected the post."
}
```

## Validation Rules

The backend is the source of truth for validation.

Frontend validation improves UX, but backend validation is mandatory.

A post is valid when:

* `content` is not empty
* `content` is not whitespace-only
* `platforms` contains at least one platform
* `platforms` only contains supported platforms
* `content` does not exceed the configured limit

Initial harness content limit:

```txt
3000 characters
```

This is a temporary internal limit. Real platform limits must be confirmed during production integration.

## Required Test Scenarios

### Frontend Tests

| Scenario                 | Expected Result               |
| ------------------------ | ----------------------------- |
| Empty content            | Submit blocked                |
| Whitespace-only content  | Submit blocked                |
| No platform selected     | Submit blocked                |
| Facebook selected        | Submit enabled                |
| LinkedIn selected        | Submit enabled                |
| Both platforms selected  | Submit enabled                |
| Backend success response | Success state displayed       |
| Backend failure response | Error state displayed         |
| Partial success response | Per-platform result displayed |

### Backend Unit Tests

| Scenario                           | Expected Result                       |
| ---------------------------------- | ------------------------------------- |
| Empty content                      | API rejects request                   |
| Whitespace-only content            | API rejects request                   |
| Missing platforms                  | API rejects request                   |
| Unsupported platform               | API rejects request                   |
| Valid Facebook post                | Facebook adapter called               |
| Valid LinkedIn post                | LinkedIn adapter called               |
| Valid multi-platform post          | Both adapters called                  |
| Facebook adapter failure           | Failure result stored                 |
| LinkedIn adapter failure           | Failure result stored                 |
| One adapter succeeds and one fails | Post status becomes `partial_success` |

### Integration Tests

| Scenario                             | Expected Result                  |
| ------------------------------------ | -------------------------------- |
| Frontend submits valid post          | Backend creates post             |
| Backend receives Facebook-only post  | Facebook mock result returned    |
| Backend receives LinkedIn-only post  | LinkedIn mock result returned    |
| Backend receives multi-platform post | Both mock results returned       |
| Backend stores platform results      | Database has post result records |
| Mock adapter failure                 | Frontend displays failure        |

## Manual Verification Flow

1. Start the database.

```bash
docker compose up -d db
```

2. Start the backend.

For Express:

```bash
npm run dev:api
```

For FastAPI:

```bash
uvicorn app.main:app --reload
```

3. Start the frontend.

```bash
npm run dev:web
```

4. Open the frontend.

```txt
http://localhost:5173
```

5. Submit a Facebook-only post.

Expected result:

```txt
Backend receives request.
Facebook mock adapter is called.
LinkedIn mock adapter is not called.
Frontend displays Facebook success.
Database stores Facebook result.
```

6. Submit a LinkedIn-only post.

Expected result:

```txt
Backend receives request.
LinkedIn mock adapter is called.
Facebook mock adapter is not called.
Frontend displays LinkedIn success.
Database stores LinkedIn result.
```

7. Submit a post to both platforms.

Expected result:

```txt
Backend receives request.
Both mock adapters are called.
Frontend displays one result per platform.
Database stores both platform results.
```

8. Submit empty content.

Expected result:

```txt
Frontend blocks submission if possible.
Backend rejects the request if it receives it.
No platform adapter is called.
```

## Automated Verification Commands

The final commands depend on the chosen backend stack.

### If using Node.js and Express

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev:web
```

Run backend:

```bash
npm run dev:api
```

Run tests:

```bash
npm run test
```

Run type check:

```bash
npm run type-check
```

Run build:

```bash
npm run build
```

### If using Python and FastAPI

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Run frontend:

```bash
npm run dev:web
```

Run backend:

```bash
uvicorn app.main:app --reload
```

Run frontend checks:

```bash
npm run type-check
npm run build
```

Run backend tests:

```bash
pytest
```

## Expected File Locations

If using Node.js and Express:

```txt
apps/
  web/
    src/
  api/
    src/
      adapters/
      routes/
      services/
      models/
      db/
```

If using Python and FastAPI:

```txt
apps/
  web/
    src/
  api/
    app/
      adapters/
      routes/
      services/
      models/
      db/
```

Recommended shared docs:

```txt
docs/
  architecture.md
  harness.md
  api.md
```

## Attack Vectors To Test Later

The harness should eventually test or document these risks:

* Frontend attempting direct platform API calls
* Access token leakage
* Invalid platform names
* Overlong post content
* Duplicate post submission
* Partial platform failure
* Backend retry creating duplicate external posts
* Missing authorization before posting
* Posting to the wrong Facebook Page or LinkedIn Organization
* Sensitive data in logs
* Weak environment variable handling
* Database records exposing tokens
* Mock mode accidentally enabled in production
* Production mode accidentally used in local tests

## Done Criteria

The harness is ready when:

1. Frontend can submit a post to backend.
2. Backend validates the request.
3. Backend persists the post.
4. Backend dispatches to mock platform adapters.
5. Mock adapters return controlled results.
6. Frontend displays per-platform results.
7. Invalid posts are rejected.
8. No real platform API is called.
9. No real credentials are required.
10. Relevant tests pass.
11. Type check passes.
12. Build passes.
