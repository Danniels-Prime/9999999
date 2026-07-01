import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSessionMessages, createMessage } from '@/lib/supabase/chat'
import { anthropic, CHAT_MODEL, buildSystemPrompt } from '@/lib/anthropic/client'

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sessionId, message, languageCode } = await req.json()
  if (!sessionId || !message) {
    return NextResponse.json({ error: 'Missing sessionId or message' }, { status: 400 })
  }

  // Persist user message first
  await createMessage(supabase, sessionId, 'user', message)

  // Build context from last 20 messages (now includes the one we just saved)
  const history = await getSessionMessages(supabase, sessionId)
  const messages = history.slice(-20).map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))

  const systemPrompt = buildSystemPrompt(languageCode ?? 'es')
  let fullContent = ''

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = anthropic.messages.stream({
          model: CHAT_MODEL,
          max_tokens: 1024,
          system: systemPrompt,
          messages,
        })

        for await (const event of response) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            const text = event.delta.text
            fullContent += text
            controller.enqueue(new TextEncoder().encode(text))
          }
        }

        await createMessage(supabase, sessionId, 'assistant', fullContent)
        controller.close()
      } catch (e) {
        controller.error(e)
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
