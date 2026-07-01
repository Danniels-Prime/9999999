import { createClient } from '@/lib/supabase/server'
import { listUserVocabulary } from '@/lib/supabase/vocabulary'
import { VocabularyGrid } from '@/components/vocabulary/VocabularyGrid'

export default async function VocabularyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const vocab = user ? await listUserVocabulary(supabase, user.id) : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-starlight mb-2">Vocabulary</h1>
        <p className="text-comet">Your personal word bank — every word enriched by AI.</p>
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <VocabularyGrid initialVocab={vocab as any} />
    </div>
  )
}
