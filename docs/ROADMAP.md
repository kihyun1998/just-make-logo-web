# Just Make Logo - 구현 로드맵

> 기준 문서: `docs/SPEC_TEXT_LOGO.md`
> 현재 상태: **Phase 4 완료 (저장 보류), Phase 5 진행 예정**

---

## Phase 1: MVP — Text Only 로고 (핵심) ✅

목표: **텍스트 입력 → 실시간 미리보기 → PNG/JPG 다운로드**가 되는 최소 제품

### Step 1-1. 프로젝트 기반 세팅 ✅
- [x] zustand + immer + zundo 설치 및 스토어 구조 세팅
- [x] `LogoState` 타입 정의 + `DEFAULT_LOGO_STATE` 상수
- [x] `useLogoStore` zustand 스토어 생성 (temporal 미들웨어 포함)
- [x] react-colorful 설치
- [x] 에디터 페이지 라우트 생성 (`/app/editor/page.tsx`)
- [x] 에디터 레이아웃 뼈대 (좌측 프리뷰 3 : 우측 패널 1, 모바일 세로 스택)

### Step 1-2. Canvas 렌더링 엔진 ✅
- [x] `<LogoCanvas>` 컴포넌트 — Canvas 기반 실시간 프리뷰
- [x] Canvas 렌더러 (배경, 텍스트, FittedBox, 패딩 적용)
- [x] 체커보드 패턴 (투명 배경 표시)
- [x] 종횡비 유지 + 크기 배지 표시 (W x H)
- [x] `document.fonts.ready` 대기 후 렌더링

### Step 1-3. 텍스트 컨트롤 패널 ✅
- [x] 모드 선택 Chip UI (4가지, Text Only만 활성)
- [x] 텍스트 입력 필드 (1~3줄 전환 + 각 줄 별도 입력)
- [x] 폰트 드롭다운 (39종, 각 폰트명을 해당 폰트로 렌더링)
- [x] Google Fonts CSS 동적 로드 (`<link>` 삽입)
- [x] 폰트 Weight 선택 (폰트별 지원 weight만 표시)
- [x] 텍스트 색상 컬러 피커 (react-colorful)
- [x] 텍스트 패딩 슬라이더 (0~90%, 1% 단위) ← 5%에서 1%로 변경

### Step 1-4. 배경 컨트롤 패널 ✅
- [x] 배경 형태 선택 (사각형 / 원형)
- [x] 배경색 컬러 피커
- [x] 퀵 프리셋 컬러 6종 (흰/검/빨/파/노/초)
- [x] 투명 배경 토글
- [x] 캔버스 패딩 슬라이더 (0~90%, 1% 단위) ← 5%에서 1%로 변경
- [x] 테두리 둥글기 슬라이더 (0~100px, 사각형일 때만)
- [x] Canvas 렌더러에 배경 모양 반영 (rect + borderRadius / circle 클리핑)

### Step 1-5. 텍스트 스타일 + 효과 ✅
- [x] 글자 간격 (letter-spacing) 슬라이더
- [x] 줄 간격 (line-height) 슬라이더
- [x] 멀티라인 Canvas 렌더링 (수동 줄 분리 + 개별 fillText)
- [x] 텍스트 그림자 (Shadow) — ON/OFF, 색상, offsetX/Y, blur
- [x] 텍스트 외곽선 (Stroke) — ON/OFF, 색상, 두께
- [x] Canvas 렌더러에 shadow/stroke 반영

### Step 1-6. 크기 프리셋 + 내보내기 ✅
- [x] 크기 프리셋 UI (일반 11종 드롭다운 + Custom)
- [x] Custom 크기 직접 입력 (W x H)
- [x] PNG 내보내기 (`canvas.toBlob('image/png')`)
- [x] JPG 내보내기 (`canvas.toBlob('image/jpeg', 0.95)`)
- [x] 스케일 배율 선택 (1x/2x/3x/4x)
- [x] 파일명 규칙: `logo_WxH[@scale].ext`
- [x] 내보내기 버튼 (컨트롤 패널 하단 배치)

