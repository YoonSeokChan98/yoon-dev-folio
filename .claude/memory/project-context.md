# 🧠 프로젝트 컨텍스트 장기 기억 소자

## 1. 시스템 개요
- **프로젝트 명:** yoon-dev-folio — 윤석찬 웹 개발자 포트폴리오
- **아키텍처:** Next.js Pages Router SSG/ISR + Notion API 데이터 소스
- **빌드 명령어:** `npm run build` / 개발: `npm run dev`
- **검증 명령:** `tsc --noEmit && npm run lint`
- **INIT_COMPLETE:** true

## 2. 핵심 스택
- **프레임워크:** Next.js 16, React 19, TypeScript 5
- **스타일링:** Tailwind CSS v4 (postcss 방식, `@import 'tailwindcss'`)
- **데이터:** Notion API (`@notionhq/client`) — SSG getStaticProps + ISR revalidate:3600
- **이메일:** EmailJS (`@emailjs/browser`) — 채용/외주 제안 폼
- **아이콘:** simple-icons SVG path (패키지 직접 import)
- **기타:** react-daum-postcode (주소 검색)

## 3. 레이어 구조
```
pages/          ← 라우팅 + getStaticProps/getServerSideProps (데이터 fetch)
  ├── index.tsx       → Hero + About 조합
  ├── projects/index  → ProjectList
  ├── projects/[id]   → NotionRenderer (상세)
  └── proposal.tsx    → JobProposalForm

components/     ← UI 컴포넌트 (순수 렌더링)
  ├── Layout/Header.tsx
  ├── Layout/Footer.tsx
  ├── Hero.tsx
  ├── About.tsx
  ├── ProjectList.tsx
  ├── ProjectItem.tsx
  ├── NotionRenderer.tsx
  └── JobProposalForm.tsx

lib/            ← 외부 서비스 연동 (Notion API 호출)
  ├── notion.ts       → getNotionData(), getNotionPage()
  └── notionColors.ts → Notion 컬러 → CSS 스타일 매핑

data/           ← 정적 데이터
  └── skills.ts → SKILLS 배열, TOTAL_SKILL_COUNT

types/
  └── notion.ts → NotionProject 타입 정의
```

## 4. 인증 패턴
- 인증 없음 (정적 포트폴리오 사이트)
- Notion API 키는 `.env.local`의 `NOTION_TOKEN`, `NOTION_DATABASE_ID`로 관리
- EmailJS 키는 클라이언트 노출 허용 (공개 키 방식)

## 5. 주요 파일 위치
- Notion 데이터 fetch: `src/lib/notion.ts`
- 스킬 데이터 수정: `src/data/skills.ts`
- 전역 CSS / 애니메이션: `src/styles/globals.css`
- Notion 컬러 매핑: `src/lib/notionColors.ts`
- 공통 타입: `src/types/notion.ts`

## 6. 금지 패턴
- `pages/`에서 직접 Notion API 호출 금지 → `lib/notion.ts`를 통해서만
- 컴포넌트에서 fetch/API 호출 금지 → props로 데이터 받기
- 하드코딩 색상/폰트/간격 금지 → Tailwind 유틸리티 또는 CSS 변수 사용
- `any` 타입 사용 금지 → `src/types/notion.ts` 확장
- `RevealBlock`은 `About.tsx` 안에 정의됨 → 재사용 필요 시 `components/ui/RevealBlock.tsx`로 추출
