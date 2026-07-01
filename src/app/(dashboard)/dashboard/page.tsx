import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'

const features = [
  {
    title: 'AI Chat',
    description: 'Practice conversations with your personal language mentor.',
    status: 'Open →',
    statusColor: 'text-aurora-end',
    href: '/chat',
  },
  {
    title: 'Vocabulary',
    description: 'Build and review your personal word bank with AI-powered definitions.',
    status: 'Open →',
    statusColor: 'text-aurora-end',
    href: '/vocabulary',
  },
  {
    title: 'Flashcards',
    description: 'Spaced repetition to lock in everything you learn.',
    status: 'Coming soon',
    statusColor: 'text-comet',
    href: null,
  },
  {
    title: 'Voice Practice',
    description: 'Speak and listen — real conversation without typing.',
    status: 'Coming soon',
    statusColor: 'text-comet',
    href: null,
  },
  {
    title: 'Knowledge Graph',
    description: 'Semantic connections between everything you know.',
    status: 'Coming soon',
    statusColor: 'text-comet',
    href: null,
  },
  {
    title: 'Progress',
    description: 'Streaks, stats, and insight into how you learn.',
    status: 'Coming soon',
    statusColor: 'text-comet',
    href: null,
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-starlight mb-2">Welcome to Æthermind</h1>
        <p className="text-comet">Your AI-powered language learning OS. The journey starts here.</p>
        {user && <p className="text-sm text-stardust mt-1">Signed in as {user.email}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) =>
          feature.href ? (
            <Link key={feature.title} href={feature.href} className="group">
              <Card elevated className="flex flex-col h-full transition-colors group-hover:border-aurora-start/50">
                <h2 className="font-semibold text-starlight mb-1">{feature.title}</h2>
                <p className="text-sm text-comet flex-1">{feature.description}</p>
                <p className={`text-xs mt-4 ${feature.statusColor}`}>{feature.status}</p>
              </Card>
            </Link>
          ) : (
            <Card key={feature.title} elevated className="flex flex-col">
              <h2 className="font-semibold text-starlight mb-1">{feature.title}</h2>
              <p className="text-sm text-comet flex-1">{feature.description}</p>
              <p className={`text-xs mt-4 ${feature.statusColor}`}>{feature.status}</p>
            </Card>
          )
        )}
      </div>
    </div>
  )
}
