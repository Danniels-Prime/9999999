'use client'

import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MicButtonProps {
  isListening: boolean
  disabled?: boolean
  size?: 'sm' | 'lg'
  onClick: () => void
}

export function MicButton({ isListening, disabled, size = 'sm', onClick }: MicButtonProps) {
  const dimension = size === 'lg' ? 'w-20 h-20' : 'w-10 h-10'
  const iconSize = size === 'lg' ? 'w-8 h-8' : 'w-4 h-4'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isListening ? 'Stop listening' : 'Start listening'}
      aria-pressed={isListening}
      className={cn(
        'relative rounded-full flex items-center justify-center transition-all duration-200 shrink-0',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        dimension,
        isListening
          ? 'bg-gradient-to-r from-aurora-start to-aurora-end text-white'
          : 'bg-nebula border border-stardust text-comet hover:border-aurora-start hover:text-starlight'
      )}
    >
      {isListening && (
        <motion.span
          className="absolute inset-0 rounded-full bg-aurora-start/40"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <Mic className={iconSize} />
    </button>
  )
}
