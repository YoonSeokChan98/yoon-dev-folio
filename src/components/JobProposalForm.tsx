/**
 * @file src/components/JobProposalForm.tsx
 * @description 채용 제안 / 외주 문의 폼 컴포넌트
 *
 * 참조처: src/pages/proposal.tsx
 *
 * 기능 개요:
 *   1. 문의 유형 선택: '채용 제안' | '외주 문의' (inquiryType)
 *   2. 전송 방법 선택: '폼으로 보내기' | '이메일로 보내기' (method)
 *   3. 제출 전 확인 모달 표시 (showConfirm)
 *   4. 전송 완료/실패 상태 피드백 (status)
 *
 * 전송 경로 (폼 방식):
 *   ① EmailJS (NEXT_PUBLIC_EMAILJS_* 환경변수) → 이메일로 전송
 *   ② /api/proposal (서버 API Route) → Discord 웹훅으로 전송
 *   두 경로가 병렬이 아닌 순차로 실행된다. EmailJS 실패 시도 Discord는 전송 시도한다.
 *
 * 전송 경로 (이메일 방식):
 *   mailto: 링크로 사용자 기본 이메일 앱을 열어준다. 직접 전송하지 않는다.
 *
 * 폼 데이터 타입:
 *   HiringForm   (채용 제안): companyName, link, role, content, address, addressDetail, contact
 *   FreelanceForm(외주 문의): name, overview, budget, schedule, contact
 *
 * 필요한 환경변수 (.env):
 *   NEXT_PUBLIC_EMAILJS_SERVICE_ID  : EmailJS 서비스 ID
 *   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID : EmailJS 템플릿 ID
 *   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  : EmailJS 공개 키
 *   (Discord 웹훅은 서버 사이드 DISCORD_WEBHOOK_URL 로 처리 — api/proposal.ts 참고)
 *
 * 주소 검색: react-daum-postcode 라이브러리 (DaumPostcodeEmbed) 사용
 *   주소 검색 완료 시 roadAddress(도로명) 우선, 없으면 address(지번) 사용
 */

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { Address } from 'react-daum-postcode';
import emailjs from '@emailjs/browser';

// SSR 환경에서 window 참조 오류 방지 — Vercel 빌드 시 필수
const DaumPostcodeEmbed = dynamic(() => import('react-daum-postcode'), { ssr: false });

/** 전송 방법: 폼(직접 전송) 또는 이메일(mailto 링크) */
type SendMethod = 'form' | 'email';

/** 문의 유형 */
type InquiryType = 'hiring' | 'freelance';

/** 채용 제안 폼 필드 */
interface HiringForm {
  companyName: string;   // 회사명 (필수)
  link: string;          // 채용 공고 URL (필수)
  role: string;          // 모집 직책 (선택)
  content: string;       // 업무 내용 (선택)
  address: string;       // 근무지 주소 (Daum 우편번호 검색 결과)
  addressDetail: string; // 근무지 상세 주소
  contact: string;       // 담당자 연락처 (필수)
}

/** 외주 문의 폼 필드 */
interface FreelanceForm {
  name: string;     // 이름 / 회사명 (필수)
  overview: string; // 프로젝트 개요 (필수)
  budget: string;   // 예산 범위 (선택)
  schedule: string; // 희망 일정 (선택)
  contact: string;  // 연락처 (필수)
}

/** 폼 초기값 */
const HIRING_INITIAL: HiringForm = {
  companyName: '', link: '', role: '', content: '', address: '', addressDetail: '', contact: '',
};
const FREELANCE_INITIAL: FreelanceForm = {
  name: '', overview: '', budget: '', schedule: '', contact: '',
};

/** 공통 input/textarea Tailwind 클래스 */
const InputClass =
  'w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-[#1a1a2e] text-sm placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all';

/** 공통 label Tailwind 클래스 */
const LabelClass = 'block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2';

