# AGENTS.md

## Project

Project name: Aizome

Aizome is a centralized media posting tool for IteaLab.

Core goal:

* Write one post from a web or app interface.
* Click Post.
* Publish the content to:

  * IteaLab Facebook fanpage
  * IteaLab LinkedIn company page

Current phase:

* Frontend-first setup.
* Backend is planned but should not be implemented unless explicitly requested.
* External posting APIs should be mocked or abstracted until real credentials and backend flow are defined.

## Tech Stack

Frontend:

* Vue 3
* Composition API
* TypeScript
* Vite
* TailwindCSS
* GSAP
* Pinia
* Axios

Planned backend:

* Node.js with Express
* Facebook Graph API for fanpage posting
* LinkedIn API for company page posting
* MongoDB

Planned deployment:

* Frontend: Vercel
* Backend: Railway

## Product Scope

The product should support:

* Creating a post
* Previewing the post
* Selecting platforms
* Posting to Facebook Page and LinkedIn Company Page
* Showing post status, success, and failure states

Do not implement the following unless explicitly requested:

* User management
* Team permissions
* Analytics dashboard
* Scheduling
* AI content generation
* Media asset library
* Billing
* Multi-tenant workspace system
* Complex CMS features

## Design Direction

Use the Aizome moodboard colors:

* `#124170`
* `#1a5076`
* `#a1dcdd`
* `#1fa1b2`
* `#5bbfbd`
* `#c5f2e8`
* `#ddf4e7`
* `#fcfcfc`

Design expectations:

* Clean SaaS dashboard style
* Calm blue and aqua visual language
* Minimal but polished interface
* Strong spacing and readable typography
* Smooth animation only where useful
* No animation that blocks usability
* No decorative complexity unless it improves the user flow

Tailwind theme tokens should be centralized in the Tailwind config or a dedicated theme file.

## Repository Layout

Expected structure:

```txt
.
├── AGENTS.md
├── README.md
├── package.json
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── pages/
│   ├── router/
│   ├── stores/
│   ├── services/
│   ├── types/
│   └── styles/
├── tests/
└── .agents/
    └── skills/
```

Recommended frontend folders:

* `src/components/`: reusable UI components
* `src/pages/`: page-level views
* `src/layouts/`: layout wrappers
* `src/stores/`: Pinia stores
* `src/services/`: API clients and platform posting services
* `src/types/`: shared TypeScript types
* `src/composables/`: reusable Vue logic
* `src/styles/`: global styles and Tailwind entry file

Do not create backend folders until backend implementation is requested.

## Working Rules

Follow these rules strictly:

* Do not assume missing requirements.
* State assumptions before implementation when requirements are unclear.
* Prefer the smallest correct change.
* Do not add features that were not requested.
* Do not add dependencies unless clearly justified.
* Do not refactor unrelated code.
* Do not rewrite unrelated formatting.
* Do not hide uncertainty.
* Do not make real external API calls unless explicitly requested.
* Do not implement real Facebook or LinkedIn posting from the frontend.
* Do not store access tokens in frontend code.
* Do not commit secrets, API keys, cookies, private keys, or real credentials.

Every changed line must directly support the current task.

## Implementation Principles

### Simplicity First

Build only what is needed for the current milestone.

Avoid:

* Premature abstractions
* Generic framework code
* Plugin systems
* Overly flexible configuration
* Large architecture before the product flow exists
* Backend simulation that becomes fake production logic

Use direct, readable code.

### Frontend First

For the current phase, prioritize:

* Project scaffolding
* Routing
* Layout
* Theme
* Post composer UI
* Platform selector
* Preview panel
* Mock post submission flow

Use mock services for external platforms.

Example:

```ts
postToFacebookPage()
postToLinkedInCompanyPage()
```

These functions may return mock success or failure responses until backend integration is explicitly requested.

### Backend Boundary

Do not call Facebook Graph API or LinkedIn API directly from the frontend.

When real posting is implemented, use this direction:

```txt
Frontend
  -> Backend API
    -> Facebook Graph API
    -> LinkedIn API
```

The backend must own:

* OAuth token handling
* API secrets
* Refresh tokens
* Platform permissions
* Posting retries
* Audit logs
* Rate-limit handling

## Security Rules

Aizome handles social posting, so security must be treated seriously.

Never:

* Put platform tokens in frontend code
* Store tokens in localStorage without explicit security review
* Hardcode secrets
* Log access tokens
* Log full OAuth responses
* Commit `.env`
* Expose backend credentials to Vercel frontend variables
* Build real posting without permission validation

Required future backend security considerations:

* OAuth flow
* Token encryption at rest
* Role-based access control
* CSRF protection if cookie auth is used
* API rate limiting
* Request validation
* Posting audit trail
* Platform permission checks

