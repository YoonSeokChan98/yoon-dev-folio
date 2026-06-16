/**
 * @file src/components/Layout/Footer.tsx
 * @description 사이트 공통 푸터 (모든 페이지 하단에 렌더링)
 *
 * 참조처: src/pages/_app.tsx 에서 전체 페이지 하단에 렌더링
 *
 * 포함 내용:
 *   - "Let's Build Something Great." 헤딩과 제안 버튼 → /proposal 페이지로 이동
 *   - GitHub, KakaoTalk 소셜 링크
 *   - 저작권 표시
 *
 * id="contact" : Header의 "연락처" 앵커 링크 대상이 될 수 있음
 * 배경색: #0f172a (진한 네이비) — 사이트 밝은 배경과 대비되는 다크 섹션
 */

import Link from 'next/link';

const Footer = () => {
  return (
    <footer id="contact" className="relative bg-[#0f172a] overflow-hidden">
      {/* 상단 장식용 그라디언트 선 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      {/* 배경 블롭 효과 */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[500px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(2,132,199,0.10) 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-6 py-28">
        {/* 섹션 레이블 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-6 bg-blue-500" />
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400">Get In Touch</p>
        </div>

        {/* 메인 헤딩 */}
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none mb-8 text-white">
          Let&apos;s Build
          <br />
          <span className="gradient-text inline-block pb-2">Something Great.</span>
        </h2>

        <p className="text-slate-400 text-base max-w-md mb-10 leading-relaxed">
          채용 제안이나 외주 문의는 아래 버튼을 통해 보내주세요.
          <br />
          빠르게 검토 후 연락드리겠습니다.
        </p>

        {/* CTA 버튼 → /proposal 페이지로 이동 */}
        <Link
          href="/proposal"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 hover:-translate-y-1 hover:shadow-blue-500/30"
        >
          제안 보내기
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>

        {/* 하단 바: 로고 + 소셜 링크 + 저작권 */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <span className="text-xl font-black tracking-tighter text-white">YOON.LOG</span>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="https://github.com/YoonSeokChan98" target="_blank" rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors">GitHub</a>
            <a href="https://open.kakao.com/o/sA3l7SAg" target="_blank" rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors">KakaoTalk</a>
          </div>
          <p className="text-[11px] text-slate-700 uppercase tracking-widest">
            © 2026 Yoon. Built with Next.js & Notion.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
