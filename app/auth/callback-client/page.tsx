import { Suspense } from 'react'
import { AuthCallbackPage } from '@/views/auth-callback'

export default function Page() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center py-20" />}>
      <AuthCallbackPage />
    </Suspense>
  )
}
