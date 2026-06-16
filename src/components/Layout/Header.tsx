/**
 * @file src/components/Layout/Header.tsx
 * @description 사이트 공통 헤더 (고정 네비게이션 바)
 *
 * 참조처: src/pages/_app.tsx 에서 전체 페이지 최상단에 렌더링
 *
 * 동작 방식:
 *   1. 스크롤 감지 (scroll 이벤트)
 *      - scrollY > 20 : 배경이 흰색 반투명(bg-white/85 + backdrop-blur)으로 전환
 *      - 아래 스크롤 & scrollY > 80 : 헤더 숨김 (-translate-y-full)
 *      - 위로 스크롤 : 헤더 다시 표시
 *
 *   2. 앵커 링크 처리 (handleAnchorClick)
 *      "/#about" 처럼 # 이 포함된 링크는 기본 동작을 막고 JS로 부드럽게 스크롤한다.
 *      전역 scroll-behavior: smooth 를 쓰지 않는 이유: 페이지 전환 시 슬라이드 현상 방지
 *      일반 링크(/projects, /proposal)는 Next.js Link가 처리한다.
 *
 * NAV 배열에 메뉴를 추가/변경하면 자동으로 렌더링된다.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';

/** 네비게이션 메뉴 목록 — 라벨과 URL만 수정하면 메뉴가 바뀐다 */
const NAV = [
  { label: '소개',    href: '/#about' },    // 홈 페이지의 About 섹션으로 스무스 스크롤
  { label: '프로젝트', href: '/projects' }, // 프로젝트 목록 페이지
  { label: '채용/외주 제안', href: '/proposal' }, // 채용/외주 문의 페이지
];

/**
 * 앵커(#) 링크 클릭 핸들러
 * href에 # 가 포함된 경우에만 동작하며, 해당 id 요소로 부드럽게 스크롤한다.
 * # 가 없는 일반 링크는 Next.js Link의 기본 동작으로 처리된다.
 */
const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (!href.includes('#')) return;
  const hash = href.split('#')[1];
  const el = document.getElementById(hash);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);   // 헤더 표시/숨김 여부
  const [lastScrollY, setLastScrollY] = useState(0);  // 이전 스크롤 위치 (방향 감지용)
  const [scrolled, setScrolled] = useState(false);    // 스크롤됨 여부 (배경 전환용)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤 위치 20px 이상: 배경 흰색으로 전환
      setScrolled(currentScrollY > 20);

      // 아래로 스크롤 중이고 80px 이상: 헤더 숨김
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        // 위로 스크롤 중: 헤더 표시
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // passive: true → scroll 이벤트에서 preventDefault 호출 안 함 (성능 최적화)
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none' // 숨김 시 클릭 불가
      } ${
        scrolled
          ? 'bg-white/85 backdrop-blur-xl border-b border-blue-100/60 shadow-sm shadow-blue-100/30'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* 로고 — 클릭 시 홈(/)으로 이동 */}
        <Link href="/" className="text-lg font-black tracking-tighter text-[#0f172a] hover:text-blue-600 transition-colors">
          YOON.LOG
        </Link>

        {/* 네비게이션 메뉴 */}
        <nav className="flex items-center gap-8 text-sm font-medium text-slate-500">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => handleAnchorClick(e, item.href)}
              className="relative group hover:text-[#0f172a] transition-colors"
            >
              {item.label}
              {/* 호버 시 아래에서 올라오는 파란 밑줄 애니메이션 */}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-blue-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
