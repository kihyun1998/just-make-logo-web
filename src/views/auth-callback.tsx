'use client'

import { useRouter } from 'next/navigation'
import { AuthCallbackView } from '@just-apps/auth'
import { useAuth } from '@/contexts/auth-context'

export function AuthCallbackPage() {
  const router = useRouter()
  const { user, isNewUser, loading } = useAuth()

  return (
    <AuthCallbackView
      loading={loading}
      user={user ?? undefined}
      isNewUser={isNewUser}
      onRoute={(dest) => {
        if (dest === 'login') router.replace('/login')
        else if (dest === 'terms') router.replace('/terms')
        else router.replace('/')
      }}
    />
  )
}
