# Just Make Logo - 구현 로드맵

> 기준 문서: `docs/SPEC_TEXT_LOGO.md`
> 현재 상태: **Phase 1 구현 완료** (일부 미비사항 있음)

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

## Phase 1 알려진 이슈 (수정 필요)

### Critical
| # | 이슈 | 파일 |
|---|------|------|
| C1 | **내보내기가 프리뷰 캔버스를 스케일업 → 이미지 흐림 + 체커보드 포함**. offscreen Canvas에서 별도 렌더링해야 함 | `export-panel.tsx` |
| C2 | **JPG 내보내기 시 투명 배경이 검은색** (JPEG은 알파 미지원). 흰색 배경 fallback 필요 | `export-panel.tsx` |
| C3 | **전체 스토어 구독 → 과도한 리렌더**. `useLogoStore(selector)` 패턴으로 변경 필요 | 모든 컴포넌트 |

### Medium
| # | 이슈 | 파일 |
|---|------|------|
| M1 | **폰트 로딩 레이스 컨디션**. 폰트 변경 시 `document.fonts.ready`가 즉시 resolve되어 fallback 폰트로 렌더링될 수 있음 | `logo-canvas.tsx` |
| M2 | **`underline` Canvas 미구현**. UI 토글 존재하나 Canvas에서 밑줄을 그리지 않음 | `logo-canvas.tsx` |
| M3 | **`fitText`에서 uppercase 미반영**. 원본 텍스트로 측정하지만 렌더링은 대문자 → 폭 불일치로 텍스트 넘침 가능 | `logo-canvas.tsx` |
| M4 | **멀티라인 Y좌표 계산 불일치**. `lineHeight < 1.0`일 때 줄 겹침, 수직 센터링 어긋남 | `logo-canvas.tsx` |
| M5 | **i18n hydration 여전히 불완전**. `setTimeout(0)`이 hydration 보장 못함. `useEffect`로 변경 필요 | `i18n/index.ts` |
| M6 | **immer+zundo equality에서 `JSON.stringify` 비교** → 성능 우려 | `logo-store.ts` |

### Low
| # | 이슈 | 파일 |
|---|------|------|
| L1 | `URL.revokeObjectURL` 즉시 호출 → 일부 브라우저에서 다운로드 실패 가능 | `export-panel.tsx` |
| L2 | `drawTextWithSpacing`에서 shadow가 문자별 중복 적용 | `logo-canvas.tsx` |
| L3 | padding 합산 50%+ 시 빈 캔버스가 되지만 사용자 피드백 없음 | `logo-canvas.tsx` |

### Dead Code (Phase 2용으로 미리 정의, 당장 문제 없음)
- `src/data/fonts.ts` → `buildGoogleFontUrl()` 미사용
- `src/data/presets.ts` → `GRADIENT_PRESETS`, `DEVICE_GROUPS` 미사용
- `src/types/logo.ts` → `ColorPreset` 미사용

---

## Phase 2: 이미지/SVG 모드 + 그라디언트

목표: **4가지 모드 전부 동작** + 그라디언트 배경 + SVG 내보내기

### Step 2-0. Phase 1 이슈 수정 (Phase 2 진입 전 필수)
- [ ] C1+C2+체커보드: 내보내기를 offscreen Canvas 별도 렌더링으로 전환
- [ ] C3: 각 컴포넌트에서 `useLogoStore(selector)` 패턴으로 변경
- [ ] M1: 폰트 변경 시 `FontFaceSet.load()` 후 렌더링
- [ ] M3: `fitText`에서 uppercase 상태 반영하여 측정
- [ ] M4: 멀티라인 Y좌표 계산 통일
- [ ] M5: i18n 언어 전환을 `useEffect`로 이동
- [x] 리셋 버튼 UI 추가 ✅ (Phase 1에서 해결)
- [x] 히스토리 debounce 추가 ✅ (Phase 1에서 해결)

