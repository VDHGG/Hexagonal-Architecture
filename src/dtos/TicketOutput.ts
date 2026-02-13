import { TicketStatus } from "../domain/value-objects/TicketStatus";
import { Priority } from "../domain/value-objects/Priority";

export interface TicketOutput {
  id: string;
  title: string;
  description?: string;
  userEmail: string;
  phone: string;
  status: string;
  priority: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}