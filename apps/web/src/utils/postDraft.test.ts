import { describe, expect, it } from 'vitest';

import { canPublishPost, togglePlatform } from './postDraft.js';

describe('post draft helpers', () => {
  it('requires content and at least one platform', () => {
    expect(canPublishPost('', ['facebook'])).toBe(false);
    expect(canPublishPost('   ', ['facebook'])).toBe(false);
    expect(canPublishPost('Aizome update', [])).toBe(false);
    expect(canPublishPost('Aizome update', ['facebook'])).toBe(true);
  });

  it('adds and removes platforms without mutating the current selection', () => {
    const current = ['facebook'] as const;

    expect(togglePlatform(current, 'linkedin')).toEqual([
      'facebook',
      'linkedin',
    ]);
    expect(togglePlatform(current, 'facebook')).toEqual([]);
    expect(current).toEqual(['facebook']);
  });
});
