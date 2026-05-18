import { ContextStore, FileContextAdapter, RedisContextAdapter, SqliteContextAdapter } from '../context';
import type { ContextStorageConfig } from './types';

const VALID_TYPES: ReadonlyArray<ContextStorageConfig['type']> = ['file', 'sqlite', 'redis'];

export class ContextAdapterFactory {
  static async init(cfg: ContextStorageConfig | undefined, defaultTtl?: number): Promise<void> {
    if (defaultTtl != null) ContextStore.defaultTtl = defaultTtl;

    if (cfg == null) return;

    if (typeof cfg !== 'object' || !VALID_TYPES.includes((cfg as ContextStorageConfig).type)) {
      const received =
        typeof cfg === 'object' ? `{ type: '${(cfg as ContextStorageConfig).type}' }` : JSON.stringify(cfg);
      throw new Error(
        `[Spraxium] Invalid context.storage value: ${received}. Use { type: 'file' } for single-instance bots, { type: 'sqlite' } for higher write volume, or { type: 'redis' } for multi-process deployments.`,
      );
    }

    switch (cfg.type) {
      case 'file':
        await ContextStore.initialize(new FileContextAdapter({ dir: cfg.dir }));
        break;
      case 'sqlite':
        await ContextStore.initialize(new SqliteContextAdapter({ path: cfg.path }));
        break;
      case 'redis':
        await ContextStore.initialize(new RedisContextAdapter(cfg));
        break;
    }
  }
}

/** @deprecated Use `ContextAdapterFactory.init()` instead. */
export async function initContextAdapter(
  cfg: ContextStorageConfig | undefined,
  defaultTtl?: number,
): Promise<void> {
  return ContextAdapterFactory.init(cfg, defaultTtl);
}
