import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createChatSession, listChatSessions } from '@/lib/supabase/chat'
import { SUPPORTED_LANGUAGES } from '@/lib/languages'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sessions = await listChatSessions(supabase, user.id)
  return NextResponse.json({ sessions })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const targetLanguage = body?.targetLanguage
  const title = typeof body?.title === 'string' ? body.title : undefined

  if (
    typeof targetLanguage !== 'string' ||
    !SUPPORTED_LANGUAGES.some((language) => language.code === targetLanguage)
  ) {
    return NextResponse.json({ error: 'Invalid targetLanguage' }, { status: 400 })
  }

  const session = await createChatSession(supabase, user.id, targetLanguage, title)
  return NextResponse.json({ session }, { status: 201 })
}
