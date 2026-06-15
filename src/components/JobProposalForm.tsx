import { useState } from 'react';
import DaumPostcodeEmbed, { Address } from 'react-daum-postcode';
import emailjs from '@emailjs/browser';

type SendMethod = 'form' | 'email';

interface FormState {
  companyName: string;
  link: string;
  role: string;
  content: string;
  address: string;
  addressDetail: string;
}

const INITIAL: FormState = {
  companyName: '',
  link: '',
  role: '',
  content: '',
  address: '',
  addressDetail: '',
};

const InputClass =
  'w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-[#1a1a2e] text-sm placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all';

const LabelClass = 'block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2';

export default function JobProposalForm() {
  const [method, setMethod] = useState<SendMethod>('form');
  const [form, setForm] = useState<FormState>(INITIAL);
  const [showDetail, setShowDetail] = useState(false);
  const [showPostcode, setShowPostcode] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressComplete = (data: Address) => {
    setForm((prev) => ({ ...prev, address: data.roadAddress || data.address }));
    setShowPostcode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const emailServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const emailTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const emailPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (emailServiceId && emailTemplateId && emailPublicKey) {
        await emailjs.send(
          emailServiceId,
          emailTemplateId,
          {
            company_name: form.companyName,
            link: form.link,
            role: form.role || '미기재',
            content: form.content || '미기재',
            address: form.address ? `${form.address}${form.addressDetail ? ` ${form.addressDetail}` : ''}` : '미기재',
          },
          emailPublicKey,
        );
      }

      const discordRes = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!discordRes.ok) throw new Error(`Discord 전송 실패 (${discordRes.status})`);

      setStatus('success');
      setForm(INITIAL);
      setShowDetail(false);
    } catch {
      setStatus('error');
      setErrorMsg('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <section id="proposal" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

      <div className="max-w-2xl mx-auto px-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-6 bg-indigo-400" />
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-500">Hire Me</p>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-[#1a1a2e] tracking-tighter leading-tight mb-4">
          채용 제안
          <br />
          <span className="gradient-text">보내기</span>
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-10">
          편한 방법을 선택해 제안해 주세요.
          <br />
          빠르게 검토 후 연락드리겠습니다.
        </p>

        {/* 방법 선택 탭 */}
        <div className="flex gap-2 p-1 rounded-xl bg-slate-100 mb-10">
          {([
            { key: 'form', icon: '📋', label: '폼으로 보내기', desc: '간편하게 작성' },
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
                <span className={`text-[10px] font-normal ${method === tab.key ? 'text-slate-400' : 'text-slate-300'}`}>{tab.desc}</span>
              </span>
            </button>
          ))}
        </div>

        {/* ── 폼 방식 ── */}
        {method === 'form' && (
          <>
            {status === 'success' && (
              <div className="mb-8 px-5 py-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                성공적으로 전달되었습니다. 빠르게 검토 후 연락드리겠습니다!
              </div>
            )}
            {status === 'error' && (
              <div className="mb-8 px-5 py-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={LabelClass}>회사명 <span className="text-red-500">*</span></label>
                <input type="text" name="companyName" value={form.companyName} onChange={handleChange}
                  required placeholder="(주)회사이름" className={InputClass} />
              </div>

              <div>
                <label className={LabelClass}>공고 링크 <span className="text-red-500">*</span></label>
                <input type="url" name="link" value={form.link} onChange={handleChange}
                  required placeholder="https://..." className={InputClass} />
              </div>

              {/* 추가 정보 토글 */}
              <button
                type="button"
                onClick={() => setShowDetail((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium hover:border-indigo-300 hover:text-indigo-500 transition-all"
              >
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

              <div className={`space-y-5 overflow-hidden transition-all duration-500 ease-in-out ${showDetail ? 'max-h-[900px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div>
                  <label className={LabelClass}>모집 직책</label>
                  <input type="text" name="role" value={form.role} onChange={handleChange}
                    placeholder="예) 프론트엔드 개발자" className={InputClass} />
                </div>
                <div>
                  <label className={LabelClass}>업무 내용</label>
                  <textarea name="content" value={form.content} onChange={handleChange} rows={5}
                    placeholder="주요 업무, 자격 요건, 우대 사항 등을 자유롭게 작성해 주세요."
                    className={`${InputClass} resize-none`} />
                </div>
                <div>
                  <label className={LabelClass}>근무지 주소</label>
                  <div className="flex gap-2">
                    <input type="text" name="address" value={form.address} readOnly
                      placeholder="주소 검색 버튼을 눌러주세요"
                      className={`${InputClass} flex-1 cursor-default bg-slate-50`} />
                    <button type="button" onClick={() => setShowPostcode((v) => !v)}
                      className="px-4 py-3 rounded-xl bg-[#1a1a2e] text-white text-xs font-bold whitespace-nowrap hover:bg-indigo-700 transition-colors">
                      주소 검색
                    </button>
                  </div>
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
                  {/* 상세 주소 */}
                  {form.address && (
                    <input
                      type="text"
                      name="addressDetail"
                      value={form.addressDetail}
                      onChange={handleChange}
                      placeholder="상세 주소 입력 (동/호수, 층, 건물명 등)"
                      className={`${InputClass} mt-2`}
                    />
                  )}
                </div>
              </div>

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
          </>
        )}

        {/* ── 이메일 방식 ── */}
        {method === 'email' && (
          <div className="rounded-2xl bg-[#f5f5f0] border border-slate-100 p-8 space-y-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">이메일 주소</p>
              <a
                href="mailto:shift71895@gmail.com"
                className="text-lg font-bold text-[#1a1a2e] hover:text-indigo-600 transition-colors break-all"
              >
                shift71895@gmail.com
              </a>
            </div>

            <div className="h-px bg-slate-200" />

            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">이메일 작성 시 포함해 주시면 좋아요</p>
              <ul className="space-y-2 text-sm text-slate-500">
                {['회사명 및 팀 소개', '모집 직책과 주요 업무', '채용 공고 링크 또는 JD', '근무지 / 근무 형태 (재택·출근)', '처우 및 복리후생 (선택)'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="mailto:shift71895@gmail.com?subject=[채용 제안] 회사명을 입력해 주세요"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              이메일 앱 열기
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
