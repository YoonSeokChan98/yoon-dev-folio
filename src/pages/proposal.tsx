/**
 * @file src/pages/proposal.tsx
 * @description 채용 제안 / 외주 문의 페이지 (/proposal)
 *
 * Header의 "채용 제안" 메뉴, Footer의 "제안 보내기" 버튼 클릭 시 이동.
 * JobProposalForm 컴포넌트를 전체 화면으로 렌더링하는 껍데기 페이지.
 *
 * 폼 로직은 src/components/JobProposalForm.tsx 에서 관리.
 * API 통신은 src/pages/api/proposal.ts (Discord 웹훅) 및 EmailJS로 처리.
 */

import Head from 'next/head';
import JobProposalForm from '@/components/JobProposalForm';

export default function ProposalPage() {
  return (
    <>
      <Head>
        <title>채용 제안 — Yoon.log</title>
        <meta name="description" content="윤에게 채용 제안 또는 외주 문의 보내기" />
      </Head>
      {/* pt-16: 고정 Header(h-16)에 가려지지 않도록 상단 패딩 */}
      <div className="pt-16">
        <JobProposalForm />
      </div>
    </>
  );
}
