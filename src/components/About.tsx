/**
 * @file src/components/About.tsx
 * @description 자기소개 섹션 (홈 페이지 두 번째 섹션)
 *
 * 참조처: src/pages/index.tsx
 *
 * Props:
 *   projectCount (number)
 *     - Notion DB 프로젝트 수 (index.tsx의 getStaticProps에서 전달)
 *     - STATS 배열의 "Projects Built" 값으로 표시
 *
 * 구성:
 *   1. 왼쪽 컬럼: 제목, 소개글, 통계(Stats), GitHub/Notion/KakaoTalk 링크
 *   2. 오른쪽 컬럼: 기술 스택 (SKILLS 데이터, 카테고리별 카드)
 *   3. 하단: 인물 특성 카드 (TRAITS)
 *
 * 스크롤 애니메이션:
 *   RevealBlock 내부 컴포넌트가 IntersectionObserver로 뷰포트 진입을 감지하고
 *   globals.css 의 .reveal / .reveal-right 클래스에 .is-visible 을 추가해 등장시킨다.
 *   direction prop으로 등장 방향을 제어한다 (up | left | right).
 *
 * SKILLS 데이터: src/data/skills.ts 에서 import
 *   스킬을 추가/변경하려면 skills.ts 를 수정한다.
 */

import { SKILLS } from '@/data/skills';
import RevealBlock from '@/components/ui/RevealBlock';
import SectionLabel from '@/components/ui/SectionLabel';
import GitHubIcon from '@/components/ui/icons/GitHubIcon';

/** 인물 특성 카드 데이터 — 내용 변경은 여기서 */
const TRAITS = [
  {
    icon: '🚀',
    title: '지속적으로 성장하는 개발자',
    desc: '새로운 기술과 트렌드에 깊은 호기심을 가지고 있으며, 관심 분야가 생기면 누구보다 빠르게 습득하고 실무에 접목합니다.',
  },
  {
    icon: '🔍',
    title: '문제 해결에 집요한 개발자',
    desc: '항상 "왜?"라는 질문을 던지며 문제의 본질을 파악하고, 직접 해결 방안을 찾는 과정에서 깊이 있는 이해와 창의적인 해결책을 도출합니다.',
  },
  {
    icon: '📖',
    title: '깊이 있는 이해를 추구하는 개발자',
    desc: '기술에 대해 설명하고 공유할 수 있을 때 진정으로 나의 것이 된다고 생각합니다. 학습한 내용을 정리하고 공유하며 팀과 함께 성장하는 문화를 중요시합니다.',
  },
  {
    icon: '🤝',
    title: '협업으로 더 나은 결과를 만드는 개발자',
    desc: '팀워크를 통해 서로의 강점을 극대화하고, 다양한 시각에서 문제를 해결하는 과정에서 더 나은 결과를 만들어내는 것을 경험했습니다.',
  },
];


const About = ({ projectCount }: { projectCount: number }) => {
  /** 통계 수치 — 왼쪽 컬럼 하단에 표시 */
  const STATS = [
    { value: '2024',               label: 'Started Coding' },
    { value: String(projectCount), label: 'Projects Built' },
    { value: '🇰🇷',              label: 'South Korea' },
  ];

  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      {/* 상단 구분선 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
      {/* 우측 상단 블롭 */}
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">

        {/* 섹션 레이블 */}
        <RevealBlock>
          <SectionLabel text="About Me" />
        </RevealBlock>

        {/* 2컬럼 그리드: 왼쪽(소개) / 오른쪽(스킬) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── 왼쪽: 소개 텍스트 영역 ── */}
          <div>
            <RevealBlock delay={100}>
              <h2 className="text-4xl sm:text-5xl font-black text-[#0f172a] tracking-tighter leading-tight mb-8">
                코드로 아이디어를
                <br />
                <span className="gradient-text inline-block pb-1">현실로 만듭니다</span>
              </h2>
            </RevealBlock>

            <RevealBlock delay={200}>
              <div className="space-y-4 text-slate-500 text-[15px] leading-[1.85] mb-10">
                <p>
                  안녕하세요, 웹 개발자{' '}
                  <strong className="text-[#0f172a]">윤석찬 (Yoon Seok Chan)</strong>입니다.
                  2024년 5월부터 개발을 시작해 빠르게 성장하고 있는 주니어 개발자입니다.
                </p>
                <p>
                  React, Next.js, TypeScript를 중심으로 사용자가 실제로 느끼는 경험에 집중하며,
                  직관적이고 아름다운 인터페이스를 만드는 것을 즐깁니다.
                  Node.js, Express, MySQL을 활용한 풀스택 경험도 갖추고 있습니다.
                </p>
              </div>
            </RevealBlock>

            {/* 통계 수치 — STATS 배열로 관리 */}
            <RevealBlock delay={300}>
              <div className="flex gap-10 mb-10 py-6 border-y border-blue-50">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl font-black text-[#0f172a] tracking-tight">{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </RevealBlock>

            {/* 외부 링크 버튼 */}
            <RevealBlock delay={400}>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/YoonSeokChan98"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 hover:-translate-y-0.5"
                >
                  <GitHubIcon />
                  GitHub
                </a>
                <a
                  href="https://www.notion.so/115e8f654d838083994ce6333f298e05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all hover:-translate-y-0.5"
                >
                  Notion
                </a>
                <a
                  href="https://open.kakao.com/o/sA3l7SAg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-100 border border-yellow-200 text-yellow-700 text-sm font-semibold hover:bg-yellow-200 transition-all hover:-translate-y-0.5"
                >
                  KakaoTalk
                </a>
              </div>
            </RevealBlock>
          </div>

          {/* ── 오른쪽: 기술 스택 카드 ──
              SKILLS 데이터(src/data/skills.ts)를 카테고리별로 렌더링.
              아이콘은 simple-icons의 공식 SVG path를 사용한다. */}
          <div className="space-y-4">
            {SKILLS.map((group, gi) => (
              <RevealBlock key={group.category} direction="right" delay={gi * 150}>
                <div className="rounded-2xl p-6 bg-[#f0f5ff] border border-blue-100 hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/60 transition-all duration-300">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-500 mb-4">
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill.name}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-default transition-all hover:brightness-95 hover:-translate-y-0.5"
                        style={{ background: skill.bg, color: skill.text, borderColor: skill.border }}
                      >
                        {/* simple-icons의 SVG path, viewBox 0 0 24 24 기준 */}
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="currentColor">
                          <path d={skill.icon} />
                        </svg>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>

        {/* ── 하단: 인물 특성 카드 (TRAITS) ── */}
        <div className="mt-28">
          <RevealBlock>
            <SectionLabel text="Who I Am" />
            <h3 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tighter mb-12">
              저는 이런 개발자입니다
            </h3>
          </RevealBlock>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRAITS.map((trait, i) => (
              <RevealBlock key={trait.title} delay={i * 100}>
                <div className="rounded-2xl p-8 bg-[#f0f5ff] border border-blue-100 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/60 transition-all duration-300 group h-full">
                  <span className="text-3xl mb-5 block">{trait.icon}</span>
                  <h4 className="text-base font-bold text-[#0f172a] mb-3 group-hover:text-blue-700 transition-colors">
                    {trait.title}
                  </h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{trait.desc}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
