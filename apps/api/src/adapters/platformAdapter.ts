import type { Platform, PlatformPostResult } from '@aizome/shared';

export interface PlatformAdapter {
  readonly platform: Platform;
  publish(content: string): Promise<PlatformPostResult>;
}
