import { DynamicButton } from '@spraxium/components';
import type { ButtonRenderConfig } from '@spraxium/components';
import type { Ticket } from '../tickets.data';

@DynamicButton({ baseId: 'close-ticket', encoding: 'inline' })
export class CloseTicketButton {
  static render(ticket: Ticket): ButtonRenderConfig {
    return {
      label: 'Close ticket',
      style: 'danger',
      emoji: '🔒',
      params: { id: ticket.id },
    };
  }
}
