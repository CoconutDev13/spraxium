import { Module } from '@spraxium/common';
import { ListTicketsCommand } from './commands/list-tickets.command';
import { OpenTicketCommand } from './commands/open-ticket.command';
import { AssignTicketButtonHandler } from './handlers/assign-ticket-button.handler';
import { CloseTicketButtonHandler } from './handlers/close-ticket-button.handler';
import { ListTicketsHandler } from './handlers/list-tickets.handler';
import { OpenTicketHandler } from './handlers/open-ticket.handler';
import { TicketsRepository } from './tickets.repository';

@Module({
  providers: [TicketsRepository],
  commands: [OpenTicketCommand, ListTicketsCommand],
  handlers: [OpenTicketHandler, ListTicketsHandler, AssignTicketButtonHandler, CloseTicketButtonHandler],
})
export class TicketsModule {}
