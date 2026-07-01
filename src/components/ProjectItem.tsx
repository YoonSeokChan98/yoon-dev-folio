/**
 * @file src/components/ProjectItem.tsx
 * @description 프로젝트 목록의 개별 카드 컴포넌트 (가로형 레이아웃)
 *
 * 참조처: src/components/ProjectList.tsx
 *
 * Props:
 *   data  (NotionProject) : Notion DB 단일 프로젝트 데이터
 *   index (number)        : 목록에서의 순서 (0부터 시작)
 *     - 이미지 좌/우 교대 배치에 사용 (짝수=이미지 왼쪽, 홀수=이미지 오른쪽)
 *     - 번호 배지(01, 02...) 표시에 사용
 *
 * 동작:
 *   - 전체 카드가 Link 컴포넌트로 감싸져 클릭 시 /projects/[id] 로 이동
 *   - 커버 이미지: external URL 우선, 없으면 file URL, 둘 다 없으면 "No Preview" 플레이스홀더
 *   - 기술 스택 태그는 최대 5개만 표시하고 초과분은 "+N" 으로 표시
 *   - 태그 색상: NOTION_TAG_COLOR (src/lib/notionColors.ts) 에서 Notion 컬러 매핑
 */

import React from 'react';
import Link from 'next/link';
import type { NotionProject } from '@/types/notion';
import { NOTION_TAG_COLOR } from '@/lib/notionColors';
import ArrowIcon from '@/components/ui/ArrowIcon';
import TagBadge from '@/components/ui/TagBadge';

interface ProjectItemProps {
  data: NotionProject;
  index: number;
}

const ProjectItem = ({ data, index }: ProjectItemProps) => {
  const item = data.properties;

  // Notion properties에서 표시할 값 추출
  const title = item.Name.title[0]?.plain_text || 'Untitled';
  const projectTypes = item.ProjectType.multi_select || [];
  const techStack = item.Skills.multi_select || [];
  const startDate = item.WorkPeriod.date?.start || '';
  const endDate = item.WorkPeriod.date?.end || '';
  const description = item.Description.rich_text[0]?.plain_text || '';

  // 커버 이미지: external(외부 URL) 우선, file(업로드) 차선
  const coverImg = data.cover?.external?.url || data.cover?.file?.url || '';

  // 기간 포맷: "2024.05 — 2024.07" (slice(0,7) = "YYYY-MM")
  const period = startDate
    ? `${startDate.slice(0, 7).replace('-', '.')} — ${endDate ? endDate.slice(0, 7).replace('-', '.') : 'Present'}`
    : '';

  // 짝수 인덱스: 이미지 왼쪽 / 홀수 인덱스: 이미지 오른쪽
  const isEven = index % 2 === 0;

  return (
    <Link
      href={`/projects/${data.id}`}
      className="group flex flex-col sm:flex-row bg-white rounded-2xl border border-blue-100 overflow-hidden hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/60 transition-all duration-500 hover:-translate-y-1"
    >
      {/* ── 커버 이미지 영역 ── */}
      <div className={`relative sm:w-72 shrink-0 h-52 sm:h-auto overflow-hidden bg-blue-50 ${isEven ? 'sm:order-first' : 'sm:order-last'}`}>
        {coverImg ? (
          <img
            src={coverImg}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          // 커버 이미지 없을 때 플레이스홀더
          <div className="flex items-center justify-center w-full h-full min-h-[180px] bg-gradient-to-br from-blue-50 to-sky-100">
            <span className="text-xs tracking-widest uppercase text-blue-300">No Preview</span>
          </div>
        )}
        {/* 순서 번호 배지 (01, 02, ...) */}
        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[11px] font-black text-blue-600 shadow-sm">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      {/* ── 텍스트 콘텐츠 영역 ── */}
      <div className="flex flex-col justify-between p-7 flex-grow">
        <div>
          {/* 기간 + 프로젝트 타입 태그 */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            {period && <span className="text-[11px] font-medium text-slate-400">{period}</span>}
            <div className="flex flex-wrap gap-1.5">
              {projectTypes.map((t) => (
                <TagBadge
                  key={t.id}
                  name={t.name}
                  style={NOTION_TAG_COLOR[t.color] ?? NOTION_TAG_COLOR.default}
                  size="xs"
                />
              ))}
            </div>
          </div>

          {/* 프로젝트 제목 */}
          <h3 className="text-xl font-black text-[#0f172a] tracking-tight group-hover:text-blue-600 transition-colors leading-snug mb-2">
            {title}
          </h3>

          {/* 한 줄 설명 (2줄까지만 표시) */}
          <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* 하단: 기술 스택 태그 + 오른쪽 화살표 */}
        <div className="flex items-end justify-between gap-4 mt-6">
          <div className="flex flex-wrap gap-1.5">
            {techStack.slice(0, 5).map((tech) => (
              <TagBadge
                key={tech.id}
                name={tech.name}
                style={NOTION_TAG_COLOR[tech.color] ?? NOTION_TAG_COLOR.default}
                size="sm"
              />
            ))}
            {techStack.length > 5 && (
              <TagBadge
                name={`+${techStack.length - 5}`}
                style={{ background: 'rgb(239 246 255)', color: 'rgb(147 197 253)' }}
                size="sm"
              />
            )}
          </div>

          {/* 호버 시 오른쪽으로 이동하는 화살표 */}
          <ArrowIcon className="w-5 h-5 text-blue-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0" />
        </div>
      </div>
    </Link>
  );
};

export default ProjectItem;
