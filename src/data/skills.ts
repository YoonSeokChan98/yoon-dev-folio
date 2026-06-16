/**
 * @file src/data/skills.ts
 * @description 포트폴리오에 표시할 기술 스택 데이터 정의
 *
 * 아이콘은 simple-icons npm 패키지에서 브랜드 공식 SVG path를 import한다.
 * 패키지가 공식 경로를 관리하므로 아이콘 오류 없이 정확하게 렌더링된다.
 * 아이콘을 추가하려면: npm에서 'simple-icons' 패키지를 확인하고 si{BrandName} 을 import한다.
 *
 * 참조처:
 *   - src/components/About.tsx  : 스킬 태그 그룹 렌더링
 *   - src/components/Hero.tsx   : TOTAL_SKILL_COUNT → 스탯 카드 "Tech Stack" 값
 *
 * 스킬을 추가/삭제하면 TOTAL_SKILL_COUNT가 자동으로 갱신된다.
 */

import {
  siReact,
  siNextdotjs,
  siTypescript,
  siJavascript,
  siHtml5,
  siCss,
  siTailwindcss,
  siNodedotjs,
  siExpress,
  siMysql,
  siGithub,
  siFigma,
  siNotion,
  siVercel,
  siGit,
} from 'simple-icons';

/** 스킬 항목 단일 타입 */
export interface Skill {
  name: string;   // 표시 이름
  bg: string;     // 태그 배경색 (hex)
  text: string;   // 태그 글자색 (hex)
  border: string; // 태그 테두리색 (hex)
  icon: string;   // simple-icons의 SVG path 문자열 (viewBox 0 0 24 24 기준)
}

/**
 * 카테고리별 스킬 목록
 * 카테고리 순서 = About 페이지 표시 순서
 * 각 항목의 bg/text/border 색상은 해당 브랜드 공식 색상 또는 어울리는 색상으로 설정
 */
export const SKILLS: { category: string; items: Skill[] }[] = [
  {
    category: 'Frontend',
    items: [
      { name: 'React',        bg: '#e8f8fd', text: '#087ea4', border: '#b3e8f7', icon: siReact.path },
      { name: 'Next.js',      bg: '#f0f0f0', text: '#111111', border: '#d0d0d0', icon: siNextdotjs.path },
      { name: 'TypeScript',   bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe', icon: siTypescript.path },
      { name: 'JavaScript',   bg: '#fefce8', text: '#854d0e', border: '#fef08a', icon: siJavascript.path },
      { name: 'HTML5',        bg: '#fff1ee', text: '#c2410c', border: '#fed7cc', icon: siHtml5.path },
      { name: 'CSS',          bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe', icon: siCss.path },
      { name: 'Tailwind CSS', bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc', icon: siTailwindcss.path },
    ],
  },
  {
    category: 'Backend & DB',
    items: [
      { name: 'Node.js', bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', icon: siNodedotjs.path },
      { name: 'Express', bg: '#f1f5f9', text: '#334155', border: '#e2e8f0', icon: siExpress.path },
      { name: 'MySQL',   bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe', icon: siMysql.path },
      { name: 'GitHub',  bg: '#f1f5f9', text: '#1e293b', border: '#e2e8f0', icon: siGithub.path },
    ],
  },
  {
    category: 'Tools & Design',
    items: [
      { name: 'Figma',  bg: '#fdf4ff', text: '#a21caf', border: '#f0abfc', icon: siFigma.path },
      { name: 'Notion', bg: '#f8fafc', text: '#1e293b', border: '#e2e8f0', icon: siNotion.path },
      { name: 'Vercel', bg: '#f1f5f9', text: '#1e293b', border: '#e2e8f0', icon: siVercel.path },
      { name: 'Git',    bg: '#fff1ee', text: '#b45309', border: '#fed7aa', icon: siGit.path },
    ],
  },
];

/**
 * 전체 스킬 개수 (자동 계산)
 * Hero 컴포넌트의 "Tech Stack" 스탯 카드 값으로 사용된다.
 * 스킬을 추가/삭제하면 자동으로 반영된다.
 */
export const TOTAL_SKILL_COUNT = SKILLS.reduce((sum, g) => sum + g.items.length, 0);
