# OpenProofing

Open-source, self-hosted artwork review, annotation, version-control and approval platform.

OpenProofing is the permanent project and internal system name. Each installation can present its own platform name, branding and domain through white-label configuration.

The product must make reviewing artwork simple while giving Account Managers firm control, traceability and a defensible approval record.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22.x or later
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [Docker](https://www.docker.com/) and Docker Compose

### Installation

```bash
# Clone the repository
git clone git@github.com:hirostudio-ai/openproofing.git
cd openproofing

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start local services (PostgreSQL, Redis, MinIO)
docker compose up -d

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Start the development server
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Local Services

| Service       | URL                                            | Credentials                         |
| ------------- | ---------------------------------------------- | ----------------------------------- |
| PostgreSQL    | `localhost:5432`                               | `openproofing` / `openproofing_dev` |
| Redis         | `localhost:6379`                               | —                                   |
| MinIO Console | [http://localhost:9001](http://localhost:9001) | `openproofing` / `openproofing_dev` |
| MinIO API     | `localhost:9000`                               | —                                   |

### Commands

| Command                  | Description                          |
| ------------------------ | ------------------------------------ |
| `pnpm dev`               | Start development server             |
| `pnpm build`             | Build for production                 |
| `pnpm start`             | Start production server              |
| `pnpm lint`              | Run ESLint                           |
| `pnpm lint:fix`          | Run ESLint with auto-fix             |
| `pnpm typecheck`         | Run TypeScript type checking         |
| `pnpm format`            | Format code with Prettier            |
| `pnpm format:check`      | Check code formatting                |
| `pnpm test`              | Run unit and integration tests       |
| `pnpm test:watch`        | Run tests in watch mode              |
| `pnpm test:e2e`          | Run Playwright end-to-end tests      |
| `pnpm db:generate`       | Generate Prisma client               |
| `pnpm db:migrate`        | Run database migrations (dev)        |
| `pnpm db:migrate:deploy` | Run database migrations (production) |
| `pnpm db:studio`         | Open Prisma Studio                   |

---

## Specification

### Document order

| File                             | Purpose                                          |
| -------------------------------- | ------------------------------------------------ |
| `CLAUDE.md`                      | Persistent project instructions                  |
| `docs/PRODUCT_BRIEF.md`          | Product goals, users, scope and journeys         |
| `docs/TECHNICAL_FOUNDATION.md`   | Technical constraints and platform services      |
| `docs/ARCHITECTURE_DECISIONS.md` | Agreed choices and their consequences            |
| `docs/DATA_MODEL.md`             | Entities, relationships, constraints and indexes |
| `docs/WORKFLOW_STATE_MACHINE.md` | Explicit workflow states, transitions and guards |
| `docs/PHASED_BUILD_PLAN.md`      | Safe build order and phase exit criteria         |
| `docs/ACCEPTANCE_TESTS.md`       | End-to-end and business-rule test catalogue      |
| `docs/CLAUDE_PHASE_PROMPT.md`    | Reusable prompt for each implementation phase    |

### Stack

- Next.js 15 (App Router) with TypeScript
- PostgreSQL 16
- Prisma 6
- Tailwind CSS v4
- Auth.js v5, with email invitation and magic-link login
- Private S3-compatible object storage (MinIO for local development)
- PDF.js for document rendering
- Resend or an equivalent email provider
- BullMQ with Redis for background jobs (rendering, email, exports)
- Vitest for unit and integration tests
- Playwright for end-to-end tests
- pnpm as the package manager

## Project Identity

- Project name: **OpenProofing**
- Repository: `openproofing`
- Container image: `openproofing/openproofing`
- Description: **Open-source, self-hosted artwork review and approval**

Keep `OpenProofing` in source packages, database migrations, environment-variable prefixes, technical documentation and upgrade tooling. White-label settings control the identity shown to end users; they must not rename internal identifiers.

Equivalent components may be substituted only when the change is recorded as an architecture decision and preserves every rule in `CLAUDE.md`.

## Definition of Done

A phase is complete only when its migrations, server-side permissions, domain rules, audit events and automated tests are complete; the relevant test suites pass; documentation matches the code; and known limitations are recorded.
