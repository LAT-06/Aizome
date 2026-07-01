import type { MediaPost } from '@aizome/shared';

export interface PostRepository {
  save(post: MediaPost): Promise<void>;
  findById(id: string): Promise<MediaPost | undefined>;
}
