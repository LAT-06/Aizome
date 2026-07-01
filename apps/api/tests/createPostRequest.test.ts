import { describe, expect, it } from 'vitest';

import { validateCreatePostRequest } from '../src/validation/createPostRequest.js';

describe('validateCreatePostRequest', () => {
  it.each([
    {
      body: { content: '', platforms: ['facebook'] },
      message: 'content must not be empty',
    },
    {
      body: { content: '   ', platforms: ['facebook'] },
      message: 'content must not be empty',
    },
    {
      body: { content: 'a'.repeat(3001), platforms: ['facebook'] },
      message: 'content must not exceed 3000 characters',
    },
    {
      body: { content: 'A post', platforms: [] },
      message: 'platforms must contain at least one platform',
    },
    {
      body: { content: 'A post', platforms: ['instagram'] },
      message: 'platforms contains an unsupported platform',
    },
    {
      body: { content: 'A post', platforms: ['facebook', 'facebook'] },
      message: 'platforms must not contain duplicates',
    },
  ])('rejects invalid input: $message', ({ body, message }) => {
    expect(() => validateCreatePostRequest(body)).toThrow(message);
  });

  it('returns a typed request for valid input', () => {
    const request = validateCreatePostRequest({
      content: 'Hello from Aizome.',
      platforms: ['facebook', 'linkedin'],
    });

    expect(request).toEqual({
      content: 'Hello from Aizome.',
      platforms: ['facebook', 'linkedin'],
    });
  });
});
