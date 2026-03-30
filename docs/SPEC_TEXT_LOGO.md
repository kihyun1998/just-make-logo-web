# Just Make Logo - 전체 기능 명세서

> AI가 아닌, 내가 직접 만드는 로고

## 1. 프로젝트 개요

### 1.1 목적
AI 기반 자동 생성이 아닌, 사용자가 **직접 텍스트/이미지/SVG/배경/색상/폰트를 조합**하여 원하는 로고를 만드는 웹 서비스.

### 1.2 핵심 가치
- **심플함**: 복잡한 디자인 툴 없이 바로 로고 제작
- **정확함**: 내가 원하는 그대로 나옴 (AI 랜덤 결과 X)
- **실용적**: PNG, JPG, SVG, ICO 다양한 포맷 + 디바이스별 크기 프리셋 내보내기

---

## 2. 로고 모드 (4가지)

| 모드 | 설명 |
|------|------|
| **Text Only** | 텍스트만으로 로고 생성 |
| **Image Only** | 이미지만으로 로고 생성 |
| **Text + Image** | 텍스트와 이미지 조합 |
| **SVG Only** | SVG 파일 업로드 후 배경 래핑 |

- 모드 전환은 Chip 버튼 UI로 선택
- 모드에 따라 관련 컨트롤 섹션이 조건부 표시/숨김

---

## 3. 텍스트 설정

### 3.1 폰트 선택

Google Fonts 39종 큐레이션 목록:

> Workbench, Jersey 20, Noto Serif, Bebas Neue, Pacifico, Lobster, Raleway, Permanent Marker, Black Han Sans, Noto Sans KR, Montserrat, Poppins, Inter, Space Grotesk, Rubik, Outfit, Oswald, Anton, Righteous, Russo One, Orbitron, Audiowide, Bungee, Fredoka, Lexend, Nunito, Quicksand, Comfortaa, Rajdhani, Chakra Petch, Michroma, Teko, Electrolize, Exo 2, Megrim, Poiret One, Gruppo, Syncopate, Zen Dots

- 드롭다운 선택 UI (각 폰트명을 해당 폰트로 렌더링하여 미리보기)
- "Install Font" 링크 → Google Fonts 페이지 오픈
- 폰트별 지원 weight만 선택 가능 (미지원 weight 자동 전환)

### 3.2 폰트 두께 (Weight)

9단계: 100(Thin) ~ 900(Black)

폰트별 지원 weight 맵:
```typescript
const fontWeights: Record<string, number[]> = {
  'Workbench': [400],
  'Jersey 20': [400],
  'Noto Serif': [100, 200, 300, 400, 500, 600, 700, 800, 900],
  'Bebas Neue': [400],
  'Pacifico': [400],
  'Lobster': [400],
  'Raleway': [100, 200, 300, 400, 500, 600, 700, 800, 900],
  'Permanent Marker': [400],
  'Black Han Sans': [400],
  'Noto Sans KR': [100, 200, 300, 400, 500, 600, 700, 800, 900],
  'Montserrat': [100, 200, 300, 400, 500, 600, 700, 800, 900],
  'Poppins': [100, 200, 300, 400, 500, 600, 700, 800, 900],
  'Inter': [100, 200, 300, 400, 500, 600, 700, 800, 900],
  'Space Grotesk': [300, 400, 500, 600, 700],
  'Rubik': [300, 400, 500, 600, 700, 800, 900],
  'Outfit': [100, 200, 300, 400, 500, 600, 700, 800, 900],
  'Oswald': [200, 300, 400, 500, 600, 700],
  'Anton': [400],
  'Righteous': [400],
  'Russo One': [400],
  'Orbitron': [400, 500, 600, 700, 800, 900],
  'Audiowide': [400],
  'Bungee': [400],
  'Fredoka': [300, 400, 500, 600, 700],
  'Lexend': [100, 200, 300, 400, 500, 600, 700, 800, 900],
  'Nunito': [200, 300, 400, 500, 600, 700, 800, 900],
  'Quicksand': [300, 400, 500, 600, 700],
  'Comfortaa': [300, 400, 500, 600, 700],
  'Rajdhani': [300, 400, 500, 600, 700],
  'Chakra Petch': [300, 400, 500, 600, 700],
  'Michroma': [400],
  'Teko': [300, 400, 500, 600, 700],
  'Electrolize': [400],
  'Exo 2': [100, 200, 300, 400, 500, 600, 700, 800, 900],
  'Megrim': [400],
  'Poiret One': [400],
  'Gruppo': [400],
  'Syncopate': [400, 700],
  'Zen Dots': [400],
}
```

