import { TicketRepository } from "../../domain/ports/TicketRepository";
import { TicketStatus } from "../../domain/value-objects/TicketStatus";
import { UpdateTicketInput } from "../../dtos/UpdateTicketInput";
import { Ticket } from "../../domain/entities/Ticket";

export class UpdateTicketUseCase {
  constructor(private readonly repository: TicketRepository) {}

  async execute(input: UpdateTicketInput): Promise<void> {
    const ticket = await this.repository.findById(input.id);
    if (!ticket) throw new Error("Ticket không tồn tại");

    const newStatus = TicketStatus.fromString(input.status);
    
    // Validate the status transition (apply business rule)
    if (!ticket.status.canTransitionTo(newStatus)) {
      throw new Error("Không thể chuyển từ trạng thái 'cancel' sang trạng thái khác");
    }
    
    // Since Ticket is immutable, create a new one with updated status and timestamp
    const updatedTicket = new Ticket(
      ticket.id,
      ticket.title,
      ticket.description,
      ticket.userEmail,
      ticket.phone,
      newStatus,
      ticket.priority,
      ticket.tags,
      ticket.createdAt,
      new Date()  // Update the timestamp
    );

    await this.repository.save(updatedTicket);
  }
}
