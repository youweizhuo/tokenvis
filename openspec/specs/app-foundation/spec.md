# app-foundation Specification

## Purpose
TBD - created by archiving change add-nextjs-bootstrap. Update Purpose after archive.
## Requirements
### Requirement: Next.js App Shell
The system SHALL provide a Next.js App Router project configured for strict TypeScript and the `@/` import alias, exposing Next.js default scripts (`dev`, `build`, `start`, `lint`) plus a seed stub.

#### Scenario: Development server runs
- **WHEN** a developer runs `npm run dev`
- **THEN** the app starts on http://localhost:3000 without runtime errors and renders a placeholder TokenVis page.

### Requirement: Styling and UI baseline
The system SHALL include Tailwind CSS setup (config, `globals.css` with `@tailwind base; @tailwind components; @tailwind utilities;`) and Shadcn UI prerequisites.

#### Scenario: Tailwind builds
- **WHEN** `npm run dev` compiles styles
- **THEN** Tailwind utilities are available and no missing configuration errors occur.

### Requirement: Core dependency set
The package manifest SHALL include the following libraries at compatible versions: `next`, `react`, `react-dom`, `typescript`, `@types/node`, `eslint` (Next configuration), `tailwindcss`, `postcss`, `autoprefixer`, `@tanstack/react-query`, `@xyflow/react`, `zod`, `drizzle-orm`, `drizzle-kit`, `better-sqlite3`, and Shadcn UI prerequisites (`class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`).

#### Scenario: Install succeeds
- **WHEN** a developer runs `npm install`
- **THEN** dependencies install without missing peer dependency warnings for the listed packages.

### Requirement: Data-layer configuration guard
The Next.js config SHALL allow bundling `better-sqlite3` by declaring it in `serverComponentsExternalPackages` to avoid build-time exclusion.

#### Scenario: Build includes SQLite driver
- **WHEN** `npm run build` is executed
- **THEN** the build completes without `better-sqlite3` bundling errors.

