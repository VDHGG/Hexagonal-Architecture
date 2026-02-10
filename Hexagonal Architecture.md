======================================== Hexagonal Architecture ========================================
I. GIỚI THIỆU & TỔNG QUAN

1. Hexagonal Architecture là gì?
   Định nghĩa cơ bản

Hexagonal Architecture là một kiến trúc phần mềm được thiết kế nhằm tách biệt hoàn toàn lõi nghiệp vụ (business logic) khỏi các yếu tố bên ngoài như:

Giao diện người dùng (CLI, Web, API)

Cơ chế lưu trữ (File, Database)

Framework, thư viện kỹ thuật

Hạ tầng (Infrastructure)

Trọng tâm của Hexagonal Architecture là:

Business logic không biết và không phụ thuộc vào cách hệ thống được sử dụng hoặc triển khai.

Thay vì để application “xoay quanh” database hay UI, Hexagonal Architecture đặt Domain Core vào trung tâm, và mọi tương tác với bên ngoài đều phải đi qua các Ports và Adapters.

Lịch sử phát triển

Hexagonal Architecture được đề xuất bởi Alistair Cockburn vào khoảng năm 2005, trong quá trình ông nghiên cứu cách thiết kế các hệ thống:

Dễ test

Dễ thay đổi công nghệ

Không bị khóa chặt bởi framework hay database

Tên gọi “hexagonal” không mang ý nghĩa hình học bắt buộc, mà chỉ là:

Một cách minh họa rằng hệ thống có nhiều “cạnh” (ports) để giao tiếp với thế giới bên ngoài

Mỗi cạnh có thể được gắn adapter khác nhau (CLI, Web, DB, File…)

Trong thực tế, hệ thống không nhất thiết phải có 6 cạnh.

Các tên gọi khác

Hexagonal Architecture còn được biết đến với tên gọi:

Ports and Adapters Pattern

Tên gọi này phản ánh đúng bản chất hơn “hexagonal”:

Ports: Các interface định nghĩa cách hệ thống được sử dụng hoặc cung cấp dữ liệu

Adapters: Các thành phần hiện thực hóa (implement) các ports đó để kết nối với thế giới bên ngoài

Hexagonal Architecture và Ports & Adapters là cùng một khái niệm, chỉ khác cách gọi.

Mục tiêu cốt lõi

Hexagonal Architecture hướng tới các mục tiêu sau:

Decoupling (Giảm phụ thuộc)

Domain không phụ thuộc UI, DB, framework

Testability

Có thể test business logic mà không cần file system, database, CLI

Flexibility

Có thể thay đổi:

JSON file → Database

CLI → Web API
mà không sửa domain

Long-term maintainability

Code dễ đọc, dễ bảo trì, dễ mở rộng

2. Tại sao cần Hexagonal Architecture?
   Vấn đề của kiến trúc truyền thống (Layered Architecture)

Trong kiến trúc phân lớp truyền thống (UI → Service → Repository → Database):

Business logic thường:

Gọi trực tiếp repository

Phụ thuộc ORM

Phụ thuộc framework

Domain logic bị “rò rỉ” sang:

Controller

Service

Infrastructure

Hệ quả:

Code khó test

Mỗi thay đổi nhỏ (DB, framework) kéo theo nhiều thay đổi lớn

Business logic không còn là trung tâm

Tight Coupling và hậu quả

Tight Coupling xảy ra khi:

Business logic biết chi tiết cách dữ liệu được lưu

Service phụ thuộc trực tiếp vào:

File system

Database driver

External API

Hậu quả:

Không thể test domain độc lập

Mock khó hoặc không thể mock

Refactor tốn kém

Code dễ “vỡ dây chuyền”

Hexagonal Architecture giải quyết vấn đề này như thế nào?

Hexagonal Architecture đảo ngược cách suy nghĩ:

Thay vì:

“Domain gọi database”

Thì:

“Domain định nghĩa cách nó muốn lưu dữ liệu, còn bên ngoài phải phù hợp với domain”

Cụ thể:

Domain định nghĩa Ports (interfaces)

Adapters implement các Ports

Dependency luôn hướng vào trong

3. Nhìn Hexagonal Architecture ở mức cao (High-level View)
   Sơ đồ tổng quan (ASCII)
   [ CLI ]
   |
   (Primary Adapter)
   |
   [ Use Case / Port ]
   |
   [ Domain Core ]
   |
   [ Repository Port ]
   |
   (Secondary Adapter)
   |
   [ File / DB ]

