/**
 * @file src/pages/projects/index.tsx
 * @description 프로젝트 목록 페이지 (/projects)
 *
 * Header에서 "프로젝트" 메뉴 클릭 시 이동하는 페이지.
 * Notion DB의 전체 프로젝트를 WorkPeriod(시작일) 기준 최신순으로 정렬해 표시한다.
 *
 * 데이터 흐름:
 *   getStaticProps → getNotionData() → 날짜 내림차순 정렬 → ProjectList 컴포넌트
 *
 * 각 프로젝트 카드 클릭 시 /projects/[id] (상세 페이지)로 이동.
 *
 * ISR: revalidate 3600초 (1시간)
 */

import Head from 'next/head';
import ProjectList from '@/components/ProjectList';
import getNotionData from '@/lib/notion';
import type { NotionProject } from '@/types/notion';

export default function ProjectsPage({ projects }: { projects: NotionProject[] }) {
  return (
    <>
      <Head>
        <title>Projects — Yoon.log</title>
        <meta name="description" content="윤의 프로젝트 목록" />
      </Head>
      {/* pt-16: 고정 Header(h-16)에 가려지지 않도록 상단 패딩 */}
      <div className="pt-16">
        <ProjectList projects={projects} />
      </div>
    </>
  );
}

/**
 * 빌드 시 서버에서 실행 (SSG + ISR)
 * 프로젝트를 WorkPeriod.date.start 기준 내림차순(최신순)으로 정렬한다.
 * start가 없는(미입력) 항목은 빈 문자열로 처리되어 목록 뒤로 밀린다.
 */
export async function getStaticProps() {
  try {
    const projects = await getNotionData();
    const sorted = [...projects].sort((a, b) => {
      const aDate = a.properties.WorkPeriod.date?.start ?? '';
      const bDate = b.properties.WorkPeriod.date?.start ?? '';
      return bDate.localeCompare(aDate); // 내림차순 (최신 → 과거)
    });
    return {
      props: { projects: sorted },
      revalidate: 3600,
    };
  } catch {
    return { props: { projects: [] } };
  }
}
