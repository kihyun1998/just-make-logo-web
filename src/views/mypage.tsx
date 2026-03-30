'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { MyPageView, Spinner } from '@just-apps/auth'
import { useAuth } from '@/contexts/auth-context'
import { Layout } from '@/components/layout/layout'

import { i18nToLocale } from '@/lib/locale'

export function MyPage() {
  const { user, loading, signOut } = useAuth()
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
          <MyPageView
            locale={locale}
            user={user}
            onSignOut={async () => {
              await signOut()
              router.push('/')
            }}
            onDeleteAccount={() => router.push('/account/delete')}
          />
        ) : null}
      </main>
    </Layout>
  )
}
