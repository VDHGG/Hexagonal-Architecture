# 🎫 Ticket Manager CLI

Hexagonal Architecture CLI app for ticket management.

## Setup

```bash
npm install
```

## Commands

### Create Ticket

```bash
npx tsx src/main.ts create --title "Bug login" --email "user@gmail.com" --phone "0987654321" --priority "Priority"
```

### List All

```bash
npx tsx src/main.ts list
```

### Show Ticket

```bash
npx tsx src/main.ts show <ticket-id>
```

### Update Status

```bash
npx tsx src/main.ts update <ticket-id> --status "đang xử lí"
```

## Tests

```bash
npm test
```

✅ 69 tests passing

## Validation

- **Email**: `@gmail.com` (case-insensitive)
- **Phone**: exactly 10 digits
- **Priority**: `Standard`, `Priority`, `Expedite`
- **Status**: `tiếp nhận` → `đang xử lí` → `đã xử lí` or `cancel`
  - Can't transition from `cancel`

## Architecture

```
Domain (Business Logic)
  ├── Entities: Ticket
  ├── Value Objects: TicketStatus, Priority
  └── Ports: TicketRepository

Application (Use Cases)
  ├── CreateTicketUseCase
  ├── ListTicketsUseCase
  ├── ShowTicketUseCase
  └── UpdateTicketUseCase

Adapters
  ├── Primary: CLI (TicketsCommand)
  └── Secondary: File Storage (FileTicketRepository)
```

## Project Structure

```
src/
├── domain/          (Business logic)
├── application/     (Use cases)
├── adapters/        (CLI + Storage)
├── dtos/            (Data transfer)
└── __tests__/       (69 unit tests)
data/
└── tickets.json     (Persistent storage)
```

## Requirements ✅

- ✓ Hexagonal Architecture
- ✓ Domain-driven design
- ✓ CLI fully functional
- ✓ 69 unit tests (all passing)
- ✓ Input validation
- ✓ Business rules enforcement
- ✓ Persistent storage

## Example Workflow

```bash
# Create ticket
npx tsx src/main.ts create --title "Login bug" --email "user@gmail.com" --phone "0987654321"

# List all
npx tsx src/main.ts list

# Update status
npx tsx src/main.ts update <id> --status "đang xử lí"

# Run tests
npm test
```
