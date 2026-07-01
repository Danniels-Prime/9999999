'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageThread } from '@/components/chat/MessageThread'
import { ChatInput } from '@/components/chat/ChatInput'
import { SessionSidebar } from '@/components/chat/SessionSidebar'
import { LanguageSelector } from '@/components/chat/LanguageSelector'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LANGUAGE_NAMES } from '@/lib/languages'
import type { ChatSession } from '@/types'

interface ThreadMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ThreadMessage[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newLanguage, setNewLanguage] = useState('es')
  const [creatingSession, setCreatingSession] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadSessions() {
      const res = await fetch('/api/chat/sessions')
      if (!res.ok) {
        if (!cancelled) setSessionsLoading(false)
        return
      }
      const { sessions: loaded } = (await res.json()) as { sessions: ChatSession[] }
      if (cancelled) return
      setSessions(loaded)
      setSessionsLoading(false)
      if (loaded.length > 0) {
        selectSession(loaded[0])
      }
    }

    loadSessions()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function selectSession(session: ChatSession) {
    setActiveSession(session)
    setError(null)
    setMessagesLoading(true)

    const res = await fetch(`/api/chat/sessions/${session.id}`)
    if (res.ok) {
      const { messages: loaded } = (await res.json()) as {
        messages: { id: string; role: 'user' | 'assistant'; content: string }[]
      }
      setMessages(loaded.map((m) => ({ id: m.id, role: m.role, content: m.content })))
    }
    setMessagesLoading(false)
  }

  async function handleCreateSession() {
    setCreatingSession(true)
    setError(null)

    const res = await fetch('/api/chat/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetLanguage: newLanguage }),
    })

    setCreatingSession(false)

    if (!res.ok) {
      setError('Could not start a new conversation. Try again.')
      return
    }

    const { session } = (await res.json()) as { session: ChatSession }
    setSessions((prev) => [session, ...prev])
    setActiveSession(session)
    setMessages([])
  }

  async function handleSend(content: string) {
    if (!activeSession) return
    setError(null)
    setSending(true)

    const userMessage: ThreadMessage = { id: `local-${Date.now()}-user`, role: 'user', content }
    const assistantId = `local-${Date.now()}-assistant`
    setMessages((prev) => [...prev, userMessage, { id: assistantId, role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSession.id,
          message: content,
          targetLanguage: activeSession.languageCode,
        }),
      })

      if (!res.ok || !res.body) {
        throw new Error('Request failed')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const events = buffer.split('\n\n')
        buffer = events.pop() ?? ''

        for (const rawEvent of events) {
          const line = rawEvent.trim()
          if (!line.startsWith('data:')) continue

          const payload = JSON.parse(line.slice('data:'.length).trim()) as
            | { type: 'delta'; text: string }
            | { type: 'done' }
            | { type: 'error'; message: string }

          if (payload.type === 'delta') {
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + payload.text } : m))
            )
          } else if (payload.type === 'error') {
            setError(payload.message)
          }
        }
      }
    } catch {
      setError('Connection lost. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col md:flex-row h-[calc(100vh-8rem)]"
    >
      <SessionSidebar
        sessions={sessions}
        activeSessionId={activeSession?.id ?? null}
        activeLanguageCode={activeSession?.languageCode}
        onSelect={selectSession}
        onNew={() => setActiveSession(null)}
        loading={sessionsLoading}
      />

      <div className="flex-1 flex flex-col min-h-0">
        {sessionsLoading ? (
          <div className="flex-1 flex items-center justify-center text-comet text-sm">
            Loading...
          </div>
        ) : !activeSession ? (
          <Card elevated className="m-auto max-w-sm text-center">
            <h2 className="font-semibold text-starlight mb-2">Start a conversation</h2>
            <p className="text-sm text-comet mb-4">
              Pick a language and Æthermind will start chatting with you.
            </p>
            <LanguageSelector value={newLanguage} onChange={setNewLanguage} className="w-full mb-4" />
            <Button onClick={handleCreateSession} loading={creatingSession} className="w-full">
              Start chatting
            </Button>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2 px-1">
              <h1 className="font-semibold text-starlight truncate">{activeSession.title}</h1>
              <span className="text-xs text-comet shrink-0 ml-2">
                {LANGUAGE_NAMES[activeSession.languageCode] ?? activeSession.languageCode}
              </span>
            </div>

            {messagesLoading ? (
              <div className="flex-1 flex items-center justify-center text-comet text-sm">
                Loading conversation...
              </div>
            ) : (
              <MessageThread messages={messages} />
            )}

            {error && (
              <p className="text-xs text-danger mb-2" role="alert">
                {error}
              </p>
            )}

            <ChatInput onSend={handleSend} disabled={sending} />
          </>
        )}
      </div>
    </motion.div>
  )
}
