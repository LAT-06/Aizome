import { randomUUID } from 'node:crypto';

import type { PlatformPostResult } from '@aizome/shared';

import type { PlatformAdapter } from './platformAdapter.js';

export class MockLinkedInAdapter implements PlatformAdapter {
  readonly platform = 'linkedin';

  async publish(_content: string): Promise<PlatformPostResult> {
    return {
      platform: this.platform,
      status: 'success',
      externalPostId: `mock_li_${randomUUID()}`,
    };
  }
}
