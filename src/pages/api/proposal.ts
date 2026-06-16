/**
 * @file src/pages/api/proposal.ts
 * @description 채용 제안 / 외주 문의를 Discord 웹훅으로 전송하는 API Route
 *
 * 호출처: src/components/JobProposalForm.tsx (handleConfirm 함수)
 * 메서드: POST only
 *
 * 요청 Body 구조:
 *   공통 필드:
 *     inquiryType: 'hiring' | 'freelance'
 *
 *   채용 제안(hiring) 추가 필드:
 *     companyName   : 회사명 (필수)
 *     link          : 채용 공고 URL (필수)
 *     contact       : 담당자 연락처 (필수)
 *     role          : 모집 직책 (선택)
 *     content       : 업무 내용 (선택)
 *     address       : 근무지 주소 (선택)
 *     addressDetail : 근무지 상세 주소 (선택)
 *
 *   외주 문의(freelance) 추가 필드:
 *     name     : 이름 / 회사명 (필수)
 *     overview : 프로젝트 개요 (필수)
 *     contact  : 연락처 (필수)
 *     budget   : 예산 범위 (선택)
 *     schedule : 희망 일정 (선택)
 *
 * 필요한 환경변수 (.env):
 *   DISCORD_WEBHOOK_URL : Discord 채널 웹훅 URL
 *
 * Discord 멘션 ID (<@396935338574217216>)는 알림을 받을 Discord 사용자 ID.
 * 변경하려면 해당 숫자를 Discord의 본인 사용자 ID로 교체한다.
 */

import type { NextApiRequest, NextApiResponse } from 'next';

/** 채용 제안 폼 필드 타입 */
interface HiringBody {
  inquiryType: 'hiring';
  companyName: string;
  link?: string;
  role?: string;
  content?: string;
  address?: string;
  addressDetail?: string;
  contact?: string;
}

/** 외주 문의 폼 필드 타입 */
interface FreelanceBody {
  inquiryType: 'freelance';
  name: string;
  overview?: string;
  budget?: string;
  schedule?: string;
  contact?: string;
}

type ProposalBody = HiringBody | FreelanceBody;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // POST 외 메서드 차단
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Discord 웹훅 URL 확인
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ message: 'Discord Webhook URL이 설정되지 않았습니다.' });
  }

  const body = req.body as ProposalBody;
  const { inquiryType } = body;

  // Discord Embed 구성: 문의 유형에 따라 다른 필드 구성
  let embed: object;

  if (inquiryType === 'hiring') {
    const { companyName, role, content, link, address, addressDetail, contact } = body as HiringBody;

    if (!companyName) {
      return res.status(400).json({ message: '회사명은 필수 항목입니다.' });
    }

    const fullAddress = address
      ? `${address}${addressDetail ? ` ${addressDetail}` : ''}`
      : '미기재';

    embed = {
      title: '💼 새로운 채용 제안이 도착했습니다!',
      color: 0x2563eb, // 파란색
      fields: [
        { name: '🏢 회사명',      value: companyName,           inline: true },
        { name: '💼 모집 직책',   value: role || '미기재',      inline: true },
        { name: '📞 연락처',      value: contact || '미기재',   inline: false },
        { name: '📍 근무지 주소', value: fullAddress,           inline: false },
        { name: '📋 업무 내용',   value: content || '미기재',   inline: false },
        { name: '🔗 공고 링크',   value: link || '첨부되지 않음', inline: false },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: 'yoon-dev-folio · 채용 제안 알림' },
    };

  } else if (inquiryType === 'freelance') {
    const { name, overview, budget, schedule, contact } = body as FreelanceBody;

    if (!name) {
      return res.status(400).json({ message: '이름/회사명은 필수 항목입니다.' });
    }

    embed = {
      title: '🤝 새로운 외주 문의가 도착했습니다!',
      color: 0x7c3aed, // 보라색
      fields: [
        { name: '👤 이름 / 회사명',   value: name,                inline: true },
        { name: '📞 연락처',          value: contact || '미기재', inline: true },
        { name: '📋 프로젝트 개요',   value: overview || '미기재', inline: false },
        { name: '💰 예산 범위',        value: budget || '미기재',  inline: true },
        { name: '📅 희망 일정',        value: schedule || '미기재', inline: true },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: 'yoon-dev-folio · 외주 문의 알림' },
    };

  } else {
    return res.status(400).json({ message: '올바르지 않은 문의 유형입니다.' });
  }

  // Discord 웹훅으로 전송
  try {
    const discordRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: '<@396935338574217216>', // 알림 받을 Discord 사용자 멘션
        embeds: [embed],
      }),
    });

    if (!discordRes.ok) {
      return res.status(502).json({ message: 'Discord 전송에 실패했습니다.' });
    }

    return res.status(200).json({ message: 'Discord 알림 전송 성공' });
  } catch {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}
