import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../src/app.js';

describe('GET /health', () => {
  it('reports that the API is available', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      service: 'aizome-api',
      status: 'ok',
    });
  });
});

describe('POST /api/posts', () => {
  it.each([
    {
      body: { content: '   ', platforms: ['facebook'] },
      detail: 'content must not be empty',
    },
    {
      body: { content: 'A post', platforms: [] },
      detail: 'platforms must contain at least one platform',
    },
    {
      body: { content: 'A post', platforms: ['instagram'] },
      detail: 'platforms contains an unsupported platform',
    },
  ])('rejects invalid requests: $detail', async ({ body, detail }) => {
    const response = await request(app).post('/api/posts').send(body);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid post request.',
        details: [detail],
      },
    });
  });

  it('dispatches to both mock adapters and returns normalized results', async () => {
    const response = await request(app).post('/api/posts').send({
      content: 'Hello from Aizome.',
      platforms: ['facebook', 'linkedin'],
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      status: 'success',
      results: [
        {
          platform: 'facebook',
          status: 'success',
        },
        {
          platform: 'linkedin',
          status: 'success',
        },
      ],
    });
    expect(response.body.postId).toMatch(/^post_/);
    expect(response.body.results[0].externalPostId).toMatch(/^mock_fb_/);
    expect(response.body.results[1].externalPostId).toMatch(/^mock_li_/);
  });
});
