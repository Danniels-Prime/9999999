import { SupabaseClient } from '@supabase/supabase-js'
import { SM2Result } from '@/lib/srs/sm2'
import type { UserVocabularyItem } from '@/types'

export async function getDueCards(
  supabase: SupabaseClient,
  userId: string
): Promise<UserVocabularyItem[]> {
  const { data, error } = await supabase
    .from('user_vocabulary')
    .select('id, next_review, interval_days, ease_factor, reps, created_at, vocabulary_items(id, word, language_code, part_of_speech, definitions, examples)')
    .eq('user_id', userId)
    .lte('next_review', new Date().toISOString())
    .order('next_review', { ascending: true })

  if (error) throw error

  return (data ?? [])
    .filter((row) => row.vocabulary_items !== null)
    .map((row) => {
      const item = row.vocabulary_items as unknown as {
        id: string
        word: string
        language_code: string
        part_of_speech: string
        definitions: { text: string; example: string }[]
        examples: string[]
      }
      return {
        userVocabId: row.id,
        nextReview: row.next_review,
        intervalDays: row.interval_days,
        easeFactor: row.ease_factor,
        reps: row.reps,
        createdAt: row.created_at,
        id: item.id,
        word: item.word,
        languageCode: item.language_code,
        partOfSpeech: item.part_of_speech,
        definitions: item.definitions ?? [],
        examples: item.examples ?? [],
      }
    })
}

export async function updateCardReview(
  supabase: SupabaseClient,
  userVocabId: string,
  result: SM2Result
) {
  const { error } = await supabase
    .from('user_vocabulary')
    .update({
      reps: result.reps,
      ease_factor: result.easeFactor,
      interval_days: result.intervalDays,
      next_review: result.nextReview.toISOString(),
    })
    .eq('id', userVocabId)

  if (error) throw error
}
