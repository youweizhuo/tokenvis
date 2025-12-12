# Change: Bootstrap Next.js project with core dependencies

## Why
We need a runnable Next.js App Router baseline so TokenVis work can start with the agreed stack (TypeScript, Tailwind, Shadcn, TanStack Query, Drizzle, React Flow, zod, better-sqlite3).

## What Changes
- Scaffold a Next.js App Router project configured for strict TypeScript and the `@/` import alias.
- Add package scripts for dev/build/lint/test (and seed stub) aligned with Next.js defaults.
- Include the core dependency set from project context: Next.js, React, Tailwind/Shadcn UI utilities, TanStack Query, React Flow, Drizzle ORM with better-sqlite3, and zod.

## Impact
- Affected specs: app-foundation
- Affected code: new Next.js project skeleton, package manifest, toolchain configs (tsconfig, tailwind, lint), seed script placeholder.