Luồng tương tác cơ bản

Người dùng nhập lệnh CLI

CLI đóng vai trò Primary Adapter

CLI gọi Primary Port (Use Case)

Use Case xử lý nghiệp vụ trong Domain

Domain gọi Secondary Port (ví dụ: TicketRepository)

Secondary Adapter (File Adapter) thực hiện lưu / đọc dữ liệu

👉 Domain không biết:

Dữ liệu được lưu ở đâu

Có CLI hay không

Có JSON hay Database

Điểm quan trọng cần nhớ (mentor rất hay hỏi)

Hexagonal Architecture không phải là:

Chỉ thêm interface cho repository

Layered Architecture đổi tên folder

Hexagonal Architecture là:

Một tư duy thiết kế

Domain đứng trung tâm

Mọi phụ thuộc đều hướng vào Domain

II. CÁC KHÁI NIỆM CỐT LÕI

1. Domain Core (Lõi nghiệp vụ)
   Domain là gì?

Domain Core là phần trung tâm của hệ thống, nơi chứa:

Nghiệp vụ cốt lõi

Quy tắc kinh doanh (business rules)

Logic quyết định điều gì hợp lệ / không hợp lệ

Trong Hexagonal Architecture, Domain được coi là:

Thứ có giá trị nhất và cần được bảo vệ nhất trong hệ thống.

Mọi thứ khác (CLI, database, framework) chỉ tồn tại để phục vụ Domain.

Business Rules vs Application Logic

Đây là chỗ rất hay bị lẫn, mentor thường hỏi:

Business Rules

Luật nghiệp vụ thuần túy

Không phụ thuộc ngữ cảnh sử dụng

Ví dụ (Ticket Manager):

Một ticket phải có title

Status chỉ được nằm trong một tập giá trị hợp lệ

Không thể update ticket không tồn tại

➡️ Những luật này luôn đúng, dù:

CLI hay Web

JSON hay Database

Application Logic

Điều phối luồng xử lý

Gọi domain object, gọi ports

Không chứa luật nghiệp vụ phức tạp

Ví dụ:

Nhận input từ CLI

Gọi use case CreateTicket

Trả kết quả cho CLI

➡️ Application logic có thể thay đổi, domain thì không.

Entities

Entity là đối tượng có:

Danh tính (identity)

Trạng thái có thể thay đổi theo thời gian

Ví dụ trong Ticket Manager:

Ticket

Có id

Có status

Có priority

Điểm quan trọng:

Hai ticket khác nhau không chỉ vì dữ liệu khác, mà vì id khác

Entity tự bảo vệ trạng thái hợp lệ của chính nó

➡️ Entity chứa logic, không phải chỉ là data holder.

Value Objects

Value Object là:

Không có identity

So sánh bằng giá trị

Thường là immutable

Ví dụ:

TicketStatus

Priority

Tag

Nếu hai value object có cùng giá trị → được coi là giống nhau.

👉 Trong CLI nhỏ, value object có thể:

Được implement đơn giản

Nhưng không được để string rải rác khắp nơi

Domain Services

Domain Service được dùng khi:

Logic nghiệp vụ không thuộc về một entity cụ thể

Nhưng vẫn là logic thuần domain

Ví dụ:

Kiểm tra ticket có thể chuyển từ status A → B hay không

Validate một hành động liên quan nhiều entity

⚠️ Lưu ý:

Domain Service không được phụ thuộc infrastructure

Không gọi file system, database, console

Nguyên tắc quan trọng nhất của Domain

Domain KHÔNG ĐƯỢC PHỤ THUỘC vào:

File system (fs)

Database

CLI / UI

Framework (NestJS, Express, etc.)

Thư viện kỹ thuật không mang ý nghĩa domain

👉 Rule kiểm tra nhanh:

Nếu xóa toàn bộ adapters, domain vẫn compile và test được → ĐÚNG

2. Ports (Cổng giao tiếp)
   Port là gì?

Port là một interface mô tả:

Domain / Application cần gì từ bên ngoài

Hoặc cho phép bên ngoài gọi vào hệ thống như thế nào

Port không phải là implementation, mà là hợp đồng (contract).

Vì sao cần Ports?

Nếu không có Ports:

Domain phải gọi trực tiếp database / file

Business logic biết chi tiết kỹ thuật

Mất khả năng thay thế công nghệ

Ports giúp:

Đảo chiều phụ thuộc

Domain định nghĩa luật chơi

Bên ngoài phải “theo luật” của domain

