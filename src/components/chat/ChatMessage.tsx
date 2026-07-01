'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap',
          isUser
            ? 'bg-gradient-to-r from-aurora-start to-aurora-end text-white'
            : 'bg-nebula border border-stardust text-starlight'
        )}
      >
        {content || ' '}
      </div>
    </motion.div>
  )
}
