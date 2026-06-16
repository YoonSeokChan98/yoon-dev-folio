/**
 * @file src/pages/_document.tsx
 * @description Next.js 커스텀 Document — HTML 뼈대 정의
 *
 * _app.tsx 보다 먼저 서버에서 한 번만 렌더링된다.
 * <html lang="ko"> : 스크린 리더, SEO를 위해 언어를 한국어로 설정
 * <body className="antialiased"> : 폰트 렌더링을 부드럽게 처리 (macOS/Windows 공통)
 *
 * 전역 폰트, 외부 스크립트, 메타태그 등을 추가할 때 이 파일을 수정한다.
 * (페이지별 메타태그는 각 페이지의 <Head> 컴포넌트에서 설정)
 */

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko">
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
