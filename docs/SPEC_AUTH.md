# Just Make Logo — Auth 연동 기획서

> 참조 구현: `just-apps-homepage` (동일 Supabase, 동일 `@just-apps/auth` 패키지)

---

## 개요

`@just-apps/auth` npm 패키지를 사용하여 인증 플로우를 구현한다.
모든 컴포넌트는 **pure view**이며, 비즈니스 로직은 props로 주입한다.

---

## 필요한 셋업

### 1. 패키지 설치
```bash
npm install @just-apps/auth
# zustand은 이미 설치됨 (logo-store에서 사용 중)
```

### 2. next.config.ts 수정
```ts
// next.config.ts
const nextConfig: NextConfig = {
  transpilePackages: ["@just-apps/auth"],
};
```

### 3. globals.css — Tailwind 소스 스캔
`@import "tailwindcss"` 바로 아래에 추가:
```css
@source "../node_modules/@just-apps/auth/src/**/*.tsx";
```

---

## 페이지 & 라우트 구조

| 라우트 | 컴포넌트 | 레이아웃 | 설명 |
|--------|----------|----------|------|
| `/login` | `LoginView` | 앱 Header 포함 | Google OAuth 로그인 |
| `/auth/callback` | Server route | — | OAuth 코드 → 세션 교환 |
| `/auth/callback-client` | `AuthCallbackView` | 없음 (스피너만) | 신규유저 판별 → terms/home 라우팅 |
| `/terms` | `TermsAgreementView` | **자체 내장 헤더/푸터** (앱 Header 미사용) | 약관 동의 full-page |
| `/mypage` | `MyPageView` | 앱 Header + Footer | 프로필, 로그아웃, 계정삭제 이동 |
| `/account/delete` | `AccountDeleteView` | 앱 Header + Footer | 2단계 계정 삭제 |

> `/terms` 페이지는 `TermsAgreementView`가 자체 헤더/푸터를 갖고 있으므로,
> 앱의 `<Layout>` 없이 단독 렌더링한다 (헤더 중복 방지).

---

## Supabase 클라이언트 변경

**현재:** factory 함수 (`export function createClient()`)

**변경:** singleton export (homepage 패턴) — Zustand store에서 직접 참조

```ts
// src/lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)
```

`supabase-server.ts`는 그대로 유지 (서버 컴포넌트/라우트용).

---

## Auth 스토어 전환

**현재:** React Context (`auth-context.tsx`) — `AuthProvider` + `useAuth()` hook

**변경:** Zustand 스토어 (`src/stores/useAuth.ts`) — homepage 패턴 따름

```ts
import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type Role = 'admin' | 'user' | null

interface AuthStore {
  user: User | null
  role: Role
  isNewUser: boolean
  loading: boolean
  initialized: boolean
  init: () => (() => void) | void
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  checkAgreement: (userId: string) => Promise<{ agreed: boolean; role: Role }>
  setIsNewUser: (v: boolean) => void
}

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  role: null,
  isNewUser: false,
  loading: true,
  initialized: false,

  init: () => {
    if (get().initialized) return
    set({ initialized: true })

    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { agreed, role } = await get().checkAgreement(session.user.id)
        set({ user: session.user, role, isNewUser: !agreed, loading: false })
      } else {
        set({ loading: false })
      }
    })()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { agreed, role } = await get().checkAgreement(session.user.id)
          set({ user: session.user, role, isNewUser: !agreed })
        } else {
          set({ user: null, role: null, isNewUser: false })
        }
      },
    )

    return () => subscription.unsubscribe()
  },

  signInWithGoogle: async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, role: null, isNewUser: false })
  },

  checkAgreement: async (userId) => {
    const { data } = await supabase
      .from('user_agreements')
      .select('id, role')
      .eq('user_id', userId)
      .single()
    return { agreed: !!data, role: (data?.role as Role) ?? null }
  },

  setIsNewUser: (v) => set({ isNewUser: v }),
}))
```

### AuthInitializer 컴포넌트

```tsx
// src/components/AuthInitializer.tsx
'use client'
import { useEffect } from 'react'
import { useAuth } from '@/stores/useAuth'

export function AuthInitializer() {
  const init = useAuth((s) => s.init)
  useEffect(() => {
    const cleanup = init()
    return () => { if (typeof cleanup === 'function') cleanup() }
  }, [init])
  return null
}
```

### 마이그레이션

1. `auth-context.tsx` 삭제
2. `app/providers.tsx`에서 `AuthProvider` 제거
3. `app/layout.tsx`에서 `<AuthInitializer />`를 `<Providers>` 안이 아닌 **`<body>` 바로 아래** sibling으로 추가
4. 기존 `useAuth()` import를 `@/contexts/auth-context` → `@/stores/useAuth`로 변경
   - `header.tsx`: `signOut`, `user` 사용
   - `login.tsx`: `signInWithGoogle` 사용

### AuthUser 타입 매핑

`@just-apps/auth` 컴포넌트는 `AuthUser = { id: string; email?: string | null; created_at?: string }`를 기대.
Supabase `User` 객체는 이 필드를 모두 가지고 있으므로 그대로 전달 가능.

---

## OAuth 콜백 플로우

```
Google OAuth
  → /auth/callback (server: 코드 교환, 에러 체크 없이 exchangeCodeForSession)
  → /auth/callback-client (client: AuthCallbackView)
      ├─ 유저 없음 → /login
      ├─ 신규유저 (약관 미동의) → /terms
      └─ 기존유저 → / (홈)
```

