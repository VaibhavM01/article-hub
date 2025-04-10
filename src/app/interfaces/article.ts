export interface Article {
  id?: string;
  title: string;
  thumbnailUrl?: string;
  description?: string;
  content: string;
  authorName?: string;
  authorId: string;
  publishDate?: string | null;
  tags?: string[]; // Use array always
  views?: number;
  likes?: number;
  featured?: boolean; // previously isEditorsPick
  isDraft: boolean;
  createdAt: Date;
}
