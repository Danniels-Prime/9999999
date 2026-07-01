# Æthermind — Task Board

## ✅ Done

- [x] Æthermind Master Plan defined
- [x] Next.js 16 project scaffolded (TypeScript, Tailwind v4, App Router)
- [x] Planning docs created: CLAUDE.md, PRODUCT_SPEC.md, DESIGN_SYSTEM.md, API_SPEC.md, TASKS.md
- [x] Tailwind v4 cosmic design system configured (globals.css @theme tokens)
- [x] Supabase SSR client library: client.ts, server.ts, middleware.ts
- [x] Database migration: profiles, vocabulary_items, user_vocabulary, chat_sessions, chat_messages, item_embeddings (with RLS)
- [x] Auth: sign-up page, sign-in page, callback route, middleware, dashboard skeleton
- [x] Branch 2 — AI Chat: Anthropic streaming client, `/api/chat` + `/api/chat/sessions` (+`/:id`) routes, chat session DB helpers, chat UI (message thread, streaming render, input bar, session sidebar, language selector), tutor system prompt
  - `npx tsc --noEmit` and `npm run build` pass clean
  - **Not yet verified live** — this dev environment's network policy blocks `*.supabase.co` (403), same as the previous session, so sign-up/sign-in and live chat streaming have not been exercised end-to-end against real Supabase/Anthropic credentials yet

---

## 🚧 Current Sprint

- [ ] Live end-to-end verification of auth + chat (blocked until an environment with Supabase network access is available)
- [ ] Branch 3: Vocabulary DB (see backlog below)

---

## 📋 Backlog

### Branch 3: Vocabulary DB
- [ ] Add word from chat (one-click inline button)
- [ ] Claude-powered definition enrichment (async, background)
- [ ] Vocabulary list page with language filter
- [ ] Word detail page / modal

### Branch 4: Flashcards / SRS
- [ ] SM-2 algorithm: `src/lib/srs/sm2.ts`
- [ ] Daily review queue (due cards only)
- [ ] Flashcard UI with flip animation
- [ ] Review result POST → SM-2 update

### Branch 5: Voice
- [ ] Browser STT integration (Web Speech API)
- [ ] TTS for Claude responses
- [ ] Voice conversation mode UI

### Branch 6: Knowledge Graph
- [ ] pgvector embedding generation on vocabulary add
- [ ] Semantic search endpoint (`/api/vocabulary/search`)
- [ ] Search UI in vocabulary section

### Branch 7: Analytics + Dashboard
- [ ] Daily streak tracker
- [ ] Words learned this week / month / all time
- [ ] Review accuracy chart (recharts)

### Branch 8: Infrastructure
- [ ] Vercel deployment + env vars
- [ ] Custom domain (buy via Namecheap / Vercel)
- [ ] Error monitoring (Sentry)
- [ ] Analytics (Plausible or Posthog)
- [ ] Stripe integration for Pro tier
- [ ] Privacy policy + Terms of Service

### Branch 9: Mobile
- [ ] React Native project scaffold (Expo)
- [ ] Auth flow on mobile
- [ ] Chat on mobile
- [ ] Offline vocabulary cache
