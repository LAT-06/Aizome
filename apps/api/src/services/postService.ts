import { randomUUID } from 'node:crypto';

import type {
  CreatePostRequest,
  CreatePostResponse,
  MediaPost,
  Platform,
  PlatformPostResult,
  PostStatus,
} from '@aizome/shared';

import type { PlatformAdapter } from '../adapters/platformAdapter.js';
import type { PostRepository } from '../repositories/postRepository.js';

type PlatformAdapters = Record<Platform, PlatformAdapter>;

function getPostStatus(results: PlatformPostResult[]): PostStatus {
  if (results.every((result) => result.status === 'success')) {
    return 'success';
  }

  if (results.some((result) => result.status === 'success')) {
    return 'partial_success';
  }

  return 'failed';
}

export class PostService {
  constructor(
    private readonly repository: PostRepository,
    private readonly adapters: PlatformAdapters,
  ) {}

  async createPost(input: CreatePostRequest): Promise<CreatePostResponse> {
    const results = await Promise.all(
      input.platforms.map((platform) =>
        this.publish(platform, input.content),
      ),
    );
    const status = getPostStatus(results);
    const timestamp = new Date().toISOString();
    const post: MediaPost = {
      id: `post_${randomUUID()}`,
      content: input.content,
      platforms: input.platforms,
      status,
      results,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.repository.save(post);

    return {
      postId: post.id,
      status: post.status,
      results: post.results,
    };
  }

  private async publish(
    platform: Platform,
    content: string,
  ): Promise<PlatformPostResult> {
    try {
      const result = await this.adapters[platform].publish(content);
      return { ...result, platform };
    } catch {
      return {
        platform,
        status: 'failed',
        errorCode: 'PLATFORM_ADAPTER_ERROR',
        errorMessage: `The ${platform} adapter could not publish the post.`,
      };
    }
  }
}
