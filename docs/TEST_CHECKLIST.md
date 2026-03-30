# 테스트 체크리스트

> `pnpm dev` → `http://localhost:3000/editor` 에서 테스트

---

## 1. 기본 진입

- [x] 홈페이지(`/`)에서 "Start Making Logo" 버튼 → `/editor` 이동
- [x] 에디터 페이지 로드 시 Canvas에 "LOGO" 텍스트 표시
- [x] 반응형: 브라우저 700px 이상 → 좌 프리뷰 + 우 패널 / 700px 미만 → 세로 스택
- [x] 다크모드 토글 → 에디터 UI 정상 표시

---

## 2. 모드 전환

- [ ] Text Only 선택 → 텍스트 관련 패널만 표시
- [ ] Image Only 선택 → 이미지 업로드 패널 표시, 텍스트 패널 숨김
- [ ] Text + Image 선택 → 텍스트 + 이미지 패널 모두 표시
- [ ] SVG Only 선택 → SVG 업로드 패널 표시, 텍스트 패널 숨김

---

## 3. 텍스트 (Text Only / Text+Image 모드)

### 텍스트 입력
- [ ] Line 수 전환: 1 → 2 → 3 (각각 입력 필드 개수 변경)
- [ ] Line 1 입력 → Canvas 실시간 반영
- [ ] Line 2, 3 입력 → 멀티라인 Canvas 렌더링
- [ ] 빈 텍스트 → 기본 "LOGO" 표시

### 폰트
- [ ] 폰트 드롭다운 열기 → 39종 표시, 각 폰트명이 해당 폰트로 렌더링
- [ ] 폰트 변경 → Canvas에 해당 폰트 적용 (로딩 후)
- [ ] 한글 폰트 (Black Han Sans, Noto Sans KR) 선택 → 한글 텍스트 정상 렌더링
- [ ] Weight가 1종만 있는 폰트 (Bebas Neue 등) → Weight 선택 UI 숨김
- [ ] Weight가 여러 종인 폰트 (Inter 등) → Weight 드롭다운 표시
- [ ] 폰트 변경 시 현재 Weight 미지원이면 → 자동으로 첫 번째 지원 Weight로 전환

### 색상
- [ ] 텍스트 색상 클릭 → 컬러 피커 팝업
- [ ] 컬러 피커에서 색 변경 → Canvas 실시간 반영
- [ ] HEX 직접 입력 (예: `FF0000`) → 빨간색 적용

### 텍스트 패딩
- [ ] 슬라이더 0% → 텍스트가 캔버스 꽉 채움
- [ ] 슬라이더 50% → 텍스트 크게 줄어듦
- [ ] 90%까지 올리면 → 매우 작은 텍스트

---

## 4. 텍스트 스타일

- [ ] Italic 토글 → Canvas에 이탤릭 적용/해제
- [ ] Uppercase 토글 → Canvas에 대문자 전환 (폭도 자동 조절)
- [ ] Underline 토글 → Canvas에 밑줄 표시
- [ ] Letter Spacing 슬라이더 → 글자 간격 넓어짐/좁아짐
- [ ] Letter Spacing 음수 → 글자 겹침
- [ ] Line Height 슬라이더 (2줄 이상일 때만 표시) → 줄 간격 변경
- [ ] Rotation 슬라이더 0° → 정상 / 90° → 옆으로 / 180° → 뒤집힘

---

## 5. 텍스트 효과

### 그림자 (Shadow)
- [ ] Shadow ON → Canvas에 그림자 표시
- [ ] 색상 변경 → 그림자 색 변경
- [ ] Offset X/Y 변경 → 그림자 위치 이동
- [ ] Blur 변경 → 그림자 흐림 정도
- [ ] Shadow OFF → 그림자 사라짐

### 외곽선 (Stroke)
- [ ] Stroke ON → 텍스트 외곽선 표시
- [ ] 색상 변경 → 외곽선 색 변경
- [ ] Width 변경 → 외곽선 두께
- [ ] Stroke OFF → 외곽선 사라짐

### 복합 테스트
- [ ] Shadow + Stroke 동시 ON → 두 효과 함께 표시
- [ ] Shadow + Letter Spacing → 그림자가 정상 표시 (문자별 중복 아님)

---

## 6. 서브텍스트 (슬로건)

