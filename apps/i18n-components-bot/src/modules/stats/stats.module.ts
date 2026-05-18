import { Module } from '@spraxium/common';
import { StatsCommand } from './commands/stats.command';
import { StatsCommandHandler } from './handlers/stats-command.handler';

@Module({
  commands: [StatsCommand],
  handlers: [StatsCommandHandler],
})
export class StatsModule {}
