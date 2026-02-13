import { describe, it, expect } from '@jest/globals';
import { TicketStatus } from '../../../domain/value-objects/TicketStatus';

describe('TicketStatus - Value Object', () => {
  describe('fromString()', () => {
    it('should create TicketStatus with valid status "tiếp nhận"', () => {
      const status = TicketStatus.fromString('tiếp nhận');
      expect(status.toString()).toBe('tiếp nhận');
    });

    it('should create TicketStatus with valid status "đang xử lí"', () => {
      const status = TicketStatus.fromString('đang xử lí');
      expect(status.toString()).toBe('đang xử lí');
    });

    it('should create TicketStatus with valid status "đã xử lí"', () => {
      const status = TicketStatus.fromString('đã xử lí');
      expect(status.toString()).toBe('đã xử lí');
    });

    it('should create TicketStatus with valid status "cancel"', () => {
      const status = TicketStatus.fromString('cancel');
      expect(status.toString()).toBe('cancel');
    });

    it('should throw error with invalid status', () => {
      expect(() => TicketStatus.fromString('invalid')).toThrow(
        'Trạng thái không hợp lệ: invalid'
      );
    });

    it('should handle case-insensitive input', () => {
      const status1 = TicketStatus.fromString('TIẾP NHẬN');
      const status2 = TicketStatus.fromString('Tiếp Nhận');
      expect(status1.toString()).toBe('tiếp nhận');
      expect(status2.toString()).toBe('tiếp nhận');
    });

    it('should handle leading/trailing spaces', () => {
      const status = TicketStatus.fromString('  tiếp nhận  ');
      expect(status.toString()).toBe('tiếp nhận');
    });
  });

  describe('canTransitionTo()', () => {
    it('should allow transition from TIẾP_NHẬN to ĐANG_XỬ_LÝ', () => {
      const from = TicketStatus.TIẾP_NHẬN;
      const to = TicketStatus.ĐANG_XỬ_LÝ;
      expect(from.canTransitionTo(to)).toBe(true);
    });

    it('should allow transition from ĐANG_XỬ_LÝ to ĐÃ_XỬ_LÝ', () => {
      const from = TicketStatus.ĐANG_XỬ_LÝ;
      const to = TicketStatus.ĐÃ_XỬ_LÝ;
      expect(from.canTransitionTo(to)).toBe(true);
    });

    it('should allow transition to CANCEL from any status except CANCEL', () => {
      const from = TicketStatus.TIẾP_NHẬN;
      const to = TicketStatus.CANCEL;
      expect(from.canTransitionTo(to)).toBe(true);
    });

    it('should NOT allow transition from CANCEL to other status - BUSINESS RULE', () => {
      const from = TicketStatus.CANCEL;
      const to = TicketStatus.TIẾP_NHẬN;
      expect(from.canTransitionTo(to)).toBe(false);
    });

    it('should NOT allow transition from CANCEL to ĐÃ_XỬ_LÝ - BUSINESS RULE', () => {
      const from = TicketStatus.CANCEL;
      const to = TicketStatus.ĐÃ_XỬ_LÝ;
      expect(from.canTransitionTo(to)).toBe(false);
    });

    it('should NOT allow transition from CANCEL to itself', () => {
      const from = TicketStatus.CANCEL;
      const to = TicketStatus.CANCEL;
      expect(from.canTransitionTo(to)).toBe(false);
    });
  });

  describe('equals()', () => {
    it('should return true for same status values', () => {
      const status1 = TicketStatus.fromString('tiếp nhận');
      const status2 = TicketStatus.fromString('tiếp nhận');
      expect(status1.equals(status2)).toBe(true);
    });

    it('should return false for different status values', () => {
      const status1 = TicketStatus.fromString('tiếp nhận');
      const status2 = TicketStatus.fromString('đang xử lí');
      expect(status1.equals(status2)).toBe(false);
    });

    it('should compare static constants correctly', () => {
      expect(TicketStatus.TIẾP_NHẬN.equals(TicketStatus.TIẾP_NHẬN)).toBe(true);
      expect(TicketStatus.TIẾP_NHẬN.equals(TicketStatus.ĐANG_XỬ_LÝ)).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return status value as string', () => {
      expect(TicketStatus.TIẾP_NHẬN.toString()).toBe('tiếp nhận');
      expect(TicketStatus.ĐANG_XỬ_LÝ.toString()).toBe('đang xử lí');
      expect(TicketStatus.ĐÃ_XỬ_LÝ.toString()).toBe('đã xử lí');
      expect(TicketStatus.CANCEL.toString()).toBe('cancel');
    });
  });
});
