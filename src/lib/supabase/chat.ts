import type { SupabaseClient } from '@supabase/supabase-js'
import type { ChatSession, ChatMessage } from '@/types'

interface ChatSessionRow {
  id: string
  user_id: string
  language_code: string
  title: string
  created_at: string
}

interface ChatMessageRow {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

function toChatSession(row: ChatSessionRow): ChatSession {
  return {
    id: row.id,
    userId: row.user_id,
    languageCode: row.language_code,
    title: row.title,
    createdAt: row.created_at,
  }
}

function toChatMessage(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    sessionId: row.session_id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at,
  }
}

export async function listChatSessions(
  supabase: SupabaseClient,
  userId: string
): Promise<ChatSession[]> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as ChatSessionRow[]).map(toChatSession)
}

export async function createChatSession(
  supabase: SupabaseClient,
  userId: string,
  languageCode: string,
  title?: string
): Promise<ChatSession> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: userId, language_code: languageCode, title: title ?? 'New conversation' })
    .select('*')
    .single()

  if (error) throw error
  return toChatSession(data as ChatSessionRow)
}

export async function getChatSession(
  supabase: SupabaseClient,
  userId: string,
  sessionId: string
): Promise<ChatSession | null> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data ? toChatSession(data as ChatSessionRow) : null
}

export async function getSessionMessages(
  supabase: SupabaseClient,
  sessionId: string
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data as ChatMessageRow[]).map(toChatMessage)
}

export async function insertChatMessage(
  supabase: SupabaseClient,
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ session_id: sessionId, role, content })
    .select('*')
    .single()

  if (error) throw error
  return toChatMessage(data as ChatMessageRow)
}
