export function i18nToLocale(lang: string): 'ko-KR' | 'en-US' {
  return lang.startsWith('ko') ? 'ko-KR' : 'en-US'
}
