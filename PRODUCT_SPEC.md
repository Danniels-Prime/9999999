# Æthermind — Product Specification

## Vision
A learning operating system, not a note-taking app. Users have a personal AI mentor that remembers their history, adapts to their level, and makes language practice feel like real conversation — not drilling.

## Target Users
Language learners who are past complete beginner but frustrated with repetitive apps (Duolingo fatigue). They want depth, real conversation practice, and a system that grows with them.

---

## MVP Features (3 months)

### 1. Authentication ✅
- Email/password sign-up and sign-in
- Email verification flow
- Protected dashboard — unauthenticated users redirected to `/sign-in`
- Auto-created user profile on sign-up

**Acceptance criteria:**
- User can create account, verify email, and land on `/dashboard`
- User can sign in and out
- Direct navigation to `/dashboard` when logged out → redirected to `/sign-in`

---

### 2. AI Chat (next branch)
- Stream-based conversation with Claude
- Language detection and auto-selection
- Session history — conversations saved and resumable
- Claude acts as language tutor: corrects errors, explains grammar, gives examples in context

**Acceptance criteria:**
- Messages stream in real time (no waiting for full response)
- Each conversation saved as a `chat_session` with messages persisted
- Claude responds in the target language unless explaining grammar
- User can start a new conversation or resume an existing one

---

### 3. Vocabulary Database
- Add words directly from chat (one-click) or manually
- Claude generates: definition, part of speech, example sentences
- Words tagged with ISO language code

**Acceptance criteria:**
- Word added in <2 clicks from chat
- Claude enrichment completes async, does not block UI
- Word list filterable by language

---

### 4. Flashcards / Spaced Repetition
- SM-2 algorithm: calculates next review date per card
- Daily review queue — shows only due cards
- Rating buttons: Again (0) / Hard (1) / Good (2) / Easy (3)

**Acceptance criteria:**
- After rating a card, next review date updates correctly per SM-2
- Review queue is empty when all cards are up to date
- Card flip animation on reveal

---

### 5. Voice Conversations
- Browser-native speech recognition (Web Speech API) for user input
- Text-to-speech (Web Speech API) for Claude responses
- Practice speaking without typing

---

### 6. Semantic Search
- pgvector embeddings on vocabulary items
- Search by meaning, not just exact string match (e.g. search "sad" finds "melancholic", "forlorn")

---

### 7. Progress Dashboard
- Words learned this week / month / all time
- Daily streak
- Review accuracy chart

---

## UX Principles
- **Minimal friction**: Core flow (open → start chatting) in <3 clicks
- **Beautiful animations**: Framer Motion on all transitions and reveals
- **Fast loading**: Streaming responses, optimistic UI updates
- **Accessibility**: Keyboard navigable, ARIA labels on all interactive elements
- **Dark by default**: Cosmic deep-space aesthetic

## Out of Scope for MVP
- Offline mode
- Tutor marketplace
- Team / classroom plans
- Mobile app (web-first; React Native in a later phase)
- Social features
