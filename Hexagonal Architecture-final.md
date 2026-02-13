# HEXAGONAL ARCHITECTURE

## I. GIỚI THIỆU & TỔNG QUAN

### 1. Hexagonal Architecture là gì?

#### Định nghĩa Cơ Bản

Hexagonal Architecture là một cách thiết kế phần mềm nhằm tách biệt hoàn toàn lõi nghiệp vụ (business logic) khỏi các yếu tố bên ngoài.

Những yếu tố bên ngoài bao gồm:

- Giao diện người dùng (CLI, Web, API)
- Cơ chế lưu trữ (File, Database)
- Framework, thư viện kỹ thuật
- Hạ tầng (Infrastructure)

Để nói dễ hiệu Hexagonal Architecture giống như 1 tiệm sửa điện thoại có:

- Core: chỉ biết cách sửa điện thoại và chỉ tập trung vào nó -> Business Logic
- Ports: Cách user mang điện thoại đến cho mình: ship, trực tiếp, nhớ người khác mang hộ -> interface
- Adapter: là tiếp tân, lắng nghe khách hàng nói xem điện thoại hỏng ra sao, rồi "phiên dịch lại" cho core hiểu để core làm việc -> UI / API / Database / Framework

#### Trọng Tâm Cốt Lõi

- Business logic không biết và không phụ thuộc vào cách hệ thống được sử dụng hoặc triển khai.
- Thay vì để application xoay quanh database hay UI, Hexagonal Architecture đặt Domain Core vào trung tâm, và mọi tương tác với bên ngoài đều phải đi qua Ports và Adapters.

#### Mục Tiêu Cốt Lõi

Hexagonal Architecture hướng tới các mục tiêu sau:

| Mục Tiêu                    | Mô Tả                                                                      |
| --------------------------- | -------------------------------------------------------------------------- |
| Decoupling (Giảm phụ thuộc) | Domain không phụ thuộc UI, DB, framework                                   |
| Testability                 | Có thể test business logic mà không cần file system, database, CLI         |
| Flexibility                 | Có thể thay đổi: JSON file -> Database; CLI -> Web API mà không sửa domain |
| Long-term Maintainability   | Code dễ đọc, dễ bảo trì, dễ mở rộng                                        |

### 2. Tại Sao Cần Hexagonal Architecture?

#### Vấn Đề Của Kiến Trúc Truyền Thống (Layered Architecture)

Trong kiến trúc phân lớp truyền thống (UI -> Service -> Repository -> Database):

Business logic thường:

- Gọi trực tiếp repository
- Phụ thuộc framework

Domain logic bị rò rỉ sang:

- Controller
- Service
- Infrastructure

Hệ quả:

- Code khó test
- Mỗi thay đổi nhỏ (DB, framework) kéo theo nhiều thay đổi lớn
- Business logic không còn là trung tâm

#### Tight Coupling Và Hậu Quả

Tight Coupling xảy ra khi: Business logic biết chi tiết cách dữ liệu được lưu

Service phụ thuộc trực tiếp vào:

- File system
- Database driver
- External API

Hậu quả:

- Không thể test domain độc lập
- Mock khó hoặc không thể mock
- Refactor tốn kém
- Code dễ vỡ dây chuyền

#### Hexagonal Architecture Giải Quyết Vấn Đề Này Như Thế Nào?

Hexagonal Architecture đảo ngược cách suy nghĩ:

- Thay Vì: "Domain gọi database"
- Thì: "Domain định nghĩa cách nó muốn lưu dữ liệu, còn bên ngoài phải phù hợp với domain"

Cụ thể:

1. Domain định nghĩa Ports (interfaces)
2. Adapters implement các Ports
3. Dependency luôn hướng vào trong

### 3. Nhìn Hexagonal Architecture sâu hơn

#### Luồng Tương Tác Cơ Bản

1. Người dùng nhập lệnh CLI
2. CLI đóng vai trò Driving Adapters (Primary) -> gọi vào core
3. CLI gọi Primary Port (Use Case)
4. Use Case xử lý nghiệp vụ trong Domain
5. Domain gọi Driven Adapters (Secondary) (ví dụ: TicketRepository)
6. Driven Adapters (Secondary) (File Adapter) thực hiện lưu / đọc dữ liệu

