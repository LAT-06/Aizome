# Aizome

Aizome is IteaLab's centralized media posting tool. This repository currently
contains the full-stack project skeleton only; social platform posting is not
implemented.

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
