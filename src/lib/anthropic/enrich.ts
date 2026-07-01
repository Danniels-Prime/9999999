import { anthropic, CHAT_MODEL } from './client'
import { getLanguageName } from '@/lib/languages'

export interface EnrichedWord {
  part_of_speech: string
  definitions: { text: string; example: string }[]
  examples: string[]
}

export async function enrichWord(word: string, languageCode: string): Promise<EnrichedWord> {
  const languageName = getLanguageName(languageCode)

  const response = await anthropic.messages.create({
    model: CHAT_MODEL,
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Return a JSON object for the ${languageName} word or phrase: "${word}"

{
  "part_of_speech": "noun | verb | adjective | adverb | phrase | other",
  "definitions": [
    { "text": "clear English definition", "example": "example sentence in ${languageName}" }
  ],
  "examples": ["another example sentence in ${languageName}"]
}

Include 1–3 definitions and 1–2 additional examples. Return ONLY the JSON object, no markdown or other text.`,
      },
    ],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''

  try {
    const parsed = JSON.parse(raw.trim())
    return {
      part_of_speech: parsed.part_of_speech ?? 'other',
      definitions: Array.isArray(parsed.definitions) ? parsed.definitions : [],
      examples: Array.isArray(parsed.examples) ? parsed.examples : [],
    }
  } catch {
    return {
      part_of_speech: 'other',
      definitions: [{ text: `Definition for "${word}"`, example: '' }],
      examples: [],
    }
  }
}
