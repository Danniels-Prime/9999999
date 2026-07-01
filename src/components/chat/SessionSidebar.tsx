'use client'

import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { LANGUAGE_NAMES } from '@/lib/languages'
import { SaveWordInput } from '@/components/vocabulary/SaveWordInput'
import type { ChatSession } from '@/types'

interface SessionSidebarProps {
  sessions: ChatSession[]
  activeSessionId: string | null
  activeLanguageCode?: string
  onSelect: (session: ChatSession) => void
  onNew: () => void
  loading?: boolean
}

export function SessionSidebar({
  sessions,
  activeSessionId,
  activeLanguageCode,
  onSelect,
  onNew,
  loading,
}: SessionSidebarProps) {
  return (
    <div className="flex flex-col w-full md:w-64 shrink-0 md:border-r md:border-stardust md:pr-4 md:mr-4 mb-4 md:mb-0">
      <Button
        variant="secondary"
        size="sm"
        onClick={onNew}
        className="mb-4 w-full justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        New conversation
      </Button>

      <div className="flex-1 overflow-y-auto flex flex-col gap-1">
        {loading && <p className="text-xs text-comet px-2">Loading...</p>}
        {!loading && sessions.length === 0 && (
          <p className="text-xs text-comet px-2">No conversations yet.</p>
        )}
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelect(session)}
            className={cn(
              'text-left px-3 py-2.5 rounded-xl text-sm transition-colors',
              session.id === activeSessionId
                ? 'bg-stardust text-starlight'
                : 'text-comet hover:bg-stardust/60 hover:text-starlight'
            )}
          >
            <span className="block truncate">{session.title}</span>
            <span className="block text-xs text-comet/70">
              {LANGUAGE_NAMES[session.languageCode] ?? session.languageCode}
            </span>
          </button>
        ))}
      </div>

      {activeLanguageCode && (
        <div className="pt-3 mt-3 border-t border-stardust">
          <SaveWordInput defaultLanguageCode={activeLanguageCode} compact />
        </div>
      )}
    </div>
  )
}
