import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';

import { MockFacebookAdapter } from './adapters/mockFacebookAdapter.js';
import { MockLinkedInAdapter } from './adapters/mockLinkedInAdapter.js';
import { InMemoryPostRepository } from './repositories/inMemoryPostRepository.js';
import { PostService } from './services/postService.js';
import {
  RequestValidationError,
  validateCreatePostRequest,
} from './validation/createPostRequest.js';

interface AppDependencies {
  postService: PostService;
}

function createDefaultPostService(): PostService {
  return new PostService(new InMemoryPostRepository(), {
    facebook: new MockFacebookAdapter(),
    linkedin: new MockLinkedInAdapter(),
  });
}

function isMalformedJson(error: unknown): boolean {
  return error instanceof SyntaxError && 'body' in error;
}

export function createApp(
  dependencies: Partial<AppDependencies> = {},
): express.Express {
  const app = express();
  const postService = dependencies.postService ?? createDefaultPostService();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));

  app.get('/health', (_request, response) => {
    response.status(200).json({
      service: 'aizome-api',
      status: 'ok',
    });
  });

  app.post('/api/posts', async (request, response, next) => {
    try {
      const input = validateCreatePostRequest(request.body);
      const result = await postService.createPost(input);
      response.status(201).json(result);
    } catch (error) {
      if (error instanceof RequestValidationError) {
        response.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid post request.',
            details: error.details,
          },
        });
        return;
      }

      next(error);
    }
  });

  app.use(
    (
      error: unknown,
      _request: Request,
      response: Response,
      _next: NextFunction,
    ) => {
      if (isMalformedJson(error)) {
        response.status(400).json({
          error: {
            code: 'MALFORMED_JSON',
            message: 'Request body must contain valid JSON.',
          },
        });
        return;
      }

      response.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'The request could not be completed.',
        },
      });
    },
  );

  return app;
}

export const app = createApp();
