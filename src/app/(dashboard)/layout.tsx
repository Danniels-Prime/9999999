import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-void text-starlight">
      <nav className="sticky top-0 z-50 border-b border-stardust bg-nebula/70 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-lg font-bold bg-gradient-to-r from-aurora-start to-aurora-end bg-clip-text text-transparent"
        >
          Æthermind
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/chat" className="text-sm text-comet hover:text-starlight transition-colors">
            Chat
          </Link>
          <Link href="/vocabulary" className="text-sm text-comet hover:text-starlight transition-colors">
            Vocabulary
          </Link>
          <span className="text-sm text-comet">{user.email}</span>
        </div>
      </nav>
      <main className="p-6 max-w-6xl mx-auto">{children}</main>
    </div>
  )
}
