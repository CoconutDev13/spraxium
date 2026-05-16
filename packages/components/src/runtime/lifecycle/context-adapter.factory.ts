import { ContextStore, FileContextAdapter, RedisContextAdapter, SqliteContextAdapter } from '../context';
import type { ContextStorageConfig } from './types';

const VALID_TYPES = ['file', 'sqlite', 'redis'] as const;

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidConfig(cfg: unknown): cfg is ContextStorageConfig {
  if (!isObjectRecord(cfg)) return false;
  const type = cfg.type;
  return typeof type === 'string' && (VALID_TYPES as readonly string[]).includes(type);
}

export async function initContextAdapter(
  cfg: ContextStorageConfig | undefined,
  defaultTtl?: number,
): Promise<void> {
  if (defaultTtl != null) ContextStore.defaultTtl = defaultTtl;

  if (cfg === undefined || cfg === null) return;

  if (!isValidConfig(cfg)) {
    const received = isObjectRecord(cfg) ? `{ type: '${String(cfg.type)}' }` : JSON.stringify(cfg);
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
    default:
      throw new Error(`[Spraxium] Unsupported context adapter type: ${String(cfg.type)}`);
  }
}
