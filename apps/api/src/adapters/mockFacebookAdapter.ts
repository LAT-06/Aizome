import { randomUUID } from 'node:crypto';

import type { PlatformPostResult } from '@aizome/shared';

import type { PlatformAdapter } from './platformAdapter.js';

export class MockFacebookAdapter implements PlatformAdapter {
  readonly platform = 'facebook';

  async publish(_content: string): Promise<PlatformPostResult> {
    return {
      platform: this.platform,
      status: 'success',
      externalPostId: `mock_fb_${randomUUID()}`,
    };
  }
}
