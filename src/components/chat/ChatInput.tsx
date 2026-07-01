'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { MicButton } from '@/components/voice/MicButton'
import { useSpeechRecognition } from '@/lib/voice/useSpeechRecognition'
import { getLanguageLocale } from '@/lib/languages'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  disabled?: boolean
  targetLanguageCode: string
  onSend: (message: string) => void
}

export function ChatInput({ disabled, targetLanguageCode, onSend }: ChatInputProps) {
  const [value, setValue] = useState('')
  const locale = getLanguageLocale(targetLanguageCode)

  const {
    isListening,
    interimTranscript,
    isSupported: sttSupported,
    start,
    stop,
  } = useSpeechRecognition({
    locale,
    onFinalResult: (transcript) => {
      setValue((prev) => (prev ? `${prev} ${transcript}` : transcript))
    },
  })

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

  function toggleMic() {
    if (isListening) {
      stop()
    } else {
      start()
    }
  }

  return (
    <div className="flex flex-col gap-1.5 border-t border-stardust pt-4 mt-2">
      {isListening && (
        <p className="text-xs text-comet px-1 truncate">{interimTranscript || 'Listening...'}</p>
      )}
      <div className="flex items-end gap-2">
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
        {sttSupported && (
          <MicButton isListening={isListening} disabled={disabled} onClick={toggleMic} />
        )}
        <Button
          onClick={submit}
          disabled={disabled || !value.trim()}
          size="md"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
