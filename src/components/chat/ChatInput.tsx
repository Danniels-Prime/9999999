'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  disabled?: boolean
  onSend: (message: string) => void
}

export function ChatInput({ disabled, onSend }: ChatInputProps) {
  const [value, setValue] = useState('')

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="flex items-end gap-2 border-t border-stardust pt-4 mt-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        placeholder="Type your message..."
        className={cn(
          'flex-1 resize-none px-4 py-2.5 rounded-xl bg-nebula border border-stardust text-starlight',
          'placeholder:text-comet/50 outline-none transition-all duration-200 max-h-40',
          'focus:border-aurora-start focus:ring-1 focus:ring-aurora-start/30',
          'disabled:opacity-50'
        )}
      />
      <Button
        onClick={submit}
        disabled={disabled || !value.trim()}
        size="md"
        aria-label="Send message"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  )
}
