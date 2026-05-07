import { Ctx, SlashCommandHandler } from '@spraxium/common';
import { SelectService } from '@spraxium/components';
import { type ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { FilterCommand } from '../commands/filter.command';
import { FilterSelect } from '../components/filter-select.component';
import { TOPICS } from '../topics.data';

@SlashCommandHandler(FilterCommand)
export class FilterCommandHandler {
  constructor(private readonly selects: SelectService) {}

  async handle(@Ctx() interaction: ChatInputCommandInteraction): Promise<void> {
    const row = await this.selects.build(FilterSelect, {
      topics: TOPICS,
      audience: 'pro',
    });

    await interaction.reply({
      content: '## 🔍 Filter topics (inline-encoded)',
      components: [row],
      flags: MessageFlags.Ephemeral,
    });
  }
}