#### Domain Không Biết:

- Dữ liệu được lưu ở đâu
- Có CLI hay không
- Có JSON hay Database

#### Điểm Quan Trọng Cần Nhớ

Hexagonal Architecture KHÔNG phải là:

- Chỉ thêm interface cho repository
- Layered Architecture đổi tên folder

Hexagonal Architecture LÀ:

- Một tư duy thiết kế
- Domain đứng trung tâm
- Mọi phụ thuộc đều hướng vào Domain

## II. CÁC KHÁI NIỆM CỐT LÕI

### 1. Domain Core (Lõi Nghiệp Vụ)

#### Domain Là Gì?

Domain Core là phần trung tâm của hệ thống, nơi chứa:

- Nghiệp vụ cốt lõi
- Quy tắc kinh doanh (business rules)
- Logic quyết định điều gì hợp lệ / không hợp lệ

#### Vị Trí Của Domain Trong Hexagonal Architecture

Trong Hexagonal Architecture, Domain được coi là thứ có giá trị nhất và cần được bảo vệ nhất trong hệ thống. Mọi thứ khác (CLI, database, framework) chỉ tồn tại để phục vụ Domain.

#### Business Rules vs Application Logic

So sánh những nhầm lẫn có thể xảy ra:

| Tiêu chí                        | Business Rules (Domain Logic)              | Application Logic                          |
| ------------------------------- | ------------------------------------------ | ------------------------------------------ |
| Bản chất                        | Luật nghiệp vụ thuần túy                   | Điều phối luồng xử lý                      |
| Phụ thuộc ngữ cảnh              | Không phụ thuộc ngữ cảnh sử dụng           | Phụ thuộc vào cách ứng dụng được sử dụng   |
| Phụ thuộc công nghệ             | Không phụ thuộc CLI, Web, DB, JSON         | Phụ thuộc vào UI, adapter, framework       |
| Mức độ ổn định                  | Rất ổn định, ít thay đổi                   | Dễ thay đổi theo yêu cầu                   |
| Trách nhiệm chính               | Định nghĩa cái gì là hợp lệ / không hợp lệ | Định nghĩa luồng xử lý diễn ra như thế nào |
| Chứa business rules phức tạp    | Có                                         | Không nên                                  |
| Gọi ports (repository, gateway) | Không trực tiếp                            | Có                                         |
| Biết về CLI / Web / HTTP        | Không biết                                 | Biết                                       |
| Khả năng tái sử dụng            | Rất cao (CLI, Web, API dùng chung)         | Thấp hơn, gắn với từng use case            |
| Khả năng unit test              | Dễ test, không cần mock adapter            | Test được nhưng cần mock ports             |

#### Entities

Entity là đối tượng có:

- Danh tính (identity)
- Trạng thái có thể thay đổi theo thời gian

Ví Dụ Trong Ticket Manager:

Ticket
├── id (Danh tính)
├── status (Trạng thái)
└── priority (Thuộc tính)

Điểm Quan Trọng: Hai ticket khác nhau không chỉ vì dữ liệu khác, mà vì id khác. Entity tự bảo vệ trạng thái hợp lệ của chính nó. Entity chứa logic, không phải chỉ là data holder.

#### Value Objects

Value Object là:

- Không có identity
- So sánh bằng giá trị
- Thường là immutable

Ví Dụ:

- TicketStatus
- Priority
- Tag

Nguyên Tắc: Nếu hai value object có cùng giá trị thì được coi là giống nhau.

Trong CLI Nhỏ:

- Value object có thể implement đơn giản
- Không được để string rải rác khắp nơi

#### Domain Services

Domain Service được dùng khi:

- Logic nghiệp vụ không thuộc về một entity cụ thể
- Nhưng vẫn là logic thuần domain

Ví Dụ:

- Kiểm tra ticket có thể chuyển từ status A → B hay không
- Validate một hành động liên quan nhiều entity

Lưu Ý:
Domain Service không được phụ thuộc infrastructure. Không gọi file system, database, console.

#### Nguyên Tắc Quan Trọng Nhất Của Domain

