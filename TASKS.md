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
- [x] POST `/api/chat` streaming endpoint
- [x] Chat session DB operations (`src/lib/supabase/chat.ts`)
- [x] Chat UI: message thread, streaming message render, input bar (`src/components/chat/ChatInterface.tsx`)
- [x] Session list sidebar (built into ChatInterface)
- [x] Language selector component (`src/components/chat/LanguageSelector.tsx`)
- [x] Claude system prompt: language tutor persona (`src/lib/anthropic/client.ts`)
- [x] Multi-language support: 15 languages from day one (`src/lib/languages.ts`)
- [x] Dashboard AI Chat card now links to `/chat`

---

## 🚧 Current Sprint — Branch 3: Vocabulary DB

- [ ] "Save word" button in chat (inline, one-click)
- [ ] Claude-powered definition enrichment (async, background)
- [ ] Vocabulary list page with language filter (`/vocabulary`)
- [ ] Word detail page / modal

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
