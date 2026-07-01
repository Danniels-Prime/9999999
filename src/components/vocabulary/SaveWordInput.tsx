'use client'

import { useState } from 'react'
import { SUPPORTED_LANGUAGES } from '@/lib/languages'
import { cn } from '@/lib/utils'

interface SaveWordInputProps {
  defaultLanguageCode?: string
  compact?: boolean
  onSaved?: (word: string) => void
}

type Status = 'idle' | 'loading' | 'saved' | 'duplicate' | 'error'

export function SaveWordInput({ defaultLanguageCode, compact, onSaved }: SaveWordInputProps) {
  const [word, setWord] = useState('')
  const [languageCode, setLanguageCode] = useState(defaultLanguageCode ?? 'es')
  const [status, setStatus] = useState<Status>('idle')

  const handleSave = async () => {
    const trimmed = word.trim()
    if (!trimmed || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: trimmed, languageCode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStatus(data.alreadySaved ? 'duplicate' : 'saved')
      setWord('')
      onSaved?.(trimmed)
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2500)
    }
  }

  return (
    <div className={cn('flex flex-col gap-1.5', compact && 'text-xs')}>
      {!compact && (
        <label className="text-xs font-medium text-comet uppercase tracking-wide">Save a word</label>
      )}
      {!defaultLanguageCode && (
        <select
          value={languageCode}
          onChange={(e) => setLanguageCode(e.target.value)}
          className="bg-stardust rounded-lg px-2 py-1.5 text-xs text-starlight focus:outline-none focus:ring-1 focus:ring-aurora-start"
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.name}
            </option>
          ))}
        </select>
      )}
      <div className="flex gap-1.5">
        <input
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder={compact ? 'Save a word…' : 'Type a word to save'}
          disabled={status === 'loading'}
          className="flex-1 min-w-0 bg-stardust rounded-lg px-3 py-1.5 text-xs text-starlight placeholder:text-comet focus:outline-none focus:ring-1 focus:ring-aurora-start disabled:opacity-50"
        />
        <button
          onClick={handleSave}
          disabled={!word.trim() || status === 'loading'}
          className="shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-aurora-start to-aurora-end text-white hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {status === 'loading' ? '…' : '+'}
        </button>
      </div>
      {status === 'saved' && <p className="text-xs text-aurora-end">✓ Saved!</p>}
      {status === 'duplicate' && <p className="text-xs text-comet">Already in your list</p>}
      {status === 'error' && <p className="text-xs text-danger">⚠ Failed — try again</p>}
    </div>
  )
}