- [ ] Sub Text ON → 입력 필드, 위치, 폰트, 색상 옵션 표시
- [ ] 텍스트 입력 → Canvas에 서브텍스트 표시
- [ ] 위치 Below → 메인 텍스트 아래
- [ ] 위치 Above → 메인 텍스트 위
- [ ] 폰트/Weight/색상 변경 → 서브텍스트에만 적용 (메인 영향 없음)
- [ ] Sub Text OFF → 서브텍스트 사라짐

---

## 7. 이미지 (Image Only / Text+Image)

### 업로드
- [ ] 업로드 영역 클릭 → 파일 선택 다이얼로그
- [ ] 이미지 파일 선택 → 썸네일 미리보기 + Canvas에 이미지 표시
- [ ] 드래그 앤 드롭 → 이미지 업로드
- [ ] Change Image 버튼 → 이미지 교체
- [ ] X 버튼 → 이미지 제거, Canvas에 "No image" 표시

### Fit 모드 (Image Only & Text+Image)
- [ ] Contain → 이미지 비율 유지, 영역 안에 맞춤
- [ ] Cover → 이미지 비율 유지, 영역 꽉 채움 (잘림 가능)
- [ ] Fill → 이미지 비율 무시, 영역 꽉 채움

### Text+Image 레이아웃
- [ ] Position Top → 이미지 위, 텍스트 아래
- [ ] Position Bottom → 텍스트 위, 이미지 아래
- [ ] Position Left → 이미지 왼쪽, 텍스트 오른쪽
- [ ] Position Right → 텍스트 왼쪽, 이미지 오른쪽
- [ ] Image Ratio 슬라이더 → 이미지 영역 비율 변경
- [ ] Gap 슬라이더 → 이미지와 텍스트 사이 간격

---

## 8. SVG (SVG Only)

- [ ] 업로드 영역 클릭 → .svg 파일 선택
- [ ] SVG 파일 업로드 → 미리보기(img 태그) + Canvas에 SVG 표시
- [ ] 드래그 앤 드롭 → SVG 업로드
- [ ] Change 버튼 → SVG 교체
- [ ] X 버튼 → SVG 제거

---

## 9. 배경

### 형태
- [ ] Rect 선택 → 사각형 배경
- [ ] Circle 선택 → 원형 배경 (내용이 원 안에 클리핑)

### 색상
- [ ] 퀵 프리셋 6종 클릭 → 즉시 배경색 변경
- [ ] 컬러 피커로 커스텀 색 → 배경색 변경
- [ ] 선택된 프리셋에 테두리 표시

### 투명
- [ ] Transparent ON → 체커보드 패턴 표시, 배경색 옵션 숨김
- [ ] Transparent OFF → 배경색 표시

### 패딩 & 라운드
- [ ] Canvas Padding 0% → 배경 가장자리까지 컨텐츠
- [ ] Canvas Padding 50% → 컨텐츠 크게 줄어듦
- [ ] Border Radius 0 → 직각 (사각형일 때만 표시)
- [ ] Border Radius 50+ → 둥근 모서리
- [ ] Circle 모드에서 → Border Radius 슬라이더 숨김

---

## 10. 그라디언트

- [ ] Gradient ON → 그라디언트 옵션 표시
- [ ] Linear 타입 → 8방향 버튼 표시
- [ ] 각 방향 클릭 → Canvas 그라디언트 방향 변경
- [ ] Radial 타입 → 방향 버튼 숨김, 원형 그라디언트 표시
- [ ] Color 1 변경 → 그라디언트 시작색 변경
- [ ] Color 2 변경 → 그라디언트 끝색 변경
- [ ] Position 슬라이더 → 각 색상 스톱 위치 조절
- [ ] "+ Add Color Stop" → 3번째 색 추가 (최대 3개)
- [ ] "Remove Last Stop" → 마지막 색 제거 (최소 2개)
- [ ] 프리셋 10종 중 하나 클릭 → 즉시 그라디언트 적용
- [ ] 그라디언트 미리보기 바 → 현재 설정 반영
- [ ] Gradient OFF → 단색 배경으로 복귀

---

## 11. 크기

### 일반 프리셋
- [ ] 512x512 선택 → Canvas 정사각형
- [ ] 1920x1080 선택 → Canvas 와이드 직사각형
- [ ] 16x16 선택 → Canvas 매우 작음
- [ ] Custom → W/H 직접 입력 가능

