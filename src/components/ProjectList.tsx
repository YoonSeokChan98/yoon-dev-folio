import React from 'react';
import ProjectItem from './ProjectItem';
import type { NotionProject } from '@/types/notion';

const ProjectList = ({ projects }: { projects: NotionProject[] }) => {
  return (
    <section id="projects" className="py-32 bg-[#f5f5f0] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-6 bg-violet-500" />
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-violet-500">Portfolio</p>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-[#1a1a2e] tracking-tighter leading-tight">
              Selected
              <br />
              <span className="gradient-text">Projects</span>
            </h2>
          </div>
          <p className="text-sm text-slate-400 pb-1">
            Total <span className="text-2xl font-black text-[#1a1a2e] ml-1">{projects.length}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectItem key={project.id} data={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectList;
