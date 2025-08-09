# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Job Application Tracker** built with Next.js 15, featuring user authentication via Clerk and PostgreSQL database integration via Prisma. The application allows users to track their job applications with full user management and data persistence.

## Development Commands

**Start development server:**
```bash
npm run dev
```
The dev server uses Turbopack for faster builds and runs on http://localhost:3000

**Build and deployment:**
```bash
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint checks
```

**Database operations:**
```bash
npx prisma generate    # Generate Prisma client after schema changes
npx prisma db push     # Push schema changes to database
npx prisma migrate dev # Create and apply new migration
npx prisma studio      # Open Prisma Studio for database browsing
```

## Architecture & Key Components

### Authentication Flow
- **Clerk Integration**: Complete authentication setup with sign-in/sign-up routes at `/sign-in` and `/sign-up`
- **Middleware Protection**: Routes are protected by Clerk middleware (`middleware.ts`), with public routes for auth pages
- **User Synchronization**: Webhook handler at `/api/webhooks/clerk/route.ts` automatically creates user records in database when Clerk users are created

### Database Architecture
- **Prisma ORM**: Database client generated to `app/generated/prisma/` (custom output location)
- **PostgreSQL**: Primary database with Prisma Accelerate extension for performance
- **Models**: Currently has User and Post models with proper relationships
  - User: Links to Clerk ID, stores email and name
  - Post: Sample content model with author relationship

### File Structure Patterns
- **App Router**: Uses Next.js 13+ app directory structure
- **Custom Prisma Location**: Prisma client generates to `app/generated/prisma/` instead of default location
- **Authentication Routes**: Clerk catch-all routes in `app/sign-in/[[...sign-in]]/` and `app/sign-up/[[...sign-up]]/`
- **API Routes**: Webhook handlers and future API endpoints in `app/api/`

### Environment Requirements
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- Clerk environment variables (CLERK_SECRET_KEY, etc.)

## Development Notes

- The app uses **Geist font family** (both sans and mono variants) loaded from Google Fonts
- **TypeScript**: Strict mode enabled with path aliases (`@/*` maps to root)
- **Tailwind CSS v4**: Latest version for styling
- **ESLint**: Next.js core web vitals and TypeScript rules enabled
- **Prisma Client**: Always import from `@/app/generated/prisma` (not default location)

When working with database models, remember to run `npx prisma generate` after schema changes and `npx prisma db push` to sync with database.

The application is currently in initial setup phase with boilerplate content on the home page ready to be replaced with job tracking functionality.