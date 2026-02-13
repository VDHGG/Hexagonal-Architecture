export class Priority {
  private constructor(private readonly value: string) {}

  static readonly STANDARD = new Priority("Standard");
  static readonly PRIORITY = new Priority("Priority");
  static readonly EXPEDITE = new Priority("Expedite");

  static fromString(priority: string): Priority {
    const normalized = priority.trim();
    switch (normalized) {
      case "Standard": return this.STANDARD;
      case "Priority": return this.PRIORITY;
      case "Expedite": return this.EXPEDITE;
      default:
        throw new Error(`Priority không hợp lệ: ${priority}`);
    }
  }

  toString(): string {
    return this.value;
  }
}