### Step 1-7. Undo/Redo + 다크모드 ✅
- [x] zundo temporal Undo/Redo 연결
- [x] 키보드 단축키: Ctrl+Z (Undo), Ctrl+Shift+Z / Ctrl+Y (Redo)
- [x] 히스토리 debounce (300ms handleSet throttle — 슬라이더/텍스트 모두 적용)
- [x] 리셋 버튼 UI (컨트롤 패널 상단 RotateCcw 아이콘)
- [x] 다크모드 (shadcn/ui 테마 토큰 사용으로 기본 대응)

### Phase 1 추가 구현 (로드맵 외)
- [x] FittedBox 단일 줄에서 lineHeight 무시 → 텍스트가 캔버스 폭을 꽉 채움
- [x] textPadding 기본값 10% → 0%로 변경
- [x] Italic / Uppercase / Underline 토글 UI (Phase 2 항목을 앞당김)
- [x] Ctrl+Y Redo 대체 키바인딩
- [x] Input 필드에서 키보드 단축키 무시
- [x] Export에서 SVG/ICO 비활성 표시 (Phase 2 안내)
- [x] temporal equality 커스텀 비교 (exportFormat/Scale 변경 시 히스토리 제외)
- [x] Export output 사이즈(W*scale x H*scale) 표시
- [x] i18n hydration mismatch 수정 시도 (아직 불완전, 아래 이슈 참조)

---

## Phase 1 알려진 이슈 — 모두 해결 ✅

### Critical (3/3 해결)
| # | 이슈 | 해결 |
|---|------|------|
| C1 | 내보내기 흐림 + 체커보드 포함 | ✅ offscreen Canvas + `renderLogo()` 공용 함수로 별도 렌더링 |
| C2 | JPG 투명배경 검은색 | ✅ `jpgBackground` 옵션 → 흰색 배경 fallback |
| C3 | 전체 스토어 구독 리렌더 | ✅ 모든 패널에 `useLogoStore(selector)` 적용 |

### Medium (6/6 해결)
| # | 이슈 | 해결 |
|---|------|------|
| M1 | 폰트 로딩 레이스 컨디션 | ✅ `document.fonts.load(fontSpec)` 명시적 로드 후 렌더링 |
| M2 | underline 미구현 | ✅ `renderLogo`에서 수동 밑줄 그리기 |
| M3 | fitText uppercase 미반영 | ✅ `displayLines = uppercase ? toUpperCase()` 측정 시 적용 |
| M4 | 멀티라인 Y좌표 불일치 | ✅ `lineStep` 통일, totalHeight와 개별 Y 계산 일치 |
| M5 | i18n hydration 불완전 | ✅ `useEffect` + `detectAndApplyLanguage()` 패턴 |
| M6 | JSON.stringify equality | ✅ 제거, `handleSet` 300ms debounce로 대체 |

### Low (3/3 해결)
| # | 이슈 | 해결 |
|---|------|------|
| L1 | revokeObjectURL 즉시 호출 | ✅ `setTimeout(3000)` 지연 |
| L2 | shadow 문자별 중복 | ✅ shadow 한번 적용 후 개별 문자는 shadow 없이 |
| L3 | padding 초과 시 피드백 없음 | ✅ "Too much padding" 텍스트 표시 |

### Dead Code (Phase 2용으로 미리 정의, 당장 문제 없음)
- `src/data/fonts.ts` → `buildGoogleFontUrl()` 미사용
- `src/data/presets.ts` → `GRADIENT_PRESETS`, `DEVICE_GROUPS` 미사용
- `src/types/logo.ts` → `ColorPreset` 미사용

---

## Phase 2: 이미지/SVG 모드 + 그라디언트

목표: **4가지 모드 전부 동작** + 그라디언트 배경 + SVG 내보내기

### Step 2-0. Phase 1 이슈 수정 ✅ (Phase 1에서 모두 해결)
- [x] C1+C2+체커보드: offscreen Canvas 별도 렌더링
- [x] C3: `useLogoStore(selector)` 패턴 적용
- [x] M1: `FontFaceSet.load()` 후 렌더링
- [x] M3: `fitText`에서 uppercase 반영
- [x] M4: 멀티라인 Y좌표 계산 통일
- [x] M5: i18n `useEffect` 패턴
- [x] 리셋 버튼 UI
- [x] 히스토리 debounce

