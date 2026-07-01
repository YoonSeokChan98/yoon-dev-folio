# 🎨 코드 스타일 서약서

## 1. 제어 흐름
- Guard Clauses 필수: 예외/실패 케이스는 상단 Early Return 처리
- if-else 중첩 구조 금지

## 2. 네이밍
- e, res, data 같은 모호한 축약 금지
- 비즈니스 성격이 드러나는 영어 정석 네이밍

## 3. 예외 처리
- 빈 catch 블록 금지
- 최소한 구조적 에러 로깅 또는 상위 전파 보장
- 외부 시스템 경계(API, DB, 파일 I/O)에서만 예외 포착, 내부 로직은 실패 즉시 전파

## 4. 컴포넌트 분리 원칙 (프론트엔드)
- UI 요소는 최소 단위로 분리: Button, SearchBar, Modal 등 각각 독립 파일
- 공통으로 2회 이상 쓰이는 UI는 반드시 컴포넌트로 추출
- 페이지 컴포넌트는 레이아웃 조립만 담당, 로직은 hooks/로 분리

## 5. 디자인 토큰 (CSS 변수화 필수)
- 색상, 폰트, 간격 값을 절대 하드코딩 금지
- 반드시 토큰 파일(예: tokens.css, theme.ts)에서 변수로 정의 후 참조
- 예: mainColor, subColor, titleFont, descFont, spacingBase 등

## 6. 함수 주석 (필수 — 생략 금지)
모든 함수에 아래 형식의 주석을 반드시 작성한다:
- 함수가 하는 일 한 줄 설명
- @param: 파라미터명 — 타입 — 설명
- @request: HTTP 메서드 + URL (API 호출 함수인 경우)
- @usage: 어디서, 어떤 상황에 호출되는지

예시:
// 로그인 요청 함수
// @param userId: string — 사용자 아이디
// @param userPw: string — 사용자 비밀번호
// @request POST /api/auth/login
// @usage LoginForm 컴포넌트 제출 시 호출

## 7. 이 프로젝트 특이사항
- Tailwind CSS v4: `@apply` 대신 인라인 클래스 사용, `@layer utilities`에 커스텀 클래스 정의
- 스크롤 애니메이션: `RevealBlock` 컴포넌트 + `globals.css`의 `.reveal/.is-visible` 조합 사용
- simple-icons: `import { si이름 } from 'simple-icons'` 후 `.path` 속성으로 SVG path 추출
- Next.js Image 대신 `<img>` 사용 중 (Notion 외부 URL 도메인 설정 불필요)
