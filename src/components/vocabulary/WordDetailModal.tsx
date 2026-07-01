'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SUPPORTED_LANGUAGES } from '@/lib/languages'

interface VocabItem {
  id: string
  word: string
  language_code: string
  part_of_speech: string
  definitions: { text: string; example: string }[]
  examples: string[]
}

interface WordDetailModalProps {
  item: VocabItem | null
  onClose: () => void
}

export function WordDetailModal({ item, onClose }: WordDetailModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const flag = SUPPORTED_LANGUAGES.find((l) => l.code === item?.language_code)?.flag ?? '💬'

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-md bg-nebula border border-stardust rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{flag}</span>
                  <h2 className="text-2xl font-bold text-starlight">{item.word}</h2>
                </div>
                <span className="text-xs text-aurora-end uppercase tracking-wide font-medium">
                  {item.part_of_speech}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-comet hover:text-starlight transition-colors text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {item.definitions.map((def, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-sm text-starlight">{def.text}</p>
                  {def.example && (
                    <p className="text-xs text-comet italic border-l-2 border-aurora-start/40 pl-3">
                      {def.example}
                    </p>
                  )}
                </div>
              ))}

              {item.examples.length > 0 && (
                <div className="pt-2 border-t border-stardust">
                  <p className="text-xs text-comet uppercase tracking-wide mb-2">More examples</p>
                  <ul className="space-y-1">
                    {item.examples.map((ex, i) => (
                      <li key={i} className="text-xs text-comet italic">
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
