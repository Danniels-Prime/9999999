# Æthermind — Task Board

## ✅ Done

- [x] Æthermind Master Plan defined
- [x] Next.js 16 project scaffolded (TypeScript, Tailwind v4, App Router)
- [x] Planning docs created: CLAUDE.md, PRODUCT_SPEC.md, DESIGN_SYSTEM.md, API_SPEC.md, TASKS.md
- [x] Tailwind v4 cosmic design system configured (globals.css @theme tokens)
- [x] Supabase SSR client library: client.ts, server.ts, middleware.ts
- [x] Database migration: profiles, vocabulary_items, user_vocabulary, chat_sessions, chat_messages, item_embeddings (with RLS)
- [x] Auth: sign-up page, sign-in page, callback route, middleware, dashboard skeleton

---

## ✅ Done — Branch 2: AI Chat

- [x] Anthropic client with streaming helper (`src/lib/anthropic/client.ts`)
- [x] POST `/api/chat` SSE streaming endpoint
- [x] Chat session DB operations (`src/lib/supabase/chat.ts`) with camelCase mapping
- [x] Chat UI: MessageThread, ChatInput, SessionSidebar, LanguageSelector components
- [x] Claude system prompt: language tutor persona
- [x] Multi-language support: 16 languages (`src/lib/languages.ts`)
- [x] Dashboard AI Chat card links to `/chat`

---

## ✅ Done — Branch 3: Vocabulary DB

- [x] Claude-powered word enrichment (`src/lib/anthropic/enrich.ts`)
- [x] POST/GET `/api/vocabulary` — save & list words
- [x] Vocabulary DB helpers (`src/lib/supabase/vocabulary.ts`)
- [x] SaveWordInput component — embedded in chat sidebar + vocabulary page
- [x] Vocabulary list page with language filter tabs (`/vocabulary`)
- [x] Word detail modal with all definitions + examples
- [x] Dashboard Vocabulary card links to `/vocabulary`
- [x] Nav updated with Vocabulary link

---

## 🚧 Current Sprint — Branch 4: Flashcards / SRS

- [ ] SM-2 algorithm (`src/lib/srs/sm2.ts`)
- [ ] Daily review queue — due cards only
- [ ] Flashcard UI with flip animation
- [ ] Review result POST → SM-2 update to `user_vocabulary`
- [ ] Live end-to-end verification (blocked until environment allows *.supabase.co outbound)

---

## 📋 Backlog

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
- [ ] Custom domain
- [ ] Error monitoring (Sentry)
- [ ] Analytics (Plausible or Posthog)
- [ ] Stripe integration for Pro tier
- [ ] Privacy policy + Terms of Service

### Branch 9: Mobile
- [ ] React Native project scaffold (Expo)
- [ ] Auth flow on mobile
- [ ] Chat on mobile
- [ ] Offline vocabulary cache
