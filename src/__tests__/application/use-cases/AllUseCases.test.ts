import { describe, it, expect, beforeEach } from '@jest/globals';
import { ListTicketsUseCase } from '../../../application/use-cases/ListTicketsUseCase';
import { ShowTicketUseCase } from '../../../application/use-cases/ShowTicketUseCase';
import { UpdateTicketUseCase } from '../../../application/use-cases/UpdateTicketUseCase';
import { CreateTicketUseCase } from '../../../application/use-cases/CreateTicketUseCase';
import { FakeTicketRepository } from '../../shared/FakeTicketRepository';

describe('ListTicketsUseCase', () => {
  let useCase: ListTicketsUseCase;
  let repository: FakeTicketRepository;
  let createUseCase: CreateTicketUseCase;

  beforeEach(() => {
    repository = new FakeTicketRepository();
    useCase = new ListTicketsUseCase(repository);
    createUseCase = new CreateTicketUseCase(repository);
  });

  describe('execute()', () => {
    it('should return empty array when no tickets exist', async () => {
      const result = await useCase.execute();
      expect(result).toEqual([]);
    });

    it('should return all tickets', async () => {
      await createUseCase.execute({
        title: 'Ticket 1',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Standard'
      });

      await createUseCase.execute({
        title: 'Ticket 2',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Priority'
      });

      const result = await useCase.execute();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Ticket 1');
      expect(result[1].title).toBe('Ticket 2');
    });

    it('should preserve ticket data in output', async () => {
      const input = {
        title: 'Test ticket',
        description: 'A test description',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Expedite',
        tags: ['test', 'bug']
      };

      await createUseCase.execute(input);
      const result = await useCase.execute();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test ticket');
      expect(result[0].description).toBe('A test description');
      expect(result[0].userEmail).toBe('user@gmail.com');
      expect(result[0].priority).toBe('Expedite');
      expect(result[0].tags).toEqual(['test', 'bug']);
    });
  });
});

describe('ShowTicketUseCase', () => {
  let useCase: ShowTicketUseCase;
  let repository: FakeTicketRepository;
  let createUseCase: CreateTicketUseCase;

  beforeEach(() => {
    repository = new FakeTicketRepository();
    useCase = new ShowTicketUseCase(repository);
    createUseCase = new CreateTicketUseCase(repository);
  });

  describe('execute()', () => {
    it('should return null when ticket does not exist', async () => {
      const result = await useCase.execute('non-existent-id');
      expect(result).toBeNull();
    });

    it('should return ticket when it exists', async () => {
      const createResult = await createUseCase.execute({
        title: 'Find me',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Standard'
      });

      const result = await useCase.execute(createResult.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(createResult.id);
      expect(result?.title).toBe('Find me');
    });

    it('should preserve all ticket details', async () => {
      const input = {
        title: 'Detailed ticket',
        description: 'Full description here',
        userEmail: 'admin@gmail.com',
        phone: '0912345678',
        priority: 'Priority',
        tags: ['critical']
      };

      const createResult = await createUseCase.execute(input);
      const result = await useCase.execute(createResult.id);

      expect(result?.title).toBe('Detailed ticket');
      expect(result?.description).toBe('Full description here');
      expect(result?.userEmail).toBe('admin@gmail.com');
      expect(result?.phone).toBe('0912345678');
      expect(result?.priority).toBe('Priority');
      expect(result?.status).toBe('tiếp nhận');
      expect(result?.tags).toEqual(['critical']);
    });
  });
});

describe('UpdateTicketUseCase', () => {
  let useCase: UpdateTicketUseCase;
  let repository: FakeTicketRepository;
  let createUseCase: CreateTicketUseCase;

  beforeEach(() => {
    repository = new FakeTicketRepository();
    useCase = new UpdateTicketUseCase(repository);
    createUseCase = new CreateTicketUseCase(repository);
  });

  describe('execute()', () => {
    it('should throw error when ticket does not exist', async () => {
      await expect(
        useCase.execute({
          id: 'non-existent-id',
          status: 'đang xử lí'
        })
      ).rejects.toThrow('Ticket không tồn tại');
    });

    it('should update ticket status when valid', async () => {
      const createResult = await createUseCase.execute({
        title: 'Update me',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Standard'
      });

      await useCase.execute({
        id: createResult.id,
        status: 'đang xử lí'
      });

      const updated = await repository.findById(createResult.id);
      expect(updated?.status.toString()).toBe('đang xử lí');
    });

    it('should validate status transition from CANCEL - BUSINESS RULE', async () => {
      // Create a ticket
      const createResult = await createUseCase.execute({
        title: 'Cancel test',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Standard'
      });

      // First, cancel it
      await useCase.execute({
        id: createResult.id,
        status: 'cancel'
      });

      // Then try to transition from cancel to another status
      await expect(
        useCase.execute({
          id: createResult.id,
          status: 'đang xử lí'
        })
      ).rejects.toThrow(
        "Không thể chuyển từ trạng thái 'cancel' sang trạng thái khác"
      );
    });

    it('should allow multiple valid transitions', async () => {
      const createResult = await createUseCase.execute({
        title: 'Multi-transition',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Standard'
      });

      // tiếp nhận → đang xử lí
      await useCase.execute({
        id: createResult.id,
        status: 'đang xử lí'
      });

      let ticket = await repository.findById(createResult.id);
      expect(ticket?.status.toString()).toBe('đang xử lí');

      // đang xử lí → đã xử lí
      await useCase.execute({
        id: createResult.id,
        status: 'đã xử lí'
      });

      ticket = await repository.findById(createResult.id);
      expect(ticket?.status.toString()).toBe('đã xử lí');
    });

    it('should accept all valid status values', async () => {
      const createResult = await createUseCase.execute({
        title: 'Status test',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Standard'
      });

      const validStatuses = ['tiếp nhận', 'đang xử lí', 'đã xử lí', 'cancel'];

      for (const status of validStatuses) {
        await useCase.execute({
          id: createResult.id,
          status
        });

        const updated = await repository.findById(createResult.id);
        expect(updated?.status.toString()).toBe(status);

        // If it's not cancel, we can continue testing next status
        if (status === 'cancel') break;
      }
    });

    it('should reject invalid status', async () => {
      const createResult = await createUseCase.execute({
        title: 'Invalid status test',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Standard'
      });

      await expect(
        useCase.execute({
          id: createResult.id,
          status: 'invalid-status'
        })
      ).rejects.toThrow('Trạng thái không hợp lệ: invalid-status');
    });

    it('should update the updatedAt timestamp', async () => {
      const createResult = await createUseCase.execute({
        title: 'Timestamp test',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Standard'
      });

      const createdTicket = await repository.findById(createResult.id);
      const originalUpdatedAt = createdTicket?.updatedAt;

      // Wait a bit to ensure timestamp changes
      await new Promise(resolve => setTimeout(resolve, 10));

      await useCase.execute({
        id: createResult.id,
        status: 'đang xử lí'
      });

      const updatedTicket = await repository.findById(createResult.id);
      expect(updatedTicket?.updatedAt).not.toBe(originalUpdatedAt);
    });
  });
});
