'use client'

import { useRouter } from 'next/navigation'
import { AuthCallbackView } from '@just-apps/auth'
import { useAuth } from '@/stores/useAuth'

export function AuthCallbackPage() {
  const router = useRouter()
  const user = useAuth((s) => s.user)
  const isNewUser = useAuth((s) => s.isNewUser)
  const loading = useAuth((s) => s.loading)

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
