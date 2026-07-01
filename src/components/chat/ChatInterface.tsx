'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { LANGUAGES, getLanguageName } from '@/lib/languages'
import { MessageBubble } from './MessageBubble'
import { LanguageSelector } from './LanguageSelector'
import { cn } from '@/lib/utils'

interface Session {
  id: string
  title: string
  language_code: string
  created_at: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatInterfaceProps {
  initialSessions: Session[]
}

export function ChatInterface({ initialSessions }: ChatInterfaceProps) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [activeSession, setActiveSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [streamingContent, setStreamingContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [input, setInput] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('es')
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  const loadMessages = useCallback(
    async (session: Session) => {
      setIsLoadingMessages(true)
      setMessages([])
      setActiveSession(session)

      const { data } = await supabase
        .from('chat_messages')
        .select('id, role, content')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true })

      setMessages((data as Message[]) ?? [])
      setIsLoadingMessages(false)
    },
    [supabase]
  )

  const startNewChat = async () => {
    const res = await fetch('/api/chat/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ languageCode: selectedLanguage }),
    })
    const session: Session = await res.json()
    setSessions((prev) => [session, ...prev])
    setMessages([])
    setActiveSession(session)
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || !activeSession || isStreaming) return

    setInput('')
    setIsStreaming(true)

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSession.id,
          message: text,
          languageCode: activeSession.language_code,
        }),
      })

      if (!res.ok) throw new Error('Chat request failed')

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setStreamingContent(accumulated)
      }

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: accumulated,
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: '⚠ Something went wrong. Please try again.' },
      ])
    } finally {
      setStreamingContent('')
      setIsStreaming(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-stardust bg-nebula">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col border-r border-stardust overflow-hidden shrink-0"
          >
            <div className="p-3 border-b border-stardust">
              <LanguageSelector
                value={selectedLanguage}
                onChange={setSelectedLanguage}
                disabled={isStreaming}
                className="w-full"
              />
            </div>

            <button
              onClick={startNewChat}
              className="mx-3 mt-3 mb-1 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-aurora-start to-aurora-end text-white hover:opacity-90 transition-opacity"
            >
              + New chat
            </button>

            <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => loadMessages(s)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-xs transition-colors truncate',
                    activeSession?.id === s.id
                      ? 'bg-stardust text-starlight'
                      : 'text-comet hover:bg-stardust/50 hover:text-starlight'
                  )}
                >
                  <span className="mr-1.5">
                    {LANGUAGES.find((l) => l.code === s.language_code)?.flag ?? '💬'}
                  </span>
                  {s.title}
                </button>
              ))}
              {sessions.length === 0 && (
                <p className="text-xs text-comet px-3 py-2">No chats yet</p>
              )}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Chat header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-stardust">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="text-comet hover:text-starlight transition-colors p-1 rounded"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          {activeSession ? (
            <span className="text-sm text-starlight font-medium">
              {LANGUAGES.find((l) => l.code === activeSession.language_code)?.flag}{' '}
              {getLanguageName(activeSession.language_code)}
            </span>
          ) : (
            <span className="text-sm text-comet">Select a language and start a new chat</span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {!activeSession && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <p className="text-4xl">🌌</p>
              <p className="text-starlight font-semibold">Ready to learn?</p>
              <p className="text-comet text-sm max-w-xs">
                Pick a language from the sidebar and hit <strong className="text-starlight">+ New chat</strong> to start
                practising with your AI tutor.
              </p>
            </div>
          )}

          {isLoadingMessages && (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-aurora-start border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {messages.map((m) => (
            <MessageBubble key={m.id} role={m.role} content={m.content} />
          ))}

          {streamingContent && (
            <MessageBubble role="assistant" content={streamingContent} isStreaming />
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-stardust">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!activeSession || isStreaming}
              placeholder={
                activeSession
                  ? `Message in ${getLanguageName(activeSession.language_code)}… (Enter to send)`
                  : 'Start a new chat first'
              }
              rows={1}
              className={cn(
                'flex-1 resize-none bg-stardust rounded-xl px-4 py-3 text-sm text-starlight placeholder:text-comet',
                'focus:outline-none focus:ring-2 focus:ring-aurora-start',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'max-h-32 overflow-y-auto'
              )}
              style={{ height: 'auto' }}
              onInput={(e) => {
                const el = e.currentTarget
                el.style.height = 'auto'
                el.style.height = `${el.scrollHeight}px`
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!activeSession || isStreaming || !input.trim()}
              className={cn(
                'shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
                'bg-gradient-to-br from-aurora-start to-aurora-end text-white',
                'hover:opacity-90 transition-opacity',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
            >
              {isStreaming ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                '↑'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