### Step 2-1. Image Only 모드 ✅
- [x] 이미지 업로드 UI (파일 피커 + 드래그 앤 드롭)
- [x] 이미지 썸네일 미리보기 / 교체 / 제거
- [x] Canvas에 이미지 렌더링 (Contain/Cover/Fill)
- [x] 배경 + 패딩 + 클리핑 적용

### Step 2-2. Text + Image 모드 ✅
- [x] 이미지 위치 선택 (Top/Bottom/Left/Right)
- [x] 이미지:텍스트 비율 슬라이더 (10~90%)
- [x] 간격(Gap) 슬라이더 (0~50px)
- [x] Fit 모드 선택 (Contain/Cover/Fill)
- [x] Canvas 렌더러에 텍스트+이미지 복합 레이아웃 구현

### Step 2-3. SVG Only 모드 ✅
- [x] SVG 파일 업로드 (파일 피커 + 드래그 앤 드롭)
- [x] SVG 파싱 + Canvas에 렌더링
- [x] SVG 래핑 내보내기 (배경 + 패딩 + 클리핑 → 새 SVG)

### Step 2-4. 그라디언트 배경 ✅
- [x] 그라디언트 ON/OFF 토글
- [x] Linear 그라디언트 (8방향 프리셋 버튼)
- [x] Radial 그라디언트 (기본)
- [x] 멀티 컬러 스톱 (2~3색) — 각 스톱 색상 + 위치% 슬라이더
- [x] 그라디언트 미리보기 바 (드래그 스톱은 Slider로 대체)
- [x] 프리셋 그라디언트 10종 (Sunset, Ocean 등)
- [x] Canvas 렌더러에 `createLinearGradient()` / `createRadialGradient()` 반영

### Step 2-5. 서브텍스트 + 텍스트 스타일 확장 ✅
- [x] 서브텍스트(슬로건) 입력 + 독립 설정 (폰트/weight/색상)
- [x] 서브텍스트 위치 (above/below)
- [x] 텍스트 회전 (0~360° 슬라이더)
- [x] Canvas에 underline 수동 렌더링
- [x] Canvas 렌더러에 서브텍스트 + 회전 반영

### Step 2-6. SVG 내보내기 + 디바이스 프리셋 ✅
- [x] SVG 내보내기: `<svg>` + `<text>` + 도형 직접 생성
- [x] SVG 폰트 임베딩 (Google Fonts `@import` URL)
- [x] SVG 그라디언트 (`<linearGradient>`, `<radialGradient>`)
- [x] SVG 클리핑 패스 (원형, 둥근 사각형)
- [x] 디바이스별 크기 프리셋 UI (Android/iOS/Web/macOS/Windows 아코디언)

### Phase 2 추가 구현 (로드맵 외)
- [x] Resizable divider (프리뷰/패널 드래그 크기 조절, 20%~80%)
- [x] 에디터 페이지 footer 숨김 (풀스크린 에디터)
- [x] 커스텀 scrollbar 디자인 (6px, 테마 색상)
- [x] 캔버스 반응형 (모바일 vertical resize 대응)
- [x] SVG 프리뷰 보안 (dangerouslySetInnerHTML → img + blob URL)
- [x] SVG export 폰트 크기 정확도 (offscreen canvas measureText)
- [x] SVG export XML 이스케이프 (&amp; 수정)
- [x] imageOnly 모드에서도 Fit 옵션 표시

**산출물:** Phase 2 완성. 4가지 모드 + 그라디언트 + SVG 내보내기 + 디바이스 프리셋

---

## Phase 2 알려진 이슈 — 모두 해결 ✅

### Critical (1/1 해결)
| # | 이슈 | 해결 |
|---|------|------|
| C1 | SVG export XSS | ✅ `sanitize-svg.ts` — 업로드 시 script/event handler/foreignObject 제거 |

