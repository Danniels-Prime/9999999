'use client'

import { SUPPORTED_LANGUAGES } from '@/lib/languages'
import { cn } from '@/lib/utils'

interface LanguageSelectorProps {
  value: string
  onChange: (code: string) => void
  disabled?: boolean
  className?: string
}

export function LanguageSelector({ value, onChange, disabled, className }: LanguageSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cn(
        'px-4 py-2.5 rounded-xl bg-nebula border border-stardust text-starlight text-sm',
        'outline-none focus:border-aurora-start focus:ring-1 focus:ring-aurora-start/30',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {SUPPORTED_LANGUAGES.map((language) => (
        <option key={language.code} value={language.code}>
          {language.flag} {language.name}
        </option>
      ))}
    </select>
  )
}
