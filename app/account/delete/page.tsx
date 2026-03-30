import { Suspense } from 'react'
import { AccountDeletePage } from '@/views/account-delete'

export default function Page() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center py-20" />}>
      <AccountDeletePage />
    </Suspense>
  )
}
