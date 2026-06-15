import { Client } from '@notionhq/client';
import type { NotionProject } from '@/types/notion';

const getNotionData = async (): Promise<NotionProject[]> => {
  const API_KEY = process.env.NOTION_API_KEY;
  const DATABASE_ID = process.env.NOTION_DATABASE_ID;

  if (!API_KEY || !DATABASE_ID) {
    console.error('노션 API 키 또는 데이터베이스 ID가 설정되지 않았습니다.');
    return [];
  }

  const notion = new Client({ auth: API_KEY });

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 100,
    });
    return response.results as unknown as NotionProject[];
  } catch (error) {
    console.error('Notion API 에러:', error);
    return [];
  }
};

export default getNotionData;