Domain KHÔNG ĐƯỢC PHỤ THUỘC VÀO:

- File system (fs)
- Database
- CLI / UI
- Framework (NestJS, Express, etc.)
- Thư viện kỹ thuật không mang ý nghĩa domain

Rule Kiểm Tra Nhanh:
Nếu xóa toàn bộ adapters, domain vẫn compile và test được thì đúng. Nếu không thì có vấn đề.

### 2. Ports (Cổng Giao Tiếp)

#### Port Là Gì?

Port là một interface mô tả:

- Domain / Application cần gì từ bên ngoài
- Hoặc cho phép bên ngoài gọi vào hệ thống như thế nào

Port không phải là implementation, mà là hợp đồng (contract).

#### Vì Sao Cần Ports?

Nếu không có Ports:

- Domain phải gọi trực tiếp database / file
- Business logic biết chi tiết kỹ thuật
- Mất khả năng thay thế công nghệ

Ports giúp:

- Đảo chiều phụ thuộc
- Domain định nghĩa luật chơi
- Bên ngoài phải theo luật của domain

#### Phân Loại Ports

##### Primary Ports (Driving Ports)

Primary Port mô tả:

- Cách bên ngoài sử dụng hệ thống
- Thường là: Use Cases, Application Services

Ví Dụ:

- CreateTicketUseCase
- UpdateTicketStatusUseCase

Quy Tắc:
CLI không gọi domain trực tiếp, mà gọi Primary Port.

Nằm Trong:

```
application/
└── use-cases/
    └── CreateTicket.ts
```

##### Secondary Ports (Driven Ports)

Secondary Port mô tả:

- Những gì domain cần từ bên ngoài

Ví Dụ:

- TicketRepository
- IdGenerator

Domain Nói: "Tôi cần lưu ticket theo cách này, còn lưu ở đâu là việc của bạn."

Nằm Trong:

```
domain/
└── ports/
    └── TicketRepository.ts
```

hoặc

```
application/
└── ports/
    └── TicketRepository.ts
```

#### tóm tắt:

- Driving Adapters (Primary - Bên trái): Là những thứ chủ động gọi vào core.
- Driven Adapters (Secondary - Bên phải): Là những thứ được core gọi để thực hiện một việc gì đó.

  | ......Câu hỏi...... | Driving.... | Driven   |
  | ------------------- | ----------- | -------- |
  | Ai gọi trước?...... | Bên ngoài.. | Core..   |
  | Ví dụ.............. | Controller  | Database |
  | Có logic không?.... | ❌........  | ❌...    |
  | Có phụ thuộc Core?. | Gọi Core... | Core gọi |

#### Interface Segregation Principle (ISP)

Ports nên:

- Nhỏ - tập trung vào một trách nhiệm
- Tập Trung - chỉ những gì thực sự cần
- Không "God Interface" - quá nhiều method

Ví Dụ:

| SAI                               | ĐÚNG                                       |
| --------------------------------- | ------------------------------------------ |
| Có TicketRepository với 20 method | Chỉ định nghĩa những gì domain thực sự cần |

#### Nguyên Tắc Cực Kỳ Quan Trọng

Ports thuộc core (domain/application), không thuộc adapters.

- Interface được định nghĩa bởi domain
- Adapters chỉ implement, không định nghĩa luật

Nếu interface nằm trong infrastructure thì sai.

### 3. Adapters (Bộ Điều Hợp)

#### Adapter Là Gì?

Adapter là thành phần:

- Hiện thực hóa (implement) Ports
- Chuyển đổi giữa: Thế giới bên ngoài ↔ Domain

Adapter không chứa business rules.

#### Trách Nhiệm Của Adapter

Adapter có nhiệm vụ:

- Parse input
- Map dữ liệu
- Gọi ports
- Chuyển output sang định dạng phù hợp

Adapter không được:

- Validate business rules
- Quyết định logic nghiệp vụ

#### Phân Loại Adapters

##### Primary Adapters

Primary Adapter là: Điểm vào của hệ thống

Ví Dụ:

- CLI
- Web Controller (chỉ so sánh, không implement)

Trong Project:

```
adapters/primary/cli/
└── TicketsCommand.ts
```

