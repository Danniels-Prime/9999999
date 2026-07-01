'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { FlashcardCard } from './FlashcardCard'
import type { UserVocabularyItem } from '@/types'

interface FlashcardDeckProps {
  initialCards: UserVocabularyItem[]
}

export function FlashcardDeck({ initialCards }: FlashcardDeckProps) {
  const [cards] = useState<UserVocabularyItem[]>(initialCards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviewed, setReviewed] = useState(0)
  const [done, setDone] = useState(false)
  const [grading, setGrading] = useState(false)

  async function handleGrade(quality: 0 | 1 | 2 | 3 | 4 | 5) {
    if (grading) return
    const card = cards[currentIndex]
    setGrading(true)

    try {
      await fetch(`/api/flashcards/${card.userVocabId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quality }),
      })
    } catch {
      // non-fatal: still advance
    }

    const next = currentIndex + 1
    setReviewed((r) => r + 1)
    if (next >= cards.length) {
      setDone(true)
    } else {
      setCurrentIndex(next)
    }
    setGrading(false)
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <p className="text-5xl mb-4">🌟</p>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-aurora-start to-aurora-end bg-clip-text text-transparent mb-2">
          All caught up!
        </h2>
        <p className="text-comet mb-1">
          {reviewed} card{reviewed !== 1 ? 's' : ''} reviewed
        </p>
        <p className="text-sm text-comet mb-8">Come back tomorrow for your next session.</p>
        <Link
          href="/vocabulary"
          className="px-5 py-2.5 rounded-xl text-sm font-medium bg-stardust text-starlight hover:border-aurora-start border border-stardust transition-colors"
        >
          Back to Vocabulary
        </Link>
      </motion.div>
    )
  }

  const total = cards.length

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-stardust rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-aurora-start to-aurora-end rounded-full"
            animate={{ width: `${(currentIndex / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs text-comet shrink-0">
          {currentIndex + 1} / {total}
        </span>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.2 }}
        >
          <FlashcardCard card={cards[currentIndex]} onGrade={handleGrade} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
