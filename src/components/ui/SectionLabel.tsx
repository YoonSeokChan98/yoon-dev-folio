// 섹션 레이블 — 왼쪽 파란 가로선 + 대문자 텍스트 조합 (About, ProjectList, Footer 공용)
interface SectionLabelProps {
  text: string;
  // @param dark: 다크 배경(Footer)에서 색상을 밝게 조정할 때 사용
  dark?: boolean;
  className?: string;
}

// @usage About.tsx "About Me"/"Who I Am", ProjectList.tsx "Portfolio", Footer.tsx "Get In Touch"
const SectionLabel = ({ text, dark = false, className = '' }: SectionLabelProps) => (
  <div className={`flex items-center gap-3 mb-4 ${className}`}>
    <div className={`h-px w-6 ${dark ? 'bg-blue-500' : 'bg-blue-500'}`} />
    <p className={`text-xs font-bold tracking-[0.2em] uppercase ${dark ? 'text-blue-400' : 'text-blue-500'}`}>
      {text}
    </p>
  </div>
);

export default SectionLabel;
