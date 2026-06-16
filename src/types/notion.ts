/**
 * @file src/types/notion.ts
 * @description Notion API 응답 데이터의 TypeScript 타입 정의
 *
 * 참조처:
 *   - src/lib/notion.ts              : API 함수 반환 타입
 *   - src/pages/index.tsx            : Hero, About 컴포넌트 props
 *   - src/pages/projects/index.tsx   : 프로젝트 목록 페이지 props
 *   - src/pages/projects/[id].tsx    : 프로젝트 상세 페이지 props
 *   - src/components/ProjectItem.tsx : 카드 렌더링
 *   - src/components/ProjectList.tsx : 목록 렌더링
 *
 * ⚠️  Notion DB의 컬럼 이름이 바뀌면 NotionProjectProperties 키도 함께 수정해야 한다.
 */

/**
 * Notion rich_text / title 배열의 개별 항목 타입
 * API는 텍스트를 배열로 반환하므로, 실제 문자열은 [0].plain_text 로 접근한다.
 */
export interface NotionTextItem {
  plain_text: string;
}

/**
 * Notion multi_select 옵션 단일 항목 타입
 * Skills, ProjectType 컬럼에서 사용된다.
 * color 값은 src/lib/notionColors.ts 의 NOTION_TAG_COLOR 키와 대응된다.
 *   예: "blue" → { background: '#D3E5EF', color: '#337EA9' }
 */
export interface NotionSelectItem {
  id: string;    // Notion 내부 UUID
  name: string;  // 태그 이름 (예: "React", "팀 프로젝트")
  color: string; // Notion 색상 이름 (예: "blue", "green")
}

/**
 * 노션 페이지 커버 이미지 타입
 * external : 외부 URL 커버
 * file     : Notion 직접 업로드 커버 (만료 URL 주의 — ISR로 주기적 갱신 필요)
 */
export interface NotionCover {
  external?: { url: string };
  file?: { url: string };
}

/**
 * Notion DB 각 행(프로젝트)의 properties 타입
 * 키 이름 = Notion DB 컬럼 이름 (대소문자 구분)
 */
export interface NotionProjectProperties {
  /** 프로젝트 제목 (Notion title 타입) */
  Name: { title: NotionTextItem[] };

  /** 프로젝트 구분 태그 (예: "팀 프로젝트", "개인 프로젝트") */
  ProjectType: { multi_select: NotionSelectItem[] };

  /** 사용 기술 태그 (예: "React", "Next.js") */
  Skills: { multi_select: NotionSelectItem[] };

  /**
   * 작업 기간
   * date가 null → 날짜 미입력
   * end가 null  → 진행 중 (Present 로 표시)
   */
  WorkPeriod: { date: { start: string; end: string | null } | null };

  /** 프로젝트 한 줄 설명 */
  Description: { rich_text: NotionTextItem[] };

  /** GitHub 저장소 URL (없으면 null) */
  Github: { url: string | null };

  /** 팀 구성 텍스트 (예: "4인 팀 / FE 2 · BE 2") */
  TeamComposition: { rich_text: NotionTextItem[] };
}

/**
 * Notion DB 단일 행(프로젝트 1개) 전체 타입
 * getNotionData(), getNotionPage() 함수의 반환 타입
 */
export interface NotionProject {
  /** Notion 페이지 UUID. 상세 페이지 URL /projects/[id] 에 사용 */
  id: string;
  /** 커버 이미지 (없으면 null) */
  cover: NotionCover | null;
  /** DB 컬럼 데이터 */
  properties: NotionProjectProperties;
}
