import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDueCards } from '@/lib/supabase/flashcards'
import { FlashcardDeck } from '@/components/flashcards/FlashcardDeck'
import Link from 'next/link'

export default async function FlashcardsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/sign-in')

  const cards = await getDueCards(supabase, user.id)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-starlight mb-1">Flashcards</h1>
        <p className="text-comet text-sm">
          {cards.length > 0
            ? `Review session · ${cards.length} card${cards.length !== 1 ? 's' : ''} due`
            : 'All caught up for today'}
        </p>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">✨</p>
          <p className="font-medium text-starlight mb-1">No cards due right now</p>
          <p className="text-sm text-comet mb-6">
            Save more words from your chat sessions to start reviewing.
          </p>
          <Link
            href="/vocabulary"
            className="text-sm text-aurora-end hover:underline"
          >
            Go to Vocabulary →
          </Link>
        </div>
      ) : (
        <FlashcardDeck initialCards={cards} />
      )}
    </div>
  )
}
