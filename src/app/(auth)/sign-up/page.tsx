'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setEmailSent(true)
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <span className="text-3xl font-bold bg-gradient-to-r from-aurora-start to-aurora-end bg-clip-text text-transparent">
          Æthermind
        </span>
      </div>

      <Card elevated>
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-starlight mb-1">Create your account</h1>
          <p className="text-comet text-sm">Start your language learning journey</p>
        </div>

        {emailSent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4"
          >
            <div className="text-4xl mb-4">✉️</div>
            <p className="text-starlight font-medium mb-2">Check your email</p>
            <p className="text-comet text-sm">
              We sent a verification link to{' '}
              <span className="text-starlight">{email}</span>. Click it to activate your account.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="8+ characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
            {error && (
              <p className="text-sm text-danger" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" loading={loading} className="mt-2 w-full">
              Create account
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-comet">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-starlight hover:text-aurora-end transition-colors"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </motion.div>
  )
}