### Medium (5/5 해결)
| # | 이슈 | 해결 |
|---|------|------|
| M1 | SVG export 이미지 누락 | ✅ imageOnly/textImage에서 base64 `<image>` 임베딩 |
| M2 | subText SVG 폰트 크기 불일치 | ✅ SVG export에서 subText 활성 시 mainAreaH 축소 반영 |
| M3 | Blob URL 메모리 누수 | ✅ `useEffect` + cleanup `revokeObjectURL` |
| M4 | 이미지 로딩 race condition | ✅ cancelled 플래그로 stale 이미지 방지 |
| M5 | Font load stale closure | ✅ cancelled 플래그로 promise 해제 후 렌더 방지 |

### Low (2/2 해결)
| # | 이슈 | 해결 |
|---|------|------|
| L1 | getTextLines 중복 | ✅ `render-logo.ts` → `text-utils.ts` import로 통합 |
| L2 | resize 시 divider 리셋 | ✅ 데스크톱↔모바일 전환 시에만 비율 리셋 |

---

## Phase 3: 일괄 내보내기 + 클립보드

목표: **일괄 내보내기 + 클립보드 복사**로 실무 생산성 마무리

### Step 3-0. Phase 2 이슈 수정 ✅ (Phase 2에서 모두 해결)
- [x] C1: SVG sanitize (`sanitize-svg.ts`)
- [x] M1: SVG export 이미지 base64 임베딩
- [x] M2: SVG export subText 영역 반영
- [x] M3: Blob URL useEffect cleanup
- [x] M4: 이미지 로딩 cancelled 플래그
- [x] M5: Font load 취소 플래그
- [x] L1: getTextLines 통합
- [x] L2: resize 전환 시에만 비율 리셋

### Step 3-1. 컬러 프리셋 ✅
- [x] 컬러 프리셋 저장 UI (이름 지정, 반원 미리보기)
- [x] 프리셋 목록 표시 / 적용 / 이름 변경 / 삭제
- [x] localStorage 영구 저장 (최대 50개, try/catch, ID 기반)

### Step 3-2. 그룹 일괄 내보내기 ✅
- [x] jszip 설치
- [x] 디바이스 그룹 선택 UI (체크박스)
- [x] 선택 그룹의 모든 크기로 일괄 렌더링
- [x] ZIP 파일로 묶어서 다운로드
- [x] 진행률 표시 + 완료 시 성공 개수 표시

### Step 3-3. 클립보드 복사 ✅
- [x] 클립보드 복사 (`navigator.clipboard.write()`)
- [x] PNG Blob → ClipboardItem 변환
- [x] 복사 완료 피드백 (체크 아이콘 2초 표시)

**산출물:** Phase 3 완성. 일괄 내보내기 + 클립보드 복사

---

## Phase 4: Supabase 연동 — 서버 저장

목표: **로그인 + 인증 기반 기능** (저장/불러오기는 무료 티어 용량 고려하여 보류)

> **테이블 네이밍:** 멀티앱 공유 Supabase이므로 `logo_` prefix 사용
> (다른 서비스: `qr_`, `scene_` 등 직관적 prefix)

### Step 4-1. Supabase 프로젝트 세팅 ✅ (회원가입 제외)
- [x] 환경변수 설정 (`.env.local` — URL, Anon Key)
- [x] `@supabase/ssr` 설치 + `supabase.ts` 리팩터 (`createBrowserClient` / `createServerClient`)
- [x] Next.js middleware 추가 (세션 갱신)
- [x] `auth-context.tsx` → Google OAuth 전환 (`signInWithOAuth({ provider: 'google' })`)
- [x] `/app/auth/callback/route.ts` OAuth 콜백 라우트
- [x] 로그인 페이지 Google OAuth 버튼으로 교체
- [x] 회원가입 페이지 (`@just-apps/auth` 패키지 — LoginView, TermsAgreementView, AuthCallbackView, MyPageView, AccountDeleteView, UserMenu)

### Step 4-2. 프로젝트 저장 스키마 ✅
- [x] `logo_projects` 테이블 마이그레이션:
  ```
  id          uuid PK (gen_random_uuid)
  user_id     uuid FK → auth.users (CASCADE)
  name        text (default 'Untitled')
  config      jsonb (LogoState — imageDataUrl/svgContent 제외, 설정값만 ~1-2KB)
  created_at  timestamptz
  updated_at  timestamptz (auto-trigger)
  ```
