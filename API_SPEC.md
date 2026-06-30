# Æthermind — API Specification

Base path: `/api`

All endpoints return JSON unless noted. Authentication is validated via Supabase session cookie (handled automatically by `@supabase/ssr` middleware). Unauthenticated requests to protected routes receive `401`.

---

## Auth

Auth is handled by Supabase client-side SDK directly. One server callback route:

### GET `/auth/callback`
Supabase email verification / magic link exchange.
- **Query params**: `code` (string), `next` (optional path, default `/dashboard`)
- **Response**: Redirect to `next` on success, `/sign-in?error=verification_failed` on failure
- **Auth**: Not required

---

## Chat (Branch 2)

### POST `/api/chat`
Stream a Claude response for the current conversation.
- **Body**: `{ sessionId: string, message: string, targetLanguage: string }`
- **Response**: `text/event-stream` — streamed text tokens
- **Auth**: Required

### GET `/api/chat/sessions`
List the authenticated user's chat sessions, newest first.
- **Response**: `{ sessions: ChatSession[] }`
- **Auth**: Required

### POST `/api/chat/sessions`
Create a new chat session.
- **Body**: `{ targetLanguage: string, title?: string }`
- **Response**: `{ session: ChatSession }`
- **Auth**: Required

---

## Vocabulary (Branch 3)

### GET `/api/vocabulary`
List the user's vocabulary items.
- **Query**: `language` (ISO 639-1 code, optional), `due` (`true` = only SRS due items)
- **Response**: `{ items: UserVocabularyItem[] }`
- **Auth**: Required

### POST `/api/vocabulary`
Add a word to the user's vocabulary.
- **Body**: `{ word: string, languageCode: string, contextSentence?: string }`
- **Response**: `{ item: VocabularyItem }`
- **Notes**: Claude enriches definition async; `definitions` may be empty initially
- **Auth**: Required

### POST `/api/vocabulary/:id/review`
Submit a flashcard review result (SRS update).
- **Body**: `{ rating: 0 | 1 | 2 | 3 }` — Again / Hard / Good / Easy
- **Response**: `{ nextReview: string }` (ISO 8601 datetime)
- **Auth**: Required

---

## Shared Types

```typescript
interface ChatSession {
  id: string
  userId: string
  languageCode: string
  title: string
  createdAt: string
}

interface ChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

interface VocabularyItem {
  id: string
  word: string
  languageCode: string
  partOfSpeech: string
  definitions: { text: string; example: string }[]
}

interface UserVocabularyItem extends VocabularyItem {
  userVocabId: string
  nextReview: string
  intervalDays: number
  easeFactor: number
  reps: number
  createdAt: string
}

interface Profile {
  id: string
  displayName: string | null
  nativeLanguage: string | null
  targetLanguages: string[]
  avatarUrl: string | null
  createdAt: string
}
```
