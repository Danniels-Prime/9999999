'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SUPPORTED_LANGUAGES } from '@/lib/languages'
import { WordDetailModal } from './WordDetailModal'
import { SaveWordInput } from './SaveWordInput'
import { cn } from '@/lib/utils'

interface VocabItem {
  id: string
  word: string
  language_code: string
  part_of_speech: string
  definitions: { text: string; example: string }[]
  examples: string[]
}

interface VocabRow {
  id: string
  created_at: string
  vocabulary_items: VocabItem
}

interface VocabularyGridProps {
  initialVocab: VocabRow[]
}

export function VocabularyGrid({ initialVocab }: VocabularyGridProps) {
  const [vocab, setVocab] = useState<VocabRow[]>(initialVocab)
  const [selectedItem, setSelectedItem] = useState<VocabItem | null>(null)
  const [activeLanguage, setActiveLanguage] = useState<string>('all')

  const languages = Array.from(new Set(vocab.map((r) => r.vocabulary_items.language_code)))

  const filtered =
    activeLanguage === 'all'
      ? vocab
      : vocab.filter((r) => r.vocabulary_items.language_code === activeLanguage)

  const handleSaved = async () => {
    const res = await fetch('/api/vocabulary')
    if (res.ok) {
      const data = await res.json()
      setVocab(data)
    }
  }

  return (
    <>
      <WordDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveLanguage('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm transition-colors',
              activeLanguage === 'all'
                ? 'bg-gradient-to-r from-aurora-start to-aurora-end text-white'
                : 'bg-stardust text-comet hover:text-starlight'
            )}
          >
            All ({vocab.length})
          </button>
          {languages.map((code) => {
            const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code)
            const count = vocab.filter((r) => r.vocabulary_items.language_code === code).length
            return (
              <button
                key={code}
                onClick={() => setActiveLanguage(code)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm transition-colors',
                  activeLanguage === code
                    ? 'bg-gradient-to-r from-aurora-start to-aurora-end text-white'
                    : 'bg-stardust text-comet hover:text-starlight'
                )}
              >
                {lang?.flag} {lang?.name} ({count})
              </button>
            )
          })}
        </div>

        <div className="w-full sm:w-64">
          <SaveWordInput onSaved={handleSaved} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-comet">
          <p className="text-4xl mb-3">📖</p>
          <p className="font-medium text-starlight mb-1">No words saved yet</p>
          <p className="text-sm">Save words from your chat sessions using the input above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((row, i) => {
            const item = row.vocabulary_items
            const flag = SUPPORTED_LANGUAGES.find((l) => l.code === item.language_code)?.flag ?? '💬'
            const firstDef = item.definitions?.[0]?.text ?? ''
            return (
              <motion.button
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedItem(item)}
                className="text-left bg-nebula border border-stardust rounded-xl p-4 hover:border-aurora-start/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{flag}</span>
                  <span className="font-semibold text-starlight">{item.word}</span>
                </div>
                <span className="text-xs text-aurora-end uppercase tracking-wide">
                  {item.part_of_speech}
                </span>
                {firstDef && (
                  <p className="text-xs text-comet mt-1.5 line-clamp-2">{firstDef}</p>
                )}
              </motion.button>
            )
          })}
        </div>
      )}
    </>
  )
}
