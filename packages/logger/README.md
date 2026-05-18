# @spraxium/logger

`@spraxium/logger` is the centralized structured logging system for the Spraxium ecosystem. It provides a `Logger` class with contextual namespacing, pluggable transports (console and Discord), automatic Discord bot token masking, custom log levels, and a `TableBuilder` utility for pretty terminal tables: all with zero required peer dependencies.

## Installation

```bash
npm install @spraxium/logger
```

## Quick Start

Use the pre-built `logger` singleton for global log output, or create a named `Logger` instance for contextual output:

```typescript
import { Logger, logger } from '@spraxium/logger';

// Root singleton: no context prefix
logger.info('Bot is starting');

// Named instance: prefixes every line with [Gateway]
const gateway = new Logger('Gateway');
gateway.info('Shard connected');
gateway.error('Connection dropped', { shardId: 2 });
```

## Configuration

Call `Logger.configure()` once at startup (e.g. in your `main.ts`) before any log output is produced:

```typescript
import { Logger } from '@spraxium/logger';

Logger.configure({
  maskTokens: true,           // redact Discord bot tokens: default: true
  commandLogging: true,       // log every slash command execution
  timestampFormat: 'default', // 'default' | 'iso' | 'time-only' | (d) => string
  timestampLocale: 'en-US',   // BCP 47 locale for time formatting
});
```

### `SpraxiumLoggerConfig`

| Field | Type | Default | Description |
|---|---|---|---|
| `maskTokens` | `boolean` | `true` | Replace Discord bot token patterns with `[REDACTED]` before any transport receives the entry |
| `commandLogging` | `boolean` | `false` | Register a listener that logs every slash command execution |
| `levels` | `CustomLogLevel[]` | `[]` | Custom log levels to register alongside the built-in set |
| `discord` | `DiscordTransportConfig` |: | Attach a Discord webhook or channel transport |
| `timestampFormat` | `TimestampFormat` | `'default'` | Controls how the timestamp prefix is rendered |
| `timestampLocale` | `string` | `'en-US'` | BCP 47 locale tag for time formatting |

#### `timestampFormat` values

- `'default'`: `DD/MM/YYYY - HH:MM:SS`
- `'iso'`: ISO 8601: `2026-05-02T14:30:00.000Z`
- `'time-only'`: `HH:MM:SS`
- `(date: Date) => string`: custom formatter function

## Log Methods

Every `Logger` instance exposes the following methods. All accept an optional `metadata` object as the last argument.

```typescript
gateway.info('Ready');
gateway.success('Shard reconnected');
gateway.warn('Rate limit approaching', { remaining: 2 });
gateway.error('Unhandled exception', { stack: err.stack });
gateway.debug('Raw payload', { payload });

// Generic: pass any level name, including custom ones
gateway.log('verbose', 'Detailed trace', { id: 42 });

// Raw output: bypasses prefix formatting
gateway.raw('Plain line with no prefix');
```

## Child Loggers

`child(name)` creates a new `Logger` whose context is `Parent > Child`, useful for sub-services:

```typescript
const db = new Logger('Database');
const query = db.child('Query');  // context: "Database > Query"
query.info('Executing SELECT ...');
```

## Custom Log Levels

Register a custom level with `extend()` and optionally attach a color:

```typescript
import { Logger, ANSI } from '@spraxium/logger';

const verbose = logger.extend('verbose', ANSI.cyan);
verbose('Detailed trace output');
```

You can also declare levels via `Logger.configure({ levels: [...] })` to make them available globally.

## Transports

### ConsoleTransport

The `ConsoleTransport` is registered automatically and writes to `stdout`/`stderr` using ANSI escape codes with no external dependencies.

```typescript
import { ConsoleTransport } from '@spraxium/logger';

// Change the timestamp format for all console output
ConsoleTransport.setTimestampFormat('time-only');

// Change the timestamp locale
ConsoleTransport.setLocale('pt-BR');

// Register a color for a custom level
ConsoleTransport.registerColor('verbose', 'cyan');
```

### DiscordTransport

Forward log entries to a Discord webhook URL or a bot channel. Configured via `Logger.configure()`:

```typescript
import { Logger } from '@spraxium/logger';

// Webhook mode: no Discord client needed
Logger.configure({
  discord: {
    type: 'webhook',
    webhookUrl: process.env.LOG_WEBHOOK_URL,
    levels: ['error', 'warn'],
  },
});

// Channel mode: requires Logger.setClient(client) after login
Logger.configure({
  discord: {
    type: 'channel',
    channelId: '123456789012345678',
    levels: ['error'],
  },
});

// After the bot logs in:
Logger.setClient(client);
```

#### `DiscordTransportConfig`

| Field | Type | Description |
|---|---|---|
| `type` | `'webhook' \| 'channel'` | Delivery method |
| `webhookUrl` | `string` | Webhook URL: required when `type` is `'webhook'` |
| `channelId` | `string` | Channel ID: required when `type` is `'channel'` |
| `levels` | `LogLevel[]` | Log levels forwarded to Discord |
| `embed` | `DiscordEmbedTemplate` | Optional embed template; uses a sensible default when omitted |

## Token Masking

Token masking is enabled by default. It scans every log message for Discord bot token patterns and replaces them with `[REDACTED]` before any transport receives the entry. Disable it explicitly if needed:

```typescript
Logger.configure({ maskTokens: false });
```

## TableBuilder

`TableBuilder` wraps `cli-table3` with the standard Spraxium border style for consistent terminal tables:

```typescript
import { TableBuilder, ANSI, nativeLog } from '@spraxium/logger';

const table = TableBuilder.create([ANSI.bold('Name'), ANSI.bold('Status')]);
table.push(['gateway', 'ready']);
table.push(['api', 'online']);
nativeLog(table.toString());
```

## ANSI Helpers

The `ANSI` object exposes color and style functions for terminal output. Use them when building table headers or custom log level colors:

```typescript
import { ANSI } from '@spraxium/logger';

ANSI.red('error message')
ANSI.green('success')
ANSI.cyan('info')
ANSI.bold('Header')
ANSI.gray('muted text')
ANSI.dim('dimmed')
```

## Debug Mode

Enable verbose debug output at runtime without changing configuration:

```typescript
Logger.setDebug(true);
```

## Managing Transports

Add or remove transports at runtime:

```typescript
import { Logger, ConsoleTransport } from '@spraxium/logger';

// Add a custom transport
Logger.addTransport(myTransport);

// Remove the built-in console transport
Logger.removeTransport('console');

// Inspect active transports
const transports = Logger.getTransports();
```

## Links

[npm](https://www.npmjs.com/package/@spraxium/logger) · [GitHub](https://github.com/spraxium/spraxium) · [Documentation](https://spraxium.com)

## License

Apache 2.0
