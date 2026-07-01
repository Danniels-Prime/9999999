'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { MicButton } from './MicButton'
import { VoiceWaveform } from './VoiceWaveform'
import { useSpeechRecognition } from '@/lib/voice/useSpeechRecognition'
import { useSpeechSynthesis } from '@/lib/voice/useSpeechSynthesis'
import { getLanguageLocale } from '@/lib/languages'

type ProcessingState = 'idle' | 'thinking' | 'speaking'

interface VoiceModePanelProps {
  targetLanguageCode: string
  onSend: (transcript: string) => Promise<string>
  onExit: () => void
}

const STATE_LABEL: Record<'listening' | ProcessingState, string> = {
  idle: 'Tap the mic to speak',
  listening: 'Listening...',
  thinking: 'Æthermind is thinking...',
  speaking: 'Æthermind is speaking...',
}

export function VoiceModePanel({ targetLanguageCode, onSend, onExit }: VoiceModePanelProps) {
  const [processing, setProcessing] = useState<ProcessingState>('idle')
  const [lastHeard, setLastHeard] = useState('')
  const [error, setError] = useState<string | null>(null)
  const speakingStartedRef = useRef(false)
  const locale = getLanguageLocale(targetLanguageCode)

  const { speak, cancel: cancelSpeech, isSpeaking, isSupported: ttsSupported } = useSpeechSynthesis()

  const {
    isListening,
    interimTranscript,
    error: sttError,
    isSupported: sttSupported,
    start,
    stop,
  } = useSpeechRecognition({ locale, onFinalResult: handleFinalTranscript })

  useEffect(() => {
    if (processing !== 'speaking') return
    if (isSpeaking) {
      speakingStartedRef.current = true
    } else if (speakingStartedRef.current) {
      speakingStartedRef.current = false
      setProcessing('idle')
    }
  }, [isSpeaking, processing])

  async function handleFinalTranscript(transcript: string) {
    if (!transcript) return
    setLastHeard(transcript)
    setError(null)
    setProcessing('thinking')

    try {
      const reply = await onSend(transcript)
      if (reply.trim() && ttsSupported) {
        setProcessing('speaking')
        speak(reply, locale)
      } else {
        setProcessing('idle')
      }
    } catch {
      setError('Something went wrong. Try again.')
      setProcessing('idle')
    }
  }

  function handleMicClick() {
    if (isListening) {
      stop()
      return
    }
    cancelSpeech()
    setError(null)
    setLastHeard('')
    start()
  }

  const displayState: 'listening' | ProcessingState = isListening ? 'listening' : processing
  const micDisabled = !sttSupported || processing === 'thinking' || processing === 'speaking'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="relative flex-1 flex flex-col items-center justify-center gap-6 py-10"
    >
      <button
        type="button"
        onClick={onExit}
        aria-label="Exit voice mode"
        className="absolute top-0 right-1 text-comet hover:text-starlight transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <VoiceWaveform
        active={displayState === 'listening' || displayState === 'speaking'}
        variant={displayState === 'speaking' ? 'speaking' : 'listening'}
      />

      <p className="text-sm text-comet">{STATE_LABEL[displayState]}</p>

      <p className="text-starlight text-center max-w-md min-h-[1.5rem] px-4">
        {interimTranscript || lastHeard}
      </p>

      {(error ?? sttError) && (
        <p className="text-xs text-danger" role="alert">
          {error ?? sttError}
        </p>
      )}

      {!sttSupported && (
        <p className="text-xs text-comet max-w-xs text-center">
          Voice input isn&apos;t supported in this browser. Try Chrome or Edge.
        </p>
      )}

      <MicButton isListening={isListening} disabled={micDisabled} size="lg" onClick={handleMicClick} />
    </motion.div>
  )
}
