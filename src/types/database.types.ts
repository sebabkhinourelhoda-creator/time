export interface ContentCategory {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
}

export interface ContentStatus {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
}

export interface DocumentType {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
}

export interface VideoType {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  category_id: number;
  status_id: number;
  thumbnail_url: string | null;
  author_id: number;
  tags: string[];
  views_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  category?: ContentCategory;
  status?: ContentStatus;
  author?: User;
}

export interface Document extends ContentItem {
  document_type_id: number;
  file_url: string;
  file_size: number;
  page_count: number | null;
  language: string;
  doi: string | null;
  citation_count: number;
  download_count: number;
  preview_url: string | null;
  keywords: string[];
  contributors: string[];
  institution: string | null;
  document_type?: DocumentType;
}

export interface Video extends ContentItem {
  video_type_id: number;
  video_url: string;
  duration: string;
  transcript: string | null;
  resolution: string | null;
  language: string;
  subtitles_url: string[];
  chapters: Record<string, any> | null;
  related_resources: string[];
  equipment_used: string[];
  certification_eligible: boolean;
  video_type?: VideoType;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  created_at: string;
  last_login: string | null;
}

export interface Database {
  public: {
    Tables: {
      content_categories: {
        Row: ContentCategory;
        Insert: Omit<ContentCategory, 'id' | 'created_at'>;
        Update: Partial<Omit<ContentCategory, 'id' | 'created_at'>>;
      };
      content_statuses: {
        Row: ContentStatus;
        Insert: Omit<ContentStatus, 'id' | 'created_at'>;
        Update: Partial<Omit<ContentStatus, 'id' | 'created_at'>>;
      };
      document_types: {
        Row: DocumentType;
        Insert: Omit<DocumentType, 'id' | 'created_at'>;
        Update: Partial<Omit<DocumentType, 'id' | 'created_at'>>;
      };
      video_types: {
        Row: VideoType;
        Insert: Omit<VideoType, 'id' | 'created_at'>;
        Update: Partial<Omit<VideoType, 'id' | 'created_at'>>;
      };
      content_items: {
        Row: ContentItem;
        Insert: Omit<ContentItem, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'likes_count'>;
        Update: Partial<Omit<ContentItem, 'id' | 'created_at'>>;
      };
      documents: {
        Row: Document;
        Insert: Omit<Document, keyof ContentItem | 'citation_count' | 'download_count'>;
        Update: Partial<Omit<Document, keyof ContentItem>>;
      };
      videos: {
        Row: Video;
        Insert: Omit<Video, keyof ContentItem>;
        Update: Partial<Omit<Video, keyof ContentItem>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'last_login'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
    };
  };
}