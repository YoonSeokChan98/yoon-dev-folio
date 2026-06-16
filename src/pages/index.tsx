/**
 * @file src/pages/index.tsx
 * @description 메인 홈 페이지 (/)
 *
 * 구성 섹션:
 *   1. <Hero />  — 풀스크린 히어로: 이름, 타이핑 롤, CTA 버튼, 스탯 카드
 *   2. <About /> — 자기소개, 스킬 태그, 인물 특성 카드
 *
 * 데이터 흐름:
 *   getStaticProps (서버) → Notion DB에서 프로젝트 목록 조회
 *     → projects.length → Hero (스탯 카드 "Projects" 값)
 *     → projects.length → About (통계 수치)
 *
 * ISR 설정: revalidate: 3600 → 1시간마다 백그라운드에서 재생성
 * (Notion에 프로젝트를 추가하면 최대 1시간 후 반영)
 */

import Head from 'next/head';
import Hero from '@/components/Hero';
import About from '@/components/About';
import getNotionData from '@/lib/notion';
import type { NotionProject } from '@/types/notion';

export default function Home({ projects }: { projects: NotionProject[] }) {
  return (
    <>
      <Head>
        <title>Yoon.log — Web Developer</title>
        <meta name="description" content="노션 API를 활용한 웹 개발자 윤의 포트폴리오" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero: projectCount prop으로 Notion에서 가져온 실제 프로젝트 수 전달 */}
      <Hero projectCount={projects.length} />

      {/* About: 동일한 수치를 소개 섹션 통계에도 사용 */}
      <About projectCount={projects.length} />
    </>
  );
}

/**
 * 빌드 시 서버에서 실행 (SSG + ISR)
 * Notion API를 호출해 프로젝트 수를 계산한다.
 * 에러 발생 시 빈 배열을 반환해 페이지 자체가 실패하지 않도록 처리.
 */
export async function getStaticProps() {
  try {
    const projects = await getNotionData();
    return {
      props: { projects },
      revalidate: 3600, // 1시간 후 백그라운드 재생성
    };
  } catch {
    return { props: { projects: [] } };
  }
}