### Step 2-1. Image Only 모드
- [ ] 이미지 업로드 UI (파일 피커 + 드래그 앤 드롭)
- [ ] 이미지 썸네일 미리보기 / 교체 / 제거
- [ ] Canvas에 이미지 렌더링 (Contain/Cover/Fill)
- [ ] 배경 + 패딩 + 클리핑 적용

### Step 2-2. Text + Image 모드
- [ ] 이미지 위치 선택 (Top/Bottom/Left/Right)
- [ ] 이미지:텍스트 비율 슬라이더 (10~90%)
- [ ] 간격(Gap) 슬라이더 (0~50px)
- [ ] Fit 모드 선택 (Contain/Cover/Fill)
- [ ] Canvas 렌더러에 텍스트+이미지 복합 레이아웃 구현

### Step 2-3. SVG Only 모드
- [ ] SVG 파일 업로드 (파일 피커 + 드래그 앤 드롭)
- [ ] SVG 파싱 + Canvas에 렌더링
- [ ] SVG 래핑 내보내기 (배경 + 패딩 + 클리핑 → 새 SVG)

### Step 2-4. 그라디언트 배경
- [ ] 그라디언트 ON/OFF 토글
- [ ] Linear 그라디언트 (8방향 프리셋 버튼)
- [ ] Radial 그라디언트 (기본)
- [ ] 멀티 컬러 스톱 (2~3색) — 각 스톱 색상/위치 조절
- [ ] 그라디언트 바 UI (드래그로 스톱 이동)
- [ ] 프리셋 그라디언트 10종 (Sunset, Ocean 등)
- [ ] Canvas 렌더러에 `createLinearGradient()` / `createRadialGradient()` 반영

### Step 2-5. 서브텍스트 + 텍스트 스타일 확장
- [ ] 서브텍스트(슬로건) 입력 + 독립 설정 (폰트/크기/색상)
- [ ] 서브텍스트 위치 (above/below)
- [ ] 텍스트 회전 (0~360°)
- [ ] Canvas에 underline 수동 렌더링
- [ ] Canvas 렌더러에 서브텍스트 + 회전 반영

### Step 2-6. SVG + ICO 내보내기
- [ ] SVG 내보내기: `<svg>` + `<text>` + 도형 직접 생성
- [ ] SVG 폰트 임베딩 (Google Fonts `@import` URL)
- [ ] SVG 그라디언트 (`<linearGradient>`, `<radialGradient>`)
- [ ] SVG 클리핑 패스 (원형, 둥근 사각형)
- [ ] ICO 내보내기 (Canvas → 16x16/32x32/48x48 멀티사이즈 ICO)
- [ ] 디바이스별 크기 프리셋 UI (Android/iOS/Web/macOS/Windows 탭)

**산출물:** Phase 2 완성. 4가지 모드 + 그라디언트 + SVG/ICO 내보내기

---

## Phase 3: 프리셋 + 일괄 내보내기

목표: **설정 저장/공유** + 일괄 내보내기로 실무 생산성 확보

### Step 3-1. 컬러 프리셋
- [ ] 컬러 프리셋 저장 UI (이름 지정, 반원 미리보기)
- [ ] 프리셋 목록 표시 / 적용 / 이름 변경 / 삭제
- [ ] localStorage 영구 저장

### Step 3-2. 전체 설정 JSON
- [ ] 현재 설정 → JSON 파일 내보내기 (Pretty-printed)
- [ ] JSON 파일 → 설정 불러오기 (파일 피커, `.json` 필터)
- [ ] 이미지/SVG 파일은 프리셋에서 제외 처리

### Step 3-3. 그룹 일괄 내보내기
- [ ] jszip 설치
- [ ] 디바이스 그룹 선택 UI (체크박스)
- [ ] 선택 그룹의 모든 크기로 일괄 렌더링
- [ ] ZIP 파일로 묶어서 다운로드
- [ ] 진행률 표시 + 완료 시 성공 개수 표시

