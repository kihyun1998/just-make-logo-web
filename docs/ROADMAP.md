# Just Make Logo - 구현 로드맵

> 기준 문서: `docs/SPEC_TEXT_LOGO.md`
> 현재 상태: 레이아웃/인증/i18n/테마 구현 완료, 로고 에디터 미착수

---

## Phase 1: MVP — Text Only 로고 (핵심)

목표: **텍스트 입력 → 실시간 미리보기 → PNG/JPG 다운로드**가 되는 최소 제품

### Step 1-1. 프로젝트 기반 세팅
- [ ] zustand + immer + zustand-temporal 설치 및 스토어 구조 세팅
- [ ] `LogoState` 타입 정의 + `DEFAULT_LOGO_STATE` 상수
- [ ] `useLogoStore` zustand 스토어 생성 (temporal 미들웨어 포함)
- [ ] react-colorful 설치
- [ ] 에디터 페이지 라우트 생성 (`/app/editor/page.tsx`)
- [ ] 에디터 레이아웃 뼈대 (좌측 프리뷰 3 : 우측 패널 1, 모바일 세로 스택)

**산출물:** 빈 에디터 페이지가 반응형으로 뜸, 상태 스토어 동작

### Step 1-2. Canvas 렌더링 엔진
- [ ] `<LogoCanvas>` 컴포넌트 — Canvas 기반 실시간 프리뷰
- [ ] Canvas 렌더러 핵심 함수: `renderLogo(ctx, state, width, height)`
  - 배경 그리기 (단색, 투명)
  - 텍스트 그리기 (단일 줄)
  - FittedBox 로직 (가용 공간에 텍스트 자동 스케일링)
  - 패딩 적용 (캔버스 패딩, 텍스트 패딩)
- [ ] 체커보드 패턴 (투명 배경 표시)
- [ ] 종횡비 유지 + 크기 배지 표시 (W x H)
- [ ] `document.fonts.ready` 대기 후 렌더링

**산출물:** Canvas에 텍스트가 그려지고, 상태 변경 시 실시간 업데이트

### Step 1-3. 텍스트 컨트롤 패널
- [ ] 모드 선택 Chip UI (4가지, 우선 Text Only만 활성)
- [ ] 텍스트 입력 필드 (1~3줄 전환 + 각 줄 별도 입력)
- [ ] 폰트 드롭다운 (39종, 각 폰트명을 해당 폰트로 렌더링)
- [ ] Google Fonts CSS 동적 로드 (`<link>` 삽입)
- [ ] 폰트 Weight 선택 (폰트별 지원 weight만 표시)
- [ ] 텍스트 색상 컬러 피커 (react-colorful)
- [ ] 텍스트 패딩 슬라이더 (0~90%, 5% 단위)

**산출물:** 텍스트 입력/폰트/색상 변경 → Canvas 실시간 반영

### Step 1-4. 배경 컨트롤 패널
- [ ] 배경 형태 선택 (사각형 / 원형)
- [ ] 배경색 컬러 피커
- [ ] 퀵 프리셋 컬러 6종 (흰/검/빨/파/노/초)
- [ ] 투명 배경 토글
- [ ] 캔버스 패딩 슬라이더 (0~90%, 5% 단위)
- [ ] 테두리 둥글기 슬라이더 (0~100px, 사각형일 때만)
- [ ] Canvas 렌더러에 배경 모양 반영 (rect + borderRadius / circle 클리핑)

**산출물:** 배경 모양/색상/패딩/라운드 변경 → Canvas 실시간 반영

### Step 1-5. 텍스트 스타일 + 효과
- [ ] 글자 간격 (letter-spacing) 슬라이더
- [ ] 줄 간격 (line-height) 슬라이더
- [ ] 멀티라인 Canvas 렌더링 (수동 줄 분리 + 개별 fillText)
- [ ] 텍스트 그림자 (Shadow) — ON/OFF, 색상, offsetX/Y, blur
- [ ] 텍스트 외곽선 (Stroke) — ON/OFF, 색상, 두께
- [ ] Canvas 렌더러에 shadow/stroke 반영

**산출물:** 그림자/외곽선이 적용된 텍스트가 Canvas에 렌더링

### Step 1-6. 크기 프리셋 + 내보내기
- [ ] 크기 프리셋 UI (일반 12종 드롭다운/그리드)
- [ ] Custom 크기 직접 입력 (W x H)
- [ ] PNG 내보내기 (`canvas.toBlob('image/png')`)
- [ ] JPG 내보내기 (`canvas.toBlob('image/jpeg', 0.95)`)
- [ ] 스케일 배율 선택 (1x/2x/3x/4x) — Canvas 크기 곱셈 후 내보내기
- [ ] 파일명 규칙: `logo_WxH[@scale].ext`
- [ ] 내보내기 버튼 헤더에 고정 배치

**산출물:** 원하는 크기/포맷/배율로 로고 다운로드 가능

### Step 1-7. Undo/Redo + 다크모드
- [ ] zustand-temporal Undo/Redo 연결
- [ ] 키보드 단축키: Ctrl+Z (Undo), Ctrl+Shift+Z (Redo)
- [ ] 슬라이더 debounce (드래그 종료 시점에 히스토리 커밋)
- [ ] 텍스트 입력 debounce (300ms)
- [ ] 리셋 버튼 (DEFAULT_LOGO_STATE로 복원)
- [ ] 다크모드에서 에디터 UI 정상 표시 확인

**산출물:** Phase 1 완성. Text Only 로고를 만들어서 PNG/JPG로 다운로드 가능

---

## Phase 2: 이미지/SVG 모드 + 그라디언트

목표: **4가지 모드 전부 동작** + 그라디언트 배경 + SVG 내보내기

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
- [ ] Italic, Uppercase, Underline 토글
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
| **Phase 1** (MVP) | 7 스텝 | Canvas 렌더러, FittedBox, 폰트 로딩 |
| **Phase 2** (모드 확장) | 6 스텝 | Text+Image 레이아웃, SVG 직접 생성, ICO 변환 |
| **Phase 3** (프리셋) | 4 스텝 | ZIP 생성, 2D 드래그 UI |
| **Phase 4** (후순위) | 4 스텝 | URL 인코딩, Supabase 스키마 |

### 의존성 그래프

```
Step 1-1 (기반 세팅)
  └→ Step 1-2 (Canvas 엔진) ★ 가장 중요
       ├→ Step 1-3 (텍스트 패널)
       ├→ Step 1-4 (배경 패널)
       ├→ Step 1-5 (텍스트 효과)
       └→ Step 1-6 (내보내기)
            └→ Step 1-7 (Undo/Redo)
                 └→ Phase 1 완성 ✓
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
| Canvas 멀티라인 + letter-spacing 크로스브라우저 | Step 1-5 | Safari fallback 문자별 렌더링 준비 |
| FittedBox 텍스트 크기 계산 정확도 | Step 1-2 | `measureText()` + 이진 탐색으로 최적 크기 계산 |
| Google Fonts 39종 초기 로딩 시간 | Step 1-3 | 선택 시점에 lazy load, 초기에는 시스템 폰트 fallback |
| SVG 내보내기 폰트 임베딩 | Step 2-6 | `@import` URL 방식 우선, Base64 임베딩은 후순위 |
| ICO 멀티사이즈 생성 | Step 2-6 | ico-canvas 같은 경량 라이브러리 또는 직접 바이너리 생성 |
| Canvas 큰 배율(4x) 메모리 | Step 1-6 | 4096x4096 이상 시 경고, maxCanvasSize 체크 |
