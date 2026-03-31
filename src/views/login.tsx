'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { GoogleIcon } from '@just-apps/auth'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { i18nToLocale } from '@/lib/locale'

export function LoginPage() {
  const { t, i18n } = useTranslation()
  const signInWithGoogle = useAuth((s) => s.signInWithGoogle)
  const locale = i18nToLocale(i18n.language)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    await signInWithGoogle()
  }

  const title = locale === 'ko-KR' ? '로그인' : 'Login'
  const subtitle =
    locale === 'ko-KR'
      ? 'Google 계정으로 시작하세요'
      : 'Get started with your Google account'

  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Button
          className="mt-8 w-full gap-3"
          variant="outline"
          size="lg"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          {t('login.google')}
        </Button>
      </div>
    </div>
  )
}