Phân loại Ports
Primary Ports (Driving Ports)

Primary Port mô tả:

Cách bên ngoài sử dụng hệ thống

Thường là:

Use Cases

Application Services

Ví dụ:

CreateTicketUseCase

UpdateTicketStatusUseCase

CLI không gọi domain trực tiếp, mà gọi Primary Port.

➡️ Primary Port thường nằm trong:

application/

Secondary Ports (Driven Ports)

Secondary Port mô tả:

Những gì domain cần từ bên ngoài

Ví dụ:

TicketRepository

IdGenerator

Domain nói:

“Tôi cần lưu ticket theo cách này, còn lưu ở đâu là việc của bạn.”

➡️ Secondary Port thường là interface trong:

domain/ hoặc application/

Interface Segregation Principle (ISP)

Ports nên:

Nhỏ

Tập trung

Không “God Interface”

Ví dụ:

Không nên có TicketRepository với 20 method

Chỉ định nghĩa những gì domain thực sự cần

Nguyên tắc cực kỳ quan trọng (mentor hay hỏi)

Ports thuộc core (domain/application), KHÔNG thuộc adapters.

Interface được định nghĩa bởi domain

Adapters chỉ implement, không định nghĩa luật

Nếu interface nằm trong infrastructure:
➡️ Vi phạm Hexagonal Architecture.

3. Adapters (Bộ điều hợp)
   Adapter là gì?

Adapter là thành phần:

Hiện thực hóa (implement) Ports

Chuyển đổi giữa:

Thế giới bên ngoài ↔ Domain

Adapter không chứa business rules.

Trách nhiệm của Adapter

Adapter có nhiệm vụ:

Parse input

Map dữ liệu

Gọi ports

Chuyển output sang định dạng phù hợp

Không được:

Validate business rules

Quyết định logic nghiệp vụ

Phân loại Adapters
Primary Adapters

Primary Adapter là:

Điểm vào của hệ thống

Ví dụ:

CLI

Web Controller (chỉ so sánh, không implement)

Trong project này:

CLI đóng vai trò Primary Adapter

CLI gọi Primary Ports

Secondary Adapters

Secondary Adapter là:

Kết nối domain với bên ngoài

Ví dụ:

File Storage Adapter (JSON)

Database Adapter (nếu mở rộng)

File Adapter:

Implement TicketRepository

Biết fs, JSON

Domain không biết adapter tồn tại

Dependency Injection

Adapters được:

Inject vào application tại composition root

Không new trực tiếp trong domain

Ví dụ:

main.ts chịu trách nhiệm wiring

➡️ Điều này giúp:

Dễ test

Dễ thay thế adapter

Rule sống còn của Adapter

Adapter phục vụ Domain, không điều khiển Domain.

Nếu adapter chứa logic nghiệp vụ:
➡️ Đó là anti-pattern, sẽ được nói rõ ở Section VII.

III. NGUYÊN TẮC & QUY TẮC THIẾT KẾ

1. Dependency Rule (Quy tắc phụ thuộc)
   Dependency Rule là gì?

Dependency Rule là quy tắc cốt lõi của Hexagonal Architecture:

Mọi dependency trong hệ thống phải hướng vào trong, về phía Domain Core.

Nói cách khác:

Domain không phụ thuộc vào:

Adapters

Infrastructure

Framework

Adapters phụ thuộc vào Domain (thông qua Ports)

Đây không phải là quy ước folder, mà là quy tắc kiến trúc bắt buộc.

Vì sao Dependency Rule quan trọng?

Nếu Domain phụ thuộc vào:

File system

Database

CLI

thì:

Domain không thể test độc lập

Mọi thay đổi kỹ thuật kéo theo thay đổi nghiệp vụ

Business logic mất vai trò trung tâm

Dependency Rule đảm bảo:

Domain luôn “sạch”

Thay đổi công nghệ không ảnh hưởng đến nghiệp vụ

Dependency Inversion Principle (DIP)

Dependency Rule được thực hiện thông qua Dependency Inversion Principle (D – trong SOLID):

High-level modules (Domain, Use Cases)
không phụ thuộc low-level modules (File, DB)

Cả hai phụ thuộc vào abstraction (interface)

Trong Hexagonal Architecture:

Ports chính là abstraction

Domain định nghĩa abstraction

Adapters implement abstraction

👉 Đây là điểm khác biệt quan trọng so với layered architecture truyền thống.

Inversion of Control (IoC)

Hexagonal Architecture sử dụng Inversion of Control:

