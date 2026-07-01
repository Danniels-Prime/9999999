import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sm2 } from '@/lib/srs/sm2'
import { updateCardReview } from '@/lib/supabase/flashcards'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { quality } = (await req.json()) as { quality: 0 | 1 | 2 | 3 | 4 | 5 }

  if (typeof quality !== 'number' || quality < 0 || quality > 5) {
    return NextResponse.json({ error: 'quality must be 0–5' }, { status: 400 })
  }

  const { data: row, error: fetchErr } = await supabase
    .from('user_vocabulary')
    .select('reps, ease_factor, interval_days')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchErr || !row) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 })
  }

  const result = sm2({
    quality,
    reps: row.reps,
    easeFactor: row.ease_factor,
    intervalDays: row.interval_days,
  })

  try {
    await updateCardReview(supabase, id, result)
    return NextResponse.json({
      nextReview: result.nextReview,
      intervalDays: result.intervalDays,
    })
  } catch (err) {
    console.error('POST /api/flashcards/[id]/review error:', err)
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 })
  }
}