- [x] `logo_color_presets` 테이블 마이그레이션:
  ```
  id          uuid PK (gen_random_uuid)
  user_id     uuid FK → auth.users (CASCADE)
  name        text
  colors      jsonb
  sort_order  integer
  created_at  timestamptz
  ```
- [x] RLS 정책 — 본인 데이터만 CRUD (`auth.uid() = user_id`, UPDATE WITH CHECK 포함)
- [x] 썸네일/이미지 저장 안 함 — config로 캔버스 렌더링

### Step 4-3 ~ 4-4. 옵션 저장/불러오기 + 컬러 프리셋 서버 마이그레이션 ⏸️ 보류
> **사유:** Supabase 무료 티어, 멀티앱 공유 DB — 용량/요청 부담 고려하여 후순위로 이동
> **테이블은 이미 생성됨** (`logo_projects`, `logo_color_presets`) — 필요 시 바로 구현 가능

**산출물:** Phase 4 완성. Google 로그인 + 회원가입 (저장 기능은 보류)

---

## Phase 5: 스토어 에셋 생성 — 앱 배포용 그래픽

목표: **안드로이드/iOS 스토어 배포에 필요한 그래픽 에셋**을 템플릿 기반으로 생성

### Step 5-1. 에셋 타입 정의 + 템플릿 시스템 ✅
- [x] 스토어 에셋 타입 정의 (Feature Graphic, 스크린샷 프레임, 프로모 배너 등) — `src/types/asset.ts`
- [x] 에셋 크기 규격 정리 (12종) — `src/data/asset-specs.ts`:
  - Google Play Feature Graphic: 1024×500
  - Google Play 스크린샷: 폰 (1080×1920), 태블릿 7" (1200×1920), 태블릿 10" (1600×2560)
  - Google Play TV 배너: 1280×720
  - Apple App Store 스크린샷: iPhone 6.7" (1290×2796), 6.5" (1284×2778), 5.5" (1242×2208), iPad 12.9" (2048×2732)
  - General: Wide 1920×1080, Square 1080×1080
- [x] 템플릿 데이터 구조 (배경 + 텍스트 영역 + 이미지 슬롯 + 레이아웃) — `src/data/asset-templates.ts` (마케팅 3종 + 스크린샷 3종)
- [x] 에셋 에디터 라우트 (`/editor/asset`) — `app/editor/asset/page.tsx`
- [x] Canvas 공통 유틸 추출 (`src/lib/canvas-utils.ts`) + 에셋 렌더링 엔진 (`src/lib/render-asset.ts`)
- [x] Zustand 스토어 (`src/store/asset-store.ts`) + 에디터 뷰/컴포넌트

### Step 5-2. 에셋 에디터 UI ✅
- [x] 에셋 타입 선택 (플랫폼별 카테고리) — `spec-selector-panel.tsx`
- [x] 템플릿 선택 UI (CSS 기반 미리보기 카드 + 텍스트/이미지 위치 표시) — `template-selector-panel.tsx`
- [x] 기존 로고 에디터 Canvas 엔진 재사용 — `canvas-utils.ts` 공유 + 폰트 로딩 추가
- [x] 텍스트 영역 편집 (textarea + 블록별 폰트/weight/색상 오버라이드) — `text-blocks-panel.tsx`
- [x] 스크린샷/이미지 삽입 슬롯 (드래그앤드롭 업로드 + 썸네일 + 제거) — `image-slots-panel.tsx`
- [x] 배경 컨트롤 (배경색 + 그라디언트 + 프리셋) — `asset-background-panel.tsx`
- [x] 단일 에셋 내보내기 (PNG/JPG 다운로드 + 클립보드 복사) — `asset-export-panel.tsx`
- [x] 컨트롤 패널 리팩터 (모놀리식 → 6개 패널 합성 구조) — `asset-control-panel.tsx`