Domain không tự tạo adapter

Adapter được inject từ bên ngoài

Trong CLI project:

main.ts đóng vai trò Composition Root

Mọi wiring xảy ra ở đây

Domain không biết:

Adapter được tạo như thế nào

Adapter là file, database hay mock

Rule kiểm tra nhanh (mentor rất hay hỏi)

Hỏi 3 câu sau:

Domain có import từ fs, path, CLI library không?

❌ Có → Sai kiến trúc

Interface (Port) nằm trong đâu?

✅ Domain / Application → Đúng

❌ Infrastructure → Sai

Adapter có thể thay mà domain không đổi không?

❌ Không → Sai thiết kế

2. Separation of Concerns (Phân tách trách nhiệm)
   Separation of Concerns là gì?

Separation of Concerns (SoC) là nguyên tắc:

Mỗi phần của hệ thống chỉ chịu trách nhiệm cho một mối quan tâm cụ thể.

Trong Hexagonal Architecture:

Domain → Nghiệp vụ

Application → Điều phối use cases

Adapters → Kết nối kỹ thuật

Business Logic vs Infrastructure

Business Logic

Quyết định:

Điều gì hợp lệ?

Điều gì không được phép?

Nằm trong:

Entity

Domain Service

Use Case

Infrastructure

Lo việc:

Lưu file

Kết nối DB

Parse input CLI

Không quyết định luật nghiệp vụ

Lỗi thường gặp (rất hay bị hỏi)

❌ Đặt business rule trong adapter:

CLI kiểm tra status hợp lệ

File adapter từ chối update sai trạng thái

→ Vi phạm SoC
→ Business logic bị phân tán

✅ Đúng:

Adapter chỉ truyền dữ liệu

Domain quyết định đúng/sai

Configuration vs Implementation

Hexagonal Architecture tách:

Configuration: wiring, dependency injection

Implementation: logic thực thi

Trong project:

main.ts:

Tạo adapter

Inject vào use case

Domain / application:

Không biết ai tạo adapter

Điều này giúp:

Dễ test

Dễ thay adapter bằng mock/fake

Testing Concerns

Testing cũng là một concern riêng:

Domain:

Test logic

Không dùng fs, DB, CLI

Adapter:

Test IO

Test mapping

Hexagonal Architecture tạo điều kiện tự nhiên cho testing, không cần hack.

3. Các quy tắc “sống còn” khi áp dụng Hexagonal Architecture
   Rule 1: Domain phải độc lập tuyệt đối

Có thể compile riêng

Có thể test riêng

Không import infrastructure

Rule 2: Ports định nghĩa bởi Domain / Application

Không định nghĩa interface trong adapter

Adapter chỉ implement

Rule 3: Adapter không chứa business logic

Adapter làm nhiệm vụ “dịch”

Không làm nhiệm vụ “quyết định”

Rule 4: Composition Root nằm ngoài Domain

Mọi wiring xảy ra ở một chỗ

Không new adapter trong domain

Rule 5: Đơn giản hơn là tốt hơn

Không thêm abstraction nếu không cần

Hexagonal Architecture không yêu cầu phức tạp

4. Áp dụng trực tiếp vào Ticket Manager CLI
   Ví dụ luồng đúng

CLI nhận lệnh tickets create

CLI parse input

CLI gọi CreateTicketUseCase

Use case gọi TicketRepository

File Adapter lưu JSON

Không có bước nào:

Domain biết CLI

Domain biết JSON

Ví dụ luồng sai (anti-pattern)

CLI tự validate nghiệp vụ

Use case import fs

Repository nằm trong infrastructure nhưng interface cũng nằm ở đó

➡️ Trông có vẻ chạy được, nhưng vi phạm Hexagonal Architecture

IV. THIẾT KẾ DỰ ÁN TICKET MANAGER CLI

1. Phân tích yêu cầu
   Mô tả bài toán

Xây dựng một CLI Ticket Manager cho phép người dùng:

Tạo ticket

Xem danh sách ticket

Xem chi tiết một ticket

Cập nhật trạng thái ticket

Dữ liệu ticket được lưu trữ cục bộ (local) dưới dạng JSON file.

Danh sách command

Hệ thống hỗ trợ các command sau:

tickets create

tickets list

tickets show <id>

tickets update <id>

👉 Mỗi command tương ứng một hành động nghiệp vụ rõ ràng, rất phù hợp để map sang Use Case trong Hexagonal Architecture.

Xác định ranh giới hệ thống