- CLI đóng vai trò Primary Adapter
- CLI gọi Primary Ports

##### Secondary Adapters

Secondary Adapter là:Kết nối domain với bên ngoài

Ví Dụ:

- File Storage Adapter (JSON)
- Database Adapter (nếu mở rộng)

Trong Project :

```
adapters/secondary/file/
└── FileTicketRepository.ts
```

- Implement TicketRepository
- Biết fs, JSON
- Domain không biết adapter tồn tại

#### Dependency Injection

Adapters được:

- Inject vào application tại composition root
- Không new trực tiếp trong domain

Ví Dụ:

```
main.ts (Composition Root)
├── Tạo adapter
├── Inject vào use case
└── Khởi chạy CLI
```

Lợi Ích:

- Dễ test
- Dễ thay thế adapter

#### Rule Sống Còn Của Adapter

- Adapter phục vụ domain, không điều khiển domain.
- Nếu adapter chứa logic nghiệp vụ thì sai.

## III. NGUYÊN TẮC & QUY TẮC THIẾT KẾ

### 1. Dependency Rule (Quy Tắc Phụ Thuộc)

#### Dependency Rule Là Gì?

Dependency Rule là quy tắc cốt lõi của Hexagonal Architecture: Mọi dependency trong hệ thống phải hướng vào trong, về phía Domain Core.

Domain không phụ thuộc vào:

- Adapters
- Infrastructure
- Framework

Adapters phụ thuộc vào Domain (thông qua Ports)

Đây không phải là quy ước folder, mà là quy tắc kiến trúc bắt buộc.

#### Vì Sao Dependency Rule Quan Trọng?

Nếu Domain phụ thuộc vào:

- File system
- Database
- CLI

Thì:

- Domain không thể test độc lập
- Mọi thay đổi kỹ thuật kéo theo thay đổi nghiệp vụ
- Business logic mất vai trò trung tâm

Dependency Rule đảm bảo:

- Domain luôn sạch
- Thay đổi công nghệ không ảnh hưởng đến nghiệp vụ

Trong Hexagonal Architecture:

- Ports chính là abstraction
- Domain định nghĩa abstraction
- Adapters implement abstraction

Đây là điểm khác biệt quan trọng so với layered architecture truyền thống.

#### Inversion of Control (IoC)

Hexagonal Architecture sử dụng Inversion of Control:

- Domain không tự tạo adapter
- Adapter được inject từ bên ngoài

Trong CLI Project:

```
main.ts (Composition Root)
├── Mọi wiring xảy ra ở đây
└── Domain không biết:
    ├── Adapter được tạo như thế nào
    ├── Adapter là file, database hay mock
```

#### Rule Kiểm Tra Nhanh

| Câu Hỏi                                          | ĐÚNG                 | SAI            |
| ------------------------------------------------ | -------------------- | -------------- |
| Domain có import từ fs, path, CLI library không? | Không                | Có             |
| Interface (Port) nằm trong đâu?                  | Domain / Application | Infrastructure |
| Adapter có thể thay mà domain không đổi không?   | Có                   | Không          |

### 2. Separation of Concerns (Phân Tách Trách Nhiệm)

#### Separation of Concerns Là Gì?

Separation of Concerns (SoC) là nguyên tắc:

Mỗi phần của hệ thống chỉ chịu trách nhiệm cho một mối quan tâm cụ thể.

Trong Hexagonal Architecture:

```
Domain → Nghiệp vụ
Application → Điều phối use cases
Adapters → Kết nối kỹ thuật
```

#### Business Logic vs Infrastructure

| Khía Cạnh  | Business Logic                           | Infrastructure                        |
| ---------- | ---------------------------------------- | ------------------------------------- |
| Quyết Định | Điều gì hợp lệ? Điều gì không được phép? | Lưu file, Kết nối DB, Parse input CLI |
| Nằm Trong  | Entity, Domain Service, Use Case         | Adapter                               |
| Đặc Điểm   | Quyết định logic nghiệp vụ               | Không quyết định luật nghiệp vụ       |

#### Lỗi Thường Gặp

