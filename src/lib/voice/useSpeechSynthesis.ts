'use client'

import { useCallback, useEffect, useState } from 'react'

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    const supported = 'speechSynthesis' in window
    setIsSupported(supported)
    if (!supported) return

    function loadVoices() {
      setVoices(window.speechSynthesis.getVoices())
    }

    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [])

  const cancel = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [isSupported])

  const speak = useCallback(
    (text: string, locale: string) => {
      if (!isSupported || !text.trim()) return

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = locale
      const languagePrefix = locale.split('-')[0]
      const matchedVoice =
        voices.find((v) => v.lang === locale) ?? voices.find((v) => v.lang.startsWith(languagePrefix))
      if (matchedVoice) utterance.voice = matchedVoice

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    },
    [isSupported, voices]
  )

  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel()
    }
  }, [isSupported])

  return { speak, cancel, isSpeaking, isSupported }
}
