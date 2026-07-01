import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDueCards } from '@/lib/supabase/flashcards'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const cards = await getDueCards(supabase, user.id)
    return NextResponse.json({ cards, total: cards.length })
  } catch (err) {
    console.error('GET /api/flashcards error:', err)
    return NextResponse.json({ error: 'Failed to load due cards' }, { status: 500 })
  }
}
