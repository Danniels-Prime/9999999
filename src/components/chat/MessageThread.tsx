'use client'

import { useEffect, useRef } from 'react'
import { ChatMessage } from './ChatMessage'

interface ThreadMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface MessageThreadProps {
  messages: ThreadMessage[]
}

export function MessageThread({ messages }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-comet text-sm">
        Say hello to start the conversation.
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-3 px-1 py-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} role={message.role} content={message.content} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