### 3.3 텍스트 입력
- 멀티라인 지원: 1줄 / 2줄 / 3줄
- 각 줄 별도 입력 필드
- 빈 줄은 기본 placeholder 텍스트 사용

### 3.4 텍스트 스타일링

| 항목 | 설명 |
|------|------|
| 텍스트 색상 | 커스텀 컬러 피커 |
| 텍스트 패딩 | 0~90% (5% 단위 슬라이더) |
| 글자 스타일 | Italic, Uppercase, Underline 토글 |
| 텍스트 회전 | 각도 조절 (0~360°) |
| 글자 간격 (letter-spacing) | 슬라이더로 조절 |
| 줄 간격 (line-height) | 멀티라인 시 줄 간격 조절 |
| FittedBox | 가용 공간에 텍스트 자동 스케일링 |

### 3.5 텍스트 효과

| 항목 | 설명 |
|------|------|
| 그림자 (Shadow) | ON/OFF, 색상, X/Y 오프셋, 블러 크기 조절 |
| 외곽선 (Stroke) | ON/OFF, 색상, 두께 조절 |

### 3.6 서브텍스트 (슬로건)

| 항목 | 설명 |
|------|------|
| 서브텍스트 입력 | 메인 텍스트 아래 별도 텍스트 레이어 |
| 독립 설정 | 폰트, 크기, 색상, 간격 등 메인과 별도 설정 가능 |
| 위치 | 메인 텍스트 상단/하단 선택 |

---

## 4. 이미지 설정

### 4.1 이미지 업로드
- 파일 피커로 이미지 선택
- 드래그 앤 드롭 업로드 지원
- 썸네일 미리보기 표시
- 이미지 변경/교체 버튼
- 이미지 제거 버튼

### 4.2 이미지 레이아웃 (Text+Image 모드)

| 항목 | 설명 |
|------|------|
| 위치 | Top / Bottom / Left / Right |
| 비율 | 10~90% (16단계) — 이미지와 텍스트 공간 비율 조절 |
| 간격 (Gap) | 0~50px (50단계) — 이미지와 텍스트 사이 간격 |
| Fit 모드 | Contain / Cover / Fill |

---

## 5. SVG 설정

### 5.1 SVG 업로드
- `.svg` 파일 업로드 (파일 피커 + 드래그 앤 드롭)
- SVG 미리보기 표시
- SVG 변경/교체 버튼
- SVG 제거 버튼

### 5.2 SVG 내보내기 특수 처리
- 업로드된 SVG를 배경 + 패딩 + 클리핑으로 래핑하여 새 SVG로 내보내기
- 원형/둥근 사각형 클리핑 지원

---

## 6. 배경 설정

### 6.1 배경 형태
- **사각형** (Rectangle) — 기본값
- **원형** (Circle) — oval 클리핑

### 6.2 단색 배경
- 6개 퀵 프리셋 컬러: 흰색, 검정, 빨강, 파랑, 노랑, 초록
- 커스텀 컬러 피커
- 투명 배경 옵션 (체커보드 패턴으로 표시)

### 6.3 그라디언트 배경
- 그라디언트 ON/OFF 토글
- **멀티 컬러 스톱**: 최소 2개 ~ 최대 3개 색상 지점
  - 각 스톱 포인트의 위치(%) 조절
  - 그라디언트 바 위에서 드래그로 스톱 위치 이동
  - 각 스톱별 개별 컬러 피커

**그라디언트 타입:**

| 타입 | 설명 |
|------|------|
| **Linear** | 직선 방향 그라디언트 |
| **Radial** | 원형/타원형 확산 |

**Linear 방향 8가지:**
- Top → Bottom, Bottom → Top
- Left → Right, Right → Left
- TopLeft → BottomRight (기본값), TopRight → BottomLeft
- BottomLeft → TopRight, BottomRight → TopLeft

**Radial 고급 옵션 (후순위):**
- 중심점 (center) X/Y 좌표 조절
- 반경 (radius) 조절
- 초점 (focal point) 위치 조절

**프리셋 그라디언트 10종:**

