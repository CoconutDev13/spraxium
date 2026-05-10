# @spraxium/env

`@spraxium/env` provides typed, decorator-based environment variable validation for Spraxium bots. You define a configuration class, annotate each property with `@Env`, and pass it to `EnvModule.forRoot` at the application root. If any required variable is missing or fails type coercion, the process prints a formatted error table and exits before the bot connects to Discord, preventing the hard-to-debug runtime failures that come from missing configuration.

The package supports string, number, boolean, and enum coercions out of the box, optional fields with default values, and secret masking so that sensitive values are never printed in full to the console or logs. The validated configuration class is registered as an injectable provider, so any service in the application can declare it as a constructor dependency and receive the fully typed, pre-validated config object.

## Installation

```bash
npm install @spraxium/env
```

## Usage

```typescript
import { Env, EnvSchema, IsBoolean, IsPort, SpraxiumBaseEnv } from '@spraxium/env';

@EnvSchema()
export class AppConfig extends SpraxiumBaseEnv {
  @Env('PORT')
  @IsPort()
  port!: number;

  @Env('COMMAND_PREFIX', { default: '!', secret: false })
  prefix!: string;

  @Env('DEBUG', { default: false, secret: false })
  @IsBoolean()
  debug!: boolean;
}
```

```typescript
import { IntentPreset, SpraxiumFactory } from '@spraxium/core';
import { EnvValidator } from '@spraxium/env';
import { AppConfig } from './app.config';
import { AppModule } from './app.module';

async function main(): Promise<void> {
  const config = EnvValidator.validate(AppConfig);

  const app = await SpraxiumFactory.create({ token: config.token });
  app.useModule(AppModule);
  app.provide(AppConfig, config);
  app.intents(IntentPreset.Standard);

  await app.listen();
}

main();
```

## Links

[npm](https://www.npmjs.com/package/@spraxium/env) · [GitHub](https://github.com/spraxium/spraxium) · [Documentation](https://spraxium.com)

## License

Apache 2.0
