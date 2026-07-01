'use client'

import { motion } from 'framer-motion'
import { Volume2, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSpeechSynthesis } from '@/lib/voice/useSpeechSynthesis'
import { getLanguageLocale } from '@/lib/languages'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  targetLanguageCode?: string
}

export function ChatMessage({ role, content, targetLanguageCode }: ChatMessageProps) {
  const isUser = role === 'user'
  const { speak, cancel, isSpeaking, isSupported } = useSpeechSynthesis()

  function toggleSpeak() {
    if (isSpeaking) {
      cancel()
      return
    }
    speak(content, getLanguageLocale(targetLanguageCode ?? 'en'))
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex items-end gap-2', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap',
          isUser
            ? 'bg-gradient-to-r from-aurora-start to-aurora-end text-white'
            : 'bg-nebula border border-stardust text-starlight'
        )}
      >
        {content || ' '}
      </div>
      {!isUser && isSupported && content.trim() && (
        <button
          type="button"
          onClick={toggleSpeak}
          aria-label={isSpeaking ? 'Stop speaking' : 'Read message aloud'}
          className="text-comet hover:text-starlight transition-colors shrink-0 mb-1"
        >
          {isSpeaking ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      )}
    </motion.div>
  )
}
