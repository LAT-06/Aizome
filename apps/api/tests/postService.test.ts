import type {
  Platform,
  PlatformPostResult,
  PlatformPostStatus,
} from '@aizome/shared';
import { describe, expect, it } from 'vitest';

import type { PlatformAdapter } from '../src/adapters/platformAdapter.js';
import { InMemoryPostRepository } from '../src/repositories/inMemoryPostRepository.js';
import { PostService } from '../src/services/postService.js';

class RecordingAdapter implements PlatformAdapter {
  readonly calls: string[] = [];

  constructor(
    readonly platform: Platform,
    private readonly resultStatus: Exclude<PlatformPostStatus, 'pending'>,
  ) {}

  async publish(content: string): Promise<PlatformPostResult> {
    this.calls.push(content);

    if (this.resultStatus === 'failed') {
      return {
        platform: this.platform,
        status: 'failed',
        errorCode: 'CONTROLLED_FAILURE',
        errorMessage: `${this.platform} rejected the post.`,
      };
    }

    return {
      platform: this.platform,
      status: 'success',
      externalPostId: `test_${this.platform}_post`,
    };
  }
}

class ThrowingAdapter implements PlatformAdapter {
  readonly platform = 'linkedin';

  async publish(): Promise<PlatformPostResult> {
    throw new Error('Sensitive provider detail');
  }
}

describe('PostService', () => {
  it('dispatches only to the selected adapter and persists the result', async () => {
    const repository = new InMemoryPostRepository();
    const facebook = new RecordingAdapter('facebook', 'success');
    const linkedin = new RecordingAdapter('linkedin', 'success');
    const service = new PostService(repository, { facebook, linkedin });

    const response = await service.createPost({
      content: 'Facebook only',
      platforms: ['facebook'],
    });

    expect(facebook.calls).toEqual(['Facebook only']);
    expect(linkedin.calls).toEqual([]);
    expect(response.status).toBe('success');
    await expect(repository.findById(response.postId)).resolves.toMatchObject({
      content: 'Facebook only',
      platforms: ['facebook'],
      status: 'success',
      results: response.results,
    });
  });

  it('dispatches to both adapters and returns partial success', async () => {
    const repository = new InMemoryPostRepository();
    const facebook = new RecordingAdapter('facebook', 'success');
    const linkedin = new RecordingAdapter('linkedin', 'failed');
    const service = new PostService(repository, { facebook, linkedin });

    const response = await service.createPost({
      content: 'Both platforms',
      platforms: ['facebook', 'linkedin'],
    });

    expect(facebook.calls).toEqual(['Both platforms']);
    expect(linkedin.calls).toEqual(['Both platforms']);
    expect(response.status).toBe('partial_success');
    expect(response.results).toEqual([
      {
        platform: 'facebook',
        status: 'success',
        externalPostId: 'test_facebook_post',
      },
      {
        platform: 'linkedin',
        status: 'failed',
        errorCode: 'CONTROLLED_FAILURE',
        errorMessage: 'linkedin rejected the post.',
      },
    ]);
  });

  it('normalizes thrown adapter errors without exposing provider details', async () => {
    const repository = new InMemoryPostRepository();
    const facebook = new RecordingAdapter('facebook', 'success');
    const linkedin = new ThrowingAdapter();
    const service = new PostService(repository, { facebook, linkedin });

    const response = await service.createPost({
      content: 'LinkedIn only',
      platforms: ['linkedin'],
    });

    expect(response.status).toBe('failed');
    expect(response.results).toEqual([
      {
        platform: 'linkedin',
        status: 'failed',
        errorCode: 'PLATFORM_ADAPTER_ERROR',
        errorMessage: 'The linkedin adapter could not publish the post.',
      },
    ]);
  });
});
