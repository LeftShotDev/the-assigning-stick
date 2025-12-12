# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: The Assigning Stick

A lacrosse jersey number assignment system for middle school players with an automated weighted assignment algorithm. Built with Next.js 16, Supabase, and Tailwind CSS 4.

## Development Commands

```bash
npm run dev     # Start development server (localhost:3000)
npm run build   # Production build (uses Turbopack)
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Add Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Run `supabase/schema.sql` in Supabase SQL Editor
4. Run `supabase/seed.sql` for demo data (24 pop culture characters)
5. Create admin user in Supabase Auth → Users

## Architecture Overview

### Database Schema (Supabase/PostgreSQL)

**Core Tables:**
- `players` - Roster with grade (6/7/8), returning status, fall ball participation, previous jersey number
- `jersey_inventory` - Jersey numbers with size arrays (YS/YM/YL/AS/AM/AL), availability tracking
- `player_submissions` - Player's 3 jersey choices + requested size
- `assignments` - Final assignments with method tracking (kept_old, first_choice, second_choice, third_choice, fallback)
- `admin_settings` - Global settings (assignments_finalized, deadline_date)

**Key Relationships:**
- `player_submissions.player_id` → `players.id`
- `assignments.player_id` → `players.id`

### Assignment Algorithm (`lib/assignment-algorithm.ts`)

The core business logic that assigns jersey numbers based on a weighted tier system:

**Tier 1: Returning Players Keeping Numbers**
- Auto-assigned if previous number matches any of their 3 choices
- Processed first to guarantee they keep their number

**Tier 2: Returning Players Changing Numbers**
- Sorted by: `participated_fall_ball DESC, grade DESC`
- Get priority over new players even with same criteria

**Tier 3: New Players**
- Sorted by: `participated_fall_ball DESC, grade DESC`

**Assignment Logic:**
1. Try choices 1, 2, 3 in order - assign if available (regardless of size mismatch)
2. Fallback: Find smallest available number in requested size
3. Ultimate fallback: Smallest number in closest size (using `JERSEY_SIZE_ORDER`)

**Critical Detail:** Size matching is ignored for explicit choices but honored for fallback assignments.

### Route Structure

**Public Routes:**
- `/` - Player selection page (Server Component fetching players, jerseys, submission counts)
- `/roster` - Public roster (shows finalized assignments or "check back soon" message based on `admin_settings.assignments_finalized`)
- `/auth/login` - Admin login (wrapped in Suspense for `useSearchParams`)

**Protected Routes (via `proxy.ts`):**
- `/admin` - Dashboard with metrics, roster CRUD, inventory manager, submissions table, assignment runner

### Authentication Flow

- Next.js 16 uses `proxy.ts` (not middleware.ts) with default export `proxy` function
- Middleware checks `/admin` routes for authenticated user
- Redirects to `/auth/login?redirectTo=/admin` if unauthorized
- Uses Supabase SSR package with cookie handling for server/client

### Server Actions (`app/actions.ts` & `app/admin/actions.ts`)

Server Actions handle all mutations:
- `submitPlayerSelection()` - Player form submission (checks for duplicates)
- `addPlayer()`, `updatePlayer()`, `deletePlayer()` - Roster management
- `updateJerseyInventory()` - Modify jersey size arrays
- `runAssignmentAlgorithm()` - Calls assignment algorithm, clears old non-finalized assignments, inserts new
- `finalizeAssignments()` - Sets `is_finalized=true` and updates admin_settings

**Important:** Always call `revalidatePath()` after mutations to refresh server component data.

### Type System (`lib/types.ts`)

**Grade Constraint:** Grade is typed as `6 | 7 | 8` union, not `number`. When parsing from form inputs, cast: `parseInt(value) as 6 | 7 | 8`

**Jersey Sizes:** Uses strict union type `JerseySize = 'YS' | 'YM' | 'YL' | 'AS' | 'AM' | 'AL'` with `JERSEY_SIZE_ORDER` array for proximity calculations.

### Component Architecture

**Shared:**
- `JerseyCard` - SVG-based powder blue jersey (#87CEEB) with navy numbers (#1e3a5f) and white outline using text-shadow
- `Navigation` - Global nav bar with active state detection via `usePathname()`

**Admin Components (`components/admin/`):**
- All admin components are client components ('use client')
- `RosterManagement` - Inline form for add/edit, handles returning player previous jersey number
- `JerseyInventoryManager` - Grid of jersey numbers, inline edit for size checkboxes
- `AssignmentManager` - Runs algorithm, displays preview table with color-coded assignment methods, finalize button

**Key Pattern:** Admin page is Server Component that fetches all data, passes to Client Components as props.

### Styling

**Color Palette:**
- Navy: `#1e3a5f` (header, jersey numbers, primary buttons)
- Powder Blue: `#87CEEB` (jerseys)
- White outlines on jersey numbers via multi-layer text-shadow

**Jersey Visual:** SVG path creating t-shirt shape with sleeves, number centered with white outline effect.

## Known Technical Details

1. **Next.js 16 Middleware:** Use `proxy.ts` with default export named `proxy`, not `middleware.ts` with `middleware` export
2. **useSearchParams Requirement:** Must wrap in Suspense boundary to avoid build errors
3. **Form Grade Parsing:** Cast `parseInt()` result to `6 | 7 | 8` to satisfy TypeScript
4. **Supabase RLS:** Policies allow public read for players/jerseys/submissions/finalized-assignments, require auth for writes
5. **Demo Data:** seed.sql uses `generate_series(0, 50)` to create 51 jersey numbers (0-50)
