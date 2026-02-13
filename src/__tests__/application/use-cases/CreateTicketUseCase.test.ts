import { describe, it, expect, beforeEach } from '@jest/globals';
import { CreateTicketUseCase } from '../../../application/use-cases/CreateTicketUseCase';
import { FakeTicketRepository } from '../../shared/FakeTicketRepository';

describe('CreateTicketUseCase', () => {
  let useCase: CreateTicketUseCase;
  let repository: FakeTicketRepository;

  beforeEach(() => {
    repository = new FakeTicketRepository();
    useCase = new CreateTicketUseCase(repository);
  });

  describe('execute()', () => {
    it('should create ticket with valid input', async () => {
      const input = {
        title: 'Bug in login',
        description: 'Email validation failing',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Expedite',
        tags: ['bug', 'urgent']
      };

      const result = await useCase.execute(input);

      expect(result.id).toBeDefined();
      expect(result.title).toBe('Bug in login');
      expect(result.description).toBe('Email validation failing');
      expect(result.userEmail).toBe('user@gmail.com');
      expect(result.phone).toBe('0987654321');
      expect(result.priority).toBe('Expedite');
      expect(result.status).toBe('tiếp nhận');
      expect(result.tags).toEqual(['bug', 'urgent']);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should create ticket without optional description', async () => {
      const input = {
        title: 'Simple ticket',
        userEmail: 'admin@gmail.com',
        phone: '0912345678',
        priority: 'Standard'
      };

      const result = await useCase.execute(input);

      expect(result.description).toBeUndefined();
      expect(result.tags).toEqual([]);
    });

    it('should trim whitespace from title', async () => {
      const input = {
        title: '  Bug with spaces  ',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Priority'
      };

      const result = await useCase.execute(input);

      expect(result.title).toBe('Bug with spaces');
    });

    it('should throw error when title is empty', async () => {
      const input = {
        title: '   ',  // Only whitespace
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Standard'
      };

      await expect(useCase.execute(input)).rejects.toThrow('Title là bắt buộc');
    });

    it('should throw error when title is not provided', async () => {
      const input = {
        title: '',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Standard'
      };

      await expect(useCase.execute(input)).rejects.toThrow('Title là bắt buộc');
    });

    it('should validate email must end with @gmail.com', async () => {
      const input = {
        title: 'Test',
        userEmail: 'user@hotmail.com',
        phone: '0987654321',
        priority: 'Standard'
      };

      await expect(useCase.execute(input)).rejects.toThrow(
        'Email phải kết thúc bằng @gmail.com'
      );
    });

    it('should validate phone must be 10 digits', async () => {
      const input = {
        title: 'Test',
        userEmail: 'user@gmail.com',
        phone: '098765432',  // Only 9 digits
        priority: 'Standard'
      };

      await expect(useCase.execute(input)).rejects.toThrow(
        'Số điện thoại phải đúng 10 chữ số'
      );
    });

    it('should validate phone cannot be longer than 10 digits', async () => {
      const input = {
        title: 'Test',
        userEmail: 'user@gmail.com',
        phone: '09876543210',  // 11 digits
        priority: 'Standard'
      };

      await expect(useCase.execute(input)).rejects.toThrow(
        'Số điện thoại phải đúng 10 chữ số'
      );
    });

    it('should validate priority format', async () => {
      const input = {
        title: 'Test',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'InvalidPriority'
      };

      await expect(useCase.execute(input)).rejects.toThrow(
        'Priority không hợp lệ: InvalidPriority'
      );
    });

    it('should set initial status to TIẾP_NHẬN', async () => {
      const input = {
        title: 'New ticket',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Standard'
      };

      const result = await useCase.execute(input);

      expect(result.status).toBe('tiếp nhận');
    });

    it('should persist ticket to repository', async () => {
      const input = {
        title: 'Persistent ticket',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Standard'
      };

      const result = await useCase.execute(input);
      const savedTicket = await repository.findById(result.id);

      expect(savedTicket).toBeDefined();
      expect(savedTicket?.title).toBe('Persistent ticket');
    });

    it('should generate unique id for each ticket', async () => {
      const input = {
        title: 'Test ticket',
        userEmail: 'user@gmail.com',
        phone: '0987654321',
        priority: 'Standard'
      };

      const result1 = await useCase.execute(input);
      const result2 = await useCase.execute(input);

      expect(result1.id).not.toBe(result2.id);
    });

    it('should handle all priority levels', async () => {
      const priorities = ['Standard', 'Priority', 'Expedite'];

      for (const priority of priorities) {
        const input = {
          title: `Ticket with ${priority}`,
          userEmail: 'user@gmail.com',
          phone: '0987654321',
          priority
        };

        const result = await useCase.execute(input);
        expect(result.priority).toBe(priority);
      }
    });
  });
});
