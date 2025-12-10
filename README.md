# The Assigning Stick

A lacrosse jersey number assignment system for middle school players with automated weighted assignment algorithm.

## Features

- **Player Selection Page**: Public-facing page where players can select their top 3 jersey number preferences
- **Admin Dashboard**: Protected admin area for roster management, jersey inventory, and assignment processing
- **Public Roster**: Display finalized jersey assignments with player names
- **Automated Assignment Algorithm**: Weighted system that prioritizes:
  1. Returning players keeping their numbers
  2. Offseason practice participation
  3. Grade level (8th → 7th → 6th)
  4. Jersey size matching

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd sprint-01-assigning-stick
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API to find your project URL and anon key
3. Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set up the database

1. In your Supabase project, go to the SQL Editor
2. Run the schema creation script from `supabase/schema.sql`
3. Run the seed data script from `supabase/seed.sql` (optional - adds demo data)

### 5. Create an admin user

1. In Supabase, go to Authentication → Users
2. Click "Add User" and create an admin account with email/password
3. Use these credentials to log in to the admin dashboard

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Player Selection

1. Navigate to the home page
2. Players select their name from the dropdown (pre-populated roster)
3. Choose 3 jersey number preferences and size
4. Submit selections

### Admin Dashboard

1. Navigate to `/admin`
2. Log in with your admin credentials
3. Manage roster, jersey inventory, and view submissions
4. Run the assignment algorithm when ready
5. Preview assignments and finalize to make them public

### Public Roster

1. Navigate to `/roster`
2. Before finalization: Shows "Check back soon" message
3. After finalization: Displays all jersey assignments with player names

## Assignment Algorithm

The algorithm processes players in this order:

**Tier 1**: Returning players keeping their old numbers (auto-assigned first)

**Tier 2**: Returning players changing numbers
- Sorted by: Offseason practice → Grade (8th→7th→6th)
- Get priority over new players with same criteria

**Tier 3**: New players
- Sorted by: Offseason practice → Grade (8th→7th→6th)

**Assignment Process**:
- Try player's 1st, 2nd, 3rd choice
- If number available but wrong size → assign it anyway
- If none available → assign smallest number in requested size
- Ultimate fallback → smallest number in closest size

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

## License

MIT
