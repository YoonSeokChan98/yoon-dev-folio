/**
 * @file src/lib/notionColors.ts
 * @description Notion 공식 multi_select 태그 색상 팔레트 매핑
 *
 * Notion API는 태그 색상을 문자열 이름("blue", "green" 등)으로만 반환하고
 * 실제 hex 값은 제공하지 않는다. 이 파일은 Notion 공식 UI 색상을
 * { background, color } 인라인 스타일 객체로 변환하는 매핑 테이블이다.
 *
 * 참조처:
 *   - src/components/ProjectItem.tsx  : 목록 카드의 태그 스타일
 *   - src/pages/projects/[id].tsx     : 상세 페이지의 태그 스타일
 *
 * 사용법:
 *   <span style={NOTION_TAG_COLOR[item.color] ?? NOTION_TAG_COLOR.default}>
 *     {item.name}
 *   </span>
 *
 * ⚠️  color 값이 이 맵에 없으면 ?? 연산자로 default 를 fallback으로 사용한다.
 * 노션이 새 색상을 추가하면 여기에도 추가해야 한다.
 */
export const NOTION_TAG_COLOR: Record<string, { background: string; color: string }> = {
  default: { background: '#E3E2E0', color: '#37352F' },
  gray:    { background: '#E3E2E0', color: '#787774' },
  brown:   { background: '#EEE0DA', color: '#9F6B53' },
  orange:  { background: '#FADEC9', color: '#D9730D' },
  yellow:  { background: '#FDECC8', color: '#CB912F' },
  green:   { background: '#DBEDDB', color: '#448361' },
  blue:    { background: '#D3E5EF', color: '#337EA9' },
  purple:  { background: '#E8DEEE', color: '#9065B0' },
  pink:    { background: '#F5E0E9', color: '#C14C8A' },
  red:     { background: '#FFE2DD', color: '#D44C47' },
};
