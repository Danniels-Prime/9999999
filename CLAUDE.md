# Æthermind — Developer Guide

## Project
AI-first language learning OS. Users learn languages through conversation with a Claude-powered AI mentor that has long-term memory, vocabulary spaced repetition, and voice practice. Cosmic aesthetic.

## Tech Stack
- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Database**: Supabase (PostgreSQL + pgvector for semantic search)
- **Auth**: Supabase Auth (email/password + magic link)
- **AI**: Anthropic Claude API (streaming responses)
- **Icons**: Lucide React
- **Deploy**: Vercel

## Project Structure
```
src/
  app/
    (auth)/           # Public: sign-in, sign-up
    (dashboard)/      # Protected: all app screens
    api/              # API route handlers
    auth/callback/    # Supabase email/magic link callback
  components/
    ui/               # Base UI primitives (Button, Input, Card)
    layout/           # App chrome (Sidebar, TopNav)
  lib/
    supabase/         # Supabase clients: client.ts, server.ts, middleware.ts
    anthropic/        # Claude API client + streaming helpers
    srs/              # SM-2 spaced repetition algorithm
  types/              # Shared TypeScript types (index.ts)
supabase/
  migrations/         # SQL migrations — run in order in Supabase SQL editor
```

## Environment Setup

1. Copy `.env.example` → `.env.local`
2. Create a Supabase project at https://supabase.com
3. Copy your Project URL and anon key into `.env.local`
4. Run each file in `supabase/migrations/` in the Supabase SQL editor (in order)
5. In Supabase Dashboard → Authentication → Providers: enable Email
6. Set Site URL to `http://localhost:3000` (and your prod URL when deploying)
7. Add your Anthropic API key

## Commands
```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npx tsc --noEmit # Type check only
```

## Conventions
- Route groups: `(auth)` = public, `(dashboard)` = requires session
- All DB access goes through `src/lib/supabase/` helpers — never import Supabase directly in components
- Claude calls go through `src/lib/anthropic/`
- Use `cn()` from `src/lib/utils.ts` for conditional Tailwind classes
- Framer Motion `motion.*` for all animated elements — components must be `'use client'`
- Tailwind v4: design tokens live in `src/app/globals.css` under `@theme`, not in tailwind.config

## Feature Build Order
1. ✅ Auth (this branch)
2. AI Chat — Claude streaming, session history
3. Vocabulary DB — add/search words, Claude definitions
4. Flashcards / SRS — SM-2 algorithm, review sessions
5. Voice — browser STT + TTS
6. Knowledge Graph — pgvector semantic search
7. Analytics + Progress Dashboard
8. Mobile — React Native
