'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface VoiceWaveformProps {
  active: boolean
  variant?: 'listening' | 'speaking'
}

const BAR_COUNT = 5

export function VoiceWaveform({ active, variant = 'listening' }: VoiceWaveformProps) {
  return (
    <div className="flex items-end justify-center gap-1.5 h-16">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <motion.span
          key={i}
          className={cn(
            'w-1.5 rounded-full',
            variant === 'speaking'
              ? 'bg-gradient-to-t from-supernova to-aurora-end'
              : 'bg-gradient-to-t from-aurora-start to-aurora-end'
          )}
          initial={{ height: '20%' }}
          animate={active ? { height: ['30%', '100%', '45%', '80%', '30%'] } : { height: '20%' }}
          transition={{
            duration: 1.1,
            repeat: active ? Infinity : 0,
            ease: 'easeInOut',
            delay: i * 0.12,
          }}
        />
      ))}
    </div>
  )
}