> **Step 5-3으로 연기:**
> - 디바이스 프레임 오버레이 (폰/태블릿 목업) — SVG 에셋 제작 + 프레임 렌더링 + 색상 커스터마이징은 Step 5-3 스코프

### Step 5-2.5. 에디터 모드 전환 네비게이션 ✅
- [x] 헤더에 Logo / Asset 에디터 전환 탭 (에디터 라우트에서만 표시, pathname 기반 활성) — `header.tsx`
- [x] 홈페이지 CTA 분리 ("로고 만들기" / "스토어 에셋 만들기" 2개 버튼) — `home.tsx` + i18n

### Step 5-3. 스크린샷 프레임 + 디바이스 목업 ✅
- [x] 디바이스 프레임 SVG 에셋 5종 (iPhone 15 Pro, iPhone SE, Pixel 8, Galaxy S24, iPad Pro) — `public/device-frames/`
- [x] 프레임 데이터 정의 (viewBox, 스크린 좌표, 호환 타입) — `src/data/device-frames.ts`
- [x] 스크린샷 삽입 → 디바이스 프레임 안에 합성 (`drawDeviceMockup` in `render-asset.ts`)
- [x] 프레임 SVG 로딩 + currentColor 틴팅 훅 — `src/hooks/use-device-frame-images.ts`
- [x] 프레임 선택 + 색상 커스터마이징 UI — `device-frame-panel.tsx` (5색 프리셋 + 커스텀 피커)
- [x] 스크린샷 템플릿에 기본 프레임 (`frame-iphone-15`) 설정
- [x] 내보내기 시 프레임 포함 렌더링

### Step 5-4. 일괄 에셋 내보내기 → Phase 7로 이동
> **사유:** 현재 1장씩 편집/내보내기로 충분히 실용적. 멀티 슬롯 관리 + 일괄 ZIP + Supabase 저장은 DB 연동과 함께 Phase 7에서 진행.

**산출물:** Phase 5 완성 (Step 5-1 ~ 5-3 + 5-2.5). 스토어 배포용 그래픽 에셋 생성기 (단일 에셋 편집/내보내기)

---

## Phase 6: 후순위 개선

### Step 6-1. ICO 내보내기
- [ ] ICO 내보내기 (Canvas → 16x16/32x32/48x48 멀티사이즈)

### Step 6-2. Radial 그라디언트 고급
- [ ] Radial 그라디언트 중심점 X/Y 2D 드래그 UI
- [ ] 반경/초점 슬라이더

### Step 6-3. 접근성
- [ ] 슬라이더 ARIA (`aria-label`, `aria-valuemin/max/now`)
- [ ] 키보드 내비게이션 전체 점검
- [ ] 스크린 리더 `aria-live` 영역
- [ ] 색상 대비 WCAG AA 검증

---

## Phase 7: Supabase 저장 + 에셋 프로젝트 워크플로우

목표: **로고/에셋 설정을 서버에 저장** + 에셋 프로젝트 단위 작업 (공통 설정 공유 + 스크린샷만 교체)

> DB 사용하는 기능은 모두 이 Phase에서 진행 (보류된 Step 4-3, 4-4 포함)
>
> **에셋 프로젝트 컨셉:** 하나의 앱 출시용 에셋을 "프로젝트"로 관리.
> 앱 이름, 태그라인, 배경 스타일, 디바이스 프레임 등 공통 설정은 프로젝트 레벨에서 공유하고,
> 스크린샷 이미지와 장별 캡션만 개별 관리. 1장씩 따로 만드는 게 아니라 하나의 작업 흐름.

### Step 7-1. 로고 프로젝트 저장/불러오기 (보류된 Step 4-3)
- [ ] 로고 설정 → Supabase `logo_projects` 저장 (config jsonb)
- [ ] 프로젝트 목록 UI + 불러오기
- [ ] 프로젝트 이름 변경 / 삭제

### Step 7-2. 컬러 프리셋 서버 마이그레이션 (보류된 Step 4-4)
- [ ] localStorage → Supabase `logo_color_presets` 마이그레이션
- [ ] 서버 동기화 (로그인 시 병합)