| 이름 | 시작색 | 끝색 |
|------|--------|------|
| Sunset | #FF512F | #F09819 |
| Ocean | #2193B0 | #6DD5ED |
| Mint | #00B09B | #96C93D |
| Peach | #ED4264 | #FFEDBC |
| Night | #232526 | #414345 |
| Berry | #8E2DE2 | #4A00E0 |
| Fire | #FF416C | #FF4B2B |
| Sky | #56CCF2 | #2F80ED |
| Lime | #B2FF59 | #69F0AE |
| Royal | #141E30 | #243B55 |

### 6.4 테두리 둥글기 (Border Radius)
- 0~100px 슬라이더
- 사각형 배경일 때만 표시

### 6.5 캔버스 패딩
- 0~90% (5% 단위)
- 로고 전체 둘레의 여백 조절

---

## 7. 크기 설정

### 7.1 일반 프리셋 (12종)

| 크기 |
|------|
| 16x16, 32x32, 48x48, 96x96, 128x128, 192x192 |
| 256x256, 512x512, 1024x1024 |
| 1280x720, 1920x1080 |
| Custom (직접 W x H 입력) |

### 7.2 디바이스별 프리셋 그룹

#### Android (6종)
| 이름 | 크기 |
|------|------|
| mdpi | 48x48 |
| hdpi | 72x72 |
| xhdpi | 96x96 |
| xxhdpi | 144x144 |
| xxxhdpi | 192x192 |
| playstore | 512x512 |

#### iOS (17종)
| 이름 | 크기 |
|------|------|
| 20pt | 20x20 |
| 20pt @2x | 40x40 |
| 20pt @3x | 60x60 |
| 29pt | 29x29 |
| 29pt @2x | 58x58 |
| 29pt @3x | 87x87 |
| 40pt | 40x40 |
| 40pt @2x | 80x80 |
| 40pt @3x | 120x120 |
| 60pt @2x | 120x120 |
| 60pt @3x | 180x180 |
| 76pt | 76x76 |
| 76pt @2x | 152x152 |
| 83.5pt @2x | 167x167 |
| 512pt | 512x512 |
| 512pt @2x | 1024x1024 |
| App Store | 1024x1024 |

#### Web (6종)
| 이름 | 크기 |
|------|------|
| favicon | 16x16 |
| favicon-32 | 32x32 |
| apple-touch | 180x180 |
| android-chrome-192 | 192x192 |
| android-chrome-512 | 512x512 |
| og-image | 1200x630 |

#### macOS (7종)
| 이름 | 크기 |
|------|------|
| 16pt ~ 1024pt | 16x16 ~ 1024x1024 (7단계) |

#### Windows (6종)
| 이름 | 크기 |
|------|------|
| 16pt ~ 256pt | 16x16 ~ 256x256 (6단계) |

---

## 8. 내보내기 (Export)

### 8.1 포맷

| 포맷 | 설명 |
|------|------|
| **PNG** | 래스터, 투명 배경 지원 |
| **JPG** | 래스터, 95% 품질 |
| **SVG** | 벡터, 무한 확장 |
| **ICO** | favicon용 아이콘 파일 |
| **WebP** | 차세대 래스터 포맷 (후순위) |
| **AVIF** | 차세대 래스터 포맷 (후순위) |

### 8.2 스케일 배율 (래스터 전용)
- 1x / 2x / 3x / 4x
- SVG는 1x 고정
- 최종 출력 크기 표시: `W x H px`

### 8.3 단일 내보내기
- 현재 설정대로 파일 하나 저장
- 파일명 규칙: `logo_WxH[@scale].ext`
- 클립보드 복사 (이미지를 클립보드에 복사)

### 8.4 그룹 일괄 내보내기 (후순위)
- 디바이스 그룹(Android/iOS/Web/macOS/Windows) 선택 후 전체 크기 일괄 저장
- ZIP 파일로 묶어서 다운로드
- 완료 시 성공 개수 + 플랫폼명 표시

### 8.5 SVG 내보내기 특수 처리
- Google Fonts `@import` URL 임베딩
- 폰트 weight별 URL 생성
- 그라디언트 정의 (`<linearGradient>`, `<radialGradient>`) 포함
- 클리핑 패스 (원형, 둥근 사각형) 포함
- 멀티라인 텍스트 line-height 계산
- XML 특수문자 이스케이프

