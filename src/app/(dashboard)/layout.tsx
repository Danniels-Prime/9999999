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
        <span className="text-lg font-bold bg-gradient-to-r from-aurora-start to-aurora-end bg-clip-text text-transparent">
          Æthermind
        </span>
        <span className="text-sm text-comet">{user.email}</span>
      </nav>
      <main className="p-6 max-w-6xl mx-auto">{children}</main>
    </div>
  )
}
