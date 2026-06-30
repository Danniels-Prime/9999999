export interface Profile {
  id: string
  displayName: string | null
  nativeLanguage: string | null
  targetLanguages: string[]
  avatarUrl: string | null
  createdAt: string
}

export interface ChatSession {
  id: string
  userId: string
  languageCode: string
  title: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface VocabularyItem {
  id: string
  word: string
  languageCode: string
  partOfSpeech: string
  definitions: { text: string; example: string }[]
  examples: string[]
}

export interface UserVocabularyItem extends VocabularyItem {
  userVocabId: string
  nextReview: string
  intervalDays: number
  easeFactor: number
  reps: number
  createdAt: string
}
