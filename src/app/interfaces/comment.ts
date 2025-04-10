export interface Comment {
  commentId: string; // Unique identifier for the comment
    userId: string;
    articleId: string;
    userName: string;
    content: string;
    timestamp: string; // ISO format
    likes: number;
    parentId: string | null; // If it's a reply
  }
  