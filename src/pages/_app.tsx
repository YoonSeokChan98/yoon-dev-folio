/**
 * @file src/pages/_app.tsx
 * @description Next.js Pages Router의 최상위 App 컴포넌트
 *
 * 모든 페이지 컴포넌트를 감싸는 레이아웃 래퍼.
 * 여기서 import한 globals.css는 전체 앱에 적용된다.
 * Header와 Footer가 모든 페이지에 공통으로 렌더링된다.
 *
 * 렌더링 트리:
 *   _app.tsx
 *     └─ <Header />         (헤더 내비게이션 — 모든 페이지 공통)
 *     └─ <Component />      (각 페이지 컴포넌트 — index, projects, proposal 등)
 *     └─ <Footer />         (푸터 — 모든 페이지 공통)
 *
 * 새로운 전역 Provider(테마, 상태관리 등)가 필요하면 이 파일에 추가한다.
 */

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* 고정 헤더: 스크롤 시 배경이 흰색으로 변하며, 아래로 스크롤 시 숨겨진다 */}
      <Header />
      {/* 현재 라우트에 해당하는 페이지 컴포넌트 */}
      <Component {...pageProps} />
      {/* 푸터: "채용 제안 보내기" 버튼과 소셜 링크 포함 */}
      <Footer />
    </>
  );
}
