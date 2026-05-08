export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  memberStatus: string;
  bio: string;
  avatarUrl: string;
  wechatName: string;
  wechatAccount: string;
}

export interface CommentItem {
  id: string;
  content: string;
  isReview: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };
}

export interface WorkListItem {
  id: string;
  title: string;
  description: string;
  category: string;
  popularityScore: number;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  images: {
    url: string;
    alt: string;
  }[];
  _count: {
    likes: number;
    favorites: number;
  };
}

export interface WorkDetail extends WorkListItem {
  productUrl: string;
  isVisible: boolean;
  isPinned: boolean;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
    bio: string;
  };
  userLiked?: boolean;
  userFavorited?: boolean;
}

export interface FeedItem {
  id: string;
  title: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ArchiveItem {
  id: string;
  title: string;
  summary: string;
  abstract: string;
  points: string[];
  keywords: string[];
  sourceName: string;
  sourceUrl: string;
  sourceDate: string;
  attachmentFileId: string;
  attachmentUrl: string;
  attachmentType: string;
  originalFileName: string;
  rawText: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArchiveDetail extends ArchiveItem {
  _count?: { favorites: number };
  userFavorited?: boolean;
}
