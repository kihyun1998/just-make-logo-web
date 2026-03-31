'use client'

import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { AccountDeleteView } from '@just-apps/auth'
import { useAuth, supabase } from '@/contexts/auth-context'
import { Layout } from '@/components/layout/layout'
import { i18nToLocale } from '@/lib/locale'

export function AccountDeletePage() {
  const user = useAuth((s) => s.user)
  const signInWithGoogle = useAuth((s) => s.signInWithGoogle)
  const signOut = useAuth((s) => s.signOut)
  const { i18n } = useTranslation()
  const router = useRouter()
  const locale = i18nToLocale(i18n.language)

  return (
    <Layout>
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <AccountDeleteView
          locale={locale}
          user={user}
          onGoogleLogin={signInWithGoogle}
          onDelete={async () => {
            const { error } = await supabase.functions.invoke('delete-account')
            if (error) throw error
            await signOut()
          }}
          onGoHome={() => router.push('/')}
        />
      </main>
    </Layout>
  )
}
