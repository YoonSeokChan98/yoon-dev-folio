// 스크롤 진입 시 등장 애니메이션 래퍼. globals.css의 .reveal/.reveal-left/.reveal-right + .is-visible 조합으로 동작.
import { useRef, useEffect, useState } from 'react';

interface RevealBlockProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
  // @param threshold: 요소의 몇 % 이상이 뷰포트에 들어올 때 트리거할지 (기본 0.12)
  threshold?: number;
}

// @usage About.tsx, ProjectList.tsx 등 스크롤 진입 애니메이션이 필요한 모든 섹션
const RevealBlock = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.12,
}: RevealBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const base = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : 'reveal';

  return (
    <div ref={ref} className={`${base} ${visible ? 'is-visible' : ''} delay-${delay} ${className}`}>
      {children}
    </div>
  );
};

export default RevealBlock;
