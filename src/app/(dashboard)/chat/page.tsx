import { createClient } from '@/lib/supabase/server'
import { listChatSessions } from '@/lib/supabase/chat'
import { ChatInterface } from '@/components/chat/ChatInterface'

export default async function ChatPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const sessions = user ? await listChatSessions(supabase, user.id) : []

  return <ChatInterface initialSessions={sessions} />
}
