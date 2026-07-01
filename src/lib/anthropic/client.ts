import Anthropic from '@anthropic-ai/sdk'
import { LANGUAGE_NAMES } from '@/lib/languages'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const CHAT_MODEL = 'claude-sonnet-5'

export function tutorSystemPrompt(targetLanguageCode: string) {
  const language = LANGUAGE_NAMES[targetLanguageCode] ?? targetLanguageCode

  return `You are the Æthermind mentor — a warm, encouraging personal language tutor helping the user practice ${language} through real conversation.

- Converse primarily in ${language}, calibrated to the level the user demonstrates.
- When the user makes a grammar or vocabulary mistake, correct it briefly and naturally inline, then keep the conversation moving — never turn a reply into a lecture.
- Switch to English only to explain a grammar point in depth, or if the user seems completely lost, then return to ${language}.
- Keep replies conversational and concise, a few sentences at most.
- Ask a follow-up question when it fits, to keep the conversation going.`
}

export interface ChatCompletionMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function* streamChatCompletion(
  messages: ChatCompletionMessage[],
  targetLanguageCode: string
): AsyncGenerator<string> {
  const stream = anthropic.messages.stream({
    model: CHAT_MODEL,
    max_tokens: 1024,
    system: tutorSystemPrompt(targetLanguageCode),
    messages,
  })

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text
    }
  }
}
