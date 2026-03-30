# Just Make Logo - 구현 로드맵

> 기준 문서: `docs/SPEC_TEXT_LOGO.md`
> 현재 상태: **Phase 2 완료, Phase 3 진행 중** (Step 3-1 컬러 프리셋 완료)

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

### Step 3-2. 그룹 일괄 내보내기
- [ ] jszip 설치
- [ ] 디바이스 그룹 선택 UI (체크박스)
- [ ] 선택 그룹의 모든 크기로 일괄 렌더링
- [ ] ZIP 파일로 묶어서 다운로드
- [ ] 진행률 표시 + 완료 시 성공 개수 표시

### Step 3-3. 클립보드 복사
- [ ] 클립보드 복사 (`navigator.clipboard.write()`)
- [ ] PNG Blob → ClipboardItem 변환
- [ ] 복사 완료 피드백 (토스트 또는 버튼 상태 변경)

**산출물:** Phase 3 완성. 일괄 내보내기 + 클립보드 복사

---

## Phase 4: Supabase 연동 — 서버 저장

목표: **로그인 + 프로젝트 서버 저장/불러오기**로 로컬 의존 제거

### Step 4-1. Supabase 프로젝트 세팅
- [ ] Supabase CLI 초기화 (`supabase init`)
- [ ] 환경변수 설정 (`.env.local` — URL, Anon Key)
- [ ] 기존 `src/lib/supabase.ts` + `auth-context.tsx` 연결 확인
- [ ] 로그인/회원가입 UI (Google OAuth 또는 Magic Link)

### Step 4-2. 프로젝트 저장 스키마
- [ ] `projects` 테이블 마이그레이션 (`id`, `user_id`, `name`, `config jsonb`, `thumbnail_url`, `created_at`, `updated_at`)
- [ ] RLS 정책 — 본인 프로젝트만 CRUD
- [ ] Supabase Storage 버킷 생성 (썸네일 저장용)

### Step 4-3. 저장/불러오기 기능
- [ ] 현재 에디터 상태 → 서버 저장 (config JSON + 썸네일 캡처)
- [ ] 내 프로젝트 목록 페이지 (썸네일 그리드)
- [ ] 프로젝트 불러오기 → 에디터 상태 복원
- [ ] 프로젝트 이름 변경 / 삭제
- [ ] 자동 저장 (debounce, 마지막 수정 후 5초)

### Step 4-4. 컬러 프리셋 서버 마이그레이션
- [ ] `color_presets` 테이블 또는 `user_settings` jsonb 컬럼
- [ ] 기존 localStorage 프리셋 → 서버 마이그레이션 (첫 로그인 시)
- [ ] 로그인 상태면 서버, 비로그인이면 localStorage fallback

**산출물:** Phase 4 완성. 로그인 + 프로젝트 서버 저장/관리

---

## Phase 5: 스토어 에셋 생성 — 앱 배포용 그래픽

목표: **안드로이드/iOS 스토어 배포에 필요한 그래픽 에셋**을 템플릿 기반으로 생성

### Step 5-1. 에셋 타입 정의 + 템플릿 시스템
- [ ] 스토어 에셋 타입 정의 (Feature Graphic, 스크린샷 프레임, 프로모 배너 등)
- [ ] 에셋 크기 규격 정리:
  - Google Play Feature Graphic: 1024×500
  - Google Play 스크린샷: 폰 (1080×1920), 태블릿 7" (1200×1920), 태블릿 10" (1600×2560)
  - Google Play TV 배너: 1280×720
  - Apple App Store 스크린샷: iPhone 6.7" (1290×2796), iPad 12.9" (2048×2732)
  - Apple App Store 프로모: 1024×1024
- [ ] 템플릿 데이터 구조 (배경 + 텍스트 영역 + 이미지 슬롯 + 레이아웃)
- [ ] 에셋 에디터 라우트 (`/editor/asset`)

### Step 5-2. 에셋 에디터 UI
- [ ] 에셋 타입 선택 (플랫폼별 카테고리)
- [ ] 템플릿 선택 UI (미리보기 카드)
- [ ] 기존 로고 에디터 Canvas 엔진 재사용
- [ ] 텍스트 영역 편집 (제목, 부제, 설명 등 멀티 텍스트 블록)
- [ ] 스크린샷/이미지 삽입 슬롯 (업로드 + 배치)
- [ ] 디바이스 프레임 오버레이 (폰/태블릿 목업)

