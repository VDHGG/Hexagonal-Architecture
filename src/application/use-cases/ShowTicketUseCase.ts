import { TicketRepository } from "../../domain/ports/TicketRepository";
import { TicketOutput } from "../../dtos/TicketOutput";

export class ShowTicketUseCase {
  constructor(private readonly repository: TicketRepository) {}

  async execute(id: string): Promise<TicketOutput | null> {
    const ticket = await this.repository.findById(id);
    if (!ticket) return null;
    return this.toOutput(ticket);
  }

  private toOutput(ticket: any): TicketOutput {
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