| SAI                                        | ĐÚNG                           |
| ------------------------------------------ | ------------------------------ |
| CLI kiểm tra status hợp lệ                 | Adapter chỉ truyền dữ liệu     |
| File adapter từ chối update sai trạng thái | Domain quyết định đúng/sai     |
| Business rule nằm trong adapter            | Business rule nằm trong domain |

Vi phạm SoC. Business logic bị phân tán.

#### Configuration vs Implementation

Hexagonal Architecture tách:

| Khía Cạnh      | Mô Tả                        |
| -------------- | ---------------------------- |
| Configuration  | Wiring, dependency injection |
| Implementation | Logic thực thi               |

Trong Project:

```
main.ts (Configuration)
├── Tạo adapter
├── Inject vào use case
│
Domain / application (Implementation)
├── Không biết ai tạo adapter
└── Chỉ know về logic
```

Lợi Ích:

- Dễ test
- Dễ thay adapter bằng mock/fake

### 3. Các Quy Tắc quan trọng Khi Áp Dụng Hexagonal Architecture

#### Rule 1: Domain Phải Độc Lập Tuyệt Đối

- Có thể compile riêng. Có thể test riêng. Không import infrastructure.

#### Rule 2: Ports Định Nghĩa Bởi Domain / Application

- Không định nghĩa interface trong adapter. Adapter chỉ implement.

#### Rule 3: Adapter Không Chứa Business Logic

- Adapter làm nhiệm vụ dịch. Không làm nhiệm vụ quyết định.

#### Rule 4: Composition Root Nằm Ngoài Domain

- Mọi wiring xảy ra ở một chỗ. Không new adapter trong domain.

#### Rule 5: Đơn Giản Hơn Là Tốt Hơn

- Không thêm abstraction nếu không cần. Hexagonal Architecture không yêu cầu phức tạp.

### 4. Áp Dụng Trực Tiếp Vào Ticket Manager CLI

#### Ví Dụ Luồng Đúng

```
1. CLI nhận lệnh: tickets create
2. CLI parse input
3. CLI gọi CreateTicketUseCase
4. Use case gọi TicketRepository
5. File Adapter lưu JSON
```

Không có bước nào:

- Domain biết CLI
- Domain biết JSON

## IV. THIẾT KẾ DỰ ÁN TICKET MANAGER CLI

### 1. Phân Tích Yêu Cầu

#### Mô Tả Bài Toán

Xây dựng một CLI Ticket Manager cho phép người dùng:

- Tạo ticket
- Xem danh sách ticket
- Xem chi tiết một ticket
- Cập nhật trạng thái ticket

Dữ Liệu:
Dữ liệu ticket được lưu trữ cục bộ (local) dưới dạng JSON file.

#### Danh Sách Command

Hệ thống hỗ trợ các command sau:

| Command             | Mô Tả                      |
| ------------------- | -------------------------- |
| tickets create      | Tạo ticket mới             |
| tickets list        | Xem danh sách ticket       |
| tickets show <id>   | Xem chi tiết một ticket    |
| tickets update <id> | Cập nhật trạng thái ticket |

Mỗi command tương ứng một hành động nghiệp vụ rõ ràng, rất phù hợp để map sang Use Case trong Hexagonal Architecture.

#### Xác Định Ranh Giới Hệ Thống

Bên Ngoài Hệ Thống:

- Người dùng
- CLI
- File system

Bên Trong Hệ Thống:

- Ticket (Domain Model)
- Business rules
- Use cases

Yêu Cầu Hexagonal Architecture:
Mọi tương tác giữa bên ngoài và bên trong đều phải đi qua Ports.

### 2. Áp Dụng Hexagonal Architecture Cho Bài Toán

#### Xác Định Domain Model

##### Entity: Ticket

Ticket là Entity cốt lõi của hệ thống, bao gồm:

```
Ticket
├── id (Danh tính duy nhất)
├── title (Tiêu đề)
├── description (Mô tả)
├── status (Trạng thái)
├── priority (Ưu tiên)
└── tags (Nhãn)
```

Vai Trò:

- Nắm giữ trạng thái
- Bảo vệ tính hợp lệ của chính nó

Ticket Không Biết:

- CLI
- JSON
- File system

##### Value Objects

Một số thuộc tính của Ticket có thể được xem là Value Object:

