# Aizome

Aizome is IteaLab's centralized media posting tool. The current backend
milestone provides a mock posting flow only; real social platform posting is
not implemented.

## Structure

```txt
apps/
  web/            Vue 3, TypeScript, Vite, Tailwind CSS, Pinia, Axios
  api/            Node.js, Express, TypeScript
packages/
  shared/         Shared TypeScript domain types
```

PostgreSQL is available as the only service in `docker-compose.yml`.

## Setup

Requirements:

- Node.js 20.19 or newer
- npm 11 or newer
- Docker, when running PostgreSQL locally

```bash
cp .env.example .env
npm install
docker compose up -d db
npm run dev
```

The web application runs at `http://localhost:5173` and the API health endpoint
is available at `http://localhost:3000/health`.

## Mock Posting API

`POST /api/posts` validates post content and selected platforms, dispatches to
mock Facebook and LinkedIn adapters, and returns normalized per-platform
results.

The API currently uses an in-memory repository because the PostgreSQL data
layer is not implemented. Stored posts are lost whenever the API process
restarts. The endpoint has no production authentication and must not be
connected to real credentials or exposed as a production posting service.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Run the web and API development servers |
| `npm run dev:web` | Run the web development server |
| `npm run dev:api` | Run the API development server |
| `npm run build` | Build all workspaces |
| `npm run type-check` | Type-check all workspaces |
| `npm run test` | Run tests in all workspaces |

## Architecture

See [docs/architecture.md](docs/architecture.md) for system boundaries and
[docs/harness.md](docs/harness.md) for the planned local verification flow.
