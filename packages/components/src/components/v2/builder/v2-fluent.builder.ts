import {
  type ActionRowBuilder,
  ButtonBuilder,
  type ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  SectionBuilder,
  SeparatorBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
} from 'discord.js';
import type { SpraxiumContext } from '../../../runtime/context';
import type { ButtonService } from '../../button';
import type { DescriptionBuilder } from '../../embed';
import type {
  V2ContainerMeta,
  V2InnerBuilder,
  V2MediaGalleryItem,
  V2SectionFluentConfig,
  V2SeparatorConfig,
} from '../interfaces';
import { buildContainer } from './build-container.util';

export class V2ContainerFluentBuilder {
  private readonly components: Array<V2InnerBuilder | Promise<V2InnerBuilder>> = [];

  constructor(
    private readonly meta: V2ContainerMeta,
    private readonly _context?: SpraxiumContext<unknown>,
    private readonly _buttons?: ButtonService,
  ) {}

  add(component: V2InnerBuilder | Promise<V2InnerBuilder>): this {
    this.components.push(component);
    return this;
  }

  text(content: string | DescriptionBuilder): this {
    const str = typeof content === 'string' ? content : content.toString();
    return this.add(new TextDisplayBuilder().setContent(str));
  }

  sep(config?: V2SeparatorConfig): this {
    const sep = new SeparatorBuilder().setDivider(config?.divider ?? true);
    if (config?.spacing !== undefined) sep.setSpacing(config.spacing);
    return this.add(sep);
  }

  section(text: string, accessory?: ThumbnailBuilder | ButtonBuilder): this;
  section(config: V2SectionFluentConfig): this;
  section(textOrConfig: string | V2SectionFluentConfig, accessory?: ThumbnailBuilder | ButtonBuilder): this {
    if (typeof textOrConfig === 'string') {
      const text = textOrConfig;
      if (!accessory) {
        return this.add(new TextDisplayBuilder().setContent(text));
      }
      const sec = new SectionBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(text));
      if (accessory instanceof ButtonBuilder) {
        sec.setButtonAccessory(accessory);
      } else if (accessory instanceof ThumbnailBuilder) {
        sec.setThumbnailAccessory(accessory);
      }
      return this.add(sec);
    }

    const cfg = textOrConfig;

    if (cfg.dynamic) {
      if (!this._buttons) {
        throw new Error(
          '[V2] Dynamic sections require V2ContainerFluentBuilder to be created via V2Service.container().',
        );
      }
      const pending = this._buttons
        .buildDynamicButtons(cfg.dynamic.button, [cfg.dynamic.item], this._context)
        .then((buttons) => {
          if (buttons.length === 0) {
            throw new Error('[V2] Dynamic section button produced no button.');
          }
          const sec = new SectionBuilder().addTextDisplayComponents(
            new TextDisplayBuilder().setContent(cfg.text),
          );
          sec.setButtonAccessory(buttons[0]);
          return sec as V2InnerBuilder;
        });
      return this.add(pending);
    }

    const sec = new SectionBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(cfg.text));
    return this.add(sec);
  }

  gallery(items: Array<V2MediaGalleryItem>): this {
    const gallery = new MediaGalleryBuilder();
    for (const item of items) {
      const mediaItem = new MediaGalleryItemBuilder().setURL(item.url);
      if (item.description) mediaItem.setDescription(item.description);
      if (item.spoiler) mediaItem.setSpoiler(item.spoiler);
      gallery.addItems(mediaItem);
    }
    return this.add(gallery);
  }

  // biome-ignore lint/suspicious/noExplicitAny: generic callable type required
  row(actionRow: ActionRowBuilder<any>): this {
    return this.add(actionRow);
  }

  render(): ContainerBuilder {
    if (this.components.some((c) => c instanceof Promise)) {
      throw new Error('[V2] Container has pending dynamic sections. Use renderAsync() instead of render().');
    }
    return buildContainer(this.meta, this.components as Array<V2InnerBuilder>);
  }

  async renderAsync(): Promise<ContainerBuilder> {
    const resolved = await Promise.all(this.components);
    return buildContainer(this.meta, resolved);
  }

  toReply(): { components: Array<ContainerBuilder>; flags: MessageFlags.IsComponentsV2 } {
    return {
      components: [this.render()],
      flags: MessageFlags.IsComponentsV2,
    };
  }

  async toReplyAsync(): Promise<{ components: Array<ContainerBuilder>; flags: MessageFlags.IsComponentsV2 }> {
    return {
      components: [await this.renderAsync()],
      flags: MessageFlags.IsComponentsV2,
    };
  }
}
