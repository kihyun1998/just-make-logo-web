# Just Make Logo - 구현 로드맵

> 기준 문서: `docs/SPEC_TEXT_LOGO.md`
> 현재 상태: **Phase 1~5 완료, Phase 6 후순위, Phase 7 (결제) 진행 예정**

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
- [x] ICO 바이너리 생성 (Canvas → 멀티사이즈 ICO)
  - 포함 사이즈: 16x16, 32x32, 48x48, 256x256
  - 모든 사이즈 PNG 청크 (모던 OS/브라우저 호환, 파일 크기 최적)
  - 구현: 직접 바이너리 생성 (외부 라이브러리 불필요, ICO 포맷 단순)
- [x] `ExportFormat` 타입에 `'ico'` 추가
- [x] 로고 에디터 내보내기 패널에 ICO 포맷 옵션 추가
- [x] 에셋 에디터 내보내기 패널에 ICO 포맷 옵션 추가
- [x] 배치 내보내기(ZIP)에 ICO 포함 지원

### Step 6-2. Radial 그라디언트 고급
- [x] `gradientCenterX/Y`, `gradientRadius` 상태 필드 초기화 (기본값: 0.5)
- [x] 중심점 X/Y 2D 드래그 UI (미니 캔버스 오버레이, Radial 선택 시에만 표시)
- [x] 반경 슬라이더 (0.1~1.5, 기본값 0.5)
- [x] `canvas-utils.ts` `buildCanvasGradient` — 중심점/반경 파라미터 적용
- [x] `export-svg.ts` — `<radialGradient>` cx/cy/r 동적 적용
- [x] 에셋 에디터 gradient 패널에도 동일 UI 적용
- [x] CSS 미리보기 (`buildCssGradient`)에 중심점/반경 반영

### Step 6-3. 접근성
- [ ] 슬라이더 ARIA (`aria-label`, `aria-valuemin/max/now`)
- [ ] 키보드 내비게이션 전체 점검
- [ ] 스크린 리더 `aria-live` 영역
- [ ] 색상 대비 WCAG AA 검증

---

## Phase 7: 결제 + 라이선싱

목표: **Free / Pro 요금제 도입**, Just Apps 통합 구독, 멀티앱 entitlement 시스템, 결제 연동

> **순서 변경 사유:** 저장/불러오기(이미지 Storage 포함)는 유료 기능으로 제공 예정.
> 결제 인프라를 먼저 깔아야 저장 기능 구현 시 라이선스 체크를 바로 넣을 수 있음.
>
> **아키텍처:** 구독(subscription) + 권한(entitlement) 분리 패턴.
> 각 앱은 entitlement만 체크 — 구독 종류(결제/관리자/프로모/체험)를 몰라도 됨.
>
> **결제:** Lemon Squeezy (MoR — 사업자등록 불필요)
>
> **상품 전략: Just Apps 통합 구독**
> - 앱별 개별 구독 없이 **Just Apps Pro 하나로 모든 앱의 Pro 기능 해금**
> - 각 앱(Logo, QR 등)의 기본 기능은 무료, 구독하면 서버 저장/프리셋 동기화 등 Pro 기능 사용 가능
> - Product 1개 (Just Apps Pro) + Variant 2개 (월간/연간)
> - 향후 상위 티어(`just_apps_ult`) 추가 가능 — `PLAN_ENTITLEMENTS` 상수 한 줄 추가로 확장, DB 스키마 변경 불필요
> - 앱이 추가될수록 구독 가치가 자연히 올라감 — 사용자 입장에서 "구독하면 다 쓸 수 있다"가 직관적
>
> **보안 원칙:**
> - 구독/권한 테이블은 **서버(service_role)만 쓰기** — 클라이언트는 읽기만 허용
> - `supabase-admin.ts`에 `import 'server-only'` 필수 — 클라이언트 번들 포함 시 빌드 에러 (사전에 `npm install server-only` 필요)
> - Webhook은 반드시 **HMAC 서명 검증** 후 처리 (raw body를 `arrayBuffer()`로 읽어야 함 — Next.js App Router body parsing 주의)
> - **Checkout URL은 서버 사이드 API Route(`/api/checkout`)에서 생성** — `custom_data.user_id`를 서버에서 인증된 세션으로 주입. 클라이언트에서 직접 `custom_data` 설정하면 user_id 위조 가능
> - `hasAccess(userId, appId)`의 `userId`는 반드시 서버 세션에서 추출 — 외부 입력(query param 등)에서 받으면 IDOR 취약점
> - `middleware.ts` matcher에 `/api/webhooks` 경로 제외 필수 — Webhook은 Lemon Squeezy 서버에서 쿠키 없이 호출하므로 인증 가드에 걸리면 안 됨
> - SVG 내보내기는 클라이언트 사이드이므로 완벽한 서버 게이팅 불가 → UX 레벨 게이팅 + 서버 측 저장/다운로드 제한으로 타협
> - 클라이언트 권한 체크(`useEntitlement`)는 **UX용**, 실제 보안은 서버 측 `hasAccess()`에서 담당

