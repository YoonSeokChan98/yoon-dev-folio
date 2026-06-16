/**
 * @file src/pages/projects/[id].tsx
 * @description 프로젝트 상세 페이지 (/projects/[id])
 *
 * 프로젝트 목록에서 카드를 클릭하면 이 페이지로 이동한다.
 * [id] = Notion 페이지 UUID
 *
 * 데이터 흐름:
 *   getStaticPaths → 모든 프로젝트 ID로 정적 경로 생성
 *   getStaticProps → getNotionPage(id) + getNotionBlocks(id) → 병렬 조회
 *     → project : 메타 정보 (제목, 커버, 기간, 스택, 링크 등)
 *     → blocks  : 본문 블록 배열 → NotionRenderer 컴포넌트가 HTML로 렌더링
 *
 * 표시 항목:
 *   - 커버 이미지 (Notion 커버)
 *   - 프로젝트 타입 태그 (ProjectType multi_select)
 *   - 제목, 한 줄 설명
 *   - 메타 정보: 기간, 팀 구성, GitHub 링크
 *   - 기술 스택 태그 (Skills multi_select)
 *   - Notion 본문 (NotionRenderer로 렌더링)
 *
 * ISR: revalidate 3600초
 * fallback: 'blocking' → 새 프로젝트 추가 시 첫 방문자가 기다리며 정적 생성
 */

import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import getNotionData, { getNotionPage, getNotionBlocks } from '@/lib/notion';
import NotionRenderer from '@/components/NotionRenderer';
import type { NotionProject } from '@/types/notion';
import { NOTION_TAG_COLOR } from '@/lib/notionColors';

interface Props {
  project: NotionProject;
  blocks: any[]; // Notion 블록 배열 (NotionRenderer에서 타입별로 처리)
}

export default function ProjectDetailPage({ project, blocks }: Props) {
  const item = project.properties;

  // 각 property에서 표시할 값 추출
  const title = item.Name.title[0]?.plain_text || 'Untitled';
  const projectTypes = item.ProjectType.multi_select || [];
  const techStack = item.Skills.multi_select || [];
  const startDate = item.WorkPeriod.date?.start || '';
  const endDate = item.WorkPeriod.date?.end || '';
  const description = item.Description.rich_text[0]?.plain_text || '';
  const github = item.Github?.url || null;
  const teamComposition = item.TeamComposition?.rich_text[0]?.plain_text || '';

  // 커버 이미지: external(URL 등록) 우선, 없으면 file(직접 업로드)
  const coverImg = project.cover?.external?.url || project.cover?.file?.url || '';

  // 기간 포맷: "2024.05 — 2024.07" 또는 "2024.05 — Present"
  const period = startDate
    ? `${startDate.replace(/-/g, '.')} — ${endDate ? endDate.replace(/-/g, '.') : 'Present'}`
    : '';

  return (
    <>
      <Head>
        <title>{title} — Yoon.log</title>
        <meta name="description" content={description} />
      </Head>

      <div className="pt-16 min-h-screen bg-[#f0f5ff]">
        {/* 커버 이미지 영역 */}
        {coverImg && (
          <div className="w-full h-64 sm:h-80 overflow-hidden">
            <img src={coverImg} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-6 py-16">
          {/* 목록으로 돌아가는 링크 */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-600 transition-colors mb-10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            프로젝트 목록
          </Link>

          {/* 헤더 영역: 태그 → 제목 → 설명 → 메타 정보 */}
          <div className="mb-10">
            {/* ProjectType 태그 (팀 프로젝트, 개인 프로젝트 등) */}
            <div className="flex flex-wrap gap-2 mb-4">
              {projectTypes.map((t) => (
                <span
                  key={t.id}
                  style={NOTION_TAG_COLOR[t.color] ?? NOTION_TAG_COLOR.default}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-full"
                >
                  {t.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#1a1a2e] tracking-tighter leading-tight mb-4">
              {title}
            </h1>

            {description && (
              <p className="text-slate-500 text-[15px] leading-relaxed mb-6">{description}</p>
            )}

            {/* 기간 / 팀 구성 / GitHub 링크 */}
            <div className="flex flex-wrap gap-6 text-sm text-slate-400 border-t border-slate-200 pt-6">
              {period && (
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-slate-300 mb-1">기간</p>
                  <p className="text-slate-600 font-medium">{period}</p>
                </div>
              )}
              {teamComposition && (
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-slate-300 mb-1">팀 구성</p>
                  <p className="text-slate-600 font-medium">{teamComposition}</p>
                </div>
              )}
              {github && (
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-slate-300 mb-1">GitHub</p>
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 font-medium hover:text-indigo-700 transition-colors break-all"
                  >
                    {github.replace('https://github.com/', '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 기술 스택 태그 (Skills multi_select) */}
          {techStack.length > 0 && (
            <div className="mb-10">
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-300 mb-3">기술 스택</p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech.id}
                    style={NOTION_TAG_COLOR[tech.color] ?? NOTION_TAG_COLOR.default}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notion 본문 블록 — NotionRenderer 컴포넌트가 블록 타입별로 렌더링 */}
          {blocks.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 px-8 py-10">
              <NotionRenderer blocks={blocks} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * 빌드 시 존재하는 모든 프로젝트 ID로 정적 경로를 생성한다.
 * fallback: 'blocking' → 빌드 후 추가된 프로젝트는 첫 방문 시 서버에서 생성
 */
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const projects = await getNotionData();
    const paths = projects.map((p) => ({ params: { id: p.id } }));
    return { paths, fallback: 'blocking' };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
};

/**
 * 각 프로젝트 페이지의 데이터를 빌드 시 조회한다.
 * getNotionPage와 getNotionBlocks를 병렬(Promise.all)로 실행해 속도를 최적화한다.
 */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  try {
    const [project, blocks] = await Promise.all([
      getNotionPage(id),
      getNotionBlocks(id),
    ]);
    if (!project) return { notFound: true };
    return { props: { project, blocks }, revalidate: 3600 };
  } catch {
    return { notFound: true };
  }
};