---

## 9. 프리셋 & 저장/불러오기

### 9.1 컬러 프리셋 (localStorage)
- 현재 배경색 + 텍스트색 조합을 프리셋으로 저장
- 프리셋 이름 지정 / 변경 / 삭제
- 프리셋 적용 → 즉시 색상 전환
- 반원 미리보기 UI (왼쪽=배경색, 오른쪽=텍스트색)
- localStorage 영구 저장

### 9.2 전체 설정 프리셋 (JSON 파일)

**저장 항목:**
- 텍스트 내용 (각 줄), 폰트, 두께, 줄 수
- 텍스트 색상, 텍스트 패딩
- 배경 색상, 배경 형태, 투명 배경 여부
- 캔버스 패딩, 테두리 둥글기, 캔버스 크기
- 내보내기 포맷, 스케일
- 그라디언트 전체 설정 (ON/OFF, 색상, 타입, 방향)
- 이미지 위치, 비율, 간격, Fit 모드

**동작:**
- `.json` 파일로 저장/불러오기
- 파일 피커 다이얼로그 (`.json` 필터)
- Pretty-printed JSON 출력
- 이미지/SVG 파일은 프리셋에 미포함 (별도 관리)

---

## 10. 프리뷰 (실시간 미리보기)

### 10.1 캔버스 프리뷰
- 모든 설정 변경 시 실시간 업데이트
- 선택된 크기의 종횡비 유지
- 크기 배지 표시 (W x H)
- 테두리 및 그림자로 시각적 구분

### 10.2 투명 배경 표시
- 투명 모드 시 체커보드 패턴 (8px 셀)

### 10.3 텍스트 렌더링
- FittedBox로 가용 공간에 맞춰 자동 스케일
- 중앙 정렬 (수평 + 수직)
- 멀티라인 텍스트 각 줄 독립 렌더링

---

## 11. UI/UX 구조

### 11.1 앱 레이아웃

```
┌─────────────────────────────────────────────────────────┐
│  AppBar (앱 로고, 타이틀, 다크모드 토글) [내보내기 버튼]    │
├────────────────────────────────┬────────────────────────┤
│                                │                        │
│        캔버스 (미리보기)         │    컨트롤 패널          │
│        종횡비 유지               │                        │
│        크기 배지 표시            │  [모드 선택 Chip]      │
│                                │  [텍스트/이미지/배경]   │
│    ┌──────────────────┐       │  [크기/내보내기]        │
│    │                  │       │                        │
│    │   LOGO TEXT      │       │  (선택된 섹션의         │
│    │   slogan         │       │   설정 항목들)          │
│    │                  │       │                        │
│    └──────────────────┘       │                        │
│                                │                        │
├────────────────────────────────┴────────────────────────┤
│  Footer                                                 │
└─────────────────────────────────────────────────────────┘
```

### 11.2 반응형

| 화면 | 레이아웃 |
|------|---------|
| Desktop (≥700px) | 좌측 프리뷰 (3) + 우측 컨트롤 패널 (1) |
| Mobile (<700px) | 상단 프리뷰 (3) + 하단 컨트롤 패널 (2) 세로 스택 |

### 11.3 테마
- 라이트/다크 모드 전환
- 테마 설정 로컬 저장 (localStorage)

---

## 12. 편집 기능

| 항목 | 설명 |
|------|------|
| Undo/Redo | Ctrl+Z / Ctrl+Shift+Z (최대 50단계) |
| 리셋 | 모든 설정 초기값으로 복원 |

### Undo/Redo 동작 규칙
- 슬라이더: 드래그 종료(mouseup/touchend) 시점에 히스토리 커밋
- 텍스트 입력: debounce 300ms 후 히스토리 커밋
- 색상 변경: 피커 닫힘 또는 500ms debounce 후 커밋
- ExportConfig 변경은 히스토리 대상 아님

---

## 13. 기술 구현

### 13.1 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router) |
| UI | Tailwind CSS v4, Radix UI, shadcn/ui |
| 상태 관리 | zustand + immer (Undo/Redo: zustand temporal 미들웨어) |
| 렌더링 | Canvas API (미리보기 + 내보내기 통일) |
| 폰트 로드 | Google Fonts CSS URL (`fonts.googleapis.com/css2`) |
| 내보내기 | Canvas → PNG/JPG/ICO, 직접 SVG 생성 (벡터) |
| 컬러 피커 | react-colorful |
| 파일 다운로드 | 네이티브 `<a download>` + `URL.createObjectURL()` |
| i18n | i18next (이미 적용됨) |
| 인증 | Supabase Auth (이미 적용됨) |