### Step 5-3. 스크린샷 프레임 + 디바이스 목업
- [ ] 디바이스 프레임 SVG 에셋 (Pixel, Galaxy, iPhone 등)
- [ ] 스크린샷 삽입 → 디바이스 프레임 안에 합성
- [ ] 배경 + 캡션 텍스트 + 디바이스 목업 = 완성 에셋
- [ ] 프레임 색상/스타일 커스터마이징

### Step 5-4. 일괄 에셋 내보내기
- [ ] 플랫폼별 필수 에셋 체크리스트 UI
- [ ] 전체 에셋 일괄 렌더링 → ZIP 다운로드
- [ ] 폴더 구조: `android/`, `ios/` 분리
- [ ] Supabase에 에셋 프로젝트 저장

**산출물:** Phase 5 완성. 스토어 배포용 그래픽 에셋 생성기

---

## Phase 6: 후순위 개선

### Step 6-1. URL 공유
- [ ] 설정을 URL 파라미터로 인코딩 (Base64 압축)
- [ ] URL에서 설정 복원
- [ ] 공유 버튼 (링크 복사)

### Step 6-2. 추가 포맷
- [ ] ICO 내보내기 (Canvas → 16x16/32x32/48x48 멀티사이즈)
- [ ] WebP 내보내기 (`canvas.toBlob('image/webp')`)
- [ ] AVIF 내보내기 (브라우저 지원 확인 후 fallback)

### Step 6-3. Radial 그라디언트 고급
- [ ] Radial 그라디언트 중심점 X/Y 2D 드래그 UI
- [ ] 반경/초점 슬라이더

### Step 6-4. 접근성
- [ ] 슬라이더 ARIA (`aria-label`, `aria-valuemin/max/now`)
- [ ] 키보드 내비게이션 전체 점검
- [ ] 스크린 리더 `aria-live` 영역
- [ ] 색상 대비 WCAG AA 검증

---

## 일정 추정 (작업 단위)

| 단계 | 스텝 수 | 핵심 난이도 |
|------|---------|------------|
| **Phase 1** (MVP) ✅ | 7 스텝 | Canvas 렌더러, FittedBox, 폰트 로딩 |
| **Phase 2** (모드 확장) ✅ | 7 스텝 | 내보내기 리팩터, Text+Image 레이아웃, SVG 직접 생성 |
| **Phase 3** (일괄+클립보드) | 2 스텝 | ZIP 생성, Clipboard API |
| **Phase 4** (Supabase) | 4 스텝 | DB 스키마, RLS, 자동저장, 마이그레이션 |
| **Phase 5** (스토어 에셋) | 4 스텝 | 템플릿 시스템, 디바이스 목업, 멀티 텍스트 블록 |
| **Phase 6** (후순위) | 4 스텝 | URL 인코딩, ICO 생성, 접근성 |

### 의존성 그래프

```
Phase 1 ✅
  └→ Phase 2 ✅
       └→ Phase 3 (일괄 내보내기 + 클립보드)
            └→ Phase 4 (Supabase 연동) ★ 서버 저장 기반
                 ├→ Phase 5 (스토어 에셋) — Phase 4 저장 기능 활용
                 └→ Phase 6 (후순위) — 독립적, 언제든 가능
```

### 핵심 리스크

| 리스크 | 영향 | 대응 |
|--------|------|------|
| Canvas 멀티라인 + letter-spacing 크로스브라우저 | Step 1-5 | Safari fallback 문자별 렌더링 ✅ 구현됨 |
| FittedBox 텍스트 크기 계산 정확도 | Step 1-2 | `measureText()` + 이진 탐색 ✅ 구현됨, uppercase 반영 완료 |
| Google Fonts 39종 초기 로딩 시간 | Step 1-3 | 전체 한 번에 로드 방식 사용 중, lazy load 개선 가능 |
| SVG 내보내기 폰트 임베딩 | Step 2-6 | `@import` URL 방식 우선, Base64 임베딩은 후순위 |
| Supabase RLS + 자동저장 충돌 | Step 4-3 | debounce + optimistic update + conflict resolution |
| 디바이스 목업 SVG 라이선스 | Step 5-3 | 자체 제작 또는 MIT 라이선스 에셋 사용 |
| 스토어 에셋 규격 변경 | Step 5-1 | Google/Apple 공식 문서 기준, 업데이트 대응 필요 |
| ICO 멀티사이즈 생성 | Step 6-2 | ico-canvas 같은 경량 라이브러리 또는 직접 바이너리 생성 |
| Canvas 큰 배율(4x) 메모리 | Step 1-6 | 4096x4096 이상 시 경고 필요 (미구현) |
