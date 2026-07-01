import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createChatSession, listChatSessions } from '@/lib/supabase/chat'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sessions = await listChatSessions(supabase, user.id)
  return NextResponse.json(sessions)
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { languageCode } = await req.json()
  const session = await createChatSession(supabase, user.id, languageCode ?? 'es')
  return NextResponse.json(session)
}
