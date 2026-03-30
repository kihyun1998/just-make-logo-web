import { Suspense } from 'react'
import { MyPage } from '@/views/mypage'

export default function Page() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center py-20" />}>
      <MyPage />
    </Suspense>
  )
}
