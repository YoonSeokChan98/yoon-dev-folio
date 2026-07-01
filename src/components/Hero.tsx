/**
 * @file src/components/Hero.tsx
 * @description 메인 홈 히어로 섹션 (풀스크린 인트로)
 *
 * 참조처: src/pages/index.tsx
 *
 * Props:
 *   projectCount (number, 기본값 0)
 *     - Notion DB에서 가져온 실제 프로젝트 수
 *     - index.tsx의 getStaticProps에서 projects.length 로 전달됨
 *     - 오른쪽 스탯 카드 "Projects" 값으로 표시
 *
 * 주요 기능:
 *   1. 타이핑 애니메이션 (Typewriter Effect)
 *      ROLES 배열의 텍스트를 순서대로 타이핑 → 대기 → 지우기 → 반복
 *      - 타이핑 속도: 80ms/글자
 *      - 지우기 속도: 35ms/글자
 *      - 완성 후 대기: 2200ms
 *
 *   2. 마운트 애니메이션
 *      mounted 상태가 false(SSR)일 때는 opacity-0, true(CSR 마운트 후)일 때 애니메이션 실행
 *      SSR에서는 애니메이션 없이 렌더링해 Hydration 불일치를 방지한다.
 *
 *   3. 스탯 카드 (xl 이상 화면에서만 표시)
 *      - Projects : projectCount prop (Notion DB 실제 값)
 *      - Tech Stack: TOTAL_SKILL_COUNT (skills.ts 에서 자동 계산)
 *      - Since : 2024 (하드코딩)
 *
 * 'use client' 지시어는 Pages Router에서 불필요하지만 명시적으로 남겨두었다.
 * (App Router로 마이그레이션 시 이 컴포넌트는 클라이언트 컴포넌트가 되어야 함)
 */

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TOTAL_SKILL_COUNT } from '@/data/skills';
import ArrowIcon from '@/components/ui/ArrowIcon';
import GitHubIcon from '@/components/ui/icons/GitHubIcon';
import StatCard from '@/components/ui/StatCard';
import useTypewriter from '@/hooks/useTypewriter';

/** 타이핑 애니메이션에 순환 표시할 역할 텍스트 배열 */
const ROLES = ['Web Developer', 'React / Next.js Engineer', 'UI/UX Enthusiast'];

const Hero = ({ projectCount = 0 }: { projectCount?: number }) => {
  const [mounted, setMounted] = useState(false);
  const displayed = useTypewriter({ roles: ROLES });

  // 마운트 직후 애니메이션 클래스 활성화 (SSR 불일치 방지)
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#f0f5ff]">

      {/* ── 배경 블롭 (흐릿한 원형 그라디언트) ── */}
      {/* 좌측 블롭: float-slow 애니메이션으로 천천히 부유 */}
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none animate-float-slow"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
      {/* 우측 블롭: float 애니메이션으로 부유 */}
      <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none animate-float"
        style={{ background: 'radial-gradient(circle, rgba(2,132,199,0.12) 0%, transparent 70%)' }} />
      {/* 중앙 블롭: 매우 연한 하늘색 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px] pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 60%)' }} />

      {/* 그리드 패턴 오버레이 (2.5% 투명도 — 거의 안 보이는 수준) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">

        {/* 상태 배지: "Available for work" */}
        <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-xs font-semibold tracking-widest uppercase mb-10 ${mounted ? 'animate-slide-down' : 'opacity-0'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Available for work · South Korea 🇰🇷
        </div>

        {/* 메인 헤딩: clamp로 반응형 폰트 크기 */}
        <h1 className={`text-[clamp(3.5rem,9vw,7.5rem)] font-black text-[#0f172a] tracking-tighter leading-[0.92] mb-8 ${mounted ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
          Hi, I&apos;m
          <br />
          <span className="gradient-text inline-block pb-2">Yoon Seok Chan</span>
        </h1>

        {/* 타이핑 텍스트 영역: 고정 높이로 레이아웃 흔들림 방지 */}
        <div className={`flex items-center mb-8 h-10 ${mounted ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
          <span className="text-xl sm:text-2xl font-semibold text-slate-500">
            {displayed}
            {/* 깜빡이는 커서 */}
            <span
              className="inline-block w-[2px] h-6 ml-1 bg-blue-500 align-middle"
              style={{ animation: 'blink 1s step-end infinite' }}
            />
          </span>
        </div>

        {/* 소개 텍스트 */}
        <p className={`max-w-lg text-base text-slate-500 leading-relaxed mb-12 ${mounted ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
          2024년 5월부터 코딩을 시작한 열정적인 웹 개발자입니다.
          사용자 중심의 경험과 클린 코드를 추구하며 빠르게 성장하고 있습니다.
        </p>

        {/* CTA 버튼 그룹 */}
        <div className={`flex flex-wrap gap-4 ${mounted ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
          <Link href="/projects"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5">
            View Projects
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="/#about"
            className="inline-flex items-center px-7 py-3.5 rounded-full border border-blue-200 text-blue-700 font-semibold text-sm hover:bg-blue-50 hover:border-blue-300 transition-all bg-white/70 backdrop-blur-sm hover:-translate-y-0.5">
            About Me
          </a>
          <a href="https://github.com/YoonSeokChan98" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-blue-200 text-blue-700 font-semibold text-sm hover:bg-blue-50 hover:border-blue-300 transition-all bg-white/70 backdrop-blur-sm hover:-translate-y-0.5">
            <GitHubIcon />
            GitHub
          </a>
        </div>

        {/* 플로팅 스탯 카드 (xl 이상 화면에서만 표시)
            projectCount : getStaticProps에서 Notion DB 프로젝트 수 전달
            TOTAL_SKILL_COUNT : skills.ts에서 자동 계산 */}
        <div className={`absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 ${mounted ? 'animate-fade-in-right delay-500' : 'opacity-0'}`}>
          <StatCard icon="📁" value={String(projectCount)}      label="Projects" />
          <StatCard icon="⚡" value={String(TOTAL_SKILL_COUNT)} label="Tech Stack" />
          <StatCard icon="🚀" value="2024"                      label="Since" />
        </div>
      </div>

      {/* 스크롤 유도 인디케이터 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 text-[10px] tracking-[0.2em] uppercase">
        <span>scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-blue-300 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