Bên ngoài hệ thống:

Người dùng

CLI

File system

Bên trong hệ thống:

Ticket

Business rules

Use cases

Hexagonal Architecture yêu cầu:

Mọi tương tác giữa “bên ngoài” và “bên trong” đều phải đi qua Ports.

2. Áp dụng Hexagonal Architecture cho bài toán
   Xác định Domain Model
   Entity: Ticket

Ticket là Entity cốt lõi của hệ thống, bao gồm:

id

title

description

status

priority

tags

Vai trò:

Nắm giữ trạng thái

Bảo vệ tính hợp lệ của chính nó

Không biết:

CLI

JSON

File system

Value Objects

Một số thuộc tính của Ticket có thể được xem là Value Object:

TicketStatus

Priority

Lợi ích:

Tránh dùng string tự do

Giảm bug do giá trị không hợp lệ

Làm rõ business rules

Xác định Use Cases (Primary Ports)

Mỗi hành động nghiệp vụ chính tương ứng một Use Case:

CreateTicket

ListTickets

ShowTicket

UpdateTicket

Use Case:

Đóng vai trò Primary Port

Được gọi bởi CLI (Primary Adapter)

Điều phối domain logic

Xác định Secondary Ports

Domain cần các khả năng từ bên ngoài:

Lưu ticket

Lấy danh sách ticket

Tìm ticket theo id

Cập nhật ticket

➡️ Tất cả được mô tả qua TicketRepository interface.

Domain chỉ biết interface, không biết:

Lưu bằng JSON

Hay database

3. Cấu trúc thư mục dự án (TypeScript)
   Cấu trúc tổng thể
   src/
   ├── domain/
   │ ├── entities/
   │ │ └── Ticket.ts
   │ ├── value-objects/
   │ │ ├── TicketStatus.ts
   │ │ └── Priority.ts
   │ └── ports/
   │ └── TicketRepository.ts
   │
   ├── application/
   │ └── use-cases/
   │ ├── CreateTicket.ts
   │ ├── ListTickets.ts
   │ ├── ShowTicket.ts
   │ └── UpdateTicket.ts
   │
   ├── adapters/
   │ ├── primary/
   │ │ └── cli/
   │ │ └── TicketsCommand.ts
   │ └── secondary/
   │ └── file/
   │ └── FileTicketRepository.ts
   │
   └── main.ts

Giải thích từng layer (mentor rất hay hỏi)
domain/

Chứa:

Entity

Value Objects

Ports (interfaces)

Không import bất kỳ adapter nào

Không biết JSON, CLI, fs

application/

Chứa:

Use cases

Điều phối domain

Phụ thuộc domain

Không phụ thuộc adapters

adapters/primary

CLI logic

Parse input

Gọi use case

adapters/secondary

Hiện thực ports

Làm việc với file system

Biết JSON

main.ts

Composition Root

Tạo adapter

Inject adapter vào use case

Khởi chạy CLI

4. Luồng xử lý chi tiết một command
   Ví dụ: tickets create

Người dùng nhập:

tickets create --title "Bug A" --priority high

CLI parse arguments

CLI gọi CreateTicket use case

Use case:

Validate nghiệp vụ

Tạo entity Ticket

Gọi TicketRepository.save()

File Adapter:

Serialize Ticket

Ghi vào JSON file

Kết quả trả về CLI

👉 Domain không biết:

Có CLI

Có JSON

Có file

5. Thiết kế để mở rộng trong tương lai

Hexagonal Architecture cho phép:

Thay FileTicketRepository bằng DatabaseTicketRepository

Thêm Web API adapter

Giữ nguyên domain & use case

Điều cần làm:

Viết adapter mới

Không sửa domain

6. Những quyết định thiết kế có chủ đích
   Vì sao không dùng framework CLI nặng?

Mục tiêu:

Giữ domain clean

Tránh phụ thuộc framework

Framework có thể:

Gây coupling không cần thiết

Che mất kiến trúc thật

Vì sao không đưa logic vào CLI?

CLI chỉ là adapter

Logic phải nằm trong domain/use case

Đúng tinh thần Hexagonal Architecture

VI. SO SÁNH & ALTERNATIVES

1. Vì sao cần so sánh kiến trúc?

Một kiến trúc chỉ có ý nghĩa khi đặt trong bối cảnh.
Hexagonal Architecture không phải lúc nào cũng là lựa chọn tốt nhất, và mentor sẽ muốn biết:

“Vì sao em chọn Hexagonal cho bài này, mà không phải kiến trúc khác?”

