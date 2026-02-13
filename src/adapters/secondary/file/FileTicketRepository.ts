import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { Ticket } from '../../../domain/entities/Ticket';
import { TicketRepository } from '../../../domain/ports/TicketRepository';
import { TicketStatus } from '../../../domain/value-objects/TicketStatus';
import { Priority } from '../../../domain/value-objects/Priority';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'tickets.json');

export class FileTicketRepository implements TicketRepository {
  private async ensureFileExists(): Promise<void> {
    await mkdir(DATA_DIR, { recursive: true });
    try {
      await readFile(FILE_PATH, 'utf8');
    } catch {
      await writeFile(FILE_PATH, '[]', 'utf8');
    }
  }

  private async readTickets(): Promise<Ticket[]> {
    await this.ensureFileExists();
    const data = await readFile(FILE_PATH, 'utf8');
    const raw = JSON.parse(data || '[]');

    return raw.map((item: any) => new Ticket(
      item.id,
      item.title,
      item.description,
      item.userEmail,
      item.phone,
      TicketStatus.fromString(item.status),
      Priority.fromString(item.priority),
      item.tags || [],
      new Date(item.createdAt),
      new Date(item.updatedAt)
    ));
  }

  private async writeTickets(tickets: Ticket[]): Promise<void> {
    const raw = tickets.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      userEmail: t.userEmail,
      phone: t.phone,
      status: t.status.toString(),
      priority: t.priority.toString(),
      tags: t.tags,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString()
    }));
    await writeFile(FILE_PATH, JSON.stringify(raw, null, 2), 'utf8');
  }

  async save(ticket: Ticket): Promise<void> {
    const tickets = await this.readTickets();
    const index = tickets.findIndex(t => t.id === ticket.id);
    if (index >= 0) tickets[index] = ticket;
    else tickets.push(ticket);
    await this.writeTickets(tickets);
  }

  async findById(id: string): Promise<Ticket | null> {
    const tickets = await this.readTickets();
    return tickets.find(t => t.id === id) || null;
  }

  async findAll(): Promise<Ticket[]> {
    return this.readTickets();
  }

  async findByStatus(status: string): Promise<Ticket[]> {
    const tickets = await this.readTickets();
    return tickets.filter(t => t.status.toString() === status);
  }

  async findByPriority(priority: string): Promise<Ticket[]> {
    const tickets = await this.readTickets();
    return tickets.filter(t => t.priority.toString() === priority);
  }

  async findByTags(tags: string[]): Promise<Ticket[]> {
    const tickets = await this.readTickets();
    return tickets.filter(t => tags.every(tag => t.tags.includes(tag)));
  }
}
