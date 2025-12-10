# The Assigning Stick - Implementation Plan

## Project Overview
A lacrosse jersey number assignment system for middle school players with automated weighted assignment algorithm.

## Tech Stack
- Next.js (App Router)
- Supabase (Auth + Postgres DB)
- Tailwind CSS
- Vercel deployment

## Database Schema

### Tables

#### `players`
- `id` (uuid, primary key)
- `first_name` (text)
- `last_name` (text)
- `grade` (integer) - 6, 7, or 8
- `is_returning` (boolean)
- `participated_fall_ball` (boolean)
- `previous_jersey_number` (integer, nullable) - for returning players
- `created_at` (timestamp)

#### `jersey_inventory`
- `id` (uuid, primary key)
- `number` (integer, unique)
- `sizes` (text[]) - array of available sizes: ['YS', 'YM', 'YL', 'AS', 'AM', 'AL']
- `is_available` (boolean) - track if assigned
- `created_at` (timestamp)

#### `player_submissions`
- `id` (uuid, primary key)
- `player_id` (uuid, foreign key → players)
- `first_choice` (integer)
- `second_choice` (integer)
- `third_choice` (integer)
- `requested_size` (text)
- `submitted_at` (timestamp)

#### `assignments`
- `id` (uuid, primary key)
- `player_id` (uuid, foreign key → players)
- `jersey_number` (integer)
- `assigned_size` (text)
- `assignment_method` (text) - 'kept_old', 'first_choice', 'second_choice', 'third_choice', 'fallback'
- `is_finalized` (boolean)
- `created_at` (timestamp)

#### `admin_settings`
- `id` (uuid, primary key)
- `key` (text, unique)
- `value` (jsonb)
- Settings like: assignments_finalized, deadline_date, etc.

## Assignment Algorithm

### Priority Tiers:

**Tier 1: Returning Players Keeping Numbers**
- Auto-assign their previous number if they selected it as a choice

**Tier 2: Returning Players Changing Numbers**
- Sort by: `participated_fall_ball DESC, grade DESC`
- Process choices in order

**Tier 3: New Players**
- Sort by: `participated_fall_ball DESC, grade DESC`
- Process choices in order

### Assignment Process:
1. Sort players into tiers
2. For each player in order:
   - Try 1st choice: if available → assign
   - Try 2nd choice: if available → assign
   - Try 3rd choice: if available → assign
   - Fallback: Find smallest available number in requested size
   - Ultimate fallback: Smallest number in closest size

### Size Matching Rules:
- If number is available but wrong size → **assign anyway** (except fallback)
- Fallback uses size as primary criteria
- Size proximity: YS ↔ YM ↔ YL ↔ AS ↔ AM ↔ AL

## Pages & Routes

### 1. Player Selection Page (`/`)
- Display jersey grid (50 jerseys)
- Player selection form
- Show submission confirmation
- Show "X players remaining" message

### 2. Admin Dashboard (`/admin`)
- Protected by Supabase Auth
- Dashboard metrics
- Roster management (add/edit players)
- Jersey inventory management
- Submissions tracking table
- Run assignment algorithm
- Preview assignments
- Manual override capability
- Finalize assignments button

### 3. Public Roster (`/roster`)
- Pre-finalization: "Check back soon" message
- Post-finalization: Grid of jerseys with names and numbers

## Components

### Shared Components
- `JerseyCard` - Displays powder blue jersey with number
- `Navigation` - Header with tabs
- `Layout` - Main layout wrapper

### Page-Specific Components
- `JerseyGrid` - Grid display of jerseys
- `PlayerSelectionForm` - Form for player submissions
- `AdminMetrics` - Dashboard stats
- `RosterTable` - Admin player roster table
- `InventoryManager` - Jersey inventory CRUD
- `AssignmentPreview` - Preview before finalizing
- `SubmissionsTable` - Track who submitted

## Demo Data

### Pop Culture Kids (20-25 players)
Mix of grades 6-8, returning/new, fall ball participation:
- Eleven (Stranger Things)
- Mike Wheeler
- Dustin Henderson
- Lucas Sinclair
- Will Byers
- Max Mayfield
- Harry Potter
- Hermione Granger
- Ron Weasley
- Percy Jackson
- Annabeth Chase
- Peter Parker (Spider-Man)
- Miles Morales
- Gwen Stacy
- Katniss Everdeen
- Peeta Mellark
- Aang (Avatar)
- Katara
- Sokka
- Toph
- etc.

## Implementation Phases

### Phase 1: Setup & Database
- [ ] Initialize Supabase project
- [ ] Create database schema
- [ ] Set up Supabase Auth
- [ ] Configure environment variables
- [ ] Create demo data seed script

### Phase 2: Core Components
- [ ] Build JerseyCard component
- [ ] Build Layout/Navigation
- [ ] Set up Tailwind styling

### Phase 3: Player Selection Page
- [ ] Jersey grid display
- [ ] Player selection form
- [ ] Submission logic
- [ ] Post-submission messaging

### Phase 4: Admin Dashboard
- [ ] Auth protection
- [ ] Dashboard metrics
- [ ] Roster management UI
- [ ] Jersey inventory management
- [ ] Submissions tracking

### Phase 5: Assignment Algorithm
- [ ] Build weighted sorting logic
- [ ] Implement assignment algorithm
- [ ] Preview assignments UI
- [ ] Manual override capability
- [ ] Finalize assignments

### Phase 6: Public Roster
- [ ] Pre-finalization state
- [ ] Post-finalization jersey display
- [ ] Name + number display

### Phase 7: Polish & Deploy
- [ ] Responsive design
- [ ] Error handling
- [ ] Loading states
- [ ] Deploy to Vercel

## Color Palette
- Navy: `#1e3a5f` (header, jersey numbers)
- Powder Blue: `#87CEEB` or similar (jerseys)
- White: `#FFFFFF` (number outlines)
- Light Gray: `#F5F7FA` (background)
- Text: `#333333`

## Jersey Sizes
- YS (Youth Small)
- YM (Youth Medium)
- YL (Youth Large)
- AS (Adult Small)
- AM (Adult Medium)
- AL (Adult Large)