### Step 3-4. Radial 고급 + 클립보드
- [ ] Radial 그라디언트 중심점 X/Y 2D 드래그 UI
- [ ] 반경/초점 슬라이더
- [ ] 클립보드 복사 (`navigator.clipboard.write()`)

**산출물:** Phase 3 완성. 프리셋 관리 + 일괄 내보내기

---

## Phase 4: 후순위 개선

### Step 4-1. URL 공유
- [ ] 설정을 URL 파라미터로 인코딩 (Base64 압축)
- [ ] URL에서 설정 복원
- [ ] 공유 버튼 (링크 복사)

### Step 4-2. 추가 포맷
- [ ] WebP 내보내기 (`canvas.toBlob('image/webp')`)
- [ ] AVIF 내보내기 (브라우저 지원 확인 후 fallback)

### Step 4-3. Supabase 연동
- [ ] `logo_projects` 테이블 생성 (마이그레이션)
- [ ] RLS 정책 적용
- [ ] 로고 저장 (config jsonb + thumbnail)
- [ ] 내 로고 목록 / 불러오기 / 삭제

### Step 4-4. 접근성
- [ ] 슬라이더 ARIA (`aria-label`, `aria-valuemin/max/now`)
- [ ] 키보드 내비게이션 전체 점검
- [ ] 스크린 리더 `aria-live` 영역
- [ ] 색상 대비 WCAG AA 검증

---

## 일정 추정 (작업 단위)

| 단계 | 스텝 수 | 핵심 난이도 |
|------|---------|------------|
| **Phase 1** (MVP) ✅ | 7 스텝 | Canvas 렌더러, FittedBox, 폰트 로딩 |
| **Phase 2** (모드 확장) | 7 스텝 (이슈 수정 포함) | 내보내기 리팩터, Text+Image 레이아웃, SVG 직접 생성 |
| **Phase 3** (프리셋) | 4 스텝 | ZIP 생성, 2D 드래그 UI |
| **Phase 4** (후순위) | 4 스텝 | URL 인코딩, Supabase 스키마 |

### 의존성 그래프

```
Phase 1 ✅
  └→ Step 2-0 (이슈 수정) ★ Phase 2 진입 전 필수
       ├→ Step 2-1~2-3 (이미지/SVG 모드) — 병렬 가능
       ├→ Step 2-4 (그라디언트)
       ├→ Step 2-5 (서브텍스트)
       └→ Step 2-6 (SVG/ICO 내보내기)
            └→ Phase 2 완성 ✓
                 ├→ Step 3-1~3-2 (프리셋) — 병렬 가능
                 ├→ Step 3-3 (일괄 내보내기)
                 └→ Step 3-4 (Radial 고급)
                      └→ Phase 3 완성 ✓
                           └→ Phase 4 (후순위)
```

### 핵심 리스크

| 리스크 | 영향 | 대응 |
|--------|------|------|
| Canvas 멀티라인 + letter-spacing 크로스브라우저 | Step 1-5 | Safari fallback 문자별 렌더링 ✅ 구현됨 |
| FittedBox 텍스트 크기 계산 정확도 | Step 1-2 | `measureText()` + 이진 탐색 ✅ 구현됨, uppercase 미반영 이슈 남음 |
| Google Fonts 39종 초기 로딩 시간 | Step 1-3 | 전체 한 번에 로드 방식 사용 중, lazy load 개선 가능 |
| SVG 내보내기 폰트 임베딩 | Step 2-6 | `@import` URL 방식 우선, Base64 임베딩은 후순위 |
| ICO 멀티사이즈 생성 | Step 2-6 | ico-canvas 같은 경량 라이브러리 또는 직접 바이너리 생성 |
| Canvas 큰 배율(4x) 메모리 | Step 1-6 | 4096x4096 이상 시 경고 필요 (미구현) |
| 내보내기 품질 (흐림/투명/체커보드) | Step 2-0 | offscreen Canvas 별도 렌더링으로 전환 필요 |
