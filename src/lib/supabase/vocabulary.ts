import { SupabaseClient } from '@supabase/supabase-js'
import { EnrichedWord } from '@/lib/anthropic/enrich'

export async function findVocabItem(
  supabase: SupabaseClient,
  word: string,
  languageCode: string
) {
  const { data } = await supabase
    .from('vocabulary_items')
    .select('*')
    .eq('word', word.toLowerCase().trim())
    .eq('language_code', languageCode)
    .maybeSingle()
  return data
}

export async function createVocabItem(
  supabase: SupabaseClient,
  word: string,
  languageCode: string,
  enriched: EnrichedWord
) {
  const { data, error } = await supabase
    .from('vocabulary_items')
    .insert({
      word: word.toLowerCase().trim(),
      language_code: languageCode,
      part_of_speech: enriched.part_of_speech,
      definitions: enriched.definitions,
      examples: enriched.examples,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function hasUserSaved(
  supabase: SupabaseClient,
  userId: string,
  itemId: string
) {
  const { data } = await supabase
    .from('user_vocabulary')
    .select('id')
    .eq('user_id', userId)
    .eq('item_id', itemId)
    .maybeSingle()
  return !!data
}

export async function addToUserVocabulary(
  supabase: SupabaseClient,
  userId: string,
  itemId: string
) {
  const { data, error } = await supabase
    .from('user_vocabulary')
    .insert({ user_id: userId, item_id: itemId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function listUserVocabulary(
  supabase: SupabaseClient,
  userId: string,
  languageCode?: string
) {
  let query = supabase
    .from('user_vocabulary')
    .select('id, created_at, vocabulary_items(id, word, language_code, part_of_speech, definitions, examples)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (languageCode) {
    query = query.eq('vocabulary_items.language_code', languageCode)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).filter((row) => row.vocabulary_items !== null)
}
