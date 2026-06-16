/**
 * @file src/components/NotionRenderer.tsx
 * @description Notion 블록 배열을 React 엘리먼트로 변환하는 렌더러
 *
 * 참조처: src/pages/projects/[id].tsx (프로젝트 상세 페이지 본문)
 *
 * Props:
 *   blocks (any[]) : getNotionBlocks()로 가져온 Notion 블록 객체 배열
 *
 * 지원하는 Notion 블록 타입:
 *   heading_1       → <h1>
 *   heading_2       → <h2>
 *   heading_3       → <h3>
 *   paragraph       → <p> (빈 단락은 <br>로 처리)
 *   bulleted_list_item → <ul><li>... (연속된 같은 타입을 하나의 <ul>로 묶음)
 *   numbered_list_item → <ol><li>... (연속된 같은 타입을 하나의 <ol>로 묶음)
 *   code            → <pre><code> (언어 구분 없이 모노스페이스)
 *   quote           → <blockquote>
 *   divider         → <hr>
 *   image           → <figure><img> (external/file 모두 지원, 캡션 포함)
 *   callout         → 배경 있는 강조 박스 (이모지 아이콘 포함)
 *   toggle          → <details><summary> (HTML 네이티브 토글)
 *
 * 미지원 블록 타입은 무시된다 (렌더링하지 않음).
 * 중첩 블록(블록 안의 블록)은 현재 미지원.
 *
 * richText() 함수:
 *   Notion rich_text 배열을 React 노드로 변환한다.
 *   지원 어노테이션: bold, italic, strikethrough, underline, code, link(href)
 */

import React from 'react';

/**
 * Notion rich_text 배열을 React 노드로 변환
 * 각 텍스트 항목의 annotations에 따라 적절한 HTML 태그로 감싼다.
 * 링크(href)가 있으면 <a target="_blank"> 로 렌더링한다.
 *
 * @param texts - Notion block의 rich_text 배열
 * @returns React.ReactNode 배열
 */
const richText = (texts: any[]): React.ReactNode =>
  texts?.map((t: any, i: number) => {
    let node: React.ReactNode = t.plain_text;
    if (t.annotations?.bold)          node = <strong key={i}>{node}</strong>;
    if (t.annotations?.italic)        node = <em key={i}>{node}</em>;
    if (t.annotations?.strikethrough) node = <s key={i}>{node}</s>;
    if (t.annotations?.underline)     node = <u key={i}>{node}</u>;
    if (t.annotations?.code)          node = (
      <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-600 text-[13px] font-mono">
        {node}
      </code>
    );
    if (t.href) node = (
      <a key={i} href={t.href} target="_blank" rel="noopener noreferrer"
        className="text-indigo-500 underline underline-offset-2 hover:text-indigo-700">
        {node}
      </a>
    );
    return <React.Fragment key={i}>{node}</React.Fragment>;
  });

const NotionRenderer = ({ blocks }: { blocks: any[] }) => {
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    const { type } = block;

    if (type === 'heading_1') {
      elements.push(
        <h1 key={block.id} className="text-2xl font-black text-[#1a1a2e] mt-10 mb-4 tracking-tight">
          {richText(block.heading_1.rich_text)}
        </h1>
      );

    } else if (type === 'heading_2') {
      elements.push(
        <h2 key={block.id} className="text-xl font-bold text-[#1a1a2e] mt-8 mb-3 tracking-tight">
          {richText(block.heading_2.rich_text)}
        </h2>
      );

    } else if (type === 'heading_3') {
      elements.push(
        <h3 key={block.id} className="text-base font-bold text-[#1a1a2e] mt-6 mb-2">
          {richText(block.heading_3.rich_text)}
        </h3>
      );

    } else if (type === 'paragraph') {
      const content = block.paragraph.rich_text;
      elements.push(
        <p key={block.id} className="text-slate-600 text-[15px] leading-relaxed mb-3">
          {content.length ? richText(content) : <br />}
        </p>
      );

    } else if (type === 'bulleted_list_item') {
      // 연속된 bulleted_list_item을 하나의 <ul>로 묶기
      const items: React.ReactNode[] = [];
      while (i < blocks.length && blocks[i].type === 'bulleted_list_item') {
        items.push(
          <li key={blocks[i].id}>{richText(blocks[i].bulleted_list_item.rich_text)}</li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${block.id}`} className="list-disc list-inside text-slate-600 text-[15px] leading-relaxed mb-3 space-y-1 pl-2">
          {items}
        </ul>
      );
      continue; // 이미 i를 증가시켰으므로 하단 i++ 건너뜀

    } else if (type === 'numbered_list_item') {
      // 연속된 numbered_list_item을 하나의 <ol>로 묶기
      const items: React.ReactNode[] = [];
      while (i < blocks.length && blocks[i].type === 'numbered_list_item') {
        items.push(
          <li key={blocks[i].id}>{richText(blocks[i].numbered_list_item.rich_text)}</li>
        );
        i++;
      }
      elements.push(
        <ol key={`ol-${block.id}`} className="list-decimal list-inside text-slate-600 text-[15px] leading-relaxed mb-3 space-y-1 pl-2">
          {items}
        </ol>
      );
      continue;

    } else if (type === 'code') {
      elements.push(
        <pre key={block.id} className="bg-slate-900 text-slate-100 rounded-xl p-5 text-[13px] font-mono overflow-x-auto mb-4">
          <code>{block.code.rich_text.map((t: any) => t.plain_text).join('')}</code>
        </pre>
      );

    } else if (type === 'quote') {
      elements.push(
        <blockquote key={block.id} className="border-l-4 border-indigo-300 pl-4 text-slate-500 italic text-[15px] my-4">
          {richText(block.quote.rich_text)}
        </blockquote>
      );

    } else if (type === 'divider') {
      elements.push(<hr key={block.id} className="my-8 border-slate-200" />);

    } else if (type === 'image') {
      // external: 외부 URL 이미지 / file: Notion 업로드 이미지
      const url = block.image.type === 'external'
        ? block.image.external.url
        : block.image.file.url;
      const caption = block.image.caption?.map((t: any) => t.plain_text).join('');
      elements.push(
        <figure key={block.id} className="my-6">
          <img src={url} alt={caption || ''} className="rounded-xl w-full object-cover" />
          {caption && (
            <figcaption className="text-center text-xs text-slate-400 mt-2">{caption}</figcaption>
          )}
        </figure>
      );

    } else if (type === 'callout') {
      // callout: 이모지 + 배경 있는 강조 박스
      elements.push(
        <div key={block.id} className="flex gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-4 my-4 text-[15px] text-slate-600">
          <span className="shrink-0">{block.callout.icon?.emoji || '💡'}</span>
          <div>{richText(block.callout.rich_text)}</div>
        </div>
      );

    } else if (type === 'toggle') {
      // HTML 네이티브 <details>/<summary>로 토글 구현
      // ▶ 아이콘이 open 시 90도 회전
      elements.push(
        <details key={block.id} className="my-3 group">
          <summary className="cursor-pointer font-semibold text-[#1a1a2e] text-[15px] list-none flex items-center gap-2">
            <span className="transition-transform group-open:rotate-90">▶</span>
            {richText(block.toggle.rich_text)}
          </summary>
          {/* 중첩 블록은 미지원 — 내용이 있어도 렌더링되지 않음 */}
          <div className="mt-2 pl-5 text-slate-600 text-[15px]" />
        </details>
      );
    }
    // 그 외 미지원 블록 타입은 무시

    i++;
  }

  return <div className="notion-content">{elements}</div>;
};

export default NotionRenderer;
