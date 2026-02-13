import { TicketRepository } from "../../domain/ports/TicketRepository";
import { TicketOutput } from "../../dtos/TicketOutput";

export class ListTicketsUseCase {
  constructor(private readonly repository: TicketRepository) {}

  async execute(): Promise<TicketOutput[]> {
    const tickets = await this.repository.findAll();
    return tickets.map(ticket => this.toOutput(ticket));
  }

  private toOutput(ticket: any): TicketOutput {   // tạm any vì sau sẽ import Ticket
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      userEmail: ticket.userEmail,
      phone: ticket.phone,
      status: ticket.status.toString ? ticket.status.toString() : ticket.status,
      priority: ticket.priority.toString ? ticket.priority.toString() : ticket.priority,
      tags: ticket.tags,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }
}