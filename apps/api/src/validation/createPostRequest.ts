import type { CreatePostRequest, Platform } from '@aizome/shared';

const MAX_CONTENT_LENGTH = 3000;

export class RequestValidationError extends Error {
  readonly details: string[];

  constructor(message: string) {
    super(message);
    this.name = 'RequestValidationError';
    this.details = [message];
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPlatform(value: unknown): value is Platform {
  return value === 'facebook' || value === 'linkedin';
}

function parseContent(value: unknown): string {
  if (typeof value !== 'string') {
    throw new RequestValidationError('content must be a string');
  }

  if (value.trim().length === 0) {
    throw new RequestValidationError('content must not be empty');
  }

  if (value.length > MAX_CONTENT_LENGTH) {
    throw new RequestValidationError(
      `content must not exceed ${MAX_CONTENT_LENGTH} characters`,
    );
  }

  return value;
}

function parsePlatforms(value: unknown): Platform[] {
  if (!Array.isArray(value)) {
    throw new RequestValidationError('platforms must be an array');
  }

  if (value.length === 0) {
    throw new RequestValidationError(
      'platforms must contain at least one platform',
    );
  }

  if (!value.every(isPlatform)) {
    throw new RequestValidationError(
      'platforms contains an unsupported platform',
    );
  }

  if (new Set(value).size !== value.length) {
    throw new RequestValidationError('platforms must not contain duplicates');
  }

  return value;
}

export function validateCreatePostRequest(value: unknown): CreatePostRequest {
  if (!isRecord(value)) {
    throw new RequestValidationError('request body must be an object');
  }

  return {
    content: parseContent(value.content),
    platforms: parsePlatforms(value.platforms),
  };
}
