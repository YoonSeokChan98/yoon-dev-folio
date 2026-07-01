// Notion 태그 배지 — 프로젝트 타입 / 기술 스택 태그 공용 (NOTION_TAG_COLOR 스타일 주입)
import type { CSSProperties } from 'react';

interface TagBadgeProps {
  name: string;
  style: CSSProperties;
  // @param size: 'sm'은 기술 스택 태그(px-2.5 py-1), 'xs'는 프로젝트 타입 태그(px-2 py-0.5)
  size?: 'xs' | 'sm';
  className?: string;
}

// @usage ProjectItem.tsx — 프로젝트 타입 태그(xs), 기술 스택 태그(sm)
const TagBadge = ({ name, style, size = 'sm', className = '' }: TagBadgeProps) => {
  const sizeClass = size === 'xs'
    ? 'px-2 py-0.5 text-[10px] font-semibold rounded-full'
    : 'px-2.5 py-1 text-[10px] font-medium rounded-md';

  return (
    <span style={style} className={`${sizeClass} ${className}`}>
      {name}
    </span>
  );
};

export default TagBadge;
