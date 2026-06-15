export interface NotionTextItem {
  plain_text: string;
}

export interface NotionSelectItem {
  id: string;
  name: string;
  color: string;
}

export interface NotionCover {
  external?: { url: string };
  file?: { url: string };
}

export interface NotionProjectProperties {
  Title: { title: NotionTextItem[] };
  SubTitle: { rich_text: NotionTextItem[] };
  TechStack: { multi_select: NotionSelectItem[] };
  Period: { date: { start: string; end: string | null } | null };
  Description: { rich_text: NotionTextItem[] };
}

export interface NotionProject {
  id: string;
  cover: NotionCover | null;
  properties: NotionProjectProperties;
}
