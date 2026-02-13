import { Ticket } from "../entities/Ticket";

export interface TicketRepository {
  save(ticket: Ticket): Promise<void>;
  findById(id: string): Promise<Ticket | null>;
  findAll(): Promise<Ticket[]>;
  
  // Chuẩn bị cho filter sau này (dù hiện tại list all)
  findByStatus(status: string): Promise<Ticket[]>;
  findByPriority(priority: string): Promise<Ticket[]>;
  findByTags(tags: string[]): Promise<Ticket[]>;
}