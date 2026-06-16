/**
 * @file src/lib/notion.ts
 * @description Notion API 통신 유틸리티 함수 모음
 *
 * 서버 사이드 전용 (getStaticProps, getStaticPaths, API Route 에서만 호출)
 * 클라이언트 컴포넌트에서 직접 호출하면 API 키가 노출되므로 절대 사용 금지.
 *
 * 필요한 환경변수 (.env 파일):
 *   NOTION_API_KEY       : Notion Integration 비밀 키
 *   NOTION_DATABASE_ID   : 프로젝트 목록 DB의 UUID
 *
 * 참조처:
 *   - src/pages/index.tsx           : getStaticProps → getNotionData()
 *   - src/pages/projects/index.tsx  : getStaticProps → getNotionData()
 *   - src/pages/projects/[id].tsx   : getStaticProps → getNotionPage(), getNotionBlocks()
 */

import { Client } from '@notionhq/client';
import type { NotionProject } from '@/types/notion';

/**
 * 요청마다 새 Notion 클라이언트 인스턴스를 생성해 반환한다.
 * 싱글톤 대신 함수로 감싼 이유: Next.js ISR 환경에서 모듈이 재사용될 때
 * API 키가 변경된 경우를 대비해 매번 환경변수를 새로 읽는다.
 *
 * @throws API 키가 없으면 에러를 던진다 (서버 시작 전에 .env 를 확인할 것)
 */
const getClient = () => {
  const API_KEY = process.env.NOTION_API_KEY;
  if (!API_KEY) throw new Error('NOTION_API_KEY가 설정되지 않았습니다.');
  return new Client({ auth: API_KEY });
};

/**
 * Notion DB에서 프로젝트 목록 전체를 가져온다.
 * 정렬은 호출 쪽(pages/projects/index.tsx)에서 WorkPeriod 기준으로 수행한다.
 *
 * @returns NotionProject 배열 (에러 시 빈 배열 반환)
 *
 * 호출처:
 *   - src/pages/index.tsx          (getStaticProps, revalidate 3600초)
 *   - src/pages/projects/index.tsx (getStaticProps, revalidate 3600초)
 */
const getNotionData = async (): Promise<NotionProject[]> => {
  const DATABASE_ID = process.env.NOTION_DATABASE_ID;
  if (!process.env.NOTION_API_KEY || !DATABASE_ID) {
    console.error('노션 API 키 또는 데이터베이스 ID가 설정되지 않았습니다.');
    return [];
  }

  try {
    const notion = getClient();
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 100, // 프로젝트가 100개 초과 시 페이지네이션 추가 필요
    });
    // Notion SDK의 반환 타입을 우리 커스텀 타입으로 캐스팅
    return response.results as unknown as NotionProject[];
  } catch (error) {
    console.error('Notion API 에러:', error);
    return [];
  }
};

/**
 * 단일 Notion 페이지(프로젝트 1개)의 메타 정보를 가져온다.
 * 커버 이미지, properties(제목·기간·링크 등)를 포함한다.
 * 블록(본문 내용)은 getNotionBlocks() 로 별도 조회한다.
 *
 * @param pageId - Notion 페이지 UUID (URL의 마지막 부분)
 * @returns NotionProject 또는 null (에러·미존재 시)
 *
 * 호출처: src/pages/projects/[id].tsx (getStaticProps)
 */
export const getNotionPage = async (pageId: string): Promise<NotionProject | null> => {
  try {
    const notion = getClient();
    const page = await notion.pages.retrieve({ page_id: pageId });
    return page as unknown as NotionProject;
  } catch (error) {
    console.error('Notion 페이지 에러:', error);
    return null;
  }
};

/**
 * Notion 페이지의 블록(본문 콘텐츠) 전체를 페이지네이션으로 수집한다.
 * 블록이 100개 초과인 경우 next_cursor 로 계속 조회한다.
 * 수집된 블록 배열은 NotionRenderer 컴포넌트에서 렌더링된다.
 *
 * 지원 블록 타입 (NotionRenderer 참고):
 *   heading_1/2/3, paragraph, bulleted_list_item, numbered_list_item,
 *   code, quote, divider, image, callout, toggle
 *
 * @param pageId - Notion 페이지 UUID
 * @returns 블록 객체 배열 (에러 시 빈 배열)
 *
 * 호출처: src/pages/projects/[id].tsx (getStaticProps)
 */
export const getNotionBlocks = async (pageId: string): Promise<any[]> => {
  try {
    const notion = getClient();
    const blocks: any[] = [];
    let cursor: string | undefined;

    // Notion API는 한 번에 최대 100개 블록만 반환하므로 has_more 인 경우 반복 조회
    do {
      const res = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });
      blocks.push(...res.results);
      cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
    } while (cursor);

    return blocks;
  } catch (error) {
    console.error('Notion 블록 에러:', error);
    return [];
  }
};

export default getNotionData;
