# AGENTS.md

## Project Context

Dimetrix is a Next.js App Router application for real-time power outage tracking in Metro Cebu, Lapu-Lapu City, and Mactan Island. Backend uses Prisma ORM with Neon PostgreSQL, Auth.js for authentication, and Zod for validation.

## Tech Stack

- **Frontend:** Next.js 14 App Router, React 18, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Prisma ORM, Neon PostgreSQL
- **Auth:** Auth.js v5 (NextAuth) with credentials + Google OAuth
- **Validation:** Zod
- **Deployment:** Vercel

## Development Workflow

- `npm run dev`: Starts Next.js dev server at http://localhost:3000.
- `npm run build`: Generates Prisma client and builds for production.
- `npm run lint`: Runs Next.js ESLint checks.
- `npm run db:push`: Pushes Prisma schema to database.
- `npm run db:studio`: Opens Prisma Studio GUI.

## Key Directories

- `src/app/`: Next.js App Router pages and API routes.
- `src/app/api/`: Backend API route handlers.
- `src/components/`: React components (client components with "use client").
- `src/lib/`: Utilities, auth config, Prisma client, Zod validations.
- `src/lib/cebuAreas.js`: Location coordinates, provider mapping, barangay lists.
- `prisma/schema.prisma`: Database schema.

## Environment Variables

- `DATABASE_URL`: Neon PostgreSQL connection string.
- `NEXTAUTH_SECRET`: Auth.js signing secret.
- `NEXTAUTH_URL`: App URL (http://localhost:3000 for dev).
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Optional Google OAuth.