### 13.2 렌더링 방식

**Canvas 기반으로 미리보기/내보내기 통일** (DOM→Canvas 불일치 방지):

```
[사용자 설정 변경]
       ↓
[zustand 상태 업데이트]
       ↓
[Canvas API로 즉시 렌더링] ← 미리보기와 내보내기 동일 렌더러
       ↓ (내보내기 클릭)
[PNG/JPG/ICO: canvas.toBlob() / SVG: 직접 SVG DOM 생성]
       ↓
[다운로드 또는 클립보드 복사]
```

**Canvas 렌더링 주의사항:**
- 멀티라인: `fillText()` 줄바꿈 미지원 → 수동 줄 분리 + 개별 렌더링
- letter-spacing: Chrome 99+ 네이티브 지원, Safari는 문자별 개별 렌더링 fallback
- 커스텀 폰트: `document.fonts.ready` await 후 렌더링 필수
- 슬라이더 입력: debounce 적용 (렌더링 최적화)

**SVG 내보내기:**
- `<svg>` + `<text>` + `<rect>`/`<circle>` 등 직접 생성
- 폰트: Google Fonts `@import` URL 임베딩
- 그라디언트: SVG `<linearGradient>`, `<radialGradient>` 요소 사용

### 13.3 추가 라이브러리

| 라이브러리 | 용도 |
|-----------|------|
| `zustand` | 상태 관리 + temporal 미들웨어 (Undo/Redo) |
| `immer` | 중첩 객체 immutable 업데이트 |
| `react-colorful` | 경량 컬러 피커 |
| `jszip` | 그룹 일괄 내보내기 ZIP 생성 (후순위) |

---

## 14. 개발 단계

### Phase 1: MVP — 기본 Text Only 로고
- [ ] zustand 상태 관리 + Undo/Redo 세팅
- [ ] Canvas 기반 미리보기 + 렌더링 엔진
- [ ] 로고 모드 선택 UI (4가지, 우선 Text Only만 동작)
- [ ] 텍스트 입력 (멀티라인 1~3줄)
- [ ] 폰트 39종 드롭다운 + weight 선택
- [ ] 텍스트 색상 (컬러 피커)
- [ ] 텍스트 패딩 (0~90%, 5% 단위)
- [ ] FittedBox 텍스트 자동 스케일링
- [ ] 글자 간격, 줄 간격
- [ ] 텍스트 그림자 (Shadow)
- [ ] 텍스트 외곽선 (Stroke)
- [ ] 사각형/원형 배경 + 배경색 (투명 포함)
- [ ] 퀵 프리셋 컬러 6종
- [ ] 캔버스 패딩 (0~90%, 5% 단위)
- [ ] 테두리 둥글기 (0~100px)
- [ ] 크기 프리셋 (일반 12종)
- [ ] PNG, JPG 내보내기
- [ ] 스케일 배율 (1x~4x)
- [ ] 다크모드 토글

### Phase 2: 이미지/SVG 모드 + 그라디언트
- [ ] Image Only 모드 (이미지 업로드/제거/교체)
- [ ] Text + Image 모드 (위치/비율/간격/Fit)
- [ ] SVG Only 모드 (SVG 업로드 + 배경 래핑)
- [ ] 기본 그라디언트 배경 (Linear 8방향 + Radial)
- [ ] 멀티 컬러 스톱 (2~3색)
- [ ] 그라디언트 프리셋 10종
- [ ] 서브텍스트(슬로건) 레이어
- [ ] 텍스트 회전
- [ ] 글자 스타일 (Italic, Uppercase, Underline)
- [ ] SVG 내보내기 (직접 SVG DOM 생성, 폰트 임베딩)
- [ ] ICO 내보내기
- [ ] 디바이스별 크기 프리셋 (Android/iOS/Web/macOS/Windows)

### Phase 3: 프리셋 + 고급 기능
- [ ] 컬러 프리셋 저장/관리 (localStorage)
- [ ] 전체 설정 JSON 저장/불러오기
- [ ] 그룹 일괄 내보내기 + ZIP 다운로드
- [ ] Radial 그라디언트 고급 옵션 (중심점/반경/초점)
- [ ] 드래그 앤 드롭 이미지/SVG 업로드
- [ ] 클립보드 복사

