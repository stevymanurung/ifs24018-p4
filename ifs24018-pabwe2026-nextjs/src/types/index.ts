export interface ApiResult<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  photo: string | null;
}

export interface PostAuthor {
  id?: string | number;
  name: string;
  photo?: string | null;
}

export interface PostComment {
  id: string | number;
  comment: string;
  created_at: string;
  author?: PostAuthor;
  user_id?: string | number;
}

export interface PostLike {
  user_id: string | number;
}

export interface Post {
  id: string | number;
  description: string;
  cover: string | null;
  created_at: string;
  updated_at?: string;
  author?: PostAuthor;
  user_id?: string | number;
  likes?: PostLike[] | number;
  comments?: PostComment[] | number;
}