- TicketStatus
- Priority

Lợi Ích:

- Tránh dùng string tự do
- Giảm bug do giá trị không hợp lệ
- Làm rõ business rules

#### Xác Định Use Cases (Primary Ports)

Mỗi hành động nghiệp vụ chính tương ứng một Use Case:

```
CreateTicket
ListTickets
ShowTicket
UpdateTicket
```

Đặc Điểm:

- Đóng vai trò Primary Port
- Được gọi bởi CLI (Primary Adapter)
- Điều phối domain logic

#### Xác Định Secondary Ports

Domain cần các khả năng từ bên ngoài:

```
Lưu ticket
Lấy danh sách ticket
Tìm ticket theo id
Cập nhật ticket
```

Tất cả được mô tả qua TicketRepository interface.

Domain Chỉ Biết Interface, Không Biết:

- Lưu bằng JSON
- Hay database

### 3. Cấu Trúc Thư Mục Dự Án (TypeScript)

#### Cấu Trúc Tổng Thể

```
src/
├── domain/                          ← LÕI NGHIỆP VỤ
│   ├── entities/
│   │   └── Ticket.ts
│   ├── value-objects/
│   │   ├── TicketStatus.ts
│   │   └── Priority.ts
│   └── ports/
│       └── TicketRepository.ts
│
├── application/                     ← ĐIỀU PHỐI
│   └── use-cases/
│       ├── CreateTicket.ts
│       ├── ListTickets.ts
│       ├── ShowTicket.ts
│       └── UpdateTicket.ts
│
├── adapters/                        ← KẾT NỐI KỸ THUẬT
│   ├── primary/
│   │   └── cli/
│   │       └── TicketsCommand.ts
│   └── secondary/
│       └── file/
│           └── FileTicketRepository.ts
│
└── main.ts                          ← COMPOSITION ROOT
```

#### Giải Thích Từng Layer

##### domain/

Chứa:

- Entity
- Value Objects
- Ports (interfaces)

Quy Tắc:

- Không import bất kỳ adapter nào
- Không biết JSON, CLI, fs

##### application/

Chứa:

- Use cases
- Điều phối domain

Quy Tắc:

- Phụ thuộc domain
- Không phụ thuộc adapters

##### adapters/primary/

Chứa:

- CLI logic

Trách Nhiệm:

- Parse input
- Gọi use case

##### adapters/secondary/

Chứa:

- Hiện thực ports
- Làm việc với file system

Trách Nhiệm:

- Biết JSON
- Implement TicketRepository

##### main.ts

Composition Root:

Trách Nhiệm:

- Tạo adapter
- Inject adapter vào use case
- Khởi chạy CLI

### 4. Luồng Xử Lý Chi Tiết Một Command

#### Ví Dụ: tickets create

```
Người dùng nhập:
$ tickets create --title "Bug A" --priority high

Luồng Thực Thi:
1. CLI parse arguments
   ↓
2. CLI gọi CreateTicket use case
   ↓
3. Use case:
   ├── Validate nghiệp vụ
   ├── Tạo entity Ticket
   └── Gọi TicketRepository.save()
   ↓
4. File Adapter:
   ├── Serialize Ticket
   └── Ghi vào JSON file
   ↓
5. Kết quả trả về CLI
```

Domain Không Biết:

- Có CLI
- Có JSON
- Có file

## V. SO SÁNH & ALTERNATIVES

### 1. So Sánh Với Layered Architecture

#### Layered Architecture Là Gì?

Layered Architecture thường chia hệ thống thành:

```
Presentation (UI / CLI)
    ↓
Service
    ↓
Repository
    ↓
Database
```

Luồng Phụ Thuộc:

```
UI → Service → Repository → Database
```

#### Điểm Mạnh Của Layered Architecture

- Dễ hiểu
- Phù hợp project nhỏ
- Setup nhanh

#### Hạn Chế So Với Hexagonal Architecture

Business Logic Thường:

- Phụ thuộc ORM
- Phụ thuộc Database
- Khó test domain độc lập

Khi Đổi Công Nghệ:

- Thay đổi lan rộng

#### So Sánh Trực Tiếp

