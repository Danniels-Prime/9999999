import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getChatSession, getSessionMessages } from '@/lib/supabase/chat'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const session = await getChatSession(supabase, user.id, id)
  if (!session) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const messages = await getSessionMessages(supabase, id)
  return NextResponse.json({ session, messages })
}
