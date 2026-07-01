import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { enrichWord } from '@/lib/anthropic/enrich'
import {
  findVocabItem,
  createVocabItem,
  hasUserSaved,
  addToUserVocabulary,
  listUserVocabulary,
} from '@/lib/supabase/vocabulary'

export async function GET(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const languageCode = searchParams.get('language') ?? undefined

  const vocab = await listUserVocabulary(supabase, user.id, languageCode)
  return NextResponse.json(vocab)
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { word, languageCode } = await req.json()
  if (!word?.trim() || !languageCode) {
    return NextResponse.json({ error: 'Missing word or languageCode' }, { status: 400 })
  }

  let item = await findVocabItem(supabase, word, languageCode)
  let isNew = false

  if (!item) {
    const enriched = await enrichWord(word, languageCode)
    item = await createVocabItem(supabase, word, languageCode, enriched)
    isNew = true
  }

  const alreadySaved = await hasUserSaved(supabase, user.id, item.id)
  if (alreadySaved) {
    return NextResponse.json({ item, alreadySaved: true, isNew })
  }

  const userVocab = await addToUserVocabulary(supabase, user.id, item.id)
  return NextResponse.json({ item, userVocab, alreadySaved: false, isNew })
}
