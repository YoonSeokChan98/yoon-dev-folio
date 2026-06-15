'use client';
import { useEffect, useState } from 'react';

const ROLES = ['Web Developer', 'React / Next.js Engineer', 'UI/UX Enthusiast'];

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[roleIndex];
    if (!deleting && displayed.length < current.length) {
      const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === current.length) {
      const t = setTimeout(() => setDeleting(true), 2200);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 35);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }
  }, [displayed, deleting, roleIndex]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#f5f5f0]">
      {/* 배경 블롭 — 채도 낮고 은은하게 */}
      <div className="absolute top-1/4 -left-40 w-[560px] h-[560px] rounded-full blur-[140px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 -right-40 w-[440px] h-[440px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
        {/* 상태 배지 */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-widest uppercase mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Available for work · South Korea 🇰🇷
        </div>

        {/* 메인 헤딩 */}
        <h1 className="text-[clamp(3.5rem,9vw,7.5rem)] font-black text-[#1a1a2e] tracking-tighter leading-[0.92] mb-8">
          Hi, I&apos;m
          <br />
          <span className="gradient-text">Yoon Seok Chan</span>
        </h1>

        {/* 타이핑 */}
        <div className="flex items-center mb-8 h-10">
          <span className="text-xl sm:text-2xl font-semibold text-slate-400">
            {displayed}
            <span className="inline-block w-[2px] h-6 ml-1 bg-indigo-500 align-middle" style={{ animation: 'blink 1s step-end infinite' }} />
          </span>
        </div>

        {/* 서브 텍스트 */}
        <p className="max-w-lg text-base text-slate-500 leading-relaxed mb-12">
          2024년 5월부터 코딩을 시작한 열정적인 웹 개발자입니다.
          사용자 중심의 경험과 클린 코드를 추구하며 빠르게 성장하고 있습니다.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap gap-4">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#1a1a2e] text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            View Projects
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#about"
            className="inline-flex items-center px-7 py-3.5 rounded-full border border-slate-200 text-slate-600 font-semibold text-sm hover:border-indigo-300 hover:text-indigo-700 transition-colors bg-white/60"
          >
            About Me
          </a>
          <a
            href="https://github.com/YoonSeokChan98"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-slate-200 text-slate-600 font-semibold text-sm hover:border-indigo-300 hover:text-indigo-700 transition-colors bg-white/60"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 text-[10px] tracking-[0.2em] uppercase">
        <span>scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-300 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