### Step 7-1. 구독 + 권한 DB 스키마
- [ ] `just_subscriptions` 테이블:
  ```
  id                          uuid PK (gen_random_uuid)
  user_id                     uuid FK → auth.users
  plan_id                     text NOT NULL   -- 'just_apps_pro', 향후 'just_apps_ult' 등
  status                      text NOT NULL   -- CHECK ('active','past_due','canceled','expired','paused','trialing')
  provider                    text NOT NULL   -- 'lemonsqueezy', 'manual'
  provider_subscription_id    text            -- Lemon Squeezy subscription ID
  provider_customer_id        text            -- Lemon Squeezy customer ID (Customer Portal URL 생성에 필요)
  canceled_at                 timestamptz     -- 취소 시점 (취소했지만 current_period_end까지 유효)
  trial_ends_at               timestamptz
  current_period_end          timestamptz
  created_at                  timestamptz
  updated_at                  timestamptz (auto-trigger)

  UNIQUE(provider, provider_subscription_id)  -- 중복 삽입 방지
  INDEX idx_subscriptions_user_id (user_id)   -- 조회 성능
  INDEX idx_subscriptions_provider_sub (provider_subscription_id)  -- webhook 조회
  ```
- [ ] `just_entitlements` 테이블:
  ```
  id                uuid PK (gen_random_uuid)
  user_id           uuid FK → auth.users
  app_id            text NOT NULL   -- 'logo', 'qr', 'scene' 등
  source            text NOT NULL   -- CHECK ('subscription', 'admin', 'promo', 'trial')
  subscription_id   uuid FK → just_subscriptions (nullable — admin/promo는 null)
  expires_at        timestamptz (nullable — null이면 영구)
  created_at        timestamptz

  INDEX idx_entitlements_user_app (user_id, app_id)  -- hasAccess() 조회 성능
  ```
- [ ] **RLS 정책** (보안 핵심):
  - `just_subscriptions`: **SELECT만** `auth.uid() = user_id` 허용, INSERT/UPDATE/DELETE는 RLS로 차단 (service_role key로만 조작)
  - `just_entitlements`: **SELECT만** `auth.uid() = user_id` 허용, INSERT/UPDATE/DELETE는 RLS로 차단
- [ ] **`supabase-admin.ts`** 생성 — service_role key 사용하는 서버 전용 admin 클라이언트 (webhook/서버 로직에서 RLS 우회하여 구독/권한 테이블 조작)
- [ ] 활성 entitlement 조회용 뷰 또는 함수:
  ```sql
  -- 만료된 entitlement 자동 필터
  WHERE expires_at IS NULL OR expires_at > now()
  ```
- [ ] 플랜 → 앱 매핑은 코드 상수로 관리 (DB 테이블 불필요):
  ```ts
  const PLAN_ENTITLEMENTS = {
    just_apps_pro: ['logo', 'qr', 'scene'],  // 통합 구독 — 모든 앱 Pro 기능
    // just_apps_ult: ['logo', 'qr', 'scene', ...],  // 향후 상위 티어
  }
  ```

