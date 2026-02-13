import { TicketStatus } from "../value-objects/TicketStatus";
import { Priority } from "../value-objects/Priority";

export class Ticket {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | undefined,
    public readonly userEmail: string,
    public readonly phone: string,
    private _status: TicketStatus,
    public readonly priority: Priority,
    public readonly tags: string[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  get status(): TicketStatus {
    return this._status;
  }

  updateStatus(newStatus: TicketStatus): void {
    if (!this._status.canTransitionTo(newStatus)) {
      throw new Error("Không thể chuyển từ trạng thái 'cancel' sang trạng thái khác");
    }
    this._status = newStatus;
  }

  // Validation helper
  static validateEmail(email: string): boolean {
    return email.toLowerCase().endsWith("@gmail.com");
  }

  static validatePhone(phone: string): boolean {
    return /^\d{10}$/.test(phone);
  }
}