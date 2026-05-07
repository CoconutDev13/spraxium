export type TicketId = string;

export interface Ticket {
  id: TicketId;
  subject: string;
  openedBy: string;
  openedAt: number;
  assignedTo?: string;
  assignRefs: string[];
}

export interface TicketsFile {
  tickets: Ticket[];
}