### Step 7-3. 에셋 프로젝트 워크플로우
- [ ] 에셋 프로젝트 데이터 모델 (공통 설정 + 장별 스크린샷/캡션 배열)
- [ ] 프로젝트 레벨 공통 설정: 앱 이름, 태그라인, 배경, 프레임 스타일 → 전체 장에 적용
- [ ] 장별 개별 설정: 스크린샷 이미지 + 캡션 텍스트만 다름
- [ ] 멀티 스크린샷 탭 UI (Screenshot 1, 2, 3... 탭 전환)
- [ ] Supabase에 프로젝트 저장/불러오기

### Step 7-4. 에셋 일괄 내보내기
- [ ] 프로젝트 내 전체 장 일괄 렌더링 → ZIP 다운로드
- [ ] 폴더 구조: `android/`, `ios/` 분리
- [ ] 플랫폼별 필수 에셋 체크리스트 UI

**산출물:** Phase 7 완성. 서버 저장 + 에셋 프로젝트 단위 작업 + 일괄 내보내기

---

## 일정 추정 (작업 단위)

| 단계 | 스텝 수 | 핵심 난이도 |
|------|---------|------------|
| **Phase 1** (MVP) ✅ | 7 스텝 | Canvas 렌더러, FittedBox, 폰트 로딩 |
| **Phase 2** (모드 확장) ✅ | 7 스텝 | 내보내기 리팩터, Text+Image 레이아웃, SVG 직접 생성 |
| **Phase 3** (일괄+클립보드) ✅ | 3 스텝 | ZIP 생성, Clipboard API |
| **Phase 4** (Supabase) ✅ | 2 스텝 완료, 2 보류 | DB 스키마, RLS, 인증 (저장 기능 보류) |
| **Phase 5** (스토어 에셋) ✅ | 4 스텝 | 템플릿 시스템, 디바이스 목업, 멀티 텍스트 블록 |
| **Phase 6** (후순위) | 4+ 스텝 | URL 인코딩, ICO 생성, 접근성 |
| **Phase 7** (DB 저장) | 4 스텝 | Supabase 저장/불러오기, 멀티 슬롯, 일괄 내보내기 |

### 의존성 그래프

```
Phase 1 ✅
  └→ Phase 2 ✅
       └→ Phase 3 ✅
            └→ Phase 4 (Supabase 연동) ✅ Step 4-1, 4-2 완료
                 ├→ Phase 5 (스토어 에셋) ✅ Step 5-1 ~ 5-3 + 5-2.5 완료
                 ├→ Phase 6 (후순위) — 독립적, 언제든 가능
                 └→ Phase 7 (DB 저장) — Phase 4 + 5 기반, 보류된 4-3/4-4 + 일괄 내보내기
```

### 핵심 리스크

| 리스크 | 영향 | 대응 |
|--------|------|------|
| Canvas 멀티라인 + letter-spacing 크로스브라우저 | Step 1-5 | Safari fallback 문자별 렌더링 ✅ 구현됨 |
| FittedBox 텍스트 크기 계산 정확도 | Step 1-2 | `measureText()` + 이진 탐색 ✅ 구현됨, uppercase 반영 완료 |
| Google Fonts 39종 초기 로딩 시간 | Step 1-3 | 전체 한 번에 로드 방식 사용 중, lazy load 개선 가능 |
| SVG 내보내기 폰트 임베딩 | Step 2-6 | `@import` URL 방식 우선, Base64 임베딩은 후순위 |
| Supabase 무료 티어 용량 (멀티앱 공유 DB) | Step 4-3/4-4 | 저장 기능 보류, 필요 시 localStorage 우선 |
| 디바이스 목업 SVG 라이선스 | Step 5-3 | 자체 제작 또는 MIT 라이선스 에셋 사용 |
| 스토어 에셋 규격 변경 | Step 5-1 | Google/Apple 공식 문서 기준, 업데이트 대응 필요 |
| ICO 멀티사이즈 생성 | Step 6-2 | ico-canvas 같은 경량 라이브러리 또는 직접 바이너리 생성 |
| Canvas 큰 배율(4x) 메모리 | Step 1-6 | 4096x4096 이상 시 경고 필요 (미구현) |
