'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { TermsAgreementView } from '@just-apps/auth'
import type { TermItem } from '@just-apps/auth'
import { useAuth, supabase } from '@/stores/useAuth'
import { useTheme } from '@/components/theme-provider'
import { getTermsByLocale } from '@/content/terms'
import { i18nToLocale } from '@/lib/locale'

export function TermsAgreementPage() {
  const router = useRouter()
  const { i18n } = useTranslation()
  const user = useAuth((s) => s.user)
  const setIsNewUser = useAuth((s) => s.setIsNewUser)
  const { theme, toggleTheme } = useTheme()

  const locale = i18nToLocale(i18n.language)

  const terms: TermItem[] = useMemo(
    () =>
      getTermsByLocale(locale).map((d) => ({
        id: d.id,
        type: d.type,
        title: d.title,
        required: d.required,
      })),
    [locale],
  )

  const toggleLocale = () => {
    i18n.changeLanguage(i18n.language.startsWith('ko') ? 'en' : 'ko')
  }

  return (
    <TermsAgreementView
      locale={locale}
      theme={theme}
      terms={terms}
      onToggleLocale={toggleLocale}
      onToggleTheme={toggleTheme}
      logoText="Just Make Logo"
      logoHref="/"
      termsViewUrl={(type, loc) => `https://justapps.co/terms/${type}/${loc}`}
      onSubmit={async (agreed) => {
        if (!user) return
        const { error } = await supabase.from('user_agreements').insert({
          user_id: user.id,
          terms_agreed: agreed.terms_of_service ?? false,
          privacy_agreed: agreed.privacy_policy ?? false,
        })
        if (error) throw error
        setIsNewUser(false)
        router.replace('/')
      }}
    />
  )
}
