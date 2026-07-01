'use client'

import { LANGUAGES } from '@/lib/languages'
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
        'bg-stardust border border-stardust rounded-lg px-3 py-2 text-sm text-starlight',
        'focus:outline-none focus:ring-2 focus:ring-aurora-start',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  )
}