Phần này nhằm:

Thể hiện khả năng đánh giá và ra quyết định

Tránh tư duy “architecture theo trend”

Giải thích trade-off, không thần thánh hóa Hexagonal

2. So sánh với Layered Architecture
   Layered Architecture là gì?

Layered Architecture thường chia hệ thống thành:

Presentation (UI / CLI)

Service

Repository

Database

Luồng phụ thuộc:

UI → Service → Repository → Database

Điểm mạnh của Layered Architecture

Dễ hiểu

Phù hợp project nhỏ

Setup nhanh

Hạn chế so với Hexagonal Architecture

Business logic thường phụ thuộc:

ORM

Database

Khó test domain độc lập

Khi đổi công nghệ:

Thay đổi lan rộng

So sánh trực tiếp
Tiêu chí Layered Hexagonal
Domain độc lập ❌ ✅
Test domain không cần DB ❌ ✅
Dễ thay storage ❌ ✅
Độ phức tạp Thấp Trung bình

👉 Với Ticket Manager CLI:
Layered chạy được, nhưng khó mở rộng và test.

3. So sánh với Clean Architecture
   Clean Architecture là gì?

Clean Architecture (Robert C. Martin) tập trung vào:

Domain / Entities

Use Cases

Interface Adapters

Frameworks

Về bản chất:

Clean Architecture và Hexagonal Architecture chia sẻ cùng triết lý.

Điểm giống nhau

Dependency hướng vào trong

Domain là trung tâm

Testability cao

Điểm khác nhau
Tiêu chí Clean Hexagonal
Trình bày Vòng tròn Ports & Adapters
Trọng tâm Use cases Domain interaction
Tính trực quan Trung bình Cao

👉 Hexagonal dễ giải thích hơn trong bối cảnh CLI.

4. So sánh với Onion Architecture
   Onion Architecture là gì?

Onion Architecture cũng xoay quanh domain, gồm:

Domain Model

Domain Services

Application Services

Infrastructure

So sánh nhanh
Tiêu chí Onion Hexagonal
Domain 중심 ✅ ✅
Ports rõ ràng ⚠️ ✅
Adapter explicit ❌ ✅

Hexagonal nhấn mạnh Ports & Adapters rõ ràng hơn, phù hợp khi cần thay đổi IO.

5. Microservices Architecture (so sánh ở mức khái niệm)
   Microservices có phải alternative trực tiếp không?

Không.

Microservices là kiến trúc hệ thống

Hexagonal là kiến trúc bên trong một service

Hai khái niệm không cùng cấp độ.

Mối quan hệ đúng

Một microservice có thể được thiết kế theo Hexagonal Architecture

Hexagonal giúp:

Mỗi service clean

Dễ test

Dễ thay adapter

6. Khi nào nên sử dụng Hexagonal Architecture?
   Phù hợp khi:

Có business logic rõ ràng

Cần test nghiêm túc

Có khả năng thay đổi:

Storage

UI

Project sống lâu

Không nên dùng khi:

Script nhỏ, one-off

Không có domain logic

Deadline cực gấp, team chưa quen

7. Vì sao Hexagonal phù hợp với Ticket Manager CLI?

Có domain rõ:

Ticket

Status

Có IO thay đổi được:

JSON → DB

Có use case cụ thể

Cần thể hiện tư duy kiến trúc

👉 Hexagonal Architecture đủ “đúng”, không quá nặng, phù hợp bài intern có mentor kỹ.

VII. COMMON MISUNDERSTANDINGS & ANTI-PATTERNS 🚫

1. Hexagonal Architecture ≠ Layered Architecture + Interfaces
   Hiểu sai phổ biến

Nhiều người nghĩ:

“Hexagonal Architecture chỉ là Layered Architecture, nhưng thêm interface cho repository.”

❌ Sai bản chất.

Vì sao sai?

Trong Layered Architecture:

Domain thường:

Gọi repository cụ thể

Biết database / ORM

Interface chỉ đóng vai trò kỹ thuật

Trong Hexagonal Architecture:

Domain định nghĩa Ports

Adapters phải phù hợp với Domain

Dependency bị đảo chiều hoàn toàn

👉 Nếu chỉ thêm interface nhưng:

Interface nằm trong infrastructure

Domain vẫn phụ thuộc adapter

➡️ Đó không phải Hexagonal Architecture.

Dấu hiệu nhận biết

Interface nằm trong adapters/ hoặc infrastructure/

Domain import repository implementation

