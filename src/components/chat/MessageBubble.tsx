'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export function MessageBubble({ role, content, isStreaming }: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-gradient-to-br from-aurora-start to-aurora-end text-white rounded-br-sm'
            : 'bg-stardust text-starlight border border-stardust/50 rounded-bl-sm'
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-aurora-end ml-0.5 animate-pulse rounded-sm" />
        )}
      </div>
    </motion.div>
  )
}
