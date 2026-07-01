/**
 * @file src/components/ProjectList.tsx
 * @description 프로젝트 목록을 카드 형태로 렌더링하는 컴포넌트
 *
 * 참조처: src/pages/projects/index.tsx
 *
 * Props:
 *   projects (NotionProject[])
 *     - Notion DB에서 가져온 프로젝트 배열
 *     - 정렬(최신순)은 호출 페이지(getStaticProps)에서 완료된 상태로 전달됨
 *
 * 스크롤 애니메이션:
 *   각 프로젝트 카드를 RevealBlock으로 감싸 뷰포트 진입 시 순차적으로 등장시킨다.
 *   딜레이는 최대 400ms로 제한 (카드가 많아도 너무 늦게 등장하지 않도록).
 *
 * 카드 렌더링은 ProjectItem 컴포넌트에 위임 (레이아웃, 데이터 표시 담당).
 */

import ProjectItem from './ProjectItem';
import RevealBlock from '@/components/ui/RevealBlock';
import SectionLabel from '@/components/ui/SectionLabel';
import type { NotionProject } from '@/types/notion';

const ProjectList = ({ projects }: { projects: NotionProject[] }) => {
  return (
    <section className="min-h-screen bg-[#f0f5ff]">

      {/* 섹션 헤더 */}
      <div className="max-w-4xl mx-auto px-6 pt-14 pb-10">
        <SectionLabel text="Portfolio" className="mb-3" />
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-4xl sm:text-5xl font-black text-[#0f172a] tracking-tighter leading-tight">
            Selected<br />
            {/* pr-1: 그라디언트 텍스트 "s" 오른쪽이 잘리지 않도록 여백 추가 */}
            <span className="gradient-text inline-block pb-1 pr-1">Projects</span>
          </h1>
          {/* 총 프로젝트 수 */}
          <p className="text-sm text-slate-400 pb-1">
            Total <span className="text-2xl font-black text-[#0f172a] ml-1">{projects.length}</span>
          </p>
        </div>
      </div>

      {/* 헤더 하단 구분선 */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
      </div>

      {/* 프로젝트 카드 목록 */}
      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-5">
        {projects.map((project, index) => (
          <RevealBlock
            key={project.id}
            delay={Math.min(index * 100, 400)}
            threshold={0.08}
          >
            {/* ProjectItem: 가로형 카드, 짝수/홀수 인덱스에 따라 이미지 좌/우 교대 배치 */}
            <ProjectItem data={project} index={index} />
          </RevealBlock>
        ))}
      </div>
    </section>
  );
};

export default ProjectList;
