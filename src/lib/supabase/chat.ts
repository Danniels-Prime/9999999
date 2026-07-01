import { SupabaseClient } from '@supabase/supabase-js'

export async function createChatSession(
  supabase: SupabaseClient,
  userId: string,
  languageCode: string,
  title = 'New conversation'
) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: userId, language_code: languageCode, title })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function listChatSessions(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('id, title, language_code, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data ?? []
}

export async function getSessionMessages(supabase: SupabaseClient, sessionId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, role, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createMessage(
  supabase: SupabaseClient,
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ session_id: sessionId, role, content })
    .select()
    .single()
  if (error) throw error
  return data
}
