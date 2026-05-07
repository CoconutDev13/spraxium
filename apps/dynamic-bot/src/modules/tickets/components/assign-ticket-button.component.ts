import { DynamicButton } from '@spraxium/components';
import type { ButtonRenderConfig } from '@spraxium/components';
import type { Ticket } from '../tickets.data';

@DynamicButton({ baseId: 'assign-ticket', payloadTtl: 60 * 60 * 24 })
export class AssignTicketButton {
  static render(ticket: Ticket): ButtonRenderConfig {
    return {
      label: 'Assign to me',
      style: 'primary',
      emoji: '🙋',
    };
  }
}
