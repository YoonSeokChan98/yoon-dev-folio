import React from 'react';
import type { NotionProject } from '@/types/notion';

interface ProjectItemProps {
  data: NotionProject;
}

const ProjectItem = ({ data }: ProjectItemProps) => {
  const item = data.properties;

  const title = item.Title.title[0]?.plain_text || 'Untitled';
  const subTitle = item.SubTitle.rich_text[0]?.plain_text || '';
  const techStack = item.TechStack.multi_select || [];
  const startDate = item.Period.date?.start || '';
  const endDate = item.Period.date?.end || '';
  const description = item.Description.rich_text[0]?.plain_text || '';
  const coverImg = data.cover?.external?.url || data.cover?.file?.url || '';

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60 transition-all duration-500">
      {/* 이미지 */}
      <div className="relative h-52 overflow-hidden bg-slate-50">
        {coverImg ? (
          <img
            src={coverImg}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-indigo-50">
            <span className="text-xs tracking-widest uppercase text-slate-300">No Preview</span>
          </div>
        )}
        {/* 날짜 배지 */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-semibold text-slate-600 border border-white/60 shadow-sm">
          {startDate.replace(/-/g, '.')} {endDate ? `— ${endDate.replace(/-/g, '.')}` : '— Present'}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-col p-6 flex-grow">
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-base font-bold text-[#1a1a2e] tracking-tight group-hover:text-indigo-700 transition-colors leading-snug">
              {title}
            </h3>
            <svg
              className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0 mt-0.5"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
          <p className="text-[12px] font-medium text-slate-400">{subTitle}</p>
        </div>

        <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 mb-6 flex-grow">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {techStack.map((tech) => (
            <span key={tech.id}
              className="px-2.5 py-1 text-[10px] font-medium rounded-md bg-slate-50 text-slate-500 border border-slate-100 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-default">
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