### Phase 4: 후순위 개선
- [ ] URL 공유 (설정을 URL 파라미터로 인코딩)
- [ ] WebP/AVIF 포맷 추가
- [ ] 로고 저장/불러오기 (Supabase 연동)
- [ ] 접근성 개선 (ARIA, 키보드 내비게이션)

---

## 15. 데이터 모델

### 15.1 로고 설정 상태

```typescript
interface LogoState {
  schemaVersion: number

  // 모드
  mode: 'textOnly' | 'imageOnly' | 'textImage' | 'svgOnly'

  // 텍스트
  text1: string
  text2: string
  text3: string
  textLines: 1 | 2 | 3
  fontFamily: string
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  textColor: string                   // hex
  textPadding: number                 // 0~90, step 5 (%)
  italic: boolean
  uppercase: boolean
  underline: boolean
  rotation: number                    // 0~360 (도)
  letterSpacing: number               // px
  lineHeight: number                  // 배수

  // 텍스트 효과
  shadow: {
    enabled: boolean
    color: string
    offsetX: number
    offsetY: number
    blur: number
  }
  stroke: {
    enabled: boolean
    color: string
    width: number
  }

  // 서브텍스트
  subText: {
    enabled: boolean
    text: string
    fontFamily: string
    fontWeight: number
    color: string
    position: 'above' | 'below'
  }

  // 배경
  backgroundColor: string             // hex
  backgroundShape: 'rectangle' | 'circle'
  isTransparent: boolean
  canvasPadding: number               // 0~90, step 5 (%)
  borderRadius: number                // 0~100 (px)

  // 그라디언트
  useGradient: boolean
  gradientType: 'linear' | 'radial'
  gradientDirection:
    | 'topToBottom' | 'bottomToTop'
    | 'leftToRight' | 'rightToLeft'
    | 'topLeftToBottomRight' | 'topRightToBottomLeft'
    | 'bottomLeftToTopRight' | 'bottomRightToTopLeft'
  gradientStops: Array<{ color: string; position: number }>  // 2~3개

  // Radial 고급 (후순위)
  gradientCenterX?: number            // 0~1
  gradientCenterY?: number            // 0~1
  gradientRadius?: number
  gradientFocalX?: number
  gradientFocalY?: number

  // 이미지
  imageFile: File | null
  imagePosition: 'top' | 'bottom' | 'left' | 'right'
  imageFlex: number                   // 10~90
  imageGap: number                    // 0~50
  imageFit: 'contain' | 'cover' | 'fill'

  // SVG
  svgFile: File | null
  svgContent: string | null

  // 캔버스 크기
  canvasWidth: number
  canvasHeight: number

  // 내보내기
  exportFormat: 'png' | 'jpg' | 'svg' | 'ico'
  exportScale: 1 | 2 | 3 | 4
}
```

### 15.2 컬러 프리셋

```typescript
interface ColorPreset {
  name: string
  backgroundColor: string             // hex
  textColor: string                   // hex
}
```

### 15.3 기본값

```typescript
const DEFAULT_LOGO_STATE: LogoState = {
  schemaVersion: 1,
  mode: 'textOnly',

  text1: 'LOGO',
  text2: '',
  text3: '',
  textLines: 1,
  fontFamily: 'Inter',
  fontWeight: 700,
  textColor: '#000000',
  textPadding: 10,
  italic: false,
  uppercase: false,
  underline: false,
  rotation: 0,
  letterSpacing: 0,
  lineHeight: 1.2,

  shadow: { enabled: false, color: '#000000', offsetX: 2, offsetY: 2, blur: 4 },
  stroke: { enabled: false, color: '#000000', width: 2 },

  subText: {
    enabled: false,
    text: '',
    fontFamily: 'Inter',
    fontWeight: 400,
    color: '#666666',
    position: 'below',
  },

  backgroundColor: '#FFFFFF',
  backgroundShape: 'rectangle',
  isTransparent: false,
  canvasPadding: 10,
  borderRadius: 0,

  useGradient: false,
  gradientType: 'linear',
  gradientDirection: 'topLeftToBottomRight',
  gradientStops: [
    { color: '#FF512F', position: 0 },
    { color: '#F09819', position: 1 },
  ],

  imageFile: null,
  imagePosition: 'top',
  imageFlex: 50,
  imageGap: 10,
  imageFit: 'contain',

  svgFile: null,
  svgContent: null,

  canvasWidth: 512,
  canvasHeight: 512,

  exportFormat: 'png',
  exportScale: 1,
}
```

