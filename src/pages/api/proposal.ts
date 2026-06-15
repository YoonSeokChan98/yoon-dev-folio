import type { NextApiRequest, NextApiResponse } from 'next';

interface ProposalBody {
  companyName: string;
  role?: string;
  content?: string;
  link?: string;
  address?: string;
  addressDetail?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ message: 'Discord Webhook URL이 설정되지 않았습니다.' });
  }

  const { companyName, role, content, link, address, addressDetail } = req.body as ProposalBody;

  if (!companyName) {
    return res.status(400).json({ message: '회사명은 필수 항목입니다.' });
  }

  const fullAddress = address
    ? `${address}${addressDetail ? ` ${addressDetail}` : ''}`
    : '미기재';

  const embed = {
    title: '🚀 새로운 채용 제안이 도착했습니다!',
    color: 0x4f46e5,
    fields: [
      { name: '🏢 회사명', value: companyName, inline: true },
      { name: '💼 모집 직책', value: role || '미기재', inline: true },
      { name: '📍 근무지 주소', value: fullAddress, inline: false },
      { name: '📋 업무 내용', value: content || '미기재', inline: false },
      { name: '🔗 공고 링크', value: link || '첨부되지 않음', inline: false },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: 'yoon-dev-folio · 채용 제안 알림' },
  };

  try {
    const discordRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: '<@396935338574217216>',
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
