// 오른쪽 방향 화살표 아이콘 (Hero CTA 버튼, ProjectItem 카드 하단 공용)
interface ArrowIconProps {
  className?: string;
}

// @usage Hero.tsx CTA 버튼, ProjectItem.tsx 카드 우하단
const ArrowIcon = ({ className = 'w-4 h-4' }: ArrowIconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default ArrowIcon;
