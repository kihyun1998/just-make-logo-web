'use client'

import { useTranslation } from 'react-i18next'
import { LoginView } from '@just-apps/auth'
import { useAuth } from '@/contexts/auth-context'

import { i18nToLocale } from '@/lib/locale'

export function LoginPage() {
  const { i18n } = useTranslation()
  const { signInWithGoogle } = useAuth()
  const locale = i18nToLocale(i18n.language)

  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <LoginView
        locale={locale}
        onGoogleLogin={signInWithGoogle}
      />
    </div>
  )
}