### 15.4 디바이스 프리셋 그룹

```typescript
interface SizePreset {
  name: string
  width: number
  height: number
}

interface DeviceGroup {
  platform: string
  sizes: SizePreset[]
}

const deviceGroups: DeviceGroup[] = [
  {
    platform: 'Android',
    sizes: [
      { name: 'mdpi', width: 48, height: 48 },
      { name: 'hdpi', width: 72, height: 72 },
      { name: 'xhdpi', width: 96, height: 96 },
      { name: 'xxhdpi', width: 144, height: 144 },
      { name: 'xxxhdpi', width: 192, height: 192 },
      { name: 'playstore', width: 512, height: 512 },
    ],
  },
  {
    platform: 'iOS',
    sizes: [
      { name: '20pt', width: 20, height: 20 },
      { name: '20pt @2x', width: 40, height: 40 },
      { name: '20pt @3x', width: 60, height: 60 },
      { name: '29pt', width: 29, height: 29 },
      { name: '29pt @2x', width: 58, height: 58 },
      { name: '29pt @3x', width: 87, height: 87 },
      { name: '40pt', width: 40, height: 40 },
      { name: '40pt @2x', width: 80, height: 80 },
      { name: '40pt @3x', width: 120, height: 120 },
      { name: '60pt @2x', width: 120, height: 120 },
      { name: '60pt @3x', width: 180, height: 180 },
      { name: '76pt', width: 76, height: 76 },
      { name: '76pt @2x', width: 152, height: 152 },
      { name: '83.5pt @2x', width: 167, height: 167 },
      { name: '512pt', width: 512, height: 512 },
      { name: '512pt @2x', width: 1024, height: 1024 },
      { name: 'App Store', width: 1024, height: 1024 },
    ],
  },
  {
    platform: 'Web',
    sizes: [
      { name: 'favicon', width: 16, height: 16 },
      { name: 'favicon-32', width: 32, height: 32 },
      { name: 'apple-touch', width: 180, height: 180 },
      { name: 'android-chrome-192', width: 192, height: 192 },
      { name: 'android-chrome-512', width: 512, height: 512 },
      { name: 'og-image', width: 1200, height: 630 },
    ],
  },
  {
    platform: 'macOS',
    sizes: [
      { name: '16pt', width: 16, height: 16 },
      { name: '32pt', width: 32, height: 32 },
      { name: '64pt', width: 64, height: 64 },
      { name: '128pt', width: 128, height: 128 },
      { name: '256pt', width: 256, height: 256 },
      { name: '512pt', width: 512, height: 512 },
      { name: '1024pt', width: 1024, height: 1024 },
    ],
  },
  {
    platform: 'Windows',
    sizes: [
      { name: '16pt', width: 16, height: 16 },
      { name: '24pt', width: 24, height: 24 },
      { name: '32pt', width: 32, height: 32 },
      { name: '48pt', width: 48, height: 48 },
      { name: '64pt', width: 64, height: 64 },
      { name: '256pt', width: 256, height: 256 },
    ],
  },
]
```

### 15.5 DB 저장 모델 (Phase 4, Supabase)

```sql
CREATE TABLE logo_projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  config jsonb NOT NULL,
  schema_version integer NOT NULL DEFAULT 1,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE logo_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own projects"
  ON logo_projects FOR ALL
  USING (auth.uid() = user_id);
```

---

## 16. 접근성

| 항목 | 대응 |
|------|------|
| 키보드 내비게이션 | 탭 전환, 슬라이더, 버튼 모두 키보드 조작 가능 (Radix UI 기본 지원) |
| 슬라이더 ARIA | `aria-label`, `aria-valuemin/max/now` 적용 |
| 색상 대비 | WCAG AA 기준 (4.5:1) 충족 (다크/라이트 모드) |
| 스크린 리더 | 캔버스 변경 시 `aria-live` 영역으로 현재 설정 상태 안내 |
| 컬러 피커 | HEX 직접 입력으로 키보드 전용 사용 가능 |