Domain biết chi tiết lưu trữ

2. Đưa Business Logic vào Adapter
   Anti-pattern phổ biến

CLI validate status hợp lệ

File adapter từ chối update ticket “sai luật”

Controller quyết định nghiệp vụ

❌ Đây là vi phạm nghiêm trọng.

Vì sao nguy hiểm?

Business rules bị phân tán

Mỗi adapter có thể xử lý khác nhau

Domain không còn là nguồn sự thật duy nhất

Cách đúng

Adapter:

Parse input

Map dữ liệu

Gọi port

Domain:

Quyết định đúng/sai

3. Đặt Ports trong Infrastructure
   Hiểu sai thường gặp

Một số codebase:

infrastructure/
└── TicketRepository.ts (interface)

Và domain import interface này.

❌ Vi phạm Hexagonal Architecture.

Lý do

Interface là luật chơi

Luật phải do domain đặt ra

Infrastructure không có quyền quyết định luật

👉 Đúng:

domain/
└── ports/
└── TicketRepository.ts

4. Adapter gọi trực tiếp Adapter khác
   Anti-pattern nguy hiểm

Ví dụ:

CLI gọi FileAdapter

FileAdapter gọi APIAdapter

❌ Adapter chaining.

Vì sao sai?

Adapter không được biết adapter khác

Mọi tương tác phải thông qua:

Domain

Ports

Cách đúng

Adapter → Use Case

Use Case → Port

Port → Adapter

5. Domain biết chi tiết kỹ thuật
   Ví dụ sai

Domain import fs

Domain biết JSON structure

Domain dùng thư viện logging kỹ thuật

❌ Domain đã bị ô nhiễm.

Rule kiểm tra

Nếu xóa folder adapters/ mà domain không compile → sai.

6. Over-engineering cho project nhỏ
   Biểu hiện

Quá nhiều abstraction

Tạo hàng loạt interface không cần thiết

Use Case chỉ gọi 1 method nhưng vẫn bọc nhiều lớp

Vì sao nguy hiểm?

Code khó đọc

Intern-level project nhưng enterprise-level complexity

Mentor sẽ hỏi:

“Em làm thế này để giải quyết vấn đề gì?”

Cách tránh

Chỉ tạo abstraction khi:

Có lý do rõ ràng

Có khả năng thay đổi trong tương lai

7. Nhầm lẫn Hexagonal Architecture với Framework
   Hiểu sai

Dùng NestJS là Hexagonal

Dùng Spring Boot là Hexagonal

❌ Framework không quyết định kiến trúc.

Thực tế

Có thể dùng Hexagonal không framework

Có thể dùng framework nhưng không phải Hexagonal

Kiến trúc là:

Cách tổ chức code

Cách kiểm soát dependency

8. “Clean Domain” trên lý thuyết, bẩn trong thực tế
   Dấu hiệu

Domain import type từ adapter

Domain dùng DTO của CLI

Use case biết chi tiết JSON

❌ Vi phạm âm thầm nhưng rất nguy hiểm.

Mentor thường hỏi

“Nếu ngày mai bỏ CLI, domain có bị ảnh hưởng không?”

Nếu trả lời:

“Có” → kiến trúc sai

“Không” → kiến trúc đúng

9. Áp dụng trực tiếp vào Ticket Manager CLI
   Những lỗi cần tránh

Để CLI validate business rules

Để FileAdapter quyết định logic

Để domain phụ thuộc fs

VIII. AI WORKFLOW & DECISION LOG 🤖

1. Vai trò của AI trong project này

Trong project Ticket Manager CLI, AI không được sử dụng như “người viết code thay”, mà đóng vai trò:

Công cụ hỗ trợ nghiên cứu

Công cụ gợi ý phương án

Công cụ phản biện và kiểm tra lại tư duy

Nguyên tắc cốt lõi (đúng theo Week 1 – AI Training):

AI có thể đề xuất, nhưng con người phải đánh giá, chọn lọc và chịu trách nhiệm.

Mọi nội dung do AI gợi ý đều phải:

Được kiểm tra logic

Được đối chiếu với yêu cầu bài toán

Được xác nhận là phù hợp Hexagonal Architecture

2. Layered Questioning Workflow

(Research → Brief → Example → Validation)

Workflow này được sử dụng xuyên suốt Phase 1 – Research.

2.1 Research – Nghiên cứu mở

Ở bước này, AI được sử dụng để:

Thu thập thông tin về:

Hexagonal Architecture

Ports & Adapters