| Tiêu Chí                 | Layered | Hexagonal  |
| ------------------------ | ------- | ---------- |
| Domain Độc Lập           | Không   | Có         |
| Test Domain Không Cần DB | Không   | Có         |
| Dễ Thay Storage          | Không   | Có         |
| Độ Phức Tạp              | Thấp    | Trung Bình |

Với Ticket Manager CLI: Layered chạy được, nhưng khó mở rộng và test.

### 2. So Sánh Với Clean Architecture

#### Clean Architecture Là Gì?

Clean Architecture (Robert C. Martin) tập trung vào:

```
Domain / Entities
    ↓
Use Cases
    ↓
Interface Adapters
    ↓
Frameworks
```

Về Bản Chất: Clean Architecture và Hexagonal Architecture chia sẻ cùng triết lý.

#### So Sánh Nhanh

| Tiêu Chí             | Clean     | Hexagonal        |
| -------------------- | --------- | ---------------- |
| Domain trung tâm     | Có        | Có               |
| Dependency Vào Trong | Có        | Có               |
| Testability Cao      | Có        | Có               |
| Trình Bày            | Vòng Tròn | Ports & Adapters |
| Ports Rõ Ràng        | Có phần   | Có               |

Hexagonal dễ giải thích hơn trong bối cảnh CLI.

### 3. So Sánh Với Onion Architecture

#### Onion Architecture Là Gì?

Onion Architecture cũng xoay quanh domain, gồm:

```
Domain Model (Tâm)
    ↓
Domain Services
    ↓
Application Services
    ↓
Infrastructure (Ngoài cùng)
```

#### So Sánh Nhanh

| Tiêu Chí         | Onion   | Hexagonal |
| ---------------- | ------- | --------- |
| Domain trung tâm | Có      | Có        |
| Ports Rõ Ràng    | Có phần | Có        |
| Adapter Explicit | Không   | Có        |

Hexagonal nhấn mạnh Ports & Adapters rõ ràng hơn, phù hợp khi cần thay đổi IO.

### 4. Khi Nào Nên Sử Dụng Hexagonal Architecture?

#### Phù Hợp Khi:

- Có business logic rõ ràng
- Cần test nghiêm túc
- Có khả năng thay đổi: Storage, UI
- Project sống lâu

#### Không Nên Dùng Khi:

- Script nhỏ, one-off
- Không có domain logic
- Deadline cực gấp, team chưa quen

## VII. AI WORKFLOW & DECISION LOG

### 1. Vai Trò Của AI

Trong project Ticket Manager CLI, AI không được sử dụng như người viết code hay research thay.

Mà đóng vai trò:

- Công cụ hỗ trợ nghiên cứu
- Công cụ gợi ý phương án
- Công cụ phản biện và kiểm tra lại tư duy
- Công cụ đánh giá tổng quan trước khi chốt các phương án

#### Nguyên Tắc Cốt Lõi

AI có thể đề xuất, nhưng con người phải đánh giá, chọn lọc và chịu trách nhiệm.

Mọi nội dung do AI gợi ý đều phải:

- Được kiểm tra logic
- Được đối chiếu với yêu cầu bài toán
- Được xác nhận là phù hợp Hexagonal Architecture

### 2. Layered Questioning Workflow

#### (Research → Brief → Example → Validation)

Workflow này được sử dụng xuyên suốt Phase 1 – Research.

#### 2.1 Research – Nghiên Cứu Mở

Ở bước này, AI được sử dụng để:

- Thu thập thông tin về:
  - Hexagonal Architecture
  - Ports & Adapters
  - Lịch sử, khái niệm, nguyên tắc

-> Ngay ở bước này AI đã được cung cấp các đường link đã được review về kiến thức, scope, rule và các giới hạn

Mục Tiêu:

- Có bức tranh tổng thể

#### 2.2 Brief – Tóm Tắt Có Chọn Lọc

Sau khi có thông tin thô, bước tiếp theo là:

- Tóm tắt lại theo ngôn ngữ của bản thân
- Loại bỏ:
  - Khái niệm không cần cho CLI
  - Nội dung quá enterprise-level

Ví Dụ trong quá trình làm tôi đã:

