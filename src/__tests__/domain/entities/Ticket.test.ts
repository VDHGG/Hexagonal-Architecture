import { describe, it, expect } from '@jest/globals';
import { Ticket } from '../../../domain/entities/Ticket';
import { TicketStatus } from '../../../domain/value-objects/TicketStatus';
import { Priority } from '../../../domain/value-objects/Priority';

describe('Ticket - Entity', () => {
  const createValidTicket = () => {
    return new Ticket(
      'ticket-1',
      'Bug in login',
      'Email validation not working',
      'user@gmail.com',
      '0987654321',
      TicketStatus.TIẾP_NHẬN,
      Priority.EXPEDITE,
      ['bug', 'urgent'],
      new Date('2026-02-11'),
      new Date('2026-02-11')
    );
  };

  describe('Constructor', () => {
    it('should create ticket with valid data', () => {
      const ticket = createValidTicket();
      expect(ticket.id).toBe('ticket-1');
      expect(ticket.title).toBe('Bug in login');
      expect(ticket.description).toBe('Email validation not working');
      expect(ticket.userEmail).toBe('user@gmail.com');
      expect(ticket.phone).toBe('0987654321');
      expect(ticket.status.toString()).toBe('tiếp nhận');
      expect(ticket.priority.toString()).toBe('Expedite');
      expect(ticket.tags).toEqual(['bug', 'urgent']);
    });

    it('should allow optional description', () => {
      const ticket = new Ticket(
        'ticket-2',
        'Test ticket',
        undefined,
        'test@gmail.com',
        '0987654321',
        TicketStatus.TIẾP_NHẬN,
        Priority.STANDARD,
        [],
        new Date(),
        new Date()
      );
      expect(ticket.description).toBeUndefined();
    });
  });

  describe('validateEmail()', () => {
    it('should validate gmail addresses', () => {
      expect(Ticket.validateEmail('user@gmail.com')).toBe(true);
      expect(Ticket.validateEmail('admin@gmail.com')).toBe(true);
    });

    it('should reject non-gmail addresses', () => {
      expect(Ticket.validateEmail('user@hotmail.com')).toBe(false);
      expect(Ticket.validateEmail('user@yahoo.com')).toBe(false);
      expect(Ticket.validateEmail('user@example.com')).toBe(false);
    });

    it('should reject invalid email format', () => {
      expect(Ticket.validateEmail('notanemail')).toBe(false);
      expect(Ticket.validateEmail('user@')).toBe(false);
    });

    it('should be case insensitive for domain', () => {
      expect(Ticket.validateEmail('user@GMAIL.COM')).toBe(true);
      expect(Ticket.validateEmail('user@Gmail.Com')).toBe(true);
    });
  });

  describe('validatePhone()', () => {
    it('should validate 10-digit phone numbers', () => {
      expect(Ticket.validatePhone('0987654321')).toBe(true);
      expect(Ticket.validatePhone('0123456789')).toBe(true);
      expect(Ticket.validatePhone('9876543210')).toBe(true);
    });

    it('should reject phone numbers with less than 10 digits', () => {
      expect(Ticket.validatePhone('098765432')).toBe(false);
      expect(Ticket.validatePhone('01234567')).toBe(false);
    });

    it('should reject phone numbers with more than 10 digits', () => {
      expect(Ticket.validatePhone('09876543210')).toBe(false);
      expect(Ticket.validatePhone('012345678901')).toBe(false);
    });

    it('should reject phone numbers with non-digit characters', () => {
      expect(Ticket.validatePhone('098765432a')).toBe(false);
      expect(Ticket.validatePhone('0987-654-321')).toBe(false);
      expect(Ticket.validatePhone('0987 654 321')).toBe(false);
    });

    it('should reject empty or invalid input', () => {
      expect(Ticket.validatePhone('')).toBe(false);
      expect(Ticket.validatePhone('abc')).toBe(false);
    });
  });

  describe('updateStatus()', () => {
    it('should update status when transition is valid', () => {
      const ticket = createValidTicket();
      const newStatus = TicketStatus.ĐANG_XỬ_LÝ;
      
      ticket.updateStatus(newStatus);
      
      expect(ticket.status.toString()).toBe('đang xử lí');
    });

    it('should throw error when transition from CANCEL - BUSINESS RULE', () => {
      const ticket = new Ticket(
        'ticket-cancel',
        'Cancelled ticket',
        undefined,
        'user@gmail.com',
        '0987654321',
        TicketStatus.CANCEL,  // Start with CANCEL
        Priority.STANDARD,
        [],
        new Date(),
        new Date()
      );

      const newStatus = TicketStatus.TIẾP_NHẬN;
      
      expect(() => ticket.updateStatus(newStatus)).toThrow(
        "Không thể chuyển từ trạng thái 'cancel' sang trạng thái khác"
      );
    });

    it('should allow transition to CANCEL from other status', () => {
      const ticket = createValidTicket();
      const cancelStatus = TicketStatus.CANCEL;
      
      ticket.updateStatus(cancelStatus);
      
      expect(ticket.status.toString()).toBe('cancel');
    });

    it('should allow multiple valid transitions in sequence', () => {
      const ticket = createValidTicket();
      
      ticket.updateStatus(TicketStatus.ĐANG_XỬ_LÝ);
      expect(ticket.status.toString()).toBe('đang xử lí');
      
      ticket.updateStatus(TicketStatus.ĐÃ_XỬ_LÝ);
      expect(ticket.status.toString()).toBe('đã xử lí');
    });
  });

  describe('status getter', () => {
    it('should return current status', () => {
      const ticket = createValidTicket();
      expect(ticket.status).toBe(TicketStatus.TIẾP_NHẬN);
    });
  });

  describe('Entity identity', () => {
    it('should have unique id for each ticket', () => {
      const ticket1 = new Ticket(
        'ticket-1',
        'Title 1',
        undefined,
        'user@gmail.com',
        '0987654321',
        TicketStatus.TIẾP_NHẬN,
        Priority.STANDARD,
        [],
        new Date(),
        new Date()
      );

      const ticket2 = new Ticket(
        'ticket-2',
        'Title 1',  // Same title
        undefined,
        'user@gmail.com',
        '0987654321',
        TicketStatus.TIẾP_NHẬN,
        Priority.STANDARD,
        [],
        new Date(),
        new Date()
      );

      expect(ticket1.id).not.toBe(ticket2.id);
    });
  });

});

