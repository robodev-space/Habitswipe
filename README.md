# HabitSwipe — Setup Guide

## What's been built

A full-stack Next.js habit tracker with:
- ✅ Swipe UI (left = skip, right = done) with Framer Motion
- ✅ Email + Password auth
- ✅ Google OAuth
- ✅ PostgreSQL via Supabase + Prisma ORM
- ✅ Streak calculation
- ✅ Dashboard stats + weekly chart
- ✅ Dark/light mode
- ✅ Fully responsive (mobile bottom nav, desktop sidebar)
- ✅ Reusable component library

---

## Step-by-step Setup

### 1. Create the Next.js project

```bash
npx create-next-app@latest habitswipe \
  --typescript --tailwind --eslint --app \
  --no-src-dir --import-alias "@/*" --yes

cd habitswipe
```

### 2. Install dependencies

```bash
npm install \
  @prisma/client prisma \
  next-auth @auth/prisma-adapter \
  bcryptjs @types/bcryptjs \
  framer-motion zustand \
  react-hook-form zod @hookform/resolvers \
  class-variance-authority clsx tailwind-merge \
  lucide-react \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-label @radix-ui/react-select \
  @radix-ui/react-slot @radix-ui/react-switch \
  @radix-ui/react-toast @radix-ui/react-avatar \
  @radix-ui/react-progress \
  date-fns next-themes
```

### 3. Copy all files

Copy all files from this project into your Next.js folder, maintaining the exact folder structure.

### 4. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → New project
2. Go to **Project Settings → Database → Connection string**
3. Copy **Transaction mode** URL (port 6543) → `DATABASE_URL`
4. Copy **Session mode** URL (port 5432) → `DIRECT_URL`

### 5. Set up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → **APIs & Services → Credentials → Create OAuth 2.0 Client**
3. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://yourdomain.com/api/auth/callback/google` (prod)
4. Copy Client ID + Secret

### 6. Create .env.local

```bash
cp .env.example .env.local
# Fill in all values
```

```env
DATABASE_URL="postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-secret"
```

### 7. Push database schema

```bash
npx prisma generate      # generates TypeScript types
npx prisma db push       # creates tables in Supabase
npx prisma studio        # optional: visual DB explorer
```

### 8. Run the app

```bash
npm run dev
# Open http://localhost:3000
```

---

## File Structure Explained

```
habitswipe/
├── app/
│   ├── (auth)/               # Public routes (no auth needed)
│   │   ├── login/page.tsx    # Login page
│   │   └── register/page.tsx # Register page
│   ├── (dashboard)/          # Protected routes
│   │   ├── layout.tsx        # Checks auth, renders Navigation
│   │   ├── page.tsx          # TODAY: main swipe UI
│   │   ├── habits/page.tsx   # HABITS: create/edit/delete
│   │   └── dashboard/page.tsx # STATS: streaks, charts
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts  # NextAuth handler
│   │   │   └── register/route.ts      # POST: create account
│   │   ├── habits/
│   │   │   ├── route.ts               # GET list, POST create
│   │   │   └── [id]/route.ts          # PATCH update, DELETE
│   │   ├── logs/route.ts              # POST swipe, GET history
│   │   └── stats/route.ts             # GET dashboard stats
│   ├── globals.css           # Design tokens (CSS variables)
│   └── layout.tsx            # Root: fonts, ThemeProvider
│
├── components/
│   ├── habits/
│   │   ├── HabitCard.tsx     # Single draggable swipe card
│   │   ├── SwipeDeck.tsx     # Stack of HabitCards
│   │   └── HabitForm.tsx     # Create/edit form
│   ├── shared/
│   │   ├── Navigation.tsx    # Sidebar + mobile bottom bar
│   │   ├── Providers.tsx     # SessionProvider + ThemeProvider
│   │   └── StreakBadge.tsx   # StreakBadge + ProgressRing
│   └── ui/
│       ├── Button.tsx        # Reusable button (5 variants)
│       └── Input.tsx         # Reusable input with label/error
│
├── hooks/
│   ├── useHabits.ts          # API calls + store mutations
│   └── useSwipe.ts           # Drag gesture tracking
│
├── lib/
│   ├── auth.ts               # NextAuth config
│   ├── prisma.ts             # DB singleton client
│   ├── store.ts              # Zustand global state
│   └── utils.ts              # cn(), streak math, date helpers
│
├── types/index.ts            # All TypeScript types
└── prisma/schema.prisma      # Database schema
```

---

## How the swipe works

1. `HabitCard` uses Framer Motion's `drag="x"` 
2. As user drags, `useMotionValue` tracks X position
3. `useTransform` derives rotation + overlay opacity from X
4. On `dragEnd`: if X > 120px → `DONE`, if X < -120px → `SKIPPED`
5. `swipeHabit()` in `useHabits` does **optimistic update** first (removes card instantly) then calls `POST /api/logs`
6. If API fails, re-fetches to restore correct state

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel

# Add env vars in Vercel dashboard:
# DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, 
# NEXTAUTH_URL (your prod URL), GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
```

---

## Adding Facebook OAuth later

1. Create app at [developers.facebook.com](https://developers.facebook.com)
2. Add to `lib/auth.ts`:
```ts
import FacebookProvider from "next-auth/providers/facebook"
// Add to providers array:
FacebookProvider({
  clientId: process.env.FACEBOOK_CLIENT_ID!,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
})
```
3. Add to `.env.local`:
```
FACEBOOK_CLIENT_ID=your-app-id
FACEBOOK_CLIENT_SECRET=your-app-secret
```
4. Add redirect URI in Facebook app settings:
   `https://yourdomain.com/api/auth/callback/facebook`
