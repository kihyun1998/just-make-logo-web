'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { MyPageView, Spinner, BoringAvatar } from '@just-apps/auth'
import { useAuth } from '@/stores/useAuth'
import { Layout } from '@/components/layout/layout'
import { i18nToLocale } from '@/lib/locale'

export function MyPage() {
  const user = useAuth((s) => s.user)
  const loading = useAuth((s) => s.loading)
  const signOut = useAuth((s) => s.signOut)
  const { i18n } = useTranslation()
  const router = useRouter()
  const locale = i18nToLocale(i18n.language)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  return (
    <Layout>
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        {loading ? (
          <Spinner size="lg" />
        ) : user ? (
          <div className="flex w-full max-w-md flex-col items-center gap-6">
            <BoringAvatar
              name={`justapps:${user.email ?? user.id}`}
              size={80}
            />
            <MyPageView
              locale={locale}
              user={user}
              onSignOut={async () => {
                await signOut()
                router.push('/')
              }}
              onDeleteAccount={() => router.push('/account/delete')}
            />
          </div>
        ) : null}
      </main>
    </Layout>
  )
}
