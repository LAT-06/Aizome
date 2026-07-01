import type { MediaPost } from '@aizome/shared';

import type { PostRepository } from './postRepository.js';

export class InMemoryPostRepository implements PostRepository {
  private readonly posts = new Map<string, MediaPost>();

  async save(post: MediaPost): Promise<void> {
    this.posts.set(post.id, structuredClone(post));
  }

  async findById(id: string): Promise<MediaPost | undefined> {
    const post = this.posts.get(id);
    return post ? structuredClone(post) : undefined;
  }
}
