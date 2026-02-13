import { Ticket } from "../../domain/entities/Ticket";
import { TicketStatus } from "../../domain/value-objects/TicketStatus";
import { Priority } from "../../domain/value-objects/Priority";
import { TicketRepository } from "../../domain/ports/TicketRepository";
import { CreateTicketInput } from "../../dtos/CreateTicketInput";
import { TicketOutput } from "../../dtos/TicketOutput";

export class CreateTicketUseCase {
  constructor(private readonly repository: TicketRepository) {}

  async execute(input: CreateTicketInput): Promise<TicketOutput> {
    // Validate
    if (!input.title?.trim()) throw new Error("Title là bắt buộc");
    if (!Ticket.validateEmail(input.userEmail)) throw new Error("Email phải kết thúc bằng @gmail.com");
    if (!Ticket.validatePhone(input.phone)) throw new Error("Số điện thoại phải đúng 10 chữ số");

    const ticket = new Ticket(
      crypto.randomUUID(),
      input.title.trim(),
      input.description?.trim(),
      input.userEmail.trim(),
      input.phone.trim(),
      TicketStatus.TIẾP_NHẬN,
      Priority.fromString(input.priority),
      input.tags || [],
      new Date(),
      new Date()
    );

    await this.repository.save(ticket);

    return this.toOutput(ticket);
  }

  private toOutput(ticket: Ticket): TicketOutput {
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      userEmail: ticket.userEmail,
      phone: ticket.phone,
      status: ticket.status.toString(),
      priority: ticket.priority.toString(),
      tags: ticket.tags,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }
}