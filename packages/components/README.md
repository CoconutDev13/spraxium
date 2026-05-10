# @spraxium/components

`@spraxium/components` provides a decorator-based system for building and handling Discord UI components in a Spraxium application. It covers buttons, select menus (string, user, role, channel, and mentionable), text inputs, modals, embeds, and the newer Discord V2 container layouts. Component handlers are defined with class and method decorators and automatically registered by the `ComponentsModule`, which listens to the relevant Discord events and routes each incoming interaction to the correct handler based on its custom ID.

The routing layer integrates cleanly with the Spraxium guard and dependency injection systems, so every component handler can declare guards for access control and inject any registered service. The `defineComponents` configuration function allows global defaults such as custom ID prefixes and error handlers to be set once for the entire module rather than repeated per handler.

## Installation

```bash
npm install @spraxium/components
```

## Usage

```typescript
// Component class: defines the custom ID, label, and style only.
import { Button } from '@spraxium/components';

@Button({ customId: 'confirm-action', label: 'Confirm', style: 'success' })
export class ConfirmButton {}
```

```typescript
// Handler class: separated from the component, contains the execution logic.
import { Injectable } from '@spraxium/common';
import { ButtonHandler, FlowContext } from '@spraxium/components';
import type { SpraxiumContext } from '@spraxium/components';
import type { ButtonInteraction } from 'discord.js';
import { Ctx } from '@spraxium/common';
import { ConfirmButton } from './confirm-button.component';

@Injectable()
@ButtonHandler(ConfirmButton)
export class ConfirmButtonHandler {
  async handle(
    @FlowContext() ctx: SpraxiumContext<{ action: string }>,
    @Ctx() interaction: ButtonInteraction,
  ): Promise<void> {
    await interaction.reply({ content: `Action confirmed: ${ctx.data.action}`, ephemeral: true });
  }
}
```

```typescript
import { Module } from '@spraxium/common';
import { ComponentsModule } from '@spraxium/components';
import { ConfirmButtonHandler } from './confirm-button.handler';

@Module({
  imports: [ComponentsModule],
  providers: [ConfirmButtonHandler],
})
export class ActionsModule {}
```

## Links

[npm](https://www.npmjs.com/package/@spraxium/components) · [GitHub](https://github.com/spraxium/spraxium) · [Discord Components](https://discord.com/developers/docs/components/overview) · [Documentation](https://spraxium.com)

## License

Apache 2.0
