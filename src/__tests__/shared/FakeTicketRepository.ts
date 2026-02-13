// Mock repository để dùng trong tests
import { Ticket } from '../../domain/entities/Ticket';
import { TicketRepository } from '../../domain/ports/TicketRepository';

export class FakeTicketRepository implements TicketRepository {
  private tickets: Map<string, Ticket> = new Map();

  async save(ticket: Ticket): Promise<void> {
    this.tickets.set(ticket.id, ticket);
  }

  async findById(id: string): Promise<Ticket | null> {
    return this.tickets.get(id) || null;
  }

  async findAll(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }

  async findByStatus(status: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(
      t => t.status.toString() === status
    );
  }

  async findByPriority(priority: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(
      t => t.priority.toString() === priority
    );
  }

  async findByTags(tags: string[]): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(t =>
      tags.every(tag => t.tags.includes(tag))
    );
  }

  // Test helper: clear all tickets
  clear(): void {
    this.tickets.clear();
  }
}