### Step 7-1.5. Lemon Squeezy 사전 준비 (외부 작업)
- [ ] **Lemon Squeezy 계정 생성** — [lemonsqueezy.com](https://lemonsqueezy.com) 가입 + 본인 인증
- [ ] **스토어 생성** — 스토어명: "Just Apps" (또는 원하는 이름), 통화: USD
- [ ] **상품 생성** — "Just Apps Pro" (통합 구독)
  - Variant 1: Monthly ($X.XX/월) — Subscription, 월간 반복 결제
  - Variant 2: Yearly ($X.XX/년) — Subscription, 연간 반복 결제 (월간 대비 할인)
  - 가격은 경쟁 서비스 참고하여 결정 (예: 월 $5~10, 연 $50~100)
  - 향후 상위 티어(Ultimate) 추가 시 별도 Product 생성
- [ ] **API Key 발급** — Settings → API → Create API Key (전체 권한)
- [ ] **Webhook 설정** — Settings → Webhooks → 엔드포인트 등록:
  - URL: `https://{도메인}/api/webhooks/lemon-squeezy`
  - Signing Secret 복사 (HMAC 검증에 사용)
  - 구독할 이벤트: `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_expired`, `subscription_paused`, `subscription_resumed`, `subscription_payment_failed`, `subscription_payment_recovered`, `order_refunded`
- [ ] **Store ID 확인** — Settings → General → Store ID
- [ ] **환경변수 설정** (`.env.local`):
  ```env
  # Lemon Squeezy
  LEMON_SQUEEZY_API_KEY=           # API Key (서버 전용, NEXT_PUBLIC_ 붙이지 않음)
  LEMON_SQUEEZY_WEBHOOK_SECRET=    # Webhook Signing Secret (서버 전용)
  LEMON_SQUEEZY_STORE_ID=          # Store ID
  LEMON_SQUEEZY_VARIANT_MONTHLY=   # Monthly variant ID (Checkout URL 생성에 사용)
  LEMON_SQUEEZY_VARIANT_YEARLY=    # Yearly variant ID
  ```
  > ⚠️ **보안**: `LEMON_SQUEEZY_*` 변수는 절대 `NEXT_PUBLIC_` prefix를 붙이지 않음.
  > API Key와 Webhook Secret이 클라이언트에 노출되면 결제 시스템 전체가 위험.
  > Checkout은 Variant ID만 필요하며, 이것도 서버에서 URL을 생성하여 클라이언트에 전달.
- [ ] **Test Mode 확인** — 개발 중에는 Test Mode로 진행 (대시보드 좌하단 토글)
  - Test Mode API Key / Webhook Secret / Store ID는 별도 발급됨
  - 프로덕션 배포 시 Live Mode 키로 교체

### Step 7-2. Lemon Squeezy 결제 연동
- [ ] **테스트 모드 환경 분리** — 환경변수 분기 (`LEMON_SQUEEZY_API_KEY`, `LEMON_SQUEEZY_WEBHOOK_SECRET`, `LEMON_SQUEEZY_STORE_ID`를 dev/prod 별도 관리)
- [ ] **Checkout 서버 사이드 생성** (`/api/checkout` API Route):
  1. 클라이언트 → 서버 API Route로 플랜 선택 요청
  2. 서버에서 `supabase.auth.getUser()`로 인증된 `user_id` 확인
  3. 서버에서 Lemon Squeezy API 호출 → `custom_data.user_id`에 인증된 ID 주입한 Checkout URL 생성
  4. 생성된 URL을 클라이언트에 반환 → Checkout Overlay로 열기
  - ⚠️ 클라이언트에서 직접 `custom_data`를 설정하면 user_id 위조 가능 — 반드시 서버에서 생성
- [ ] 구독 생성 / 취소 / 갱신 플로우 (향후 Pro→Ultimate 업그레이드 시 차액 결제)
- [ ] **Webhook 엔드포인트** (`app/api/webhooks/lemon-squeezy/route.ts`):
  - **HMAC-SHA256 서명 검증** — `X-Signature` 헤더 + raw body로 검증, 실패 시 403 반환
  - **Idempotency** — `provider_subscription_id` 기준 upsert, `updated_at` 타임스탬프 비교하여 오래된 이벤트 무시
  - **처리할 이벤트 전체 목록**:
    | 이벤트 | 처리 |
    |--------|------|
    | `subscription_created` | subscription + entitlements 생성 |
    | `subscription_updated` | period_end 갱신, entitlements expires_at 동기화 |
    | `subscription_cancelled` | status → 'canceled', canceled_at 기록 (current_period_end까지 유효) |
    | `subscription_expired` | status → 'expired', entitlements expires_at 즉시 만료 |
    | `subscription_paused` / `subscription_resumed` | status 업데이트, entitlement 일시정지/복구 |
    | `subscription_payment_failed` | status → 'past_due', 유저에게 결제 실패 알림 트리거 |
    | `subscription_payment_recovered` | status → 'active' 복구 |
    | `order_refunded` | entitlement 회수, subscription status 업데이트 |
  - **플랜 변경 시 원자적 entitlement 전환** — 향후 Pro→Ultimate 업그레이드 시, 트랜잭션으로 기존 entitlement 만료 + 새 entitlement 생성 (일시적 권한 공백 방지)
  - **에러 로깅/알림** — webhook 처리 실패 시 `just_webhook_logs` 테이블에 기록 + Slack/Discord 알림 (결제 webhook 실패는 매출 직결)
- [ ] **Checkout 완료 후 webhook 지연 대응**:
  - Checkout Overlay 완료 콜백에서 polling (3초 간격, 최대 30초)
  - polling 실패 시 Lemon Squeezy API 직접 조회 fallback
  - Optimistic UI — "결제 처리 중..." 표시 후 entitlement 확인되면 Pro 활성화
- [ ] Lemon Squeezy Customer Portal 링크 연동 — `provider_customer_id`로 동적 URL 생성

### Step 7-3. 권한 체크 + 기능 게이팅
- [ ] `hasAccess(userId, appId)` 서버 유틸 — entitlements 테이블 조회 (`supabase-admin.ts` 사용)
- [ ] `useEntitlement(appId)` 클라이언트 훅 — `useAuth`와 분리된 별도 훅 (관심사 분리: 인증은 `useAuth`, 권한은 `useEntitlement`)
- [ ] **Entitlement 캐싱** — 로그인 시 entitlement 정보를 한 번 가져와 클라이언트 스토어에 캐시, webhook으로 상태 변경 시 Supabase Realtime으로 실시간 갱신 (매 요청마다 DB 조회 방지)
- [ ] Pro 기능 게이트:
  - SVG 내보내기 — `ExportPanel`에서 SVG 포맷 선택 시 entitlement 체크, 미보유 시 업그레이드 모달 (클라이언트 레벨 게이팅)
  - 클라우드 저장 / 설정 저장·불러오기 — 서버 측 `hasAccess()` 검증 (Phase 8 연동)
- [ ] **업그레이드 유도 UI** — Pro 기능 접근 시 Pricing 모달 또는 페이지로 유도
- [ ] **무료체험(trial)**:
  - 시작 조건: 명시적 "무료 체험 시작" 버튼 클릭 (가입 즉시 자동 부여 아님)
  - 기간: 7일 entitlement 자동 부여 (source: 'trial')
  - **중복 방지**: `just_trial_history` 테이블 (user_id + email 기반) — 계정 삭제 후 재가입해도 trial 재사용 불가
  - **만료 알림**: trial 만료 2일 전 / 만료 시 이메일 알림 (Lemon Squeezy 빌트인 이메일 또는 별도 서비스)
- [ ] **결제 실패(past_due) 대응 UI**:
  - Grace period (3일) 동안 Pro 기능 유지 + 배너로 결제 수단 업데이트 유도
  - Grace period 만료 후 Free로 다운그레이드 + Customer Portal 링크 제공

### Step 7-4. 관리자 + 프로모션
- [ ] 관리자 판별: 기존 `user_agreements.role = 'admin'` 활용 — **반드시 서버 사이드에서 role 검증 후 수행** (클라이언트에서 role만 보고 관리자 API 호출 불가)
- [ ] 관리자 entitlement 수동 부여 (source: 'admin', expires_at: null — 영구)
- [ ] 프로모션 entitlement 부여 (source: 'promo', expires_at: 기간 지정)
- [ ] 초기에는 Supabase Dashboard에서 직접 관리, 추후 관리자 UI 구현

### Step 7-5. 구독 관리 UI
- [ ] 마이페이지(`MyPageView`)에 구독 현황 표시 (플랜, 다음 결제일, 상태, 취소 예정일)
  - 초기에는 앱 로컬 구현, 안정화 후 `@just-apps/auth` 패키지에 `SubscriptionView`로 추출
- [ ] 플랜 변경 (향후 Pro → Ultimate 업그레이드, 차액 결제)
- [ ] 구독 취소 플로우 (취소 사유 수집 + 확인 모달 + canceled_at 기록)
- [ ] Lemon Squeezy Customer Portal 연동 (결제 수단 변경, 영수증 조회)
- [ ] 결제 실패 시 재결제 유도 배너 / 결제 수단 업데이트 안내

### Step 7-6. 기존 유저 마이그레이션 + 테스트
- [ ] **기존 유저 정책**: 기존 가입자(`user_agreements` 기존 rows)에게 trial 자동 부여 (신규 유저와 동일하게 "무료 체험 시작" 버튼 제공)
- [ ] **`logo_projects` / `logo_color_presets` RLS 확장**: Phase 8에서 저장 기능 구현 시 entitlement 체크를 RLS에 추가할지, 앱 레벨에서만 할지 결정 → 이 시점에 함께 설계
- [ ] **Webhook 로컬 테스트 환경**: ngrok 또는 Lemon Squeezy webhook 테스트 도구로 로컬에서 webhook 수신 테스트
- [ ] **단위 테스트**: `hasAccess()`, entitlement 만료 로직, webhook 이벤트 핸들러별 테스트
- [ ] **E2E 테스트**: Lemon Squeezy Test Mode로 결제 플로우 전체 검증
- [ ] **`just_webhook_logs` 테이블**: webhook 수신/처리 이력 기록 (디버깅 + 모니터링)
  ```
  id            uuid PK
  event_name    text
  payload       jsonb
  status        text      -- 'processed', 'failed', 'skipped'
  error_message text
  created_at    timestamptz
  ```

**산출물:** Phase 7 완성. Just Apps 통합 구독 (Lemon Squeezy), 멀티앱 entitlement 시스템, HMAC 서명 검증, idempotent webhook 처리, 관리자/프로모/체험 지원, 결제 실패 대응, 구독 관리 UI, webhook 로깅/모니터링

---

## Phase 8: Supabase 저장/불러오기

목표: **로고/에셋 설정값을 서버에 저장/불러오기** (유료 사용자 전용)

> **설계 방침:**
> - 로고/에셋 모두 "설정값 스냅샷 저장/불러오기" 패턴 (프로젝트 개념 아님)
> - 이미지(업로드 이미지, SVG, 스크린샷)는 **Supabase Storage**에 업로드 → URL 참조
> - DB에는 설정값(config jsonb)만 저장 — 이미지 data URL 대신 Storage URL로 교체
> - 에셋은 나중에 스크린샷만 교체해서 다시 뽑는 용도로 재사용
> - 비로그인 사용자는 기존처럼 에디터만 사용 (저장 불가)

### Step 8-1. Supabase Storage 설정
- [ ] Storage 버킷 생성 (`logo-images`, `asset-images`)
- [ ] RLS 정책 (본인 폴더만 CRUD: `user_id/` prefix)
- [ ] 이미지 업로드 유틸 (data URL → Storage 업로드 → public URL 반환)
- [ ] 업로드 용량 제한 / 파일 타입 검증

### Step 8-2. 로고 설정 저장/불러오기 (보류된 Step 4-3)
- [ ] 저장: 현재 `LogoState` 스냅샷 → 이미지는 Storage 업로드 → config jsonb에 URL 참조로 저장
- [ ] 에디터 내 저장/불러오기 UI (저장 목록 + 이름 지정 + 불러오기 + 삭제)
- [ ] 불러오기: config 복원 → Storage URL에서 이미지 로드 → store에 반영
- [ ] 라이선스 체크 (`useProFeature`) 연동

### Step 8-3. 에셋 설정 저장/불러오기
- [ ] `asset_configs` 테이블 (id, user_id, name, config jsonb, created_at, updated_at)
- [ ] 저장: `AssetEditorState` 스냅샷 → 스크린샷/이미지는 Storage → config에 URL 참조
- [ ] 에셋 에디터 내 저장/불러오기 UI (로고와 동일 패턴)
- [ ] 불러오기 후 스크린샷만 교체 → 재내보내기 워크플로우
- [ ] 라이선스 체크 연동

### Step 8-4. 컬러 프리셋 서버 마이그레이션 (보류된 Step 4-4)
- [ ] localStorage → Supabase `logo_color_presets` 마이그레이션
- [ ] 서버 동기화 (로그인 시 병합)

**산출물:** Phase 8 완성. 유료 사용자 로고/에셋 설정 저장/불러오기 + 이미지 Storage + 컬러 프리셋 동기화

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
| **Phase 7** (결제/라이선싱) | 6 스텝 | Just Apps 통합 구독, entitlement 스키마, Lemon Squeezy, HMAC webhook, 권한 게이팅, trial 중복 방지 |
| **Phase 8** (저장/불러오기) | 4 스텝 | Storage 이미지 업로드, 설정값 저장/불러오기, 프리셋 동기화 |

### 의존성 그래프

```
Phase 1 ✅
  └→ Phase 2 ✅
       └→ Phase 3 ✅
            └→ Phase 4 (Supabase 연동) ✅ Step 4-1, 4-2 완료
                 ├→ Phase 5 (스토어 에셋) ✅ Step 5-1 ~ 5-3 + 5-2.5 완료
                 ├→ Phase 6 (후순위) — 독립적, 언제든 가능
                 └→ Phase 7 (결제/라이선싱) — Phase 4 기반, Just Apps 통합 구독
                      └→ Phase 8 (저장/불러오기) — Phase 7 기반, 유료 기능으로 게이팅 + Storage 이미지
```

### 핵심 리스크

| 리스크 | 영향 | 대응 |
|--------|------|------|
| Canvas 멀티라인 + letter-spacing 크로스브라우저 | Step 1-5 | Safari fallback 문자별 렌더링 ✅ 구현됨 |
| FittedBox 텍스트 크기 계산 정확도 | Step 1-2 | `measureText()` + 이진 탐색 ✅ 구현됨, uppercase 반영 완료 |
| Google Fonts 39종 초기 로딩 시간 | Step 1-3 | 전체 한 번에 로드 방식 사용 중, lazy load 개선 가능 |
| SVG 내보내기 폰트 임베딩 | Step 2-6 | `@import` URL 방식 우선, Base64 임베딩은 후순위 |
| Supabase Storage 용량/비용 (멀티앱 공유) | Step 8-1 | 이미지는 Storage, DB에는 config만 — DB 부담 최소화. Storage 용량 모니터링 필요 |
| 디바이스 목업 SVG 라이선스 | Step 5-3 | 자체 제작 또는 MIT 라이선스 에셋 사용 |
| 스토어 에셋 규격 변경 | Step 5-1 | Google/Apple 공식 문서 기준, 업데이트 대응 필요 |
| ICO 멀티사이즈 생성 | Step 6-2 | ico-canvas 같은 경량 라이브러리 또는 직접 바이너리 생성 |
| Canvas 큰 배율(4x) 메모리 | Step 1-6 | 4096x4096 이상 시 경고 필요 (미구현) |
| Webhook 순서/중복 처리 | Step 7-2 | idempotent upsert + updated_at 비교로 오래된 이벤트 무시 |
| Checkout 후 webhook 지연 | Step 7-2 | polling + Lemon Squeezy API 직접 조회 fallback |
| Trial 재사용 악용 (삭제→재가입) | Step 7-3 | just_trial_history 테이블로 email 기반 중복 방지 |
| 결제 실패 시 서비스 중단 | Step 7-3 | 3일 grace period + 재결제 유도 배너 |
| SVG 내보내기 서버 게이팅 불가 | Step 7-3 | 클라이언트 사이드이므로 UX 레벨 게이팅으로 타협, 서버 측 저장/다운로드만 실제 차단 |