export default function JobProposalForm() {
  const [inquiryType, setInquiryType] = useState<InquiryType>('hiring');
  const [method, setMethod] = useState<SendMethod>('form');
  const [hiringForm, setHiringForm] = useState<HiringForm>(HIRING_INITIAL);
  const [freelanceForm, setFreelanceForm] = useState<FreelanceForm>(FREELANCE_INITIAL);
  const [showDetail, setShowDetail] = useState(false);      // 채용 폼의 추가 정보 토글
  const [showPostcode, setShowPostcode] = useState(false);  // Daum 주소 검색 팝업 표시
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);    // 전송 확인 모달 표시

  /** 채용 제안 폼 필드 변경 핸들러 (input name 속성으로 state 키 자동 매핑) */
  const handleHiringChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setHiringForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /** 외주 문의 폼 필드 변경 핸들러 */
  const handleFreelanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFreelanceForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /**
   * Daum 주소 검색 완료 콜백
   * 도로명 주소(roadAddress) 우선 사용, 없으면 지번 주소(address) 사용
   */
  const handleAddressComplete = (data: Address) => {
    setHiringForm((prev) => ({ ...prev, address: data.roadAddress || data.address }));
    setShowPostcode(false);
  };

  /** 문의 유형 변경 시 상태 초기화 */
  const handleInquiryTypeChange = (type: InquiryType) => {
    setInquiryType(type);
    setStatus('idle');
    setShowDetail(false);
  };

  /** 폼 제출: 실제 전송 전에 확인 모달을 먼저 표시 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  /**
   * 확인 모달에서 "보내기" 클릭 시 실제 전송 처리
   * 순서: EmailJS 전송 → Discord API 전송 → 성공/실패 상태 업데이트
   */
  const handleConfirm = async () => {
    setShowConfirm(false);
    setStatus('loading');
    setErrorMsg('');

    try {
      const emailServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const emailTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const emailPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      const typeLabel = inquiryType === 'hiring' ? '채용 제안' : '외주 문의';

      // EmailJS 템플릿 파라미터 구성
      // 채용/외주 모두 같은 EmailJS 템플릿을 사용하며, inquiry_type으로 구분
      const emailParams = inquiryType === 'hiring'
        ? {
            inquiry_type: typeLabel,
            company_name: hiringForm.companyName,
            link: hiringForm.link,
            role: hiringForm.role || '미기재',
            content: hiringForm.content || '미기재',
            address: hiringForm.address
              ? `${hiringForm.address}${hiringForm.addressDetail ? ` ${hiringForm.addressDetail}` : ''}`
              : '미기재',
            contact: hiringForm.contact || '미기재',
          }
        : {
            inquiry_type: typeLabel,
            company_name: freelanceForm.name,
            link: '—',
            role: '외주 문의',
            content: `[프로젝트 개요] ${freelanceForm.overview}\n[예산] ${freelanceForm.budget || '미기재'}\n[희망 일정] ${freelanceForm.schedule || '미기재'}\n[연락처] ${freelanceForm.contact || '미기재'}`,
            address: '—',
          };

      // EmailJS 전송 (환경변수가 설정된 경우에만 실행)
      if (emailServiceId && emailTemplateId && emailPublicKey) {
        await emailjs.send(emailServiceId, emailTemplateId, emailParams, emailPublicKey);
      }

      // Discord 웹훅 전송 (서버 API Route 경유)
      const discordRes = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryType,
          ...(inquiryType === 'hiring' ? hiringForm : freelanceForm),
        }),
      });

      if (!discordRes.ok) throw new Error(`Discord 전송 실패 (${discordRes.status})`);

      // 전송 성공: 폼 초기화
      setStatus('success');
      setHiringForm(HIRING_INITIAL);
      setFreelanceForm(FREELANCE_INITIAL);
      setShowDetail(false);
    } catch {
      setStatus('error');
      setErrorMsg('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  /** 이메일 방식에서 사용자가 포함하면 좋을 항목 힌트 (문의 유형별로 다름) */
  const emailHints = inquiryType === 'hiring'
    ? ['회사명 및 팀 소개', '모집 직책과 주요 업무', '채용 공고 링크 또는 JD', '근무지 / 근무 형태 (재택·출근)', '처우 및 복리후생 (선택)']
    : ['이름 또는 회사명', '프로젝트 개요 및 목적', '예산 범위', '희망 일정', '연락 가능한 연락처'];

  /** 이메일 앱 열기 버튼의 subject 파라미터 */
  const emailSubject = inquiryType === 'hiring'
    ? '[채용 제안] 회사명을 입력해 주세요'
    : '[외주 문의] 프로젝트명을 입력해 주세요';

  return (
    <section id="proposal" className="py-32 bg-white relative overflow-hidden">
      {/* 상단 장식 그라디언트 선 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

      <div className="max-w-2xl mx-auto px-6">

        {/* 섹션 헤더 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-6 bg-indigo-400" />
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-500">Contact</p>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-[#1a1a2e] tracking-tighter leading-tight mb-4">
          {inquiryType === 'hiring' ? '채용 제안' : '외주 문의'}
          <br />
          <span className="gradient-text inline-block pb-1">보내기</span>
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          편한 방법을 선택해 문의해 주세요.
          <br />
          빠르게 검토 후 연락드리겠습니다.
        </p>

        {/* ── 문의 유형 선택 버튼 ── */}
        <div className="flex gap-3 mb-6">
          {([
            { key: 'hiring',    label: '채용 제안', desc: '정규직 · 계약직 · 인턴', icon: '💼' },
            { key: 'freelance', label: '외주 문의', desc: '프리랜서 · 단기 프로젝트', icon: '🤝' },
          ] as { key: InquiryType; label: string; desc: string; icon: string }[]).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => handleInquiryTypeChange(t.key)}
              className={`flex-1 flex flex-col items-start gap-1 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                inquiryType === t.key
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              <span className={`text-sm font-bold ${inquiryType === t.key ? 'text-indigo-700' : 'text-[#1a1a2e]'}`}>
                {t.label}
              </span>
              <span className="text-[11px] text-slate-400">{t.desc}</span>
            </button>
          ))}
        </div>

        {/* ── 전송 방법 탭 (폼 / 이메일) ── */}
        <div className="flex gap-2 p-1 rounded-xl bg-slate-100 mb-8">
          {([
            { key: 'form',  icon: '📋', label: '폼으로 보내기',   desc: '간편하게 작성' },
            { key: 'email', icon: '✉️', label: '이메일로 보내기', desc: '직접 작성' },
          ] as { key: SendMethod; icon: string; label: string; desc: string }[]).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => { setMethod(tab.key); setStatus('idle'); }}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                method === tab.key
                  ? 'bg-white text-[#1a1a2e] shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="flex flex-col items-start leading-tight">
                <span>{tab.label}</span>
                <span className={`text-[10px] font-normal ${method === tab.key ? 'text-slate-400' : 'text-slate-300'}`}>
                  {tab.desc}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* ── 전송 확인 모달 ── */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 w-max max-w-[90vw]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#1a1a2e]">
                  {inquiryType === 'hiring' ? '채용 제안을' : '외주 문의를'} 보내시겠습니까?
                </h3>
              </div>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed whitespace-nowrap text-center">
                작성하신 내용이 이메일과 디스코드로 전송됩니다.
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-colors">
                  취소
                </button>
                <button type="button" onClick={handleConfirm}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold hover:opacity-90 transition-opacity">
                  보내기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            폼 방식 (method === 'form')
        ══════════════════════════════════════ */}
        {method === 'form' && (
          <>
            {/* 성공 알림 */}
            {status === 'success' && (
              <div className="mb-6 px-5 py-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                성공적으로 전달되었습니다. 빠르게 검토 후 연락드리겠습니다!
              </div>
            )}
            {/* 실패 알림 */}
            {status === 'error' && (
              <div className="mb-6 px-5 py-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorMsg}
              </div>
            )}

            {/* 전송 경로 안내 배너 */}
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100 mb-5">
              <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-indigo-500 leading-relaxed">
                제출하신 내용은 <span className="font-bold">이메일</span>과{' '}
                <span className="font-bold">디스코드</span>로 동시에 발송됩니다.
              </p>
            </div>

            {/* ── 채용 제안 폼 ── */}
            {inquiryType === 'hiring' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 필수 필드 */}
                <div>
                  <label className={LabelClass}>회사명 <span className="text-red-500">*</span></label>
                  <input type="text" name="companyName" value={hiringForm.companyName}
                    onChange={handleHiringChange} required placeholder="(주)회사이름" className={InputClass} />
                </div>
                <div>
                  <label className={LabelClass}>공고 링크 <span className="text-red-500">*</span></label>
                  <input type="url" name="link" value={hiringForm.link}
                    onChange={handleHiringChange} required placeholder="https://..." className={InputClass} />
                </div>
                <div>
                  <label className={LabelClass}>담당자 연락처 <span className="text-red-500">*</span></label>
                  <input type="text" name="contact" value={hiringForm.contact}
                    onChange={handleHiringChange} required placeholder="이메일 또는 전화번호" className={InputClass} />
                </div>

                {/* 추가 정보 토글 (선택 필드) */}
                <button type="button" onClick={() => setShowDetail((v) => !v)}
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium hover:border-indigo-300 hover:text-indigo-500 transition-all">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    추가 정보 입력하기
                    <span className="text-xs text-slate-300">(모집 직책 · 업무 내용 · 근무지)</span>
                  </span>
                  <svg className={`w-4 h-4 transition-transform duration-300 ${showDetail ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* max-h 트랜지션으로 높이를 애니메이션하여 추가 필드를 접었다 펼침 */}
                <div className={`space-y-5 overflow-hidden transition-all duration-500 ease-in-out ${showDetail ? 'max-h-[900px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div>
                    <label className={LabelClass}>모집 직책</label>
                    <input type="text" name="role" value={hiringForm.role}
                      onChange={handleHiringChange} placeholder="예) 프론트엔드 개발자" className={InputClass} />
                  </div>
                  <div>
                    <label className={LabelClass}>업무 내용</label>
                    <textarea name="content" value={hiringForm.content}
                      onChange={handleHiringChange} rows={5}
                      placeholder="주요 업무, 자격 요건, 우대 사항 등을 자유롭게 작성해 주세요."
                      className={`${InputClass} resize-none`} />
                  </div>
                  <div>
                    <label className={LabelClass}>근무지 주소</label>
                    <div className="flex gap-2">
                      {/* 읽기 전용: Daum 주소 검색 버튼 클릭 후 자동 입력 */}
                      <input type="text" name="address" value={hiringForm.address} readOnly
                        placeholder="주소 검색 버튼을 눌러주세요"
                        className={`${InputClass} flex-1 cursor-default bg-slate-50`} />
                      <button type="button" onClick={() => setShowPostcode((v) => !v)}
                        className="px-4 py-3 rounded-xl bg-[#1a1a2e] text-white text-xs font-bold whitespace-nowrap hover:bg-indigo-700 transition-colors">
                        주소 검색
                      </button>
                    </div>
                    {/* Daum 우편번호 검색 위젯 */}
                    {showPostcode && (
                      <div className="relative mt-3">
                        <button type="button" onClick={() => setShowPostcode(false)}
                          className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors text-xs font-bold">
                          ✕
                        </button>
                        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg">
                          <DaumPostcodeEmbed onComplete={handleAddressComplete} style={{ height: 450 }} />
                        </div>
                      </div>
                    )}
                    {/* 주소 선택 후 상세 주소 입력 필드 표시 */}
                    {hiringForm.address && (
                      <input type="text" name="addressDetail" value={hiringForm.addressDetail}
                        onChange={handleHiringChange}
                        placeholder="상세 주소 입력 (동/호수, 층, 건물명 등)"
                        className={`${InputClass} mt-2`} />
                    )}
                  </div>
                </div>

                {/* 제출 버튼 */}
                <button type="submit" disabled={status === 'loading'}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2">
                  {status === 'loading' ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      전송 중...
                    </>
                  ) : '제안 보내기'}
                </button>
              </form>
            )}

            {/* ── 외주 문의 폼 ── */}
            {inquiryType === 'freelance' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={LabelClass}>이름 / 회사명 <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={freelanceForm.name}
                    onChange={handleFreelanceChange} required
                    placeholder="홍길동 또는 (주)회사이름" className={InputClass} />
                </div>
                <div>
                  <label className={LabelClass}>프로젝트 개요 <span className="text-red-500">*</span></label>
                  <textarea name="overview" value={freelanceForm.overview}
                    onChange={handleFreelanceChange} required rows={5}
                    placeholder="어떤 프로젝트인지 간략하게 설명해 주세요."
                    className={`${InputClass} resize-none`} />
                </div>
                <div>
                  <label className={LabelClass}>예산 범위</label>
                  <input type="text" name="budget" value={freelanceForm.budget}
                    onChange={handleFreelanceChange} placeholder="예) 300~500만원" className={InputClass} />
                </div>
                <div>
                  <label className={LabelClass}>희망 일정</label>
                  <input type="text" name="schedule" value={freelanceForm.schedule}
                    onChange={handleFreelanceChange}
                    placeholder="예) 2025년 3월 ~ 4월 (2개월)" className={InputClass} />
                </div>
                <div>
                  <label className={LabelClass}>연락처 <span className="text-red-500">*</span></label>
                  <input type="text" name="contact" value={freelanceForm.contact}
                    onChange={handleFreelanceChange} required
                    placeholder="이메일 또는 전화번호" className={InputClass} />
                </div>

                {/* 제출 버튼 */}
                <button type="submit" disabled={status === 'loading'}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2">
                  {status === 'loading' ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      전송 중...
                    </>
                  ) : '문의 보내기'}
                </button>
              </form>
            )}
          </>
        )}

        {/* ══════════════════════════════════════
            이메일 방식 (method === 'email')
            mailto: 링크로 기본 이메일 앱을 열어준다.
        ══════════════════════════════════════ */}
        {method === 'email' && (
          <div className="rounded-2xl bg-[#f5f5f0] border border-slate-100 p-8 space-y-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">이메일 주소</p>
              <a href="mailto:shift71895@gmail.com"
                className="text-lg font-bold text-[#1a1a2e] hover:text-indigo-600 transition-colors break-all">
                shift71895@gmail.com
              </a>
            </div>

            <div className="h-px bg-slate-200" />

            {/* 문의 유형별 작성 가이드 힌트 */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
                이메일 작성 시 포함해 주시면 좋아요
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                {emailHints.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 이메일 앱 열기 버튼: subject 파라미터로 제목 자동 입력 */}
            <a href={`mailto:shift71895@gmail.com?subject=${encodeURIComponent(emailSubject)}`}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              이메일 앱 열기
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
