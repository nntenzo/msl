import { createClient } from '@metagptx/web-sdk';

export const client = createClient();

export interface SiteSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  category: string;
}

export interface PigPrice {
  id: number;
  price_type: string;
  price_per_kg: number;
  price_per_head: number;
  is_active: boolean;
  notes_en: string;
  notes_my: string;
  notes_zh: string;
}

export interface KnowledgeArticle {
  id: number;
  slug: string;
  title_en: string;
  title_my: string;
  title_zh: string;
  content_en: string;
  content_my: string;
  content_zh: string;
  category: string;
  thumbnail_url: string;
  is_published: boolean;
  sort_order: number;
}

export interface PageContent {
  id: number;
  page_key: string;
  section_key: string;
  content_en: string;
  content_my: string;
  content_zh: string;
  image_url: string;
  is_visible: boolean;
  sort_order: number;
}