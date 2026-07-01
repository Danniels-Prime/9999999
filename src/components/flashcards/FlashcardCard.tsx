'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SUPPORTED_LANGUAGES } from '@/lib/languages'
import { cn } from '@/lib/utils'
import type { UserVocabularyItem } from '@/types'

interface FlashcardCardProps {
  card: UserVocabularyItem
  onGrade: (quality: 0 | 1 | 2 | 3 | 4 | 5) => void
}

const GRADES: { label: string; quality: 0 | 1 | 2 | 3 | 4 | 5; className: string }[] = [
  { label: 'Again', quality: 0, className: 'bg-stardust text-comet hover:text-starlight' },
  { label: 'Hard', quality: 3, className: 'bg-stardust text-comet hover:text-starlight' },
  { label: 'Good', quality: 4, className: 'bg-gradient-to-r from-aurora-start to-aurora-end text-white hover:opacity-90' },
  { label: 'Easy', quality: 5, className: 'bg-gradient-to-r from-aurora-start to-aurora-end text-white hover:opacity-90' },
]

export function FlashcardCard({ card, onGrade }: FlashcardCardProps) {
  const [flipped, setFlipped] = useState(false)
  const flag = SUPPORTED_LANGUAGES.find((l) => l.code === card.languageCode)?.flag ?? '💬'
  const firstDef = card.definitions?.[0]

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      <div
        className="relative w-full cursor-pointer"
        style={{ perspective: 1000 }}
        onClick={() => !flipped && setFlipped(true)}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-full"
        >
          {/* Front */}
          <div
            className="bg-nebula border border-stardust rounded-2xl p-10 flex flex-col items-center justify-center min-h-[220px] shadow-lg shadow-black/50"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-4xl mb-4">{flag}</span>
            <h2 className="text-4xl font-bold text-starlight text-center">{card.word}</h2>
            <p className="text-xs text-comet mt-4">tap to reveal</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-nebula border border-aurora-start/40 rounded-2xl p-8 flex flex-col justify-center min-h-[220px] shadow-lg shadow-black/50"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="text-xs text-aurora-end uppercase tracking-wide font-medium mb-3">
              {card.partOfSpeech}
            </span>
            {firstDef && (
              <>
                <p className="text-starlight text-base mb-3">{firstDef.text}</p>
                {firstDef.example && (
                  <p className="text-sm text-comet italic border-l-2 border-aurora-start/40 pl-3">
                    {firstDef.example}
                  </p>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>

      {flipped && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex gap-3 w-full justify-center flex-wrap"
        >
          {GRADES.map(({ label, quality, className }) => (
            <button
              key={label}
              onClick={() => onGrade(quality)}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95',
                className
              )}
            >
              {label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}