If a task touches authentication, authorization, OAuth, or platform tokens, stop and state the security implications before coding.

## Commands

Use these commands after the frontend is scaffolded.

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Type check:

```bash
npm run type-check
```

Lint:

```bash
npm run lint
```

Format:

```bash
npm run format
```

Build:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

If a command does not exist yet, either add it intentionally or state that it is missing.

Do not claim verification passed unless the command was actually run.

## Testing Expectations

Every new feature should include tests when practical.

Expected testing direction:

* Component tests for post composer behavior
* Unit tests for post validation
* Unit tests for platform selection logic
* Unit tests for mock posting services
* Regression tests for fixed bugs

Minimum test cases for post creation:

* Empty post should be rejected
* Valid text post should be accepted
* At least one platform must be selected
* Facebook-only post should call Facebook service
* LinkedIn-only post should call LinkedIn service
* Multi-platform post should call both services
* Failed platform post should show a failure state

Do not create brittle tests that only check implementation details.

## TypeScript Rules

Use TypeScript strictly.

Prefer:

* Explicit domain types
* Narrow interfaces
* Typed API responses
* Typed Pinia state
* Typed service results

Avoid:

* `any`
* Untyped Axios responses
* Large global types
* Overly generic utility types
* Type assertions unless justified

Example domain types:

```ts
type Platform = 'facebook' | 'linkedin'

type PostStatus = 'draft' | 'posting' | 'success' | 'failed'

interface MediaPost {
  id: string
  content: string
  platforms: Platform[]
  status: PostStatus
}
```

## Vue Rules

Use Vue 3 Composition API.

Prefer:

* `<script setup lang="ts">`
* Small components
* Clear props and emits
* Computed values over duplicated state
* Pinia only for shared application state

Avoid:

* Options API
* Large page components with too many responsibilities
* Global event buses
* Overusing stores for local component state

## State Management Rules

Use Pinia only when state is shared across pages or major components.

Good store candidates:

* Draft post state
* Selected platforms
* Posting status
* Auth state, later
* Connected social accounts, later

Do not put purely local UI state in Pinia.

## API Service Rules

Use Axios through a centralized service layer.

Expected structure:

```txt
src/services/
├── http.ts
├── postService.ts
├── facebookService.ts
└── linkedinService.ts
```

For the frontend-only phase:

* Services may use mocked responses.
* Keep mock logic obvious.
* Do not pretend mock logic is production-ready.

## Styling Rules

Use TailwindCSS for styling.

Prefer:

* Theme tokens
* Reusable layout primitives
* Clear responsive classes
* Accessible contrast
* Consistent spacing

Avoid:

* Large custom CSS files
* Inline styles
* Random one-off colors
* Magic pixel values everywhere

Use the moodboard palette consistently.

## Animation Rules

Use GSAP only for meaningful animation.

Acceptable uses:

* Page entrance transitions
* Preview panel reveal
* Success or failure feedback
* Small dashboard interaction polish

Avoid:

* Animating every component
* Complex timelines for simple UI
* Animation that delays form interaction
* Animation that harms accessibility

Respect reduced-motion preferences when practical.

## Accessibility Rules

Minimum expectations:

* Buttons must be real buttons
* Inputs must have labels
* Interactive elements must be keyboard accessible
* Loading states must be visible
* Error states must be readable
* Color must not be the only signal
* Form validation should be understandable

## Definition of Done

A task is done only when:

1. The requested behavior is implemented.
2. The implementation is minimal.
3. Relevant TypeScript types are correct.
4. Relevant tests are added or updated when practical.
5. The relevant verification command was run.
6. The build passes, unless there is a clearly stated blocker.
7. No unrelated files were changed.
8. Security risks are stated if the task touches posting APIs, OAuth, tokens, or credentials.

## Planning Rules

For multi-step tasks, provide a short plan before editing:

```txt
1. Inspect current files -> verify structure
2. Implement requested change -> verify behavior
3. Add or update tests -> verify test result
4. Run build or type-check -> verify project health
```

For small tasks, keep the plan brief.

If requirements conflict, stop and ask.

## Git Rules

* Keep diffs focused.
* Do not change unrelated files.
* Do not rename files unless needed.
* Do not mass-format the repo unless requested.
* Do not commit generated files unless they are required.
* Do not modify lockfiles unless dependency changes require it.

## External API Rules

Facebook and LinkedIn integrations must be treated as backend responsibilities.

Before implementing real integration, confirm:

* Which Facebook Page is used
* Which LinkedIn organization is used
* Who owns the developer apps
* Required OAuth scopes
* Token storage method
* Posting permission model
* Error handling policy
* Audit logging requirement

Do not build production posting logic without this information.

## Final Response Expectations

After making changes, report:

* What changed
* Files changed
* Commands run
* Test or build result
* Known limitations
* Next recommended step

Do not claim success without verification.
