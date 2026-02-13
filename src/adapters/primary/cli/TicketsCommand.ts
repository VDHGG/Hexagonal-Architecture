import { Command } from 'commander';
import { CreateTicketUseCase } from '../../../application/use-cases/CreateTicketUseCase';
import { ListTicketsUseCase } from '../../../application/use-cases/ListTicketsUseCase';
import { ShowTicketUseCase } from '../../../application/use-cases/ShowTicketUseCase';
import { UpdateTicketUseCase } from '../../../application/use-cases/UpdateTicketUseCase';
import { FileTicketRepository } from '../../secondary/file/FileTicketRepository';

const repository = new FileTicketRepository();

const createUseCase = new CreateTicketUseCase(repository);
const listUseCase = new ListTicketsUseCase(repository);
const showUseCase = new ShowTicketUseCase(repository);
const updateUseCase = new UpdateTicketUseCase(repository);

// Khởi tạo CLI program
export const TicketsCommand = new Command()
  .name('tickets')
  .description('🎫 Ticket Manager CLI - Hexagonal Architecture')
  .version('1.0.0');

// ========== CREATE COMMAND ==========
TicketsCommand
  .command('create')
  .description('📝 Tạo ticket mới')
  .requiredOption('--title <title>', 'Tiêu đề ticket')
  .option('--description <desc>', 'Mô tả chi tiết')
  .requiredOption('--email <email>', 'Email người tạo')
  .requiredOption('--phone <phone>', 'Số điện thoại')
  .requiredOption('--priority <priority>', 'Ưu tiên (Standard, Priority, Expedite)')
  .option('--tags <tags...>', 'Các tags')
  .action(async (options) => {
    try {
      const result = await createUseCase.execute({
        title: options.title,
        description: options.description,
        userEmail: options.email,
        phone: options.phone,
        priority: options.priority,
        tags: options.tags || []
      });
      console.log('\n✅ Ticket được tạo thành công!');
      console.log('📦 Chi tiết ticket:');
      console.table({
        'ID': result.id,
        'Tiêu đề': result.title,
        'Email': result.userEmail,
        'Số điện thoại': result.phone,
        'Ưu tiên': result.priority,
        'Trạng thái': result.status,
        'Tạo lúc': new Date(result.createdAt).toLocaleString('vi-VN')
      });
    } catch (e: any) {
      console.error('\n❌ Lỗi:', e.message);
    }
  });

// ========== LIST COMMAND ==========
TicketsCommand
  .command('list')
  .description('📋 Xem danh sách tất cả ticket')
  .action(async () => {
    try {
      const tickets = await listUseCase.execute();
      if (tickets.length === 0) {
        console.log('\n📭 Không có ticket nào');
        return;
      }
      console.log(`\n📋 Tổng: ${tickets.length} ticket\n`);
      console.table(tickets.map(t => ({
        'ID': t.id.substring(0, 8) + '...',
        'Tiêu đề': t.title,
        'Email': t.userEmail,
        'Ưu tiên': t.priority,
        'Trạng thái': t.status,
        'Cập nhật': new Date(t.updatedAt).toLocaleString('vi-VN')
      })));
    } catch (e: any) {
      console.error('\n❌ Lỗi:', e.message);
    }
  });

// ========== SHOW COMMAND ==========
TicketsCommand
  .command('show <id>')
  .description('🔍 Xem chi tiết ticket')
  .action(async (id) => {
    try {
      const ticket = await showUseCase.execute(id);
      if (!ticket) {
        console.log('\n❌ Không tìm thấy ticket với ID:', id);
        return;
      }
      console.log('\n📄 Chi tiết ticket:\n');
      console.table({
        'ID': ticket.id,
        'Tiêu đề': ticket.title,
        'Mô tả': ticket.description || '(Không có)',
        'Email': ticket.userEmail,
        'Số điện thoại': ticket.phone,
        'Ưu tiên': ticket.priority,
        'Trạng thái': ticket.status,
        'Tags': ticket.tags.join(', ') || '(Không có)',
        'Tạo lúc': new Date(ticket.createdAt).toLocaleString('vi-VN'),
        'Cập nhật lúc': new Date(ticket.updatedAt).toLocaleString('vi-VN')
      });
    } catch (e: any) {
      console.error('\n❌ Lỗi:', e.message);
    }
  });

// ========== UPDATE COMMAND ==========
TicketsCommand
  .command('update <id>')
  .description('🔄 Cập nhật trạng thái ticket')
  .requiredOption('--status <status>', 'Trạng thái mới (tiếp nhận, đang xử lí, đã xử lí, cancel)')
  .action(async (id, options) => {
    try {
      await updateUseCase.execute({ id, status: options.status });
      console.log('\n✅ Cập nhật trạng thái thành công!');
      console.log('📌 Ticket ID:', id);
      console.log('🔄 Trạng thái mới:', options.status);
    } catch (e: any) {
      console.error('\n❌ Lỗi:', e.message);
    }
  });

// Help mặc định
TicketsCommand.configureHelp({
  helpWidth: 120
});

TicketsCommand.showHelpAfterError('(add --help for additional information)');