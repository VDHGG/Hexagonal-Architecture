export class TicketStatus {
  private constructor(private readonly value: string) {}

  static readonly TIẾP_NHẬN = new TicketStatus("tiếp nhận");
  static readonly ĐANG_XỬ_LÝ = new TicketStatus("đang xử lí");
  static readonly ĐÃ_XỬ_LÝ = new TicketStatus("đã xử lí");
  static readonly CANCEL = new TicketStatus("cancel");

  static fromString(status: string): TicketStatus {
    const normalized = status.toLowerCase().trim();
    switch (normalized) {
      case "tiếp nhận": return this.TIẾP_NHẬN;
      case "đang xử lí": return this.ĐANG_XỬ_LÝ;
      case "đã xử lí": return this.ĐÃ_XỬ_LÝ;
      case "cancel": return this.CANCEL;
      default:
        throw new Error(`Trạng thái không hợp lệ: ${status}`);
    }
  }

  canTransitionTo(newStatus: TicketStatus): boolean {
    if (this.value === "cancel") return false; // Business rule
    return true;
  }

  equals(other: TicketStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}