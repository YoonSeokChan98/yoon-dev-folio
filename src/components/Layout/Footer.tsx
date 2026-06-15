const Footer = () => {
  return (
    <footer id="contact" className="relative bg-[#1a1a2e] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full blur-[140px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-6 py-28">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-6 bg-indigo-400" />
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-400">Get In Touch</p>
        </div>

        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none mb-8 text-white">
          Let&apos;s Build
          <br />
          <span className="gradient-text">Something Great.</span>
        </h2>

        <p className="text-slate-400 text-base max-w-md mb-10 leading-relaxed">
          채용 제안이나 협업 문의는 위 폼을 통해 보내주세요.
          <br />
          빠르게 검토 후 연락드리겠습니다.
        </p>

        <a
          href="#proposal"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#1a1a2e] font-bold text-sm hover:bg-indigo-50 transition-colors"
        >
          제안 보내기
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <span className="text-xl font-black tracking-tighter text-white">YOON.LOG</span>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="https://github.com/YoonSeokChan98" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://open.kakao.com/o/sA3l7SAg" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">KakaoTalk</a>
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
