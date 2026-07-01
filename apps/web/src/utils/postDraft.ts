import type { Platform } from '@aizome/shared';

export function canPublishPost(
  content: string,
  platforms: readonly Platform[],
): boolean {
  return content.trim().length > 0 && platforms.length > 0;
}

export function togglePlatform(
  platforms: readonly Platform[],
  platform: Platform,
): Platform[] {
  if (platforms.includes(platform)) {
    return platforms.filter((item) => item !== platform);
  }

  return [...platforms, platform];
}