Lịch sử, khái niệm, nguyên tắc

Mục tiêu:

Có bức tranh tổng thể

Không áp dụng ngay vào code

⚠️ Lưu ý:

Không tin ngay mọi câu trả lời

Xem AI như nguồn tổng hợp, không phải nguồn chân lý

2.2 Brief – Tóm tắt có chọn lọc

Sau khi có thông tin thô, bước tiếp theo là:

Tóm tắt lại theo ngôn ngữ của bản thân

Loại bỏ:

Khái niệm không cần cho CLI

Nội dung quá enterprise-level

Ví dụ:

Giữ:

Domain

Ports

Adapters

Dependency Rule

Loại bỏ:

Event Sourcing

Distributed Systems

Advanced CQRS

👉 Việc loại bỏ cũng là một quyết định có chủ đích, không phải thiếu sót.

2.3 Example – Gắn với bài toán cụ thể

Mọi khái niệm chỉ được giữ lại nếu:

Có thể map trực tiếp vào Ticket Manager CLI

Ví dụ:

“Primary Adapter” → CLI

“Secondary Adapter” → File JSON storage

“Primary Port” → Use Case như CreateTicket

“Secondary Port” → TicketRepository

Nếu một khái niệm:

Không gắn được vào Ticket Manager
➡️ Không đưa vào tài liệu

2.4 Validation – Kiểm chứng và phản biện

Ở bước này, AI được dùng để:

Đặt câu hỏi ngược lại:

“Thiết kế này có vi phạm Hexagonal không?”

“Domain có bị phụ thuộc không?”

Phát hiện các điểm:

Over-engineering

Hiểu sai thuật ngữ

Mọi nội dung cuối cùng trong document:

Phải tự giải thích được

Phải trả lời được mentor mà không cần AI

3. Solution Exploration Workflow

(Explore → Compare → Decide)

Workflow này được dùng khi có nhiều phương án hợp lệ.

3.1 Explore – Khám phá các phương án

Ví dụ trong project:

Lưu ticket bằng:

In-memory

JSON file

Database

Tổ chức project theo:

Layered

Clean Architecture

Hexagonal Architecture

AI được dùng để:

Liệt kê phương án

Chỉ ra ưu / nhược điểm

3.2 Compare – So sánh trong bối cảnh cụ thể

Các phương án được so sánh dựa trên:

Scope bài intern

Yêu cầu mentor kỹ thuật

Deadline

Mục tiêu học Hexagonal Architecture

Ví dụ:

Database → quá nặng

In-memory → không thể hiện rõ adapter

JSON file → đủ đơn giản, đúng mục tiêu

3.3 Decide – Quyết định có lý do

Quyết định cuối cùng:

JSON file + File Adapter

CLI thuần, không framework nặng

Hexagonal Architecture thay vì Layered

Mỗi quyết định đều có:

Lý do rõ ràng

Trade-off được chấp nhận

👉 Điều quan trọng:

Không có quyết định nào chỉ vì “AI nói thế”.

4. Iterative Refinement Workflow

(Review → Improve → Validate)

Workflow này được áp dụng liên tục, không chỉ một lần.

4.1 Review – Rà soát lại đề xuất của AI

Mỗi khi AI đề xuất:

Thêm abstraction

Thêm pattern

Thêm framework

Người thực hiện sẽ tự hỏi:

Có thật sự cần không?

Có phục vụ mục tiêu bài toán không?

4.2 Improve – Điều chỉnh cho phù hợp

Ví dụ:

AI gợi ý thêm CQRS → loại bỏ

AI gợi ý thêm Event Sourcing → loại bỏ

AI gợi ý framework CLI → giữ CLI thuần

Mục tiêu:

Giữ kiến trúc đúng nhưng không nặng

4.3 Validate – Xác nhận lần cuối

Một quyết định chỉ được giữ nếu:

Không vi phạm Hexagonal Architecture

Không làm domain phụ thuộc

Có thể giải thích với mentor

5. Decision Log – Một số quyết định tiêu biểu
   Quyết định 1: Chọn Hexagonal Architecture

Vì:

Thể hiện tư duy kiến trúc

Domain-centric

Dễ test, dễ mở rộng

Quyết định 2: Không dùng framework

Vì:

Tránh coupling không cần thiết

Thể hiện kiến trúc rõ ràng hơn

Quyết định 3: Không đưa advanced topics vào doc

Vì:

Không implement

Dễ bị mentor hỏi ngược

Không phù hợp scope intern
