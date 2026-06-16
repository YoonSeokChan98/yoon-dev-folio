# YOON.LOG — 포트폴리오 웹사이트

웹 개발자 윤석찬의 포트폴리오 사이트.  
Notion을 CMS(콘텐츠 관리 시스템)로 사용해 프로젝트 데이터를 관리하고, Next.js로 정적 생성(SSG + ISR)해 배포한다.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (Pages Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS v4 |
| CMS | Notion API (`@notionhq/client`) |
| 이메일 전송 | EmailJS (`@emailjs/browser`) |
| Discord 알림 | Discord Webhook (서버 API Route) |
| 주소 검색 | react-daum-postcode |
| 아이콘 | simple-icons (SVG path) |
| 배포 | Vercel (권장) |

---

## 디렉토리 구조

```
yoon-dev-folio/
├── public/                        # 정적 파일 (favicon 등)
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.tsx         # 고정 네비게이션 바 (스크롤 감지, 숨김/표시)
│   │   │   └── Footer.tsx         # 푸터 (연락 CTA, 소셜 링크)
│   │   ├── Hero.tsx               # 홈 히어로 섹션 (타이핑 애니메이션, 스탯 카드)
│   │   ├── About.tsx              # 자기소개 섹션 (스킬 태그, 인물 특성)
│   │   ├── ProjectList.tsx        # 프로젝트 목록 (카드 리스트)
│   │   ├── ProjectItem.tsx        # 프로젝트 카드 1개 (가로형, 교대 이미지 레이아웃)
│   │   ├── NotionRenderer.tsx     # Notion 블록 → React 엘리먼트 변환기
│   │   └── JobProposalForm.tsx    # 채용 제안 / 외주 문의 폼
│   ├── data/
│   │   └── skills.ts              # 기술 스택 데이터 (simple-icons 아이콘 포함)
│   ├── lib/
│   │   ├── notion.ts              # Notion API 유틸리티 함수
│   │   └── notionColors.ts        # Notion 태그 색상 팔레트 매핑
│   ├── pages/
│   │   ├── _app.tsx               # 전역 레이아웃 (Header + Footer 래핑)
│   │   ├── _document.tsx          # HTML 문서 뼈대 (lang="ko" 설정)
│   │   ├── index.tsx              # 홈 페이지 (/)
│   │   ├── proposal.tsx           # 채용/외주 문의 페이지 (/proposal)
│   │   ├── api/
│   │   │   └── proposal.ts        # Discord 웹훅 API Route (서버 사이드)
│   │   └── projects/
│   │       ├── index.tsx          # 프로젝트 목록 페이지 (/projects)
│   │       └── [id].tsx           # 프로젝트 상세 페이지 (/projects/[id])
│   ├── styles/
│   │   └── globals.css            # 전역 스타일 (애니메이션 키프레임, 유틸리티 클래스)
│   └── types/
│       └── notion.ts              # Notion API 응답 TypeScript 타입 정의
├── .env                           # 환경변수 (git 추적 제외)
├── next.config.ts
├── postcss.config.mjs             # Tailwind v4 PostCSS 설정
└── tsconfig.json
```

---

## 페이지 구성

### `/` — 홈
- **Hero 섹션**: 풀스크린, 타이핑 롤 애니메이션, CTA 버튼, 스탯 카드
- **About 섹션**: 자기소개, 기술 스택 태그, 인물 특성 카드

### `/projects` — 프로젝트 목록
- Notion DB의 프로젝트를 최신순(WorkPeriod 기준)으로 가로 카드 레이아웃으로 나열
- 짝수/홀수 인덱스에 따라 이미지가 좌/우 교대 배치

### `/projects/[id]` — 프로젝트 상세
- Notion 페이지의 커버 이미지, 메타 정보, 기술 스택, 본문 블록 렌더링

### `/proposal` — 채용 제안 / 외주 문의
- **채용 제안 폼**: 회사명, 공고링크, 연락처 (필수) + 직책·업무·주소 (선택)
- **외주 문의 폼**: 이름, 개요, 연락처 (필수) + 예산·일정 (선택)
- **전송 방식**: 폼(EmailJS + Discord) / 이메일(mailto 링크)

---

## 환경변수 설정 (`.env`)

```env
# Notion
NOTION_API_KEY=secret_xxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# EmailJS (클라이언트 사이드 — NEXT_PUBLIC_ 접두사 필수)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx

# Discord Webhook (서버 사이드 — NEXT_PUBLIC_ 없음)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxx/xxxx
```

> `.env` 파일은 `.gitignore`에 포함되어 있으므로 절대 커밋하지 않는다.

---

## Notion DB 설정

프로젝트 Notion DB의 컬럼명이 아래와 일치해야 한다.  
이름이 다르면 `src/types/notion.ts`의 `NotionProjectProperties` 키를 수정한다.

| Notion 컬럼명 | 타입 | 설명 |
|--------------|------|------|
| `Name` | title | 프로젝트 제목 |
| `ProjectType` | multi_select | 프로젝트 구분 (팀/개인 등) |
| `Skills` | multi_select | 사용 기술 |
| `WorkPeriod` | date | 작업 기간 (시작 ~ 종료) |
| `Description` | rich_text | 한 줄 설명 |
| `Github` | url | GitHub 저장소 URL |
| `TeamComposition` | rich_text | 팀 구성 (예: "4인 팀") |

---

## 데이터 흐름

```
Notion DB
   │
   ├─ getNotionData()      → 프로젝트 목록 (index.tsx, projects/index.tsx)
   ├─ getNotionPage(id)    → 단일 프로젝트 메타 (projects/[id].tsx)
   └─ getNotionBlocks(id)  → 본문 블록 배열 → NotionRenderer
```

- 모든 Notion 데이터는 **서버 사이드(getStaticProps)**에서만 조회한다.
- **ISR**(Incremental Static Regeneration): `revalidate: 3600` → 1시간마다 백그라운드 재생성
- Notion에 프로젝트를 추가하면 **최대 1시간 후** 사이트에 반영된다.  
  즉시 반영이 필요하면 Vercel 대시보드에서 수동 재배포한다.

---

## 채용 제안 전송 흐름

```
사용자가 폼 작성 → 제출 → 확인 모달
   └─ 확인 클릭
        ├─ EmailJS.send()       → 이메일 수신 (shift71895@gmail.com)
        └─ POST /api/proposal   → Discord 웹훅 → Discord 채널 메시지
```

---

## 스크롤 애니메이션

| 클래스 | 동작 | 사용처 |
|--------|------|--------|
| `.reveal` | 아래→위 등장 | About, ProjectList |
| `.reveal-right` | 오른쪽→왼쪽 등장 | About 스킬 카드 |
| `.is-visible` | 등장 트리거 | IntersectionObserver가 자동 추가 |
| `.delay-100` ~ `.delay-700` | 순차 딜레이 | 여러 요소 순서대로 등장 |
| `.animate-fade-in-up` | 페이드인업 (1회) | Hero 요소들 |
| `.animate-float` | 무한 부유 | Hero 배경 블롭 |

> `scroll-behavior: smooth`는 전역으로 사용하지 않는다.  
> 해시 앵커(`/#about`) 스크롤은 `Header.tsx`의 JS `scrollIntoView`로 처리한다.  
> (이유: 전역 smooth를 쓰면 페이지 전환 시 슬라이드 현상 발생)

---

## 기술 스택 추가 방법 (`src/data/skills.ts`)

1. `simple-icons` 패키지에서 원하는 브랜드 아이콘 이름 확인:
   ```bash
   node -e "const si = require('simple-icons'); console.log(si.siReact ? 'OK' : 'NOT FOUND')"
   ```
2. `skills.ts` 에서 import하고 SKILLS 배열에 항목 추가:
   ```ts
   import { siNewbrand } from 'simple-icons';
   // SKILLS 배열의 적절한 카테고리에 추가:
   { name: 'Brand Name', bg: '#...', text: '#...', border: '#...', icon: siNewbrand.path }
   ```
3. `TOTAL_SKILL_COUNT`는 자동으로 갱신된다.

---

## 로컬 개발

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 서버 실행
```

---

## 주요 파일 수정 가이드

| 하고 싶은 것 | 수정 파일 |
|-------------|-----------|
| 네비게이션 메뉴 변경 | `src/components/Layout/Header.tsx` — `NAV` 배열 |
| 소개글 / 인물 특성 수정 | `src/components/About.tsx` — `TRAITS` 배열, 소개 텍스트 |
| 스킬 추가 / 삭제 | `src/data/skills.ts` — `SKILLS` 배열 |
| Notion 태그 색상 변경 | `src/lib/notionColors.ts` — `NOTION_TAG_COLOR` |
| Notion DB 컬럼명 변경 대응 | `src/types/notion.ts` — `NotionProjectProperties` |
| Discord 알림 수신자 변경 | `src/pages/api/proposal.ts` — `<@사용자ID>` 숫자 교체 |
| 이메일 주소 변경 | `src/components/JobProposalForm.tsx` — `shift71895@gmail.com` 교체 |
| 전역 애니메이션 추가 | `src/styles/globals.css` — `@keyframes` 및 유틸리티 클래스 추가 |
| 소셜 링크 변경 | `src/components/Layout/Footer.tsx`, `src/components/About.tsx` |
