import { createClient } from '@/lib/supabase/server'
import { getChatSession, getSessionMessages, insertChatMessage } from '@/lib/supabase/chat'
import { streamChatCompletion } from '@/lib/anthropic/client'

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function sseEvent(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return jsonError('Unauthorized', 401)
  }

  const body = await request.json().catch(() => null)
  const sessionId = body?.sessionId
  const message = body?.message
  const targetLanguage = body?.targetLanguage

  if (
    typeof sessionId !== 'string' ||
    typeof message !== 'string' ||
    !message.trim() ||
    typeof targetLanguage !== 'string'
  ) {
    return jsonError('Invalid request body', 400)
  }

  const session = await getChatSession(supabase, user.id, sessionId)
  if (!session) {
    return jsonError('Not found', 404)
  }

  const priorMessages = await getSessionMessages(supabase, sessionId)
  await insertChatMessage(supabase, sessionId, 'user', message)

  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let fullResponse = ''
      try {
        const history = [
          ...priorMessages.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user' as const, content: message },
        ]

        for await (const chunk of streamChatCompletion(history, targetLanguage)) {
          fullResponse += chunk
          controller.enqueue(encoder.encode(sseEvent({ type: 'delta', text: chunk })))
        }

        if (fullResponse.trim()) {
          await insertChatMessage(supabase, sessionId, 'assistant', fullResponse)
        }
        controller.enqueue(encoder.encode(sseEvent({ type: 'done' })))
      } catch (error) {
        console.error('Chat stream failed:', error)
        controller.enqueue(
          encoder.encode(sseEvent({ type: 'error', message: 'Failed to generate a response.' }))
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
