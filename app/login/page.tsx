import { Suspense } from 'react'
import { Layout } from '@/components/layout/layout'
import { LoginPage } from '@/views/login'

export default function Page() {
  return (
    <Layout>
      <Suspense fallback={<div className="flex flex-1 items-center justify-center py-20" />}>
        <LoginPage />
      </Suspense>
    </Layout>
  )
}
