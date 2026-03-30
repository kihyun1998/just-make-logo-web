import { Suspense } from 'react'
import { TermsAgreementPage } from '@/views/terms-agreement'

export default function Page() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center py-20" />}>
      <TermsAgreementPage />
    </Suspense>
  )
}