| Giữ      | Loại Bỏ             |
| -------- | ------------------- |
| Domain   | Event Sourcing      |
| Ports    | Distributed Systems |
| Adapters | Advanced CQRS       |

-> thừa

#### 2.3 Example – Gắn Với Bài Toán Cụ Thể

Mọi khái niệm chỉ được giữ lại nếu:

- Có thể map trực tiếp vào Ticket Manager CLI

Ví Dụ Mapping:

| Khái Niệm         | Map Với                   |
| ----------------- | ------------------------- |
| Primary Adapter   | CLI                       |
| Secondary Adapter | File JSON storage         |
| Primary Port      | Use Case như CreateTicket |
| Secondary Port    | TicketRepository          |

#### 2.4 Validation – Kiểm Chứng Và Phản Biện

Ở bước này, AI được dùng để:

- Đặt câu hỏi ngược lại:
  - "Thiết kế này có vi phạm Hexagonal không?"
  - "Domain có bị phụ thuộc không?"

- Phát hiện các điểm:
  - Over-engineering
  - Hiểu sai thuật ngữ

### 3. Solution Exploration Workflow

#### (Explore → Compare → Decide)

Workflow này được dùng khi có nhiều phương án hợp lệ.

#### 3.1 Explore – Khám Phá Các Phương Án

Ví Dụ Trong Project:

Lưu Ticket Bằng:

- In-memory
- JSON file
- Database

Tổ Chức Project Theo:

- Hexagonal Architecture

AI Được Dùng Để:

- Liệt kê phương án
- Chỉ ra ưu / nhược điểm
- Theo dõi quy trình

#### 3.2 Compare – So Sánh Trong Bối Cảnh Cụ Thể

Các phương án được so sánh dựa trên:

- Scope bài đơn giản (local)
- Yêu cầu kỹ thuật
- Deadline
- Mục tiêu học Hexagonal Architecture

Ví Dụ:

| Phương Án | Đánh Giá                   |
| --------- | -------------------------- |
| Database  | Quá nặng                   |
| In-memory | Không thể hiện rõ adapter  |
| JSON file | Đủ đơn giản, đúng mục tiêu |

#### 3.3 Decide – Quyết Định Có Lý Do

Quyết Định Cuối Cùng:

- JSON file + File Adapter
- CLI thuần, không framework nặng
- Hexagonal Architecture thay vì Layered

Mỗi Quyết Định Đều Có:

- Lý do rõ ràng
- Trade-off được chấp nhận

### 4. Iterative Refinement Workflow

#### (Review → Improve → Validate)

Workflow này được áp dụng liên tục, không chỉ một lần.

#### 4.1 Review – Rà Soát Lại Đề Xuất Của AI

Mỗi khi AI đề xuất:

- Thêm abstraction
- Thêm pattern
- Thêm framework

Người Thực Hiện Sẽ Tự Hỏi:

- Có thật sự cần không?
- Có phục vụ mục tiêu bài toán không?

#### 4.2 Improve – Điều Chỉnh Cho Phù Hợp

Ví Dụ:

| Gợi Ý               | Quyết Định    | Lý Do           |
| ------------------- | ------------- | --------------- |
| Thêm CQRS           | Loại bỏ       | Quá phức tạp    |
| Thêm Event Sourcing | Loại bỏ       | Không implement |
| Framework CLI       | Giữ CLI thuần | Tránh coupling  |

Mục Tiêu:

- Giữ kiến trúc đúng nhưng không nặng

#### 4.3 Validate – Xác Nhận Lần Cuối

Một quyết định chỉ được giữ nếu:

- Không vi phạm Hexagonal Architecture
- Không làm domain phụ thuộc
- Phục vụ cho mục đích hoàn thành check list

### 5. Decision Log – Một Số Quyết Định Tiêu Biểu

#### Quyết Định 1: Chọn Hexagonal Architecture

Vì:

- Thể hiện tư duy kiến trúc
- Domain-centric
- Dễ test, dễ mở rộng

#### Quyết Định 2: Không Dùng Framework

Vì:

- Tránh coupling không cần thiết
- Thể hiện kiến trúc rõ ràng hơn

#### Quyết Định 3: Không Đưa Advanced Topics Vào Doc
