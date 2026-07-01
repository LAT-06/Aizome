export type Platform = 'facebook' | 'linkedin';

export type PostStatus =
  | 'draft'
  | 'posting'
  | 'success'
  | 'failed'
  | 'partial_success';

export type PlatformPostStatus = 'pending' | 'success' | 'failed';

export interface PlatformPostResult {
  platform: Platform;
  status: PlatformPostStatus;
  externalPostId?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface CreatePostRequest {
  content: string;
  platforms: Platform[];
}

export interface CreatePostResponse {
  postId: string;
  status: PostStatus;
  results: PlatformPostResult[];
}

export interface MediaPost {
  id: string;
  content: string;
  platforms: Platform[];
  status: PostStatus;
  results: PlatformPostResult[];
  createdAt: string;
  updatedAt: string;
}