### 디바이스 프리셋
- [ ] Android 펼치기 → 6종 표시 (mdpi~playstore)
- [ ] iOS 펼치기 → 17종 표시
- [ ] Web 펼치기 → 6종 (favicon, og-image 등)
- [ ] macOS 펼치기 → 7종
- [ ] Windows 펼치기 → 6종
- [ ] 디바이스 프리셋 클릭 → Canvas 크기 즉시 변경

---

## 12. 내보내기

### PNG
- [ ] Format: PNG, Scale: 1x → 다운로드 → 파일 크기 = Canvas 크기
- [ ] Scale: 2x → 다운로드 → 파일 크기 = Canvas * 2
- [ ] 투명 배경 → PNG에 투명 배경 유지 (이미지 뷰어에서 확인)
- [ ] 파일명: `logo_512x512.png` 형식

### JPG
- [ ] Format: JPG → 다운로드
- [ ] 투명 배경 시 → 흰색 배경으로 대체 (검은색 아님)
- [ ] 파일명: `logo_512x512.jpg` 형식

### SVG
- [ ] Format: SVG → 다운로드
- [ ] 브라우저에서 SVG 열기 → 텍스트가 벡터로 표시 (확대해도 선명)
- [ ] 폰트가 정상 로드됨 (Google Fonts import)
- [ ] 그라디언트 배경 → SVG에 정상 표시
- [ ] 그림자/외곽선 → SVG에 반영
- [ ] 서브텍스트 → SVG에 포함
- [ ] 텍스트 회전 → SVG에 반영
- [ ] 다른 폰트로 변경 후 SVG 내보내기 → 폰트 크기 정확 (Canvas와 일치)

### Output 표시
- [ ] Output 크기 표시: `512 * 2 = 1024 x 1024 px` 등 정확

---

## 13. Undo/Redo

- [ ] 텍스트 변경 → Ctrl+Z → 이전 텍스트 복원
- [ ] Ctrl+Shift+Z → 다시 적용 (Redo)
- [ ] Ctrl+Y → Redo (대체 키)
- [ ] 슬라이더 드래그 → Undo 시 드래그 전 상태로 복원 (매 틱이 아님)
- [ ] Input 필드에서 Ctrl+Z → 브라우저 기본 Undo 동작 (커스텀 Undo 아님)

---

## 14. 리셋

- [ ] 여러 설정 변경 후 리셋 버튼(↺) 클릭 → 모든 설정 초기값 복원
- [ ] Canvas에 기본 "LOGO" 텍스트 표시

---

## 15. 크로스 모드 테스트

- [ ] Text Only에서 설정 변경 → Image Only로 전환 → 다시 Text Only → 텍스트 설정 유지
- [ ] 이미지 업로드 후 Text+Image → Image Only → Text+Image → 이미지 유지
- [ ] 그라디언트 ON 상태에서 모드 전환 → 배경 그라디언트 유지

---

## 16. 엣지 케이스

- [ ] 매우 긴 텍스트 입력 → FittedBox로 자동 축소 (넘치지 않음)
- [ ] Canvas Padding + Text Padding 합산 50%+ → "Too much padding" 표시
- [ ] Canvas 크기 1x1 → 크래시 없이 렌더링
- [ ] Canvas 크기 4096x4096 + Scale 4x → 내보내기 시도 (메모리 경고 없지만 동작)
- [ ] 이미지 없이 Image Only 모드 → "No image" 표시
- [ ] SVG 없이 SVG Only 모드 → "No SVG" 표시
- [ ] 그라디언트 3색 스톱 모두 position 50%로 → 급격한 색 전환 (크래시 없음)

---

## 17. 다크모드

- [ ] 라이트 → 다크 전환 시 에디터 패널 UI 정상 (텍스트 보임, 컨트롤 사용 가능)
- [ ] 컬러 피커 팝업 다크모드 정상
- [ ] 그라디언트 프리셋 미리보기 다크모드 정상

---

## 18. i18n

- [ ] 한국어 기본 로드 (헤더에 "Just Make Logo")
- [ ] 언어 전환 (English) → 헤더/푸터 텍스트 변경
- [ ] 새로고침 → 선택한 언어 유지
- [ ] hydration 에러 없음 (콘솔에 "Hydration failed" 경고 없음)