### callback route 변경

```ts
// app/auth/callback/route.ts — homepage 패턴으로 변경
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      },
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}/auth/callback-client`)
}
```

---

## 약관 동의

- `TermsAgreementView` 사용 (**full-page, 앱 Header 미사용**)
- terms 데이터: Supabase `terms` 테이블에서 조회 (`type`, `title`, `required`, `locale` 기준)
- `termsViewUrl`: `https://justapps.co/terms/${type}/${locale}` (외부 링크 — justapps.co에서 약관 전문 표시)
- `theme` prop 필요 — 현재 앱 테마 상태에서 가져옴
- `logoText`: `"Just Make Logo"` / `logoHref`: `"/"`
- 동의 시 `user_agreements` 테이블에 INSERT

### terms 데이터 조회

```ts
const { data } = await supabase
  .from('terms')
  .select('id, type, title, required')
  .eq('locale', locale === 'ko-KR' ? 'ko' : 'en')
  // terms 테이블의 locale 컬럼은 'ko'/'en' 형식
```

---

## 헤더 변경

**현재:** 로그인 버튼 / LogOut 아이콘

**변경:**
- 비로그인: "Login" 버튼 (기존 유지)
- 로그인: `UserMenu` 아바타 드롭다운 (마이페이지/로그아웃)
  - 아바타: `BoringAvatar` (`justapps:${email}`)
  - role=admin → "Admin" 메뉴 (향후)
  - role=user → "My Page" 메뉴
- 언어/테마 토글 버튼은 기존 그대로 유지

---

## Middleware 변경

현재: 세션 갱신만.

추가:
- `/mypage` → 미인증 시 `/login`으로 리다이렉트
- `/login` → 인증된 상태면 `/`로 리다이렉트
- `/account/delete`는 미들웨어 가드 안 함 — `AccountDeleteView`가 자체적으로 미인증 상태 처리 (로그인 버튼 표시)

---

## Locale 처리

`@just-apps/auth`는 `"ko-KR" | "en-US"` 형식을 요구.
현재 앱은 `i18next` 기반 (`ko`, `en`).

**매핑 유틸:**
```ts
// i18next language → @just-apps/auth locale
function toAuthLocale(lang: string): 'ko-KR' | 'en-US' {
  return lang.startsWith('ko') ? 'ko-KR' : 'en-US'
}
```

`i18next`의 `i18n.language`에서 파생 — 별도 locale 스토어 불필요.
`TermsAgreementView`의 `onToggleLocale`은 `i18n.changeLanguage()`를 호출.

---

## 계정 삭제

- `AccountDeleteView` 사용
- `delete-account` Edge Function 호출 (기존 Supabase에 있음)
- 삭제 시: `user_agreements` + `auth.users` 삭제
- `logo_projects`, `logo_color_presets`는 CASCADE로 자동 삭제

---

## 구현 순서

1. `supabase.ts` factory → singleton 변경
2. `src/stores/useAuth.ts` 생성 (Zustand)
3. `src/components/AuthInitializer.tsx` 생성
4. `app/providers.tsx` — `AuthProvider` 제거
5. `app/layout.tsx` — `AuthInitializer` 추가
6. `auth-context.tsx` 삭제
7. 기존 `useAuth()` consumer 업데이트 (`header.tsx`, `login.tsx`)
8. `next.config.ts` + `globals.css` 수정
9. `app/auth/callback/route.ts` 수정 (→ callback-client 리다이렉트)
10. 새 페이지 추가: callback-client, terms, mypage, account/delete
11. `middleware.ts` auth guard 추가
12. 빌드 + 테스트

---

## 변경 파일 목록

| 파일 | 변경 |
|------|------|
| `src/lib/supabase.ts` | factory → singleton 변경 |
| `src/stores/useAuth.ts` | 새로 생성 (Zustand auth store) |
| `src/components/AuthInitializer.tsx` | 새로 생성 |
| `src/contexts/auth-context.tsx` | **삭제** |
| `app/providers.tsx` | `AuthProvider` 제거 |
| `app/layout.tsx` | `AuthInitializer` 추가 |
| `next.config.ts` | `transpilePackages` 추가 |
| `app/globals.css` | `@source` 추가 |
| `middleware.ts` | auth guard 추가 |
| `app/auth/callback/route.ts` | callback-client로 리다이렉트 변경 |
| `app/auth/callback-client/page.tsx` | 새로 생성 |
| `app/terms/page.tsx` | 새로 생성 (Suspense 필요, Layout 미사용) |
| `app/mypage/page.tsx` | 새로 생성 |
| `app/account/delete/page.tsx` | 새로 생성 |
| `src/views/login.tsx` | `LoginView` 사용으로 교체 |
| `src/views/AuthCallbackPage.tsx` | 새로 생성 |
| `src/views/TermsAgreementPage.tsx` | 새로 생성 |
| `src/views/MyPage.tsx` | 새로 생성 |
| `src/views/AccountDeletePage.tsx` | 새로 생성 |
| `src/components/layout/header.tsx` | `UserMenu` 연동, import 경로 변경 |
| `src/i18n/locales/ko.json` | 불필요한 login.email/password 키 이미 제거됨 |
| `src/i18n/locales/en.json` | 동일 |
