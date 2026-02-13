export interface CreateTicketInput {
  title: string;
  description?: string;
  userEmail: string;
  phone: string;
  priority: string;      
  tags?: string[];
}