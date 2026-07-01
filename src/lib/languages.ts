export interface Language {
  code: string
  name: string
  flag: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Mandarin Chinese', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

export const LANGUAGE_NAMES: Record<string, string> = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((l) => [l.code, l.name])
)

export function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code] ?? code
}

// BCP-47 locales for the Web Speech API (SpeechRecognition + SpeechSynthesis)
export const LANGUAGE_LOCALES: Record<string, string> = {
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-BR',
  ja: 'ja-JP',
  ko: 'ko-KR',
  zh: 'zh-CN',
  ru: 'ru-RU',
  ar: 'ar-SA',
  nl: 'nl-NL',
  sv: 'sv-SE',
  pl: 'pl-PL',
  tr: 'tr-TR',
  hi: 'hi-IN',
  en: 'en-US',
}

export function getLanguageLocale(code: string): string {
  return LANGUAGE_LOCALES[code] ?? 'en-US'
}
