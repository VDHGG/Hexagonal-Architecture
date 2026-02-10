# 🏗️ HEXAGONAL ARCHITECTURE

---

## I. GIỚI THIỆU & TỔNG QUAN

### 1️⃣ Hexagonal Architecture là gì?

#### **Định nghĩa Cơ Bản**

**Hexagonal Architecture** là một kiến trúc phần mềm được thiết kế để:

- 🎯 **Tách biệt hoàn toàn** lõi nghiệp vụ (**business logic**) khỏi các yếu tố bên ngoài

**Những yếu tố bên ngoài bao gồm:**

- 🖥️ **Giao diện người dùng** (CLI, Web, API)
- 💾 **Cơ chế lưu trữ** (File, Database)
- 📦 **Framework, thư viện kỹ thuật**
- 🌐 **Hạ tầng** (Infrastructure)

#### **💡 Trọng Tâm Cốt Lõi**

> **Business logic không biết và không phụ thuộc** vào cách hệ thống được sử dụng hoặc triển khai.
>
> Thay vì để application **"xoay quanh"** database hay UI, **Hexagonal Architecture** đặt **Domain Core** vào trung tâm, và mọi tương tác với bên ngoài đều phải đi qua **Ports** và **Adapters**.

---

Hexagonal Architecture còn được biết đến với tên gọi:

### **🔗 Ports and Adapters Pattern**

Tên gọi này phản ánh **đúng bản chất** hơn "hexagonal":

| Khái Niệm    | Định Nghĩa                                                                              |
| ------------ | --------------------------------------------------------------------------------------- |
| **Ports**    | Các interface định nghĩa cách hệ thống được sử dụng hoặc cung cấp dữ liệu               |
| **Adapters** | Các thành phần hiện thực hóa (implement) các ports đó để kết nối với thế giới bên ngoài |

> 💫 **Hexagonal Architecture** và **Ports & Adapters** là cùng một khái niệm, chỉ khác cách gọi.

---

#### **🎯 Mục Tiêu Cốt Lõi**

Hexagonal Architecture hướng tới các mục tiêu sau:

| Mục Tiêu                        | Mô Tả                                                                    |
| ------------------------------- | ------------------------------------------------------------------------ |
| **Decoupling** (Giảm phụ thuộc) | Domain không phụ thuộc UI, DB, framework                                 |
| **Testability**                 | Có thể test business logic mà không cần file system, database, CLI       |
| **Flexibility**                 | Có thể thay đổi: JSON file → Database; CLI → Web API mà không sửa domain |
| **Long-term Maintainability**   | Code dễ đọc, dễ bảo trì, dễ mở rộng                                      |

---

### 2️⃣ Tại Sao Cần Hexagonal Architecture?

#### **❌ Vấn Đề Của Kiến Trúc Truyền Thống (Layered Architecture)**

Trong kiến trúc phân lớp truyền thống (**UI → Service → Repository → Database**):

**Business logic thường:**

- ❌ Gọi trực tiếp repository
- ❌ Phụ thuộc ORM
- ❌ Phụ thuộc framework

**Domain logic bị "rò rỉ" sang:**

- ❌ Controller
- ❌ Service
- ❌ Infrastructure

**Hệ quả:**

- 🚨 Code khó test
- 🚨 Mỗi thay đổi nhỏ (DB, framework) kéo theo nhiều thay đổi lớn
- 🚨 Business logic không còn là trung tâm

---

#### **⛓️ Tight Coupling Và Hậu Quả**

**Tight Coupling** xảy ra khi: **Business logic biết chi tiết cách dữ liệu được lưu**

Service phụ thuộc trực tiếp vào:

- 📁 File system
- 🗄️ Database driver
- 🌐 External API

**Hậu quả:**

- ❌ Không thể test domain độc lập
- ❌ Mock khó hoặc không thể mock
- ❌ Refactor tốn kém
- ❌ Code dễ **"vỡ dây chuyền"**

---

#### **✅ Hexagonal Architecture Giải Quyết Vấn Đề Này Như Thế Nào?**

**Hexagonal Architecture đảo ngược cách suy nghĩ:**

- Thay Vì : **"Domain gọi database"**
- Thì: **"Domain định nghĩa cách nó muốn lưu dữ liệu, còn bên ngoài phải phù hợp với domain"**

**Cụ thể:**

1. ✅ **Domain định nghĩa Ports** (interfaces)
2. ✅ **Adapters implement các Ports**
3. ✅ **Dependency luôn hướng vào trong**

---

### 3️⃣ Nhìn Hexagonal Architecture Ở Mức Cao (High-level View)

#### **📊 Sơ Đồ Tổng Quan**

```
                    ┌─────────────────┐
                    │      CLI        │
                    └────────┬────────┘
                             │
                    (Primary Adapter)
                             │
                    ┌────────▼────────┐
                    │  Use Case/Port  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Domain Core    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │Repository Port  │
                    └────────┬────────┘
                             │
                   (Secondary Adapter)
                             │
                    ┌────────▼────────┐
                    │   File / DB     │
                    └─────────────────┘
```

#### **🔄 Luồng Tương Tác Cơ Bản**

1. 👤 Người dùng nhập lệnh **CLI**
2. 🔌 **CLI** đóng vai trò **Primary Adapter**
3. 📤 **CLI** gọi **Primary Port** (Use Case)
4. ⚙️ **Use Case** xử lý nghiệp vụ trong **Domain**
5. 📥 **Domain** gọi **Secondary Port** (ví dụ: TicketRepository)
6. 💾 **Secondary Adapter** (File Adapter) thực hiện lưu / đọc dữ liệu

#### **💡 Domain Không Biết:**

- 🤷 Dữ liệu được lưu ở đâu
- 🤷 Có CLI hay không
- 🤷 Có JSON hay Database

---

#### **🔑 Điểm Quan Trọng Cần Nhớ**

**Hexagonal Architecture KHÔNG phải là:**

- ❌ Chỉ thêm interface cho repository
- ❌ Layered Architecture đổi tên folder

**Hexagonal Architecture LÀ:**

- ✅ Một **tư duy thiết kế**
- ✅ **Domain** đứng trung tâm
- ✅ Mọi phụ thuộc đều hướng vào **Domain**

---

## II. CÁC KHÁI NIỆM CỐT LÕI

### 1️⃣ Domain Core (Lõi Nghiệp Vụ)

#### **❓ Domain Là Gì?**

**Domain Core** là phần trung tâm của hệ thống, nơi chứa:

- 📋 **Nghiệp vụ cốt lõi**
- 📜 **Quy tắc kinh doanh** (business rules)
- 🎯 **Logic quyết định** điều gì hợp lệ / không hợp lệ

#### **🌟 Vị Trí Của Domain Trong Hexagonal Architecture**

Trong Hexagonal Architecture, **Domain được coi là:**

> 👑 **Thứ có giá trị nhất và cần được bảo vệ nhất** trong hệ thống.
> Mọi thứ khác (CLI, database, framework) chỉ tồn tại để **phục vụ Domain**.

---

#### **🔀 Business Rules vs Application Logic**

⚠️ **So sánh những nhầm lẫn có thể xảy ra:**
| ............Tiêu chí........... |.......**Business Rules (Domain Logic)**........|..............**Application Logic**.............|
| ------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| Bản chất......................->| Luật nghiệp vụ thuần túy.......................| Điều phối luồng xử lý |
| Phụ thuộc ngữ cảnh............->| ❌ Không phụ thuộc ngữ cảnh sử dụng............| ✅ Phụ thuộc vào cách ứng dụng được sử dụng |
| Phụ thuộc công nghệ...........->| ❌ Không phụ thuộc CLI, Web, DB, JSON..........| ✅ Phụ thuộc vào UI, adapter, framework |
| Mức độ ổn định................->| Rất ổn định, ít thay đổi.......................| Dễ thay đổi theo yêu cầu |
| Trách nhiệm chính.............->| Định nghĩa **cái gì là hợp lệ / không hợp lệ** | Định nghĩa **luồng xử lý diễn ra như thế nào** |
| Chứa business rules phức tạp..->| ✅ Có..........................................| ❌ Không nên |
| Gọi ports (repository, gateway).| ❌ Không trực tiếp.............................| ✅ Có |
| Biết về CLI / Web / HTTP......->| ❌ Không biết..................................| ✅ Biết |
| Khả năng tái sử dụng..........->| Rất cao (CLI, Web, API dùng chung).............| Thấp hơn, gắn với từng use case |
| Khả năng unit test............->| Dễ test, không cần mock adapter................| Test được nhưng cần mock ports |

---

#### **🏛️ Entities**

**Entity** là đối tượng có:

- 🆔 **Danh tính** (identity)
- 🔄 **Trạng thái có thể thay đổi** theo thời gian

**Ví Dụ Trong Ticket Manager:**

```
Ticket
├── id (Danh tính)
├── status (Trạng thái)
└── priority (Thuộc tính)
```

**🔑 Điểm Quan Trọng:**

> 💫 Hai ticket khác nhau không chỉ vì **dữ liệu khác**, mà vì **id khác**
> Entity **tự bảo vệ** trạng thái hợp lệ của chính nó
> ➡️ **Entity chứa logic, không phải chỉ là data holder**.

---

#### **💎 Value Objects**

**Value Object** là:

- 🔹 Không có identity
- 🔹 So sánh bằng giá trị
- 🔹 Thường là immutable

**Ví Dụ:**

- 🏷️ `TicketStatus`
- ⭐ `Priority`
- 🎫 `Tag`

**Nguyên Tắc:** -> Nếu hai value object có cùng giá trị → được coi là giống nhau.

**Trong CLI Nhỏ:**

- ✅ Value object có thể implement đơn giản
- ❌ **NHƯNG** không được để string rải rác khắp nơi

---

#### **⚙️ Domain Services**

**Domain Service được dùng khi:**

- Logic nghiệp vụ **không thuộc về** một entity cụ thể
- **Nhưng vẫn là** logic thuần domain

**Ví Dụ:**

- Kiểm tra ticket có thể chuyển từ status A → B hay không
- Validate một hành động liên quan nhiều entity

#### **⚠️ Lưu Ý:**

> Domain Service **KHÔNG được phụ thuộc infrastructure**
> ❌ Không gọi file system, database, console

---

#### **🚫 Nguyên Tắc Quan Trọng Nhất Của Domain**

```
Domain KHÔNG ĐƯỢC PHỤ THUỘC VÀO:
├── 📁 File system (fs)
├── 🗄️ Database
├── 💻 CLI / UI
├── 📦 Framework (NestJS, Express, etc.)
└── 🔧 Thư viện kỹ thuật không mang ý nghĩa domain
```

#### **Rule Kiểm Tra Nhanh:**

> ✅ **Nếu xóa toàn bộ adapters, domain vẫn compile và test được → ĐÚNG**
>
> ❌ Nếu không → CÓ VẤN ĐỀ

---

### 2️⃣ Ports (Cổng Giao Tiếp)

#### **🔌 Port Là Gì?**

**Port** là một **interface** mô tả:

- 🎯 Domain / Application cần gì từ bên ngoài
- 🎯 Hoặc cho phép bên ngoài gọi vào hệ thống như thế nào

> 💼 **Port không phải là implementation, mà là hợp đồng (contract)**.

---

#### **❓ Vì Sao Cần Ports?**

**Nếu không có Ports:**

- ❌ Domain phải gọi trực tiếp database / file
- ❌ Business logic biết chi tiết kỹ thuật
- ❌ Mất khả năng thay thế công nghệ

**Ports giúp:**

- ✅ Đảo chiều phụ thuộc
- ✅ **Domain định nghĩa luật chơi**
- ✅ **Bên ngoài phải "theo luật" của domain**

---

#### **🔀 Phân Loại Ports**

##### **🔴 Primary Ports (Driving Ports)**

Primary Port mô tả:

- 🎯 **Cách bên ngoài sử dụng hệ thống**
- 🎯 Thường là: **Use Cases**, **Application Services**

**Ví Dụ:**

- 🎫 `CreateTicketUseCase`
- 🎫 `UpdateTicketStatusUseCase`

**🔑 Quy Tắc:**

> CLI **KHÔNG** gọi domain trực tiếp, mà gọi **Primary Port**.

**📍 Nằm Trong:**

```
application/
└── use-cases/
    └── CreateTicket.ts
```

---

##### **🔵 Secondary Ports (Driven Ports)**

Secondary Port mô tả:

- 🎯 **Những gì domain cần từ bên ngoài**

**Ví Dụ:**

- 📦 `TicketRepository`
- 🆔 `IdGenerator`

**💬 Domain Nói:**

> "Tôi cần lưu ticket theo cách này, còn lưu ở đâu là việc của bạn."

**📍 Nằm Trong:**

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

---

#### **📋 Interface Segregation Principle (ISP)**

**Ports nên:**

- ✅ **Nhỏ** - tập trung vào một trách nhiệm
- ✅ **Tập Trung** - chỉ những gì thực sự cần
- ❌ **KHÔNG "God Interface"** - quá nhiều method

**Ví Dụ:**

| ❌ SAI                            | ✅ ĐÚNG                                    |
| --------------------------------- | ------------------------------------------ |
| Có TicketRepository với 20 method | Chỉ định nghĩa những gì domain thực sự cần |

---

#### **🔑 Nguyên Tắc Cực Kỳ Quan Trọng**

**Ports thuộc core (domain/application), KHÔNG thuộc adapters.**

- ✅ Interface được **định nghĩa bởi domain**
- ✅ **Adapters chỉ implement**, không định nghĩa luật

**❌ Nếu interface nằm trong infrastructure:**

```
infrastructure/
└── TicketRepository.ts (interface) ← ❌ SAI!
```

➡️ **Vi phạm Hexagonal Architecture**.

---

### 3️⃣ Adapters (Bộ Điều Hợp)

#### **🔧 Adapter Là Gì?**

**Adapter** là thành phần:

- 🎯 **Hiện thực hóa (implement) Ports**
- 🎯 **Chuyển đổi** giữa: **Thế giới bên ngoài ↔ Domain**

> ⚠️ **Adapter KHÔNG chứa business rules**.

---

#### **📝 Trách Nhiệm Của Adapter**

**Adapter có nhiệm vụ:**

- ✅ Parse input
- ✅ Map dữ liệu
- ✅ Gọi ports
- ✅ Chuyển output sang định dạng phù hợp

**Adapter KHÔNG được:**

- ❌ Validate business rules
- ❌ Quyết định logic nghiệp vụ

---

#### **🔀 Phân Loại Adapters**

##### **🔴 Primary Adapters**

**Primary Adapter là:**

- 🎯 **Điểm vào của hệ thống**

**Ví Dụ:**

- 💻 CLI
- 🌐 Web Controller (chỉ so sánh, không implement)

**Trong Project Này:**

```
adapters/primary/cli/
└── TicketsCommand.ts
```

- ✅ CLI đóng vai trò **Primary Adapter**
- ✅ CLI gọi **Primary Ports**

---

##### **🔵 Secondary Adapters**

**Secondary Adapter là:**

- 🎯 **Kết nối domain với bên ngoài**

**Ví Dụ:**

- 📁 File Storage Adapter (JSON)
- 🗄️ Database Adapter (nếu mở rộng)

**Trong Project Này:**

```
adapters/secondary/file/
└── FileTicketRepository.ts
```

- ✅ **Implement** `TicketRepository`
- ✅ **Biết** fs, JSON
- ✅ **Domain KHÔNG biết** adapter tồn tại

---

#### **💉 Dependency Injection**

**Adapters được:**

- ✅ **Inject** vào application tại **composition root**
- ❌ **KHÔNG** new trực tiếp trong domain

**Ví Dụ:**

```
main.ts (Composition Root)
├── Tạo adapter
├── Inject vào use case
└── Khởi chạy CLI
```

**Lợi Ích:**

- ✅ Dễ test
- ✅ Dễ thay thế adapter

---

#### **🚫 Rule Sống Còn Của Adapter**

> ⚠️ **ADAPTER PHỤC VỤ DOMAIN, KHÔNG ĐIỀU KHIỂN DOMAIN.**

**❌ Nếu adapter chứa logic nghiệp vụ:**

```
File Adapter tự quyết định validate logic
CLI tự kiểm tra business rules
```

---

## III. NGUYÊN TẮC & QUY TẮC THIẾT KẾ

### 1️⃣ Dependency Rule (Quy Tắc Phụ Thuộc)

#### **📌 Dependency Rule Là Gì?**

**Dependency Rule** là quy tắc cốt lõi của Hexagonal Architecture:

> 🔑 **Mọi dependency trong hệ thống phải hướng vào trong, về phía Domain Core.**

**Nói Cách Khác:**

```
Domain KHÔNG phụ thuộc vào:
├── Adapters
├── Infrastructure
└── Framework

Adapters phụ thuộc vào Domain (thông qua Ports)
```

> ⚠️ **Đây KHÔNG phải là quy ước folder, mà là quy tắc kiến trúc bắt buộc.**

---

#### **❓ Vì Sao Dependency Rule Quan Trọng?**

**Nếu Domain phụ thuộc vào:**

- 📁 File system
- 🗄️ Database
- 💻 CLI

**Thì:**

- ❌ Domain không thể test độc lập
- ❌ Mọi thay đổi kỹ thuật kéo theo thay đổi nghiệp vụ
- ❌ Business logic mất vai trò trung tâm

**Dependency Rule đảm bảo:**

- ✅ **Domain luôn "sạch"**
- ✅ **Thay đổi công nghệ không ảnh hưởng đến nghiệp vụ**

---

#### **🔄 Dependency Inversion Principle (DIP)**

**Dependency Rule được thực hiện thông qua Dependency Inversion Principle (D – trong SOLID):**

```
High-level modules (Domain, Use Cases)
    ↓ (phụ thuộc vào)
Abstraction (Ports/Interfaces)
    ↑ (phụ thuộc vào)
Low-level modules (File, DB)
```

**Trong Hexagonal Architecture:**

- 🔌 **Ports** chính là abstraction
- ✅ **Domain** định nghĩa abstraction
- ✅ **Adapters** implement abstraction

> 💫 **Đây là điểm khác biệt quan trọng so với layered architecture truyền thống.**

---

#### **⚙️ Inversion of Control (IoC)**

**Hexagonal Architecture sử dụng Inversion of Control:**

- ❌ Domain **KHÔNG** tự tạo adapter
- ✅ **Adapter được inject từ bên ngoài**

**Trong CLI Project:**

```
main.ts (Composition Root)
├── Mọi wiring xảy ra ở đây
└── Domain không biết:
    ├── Adapter được tạo như thế nào
    ├── Adapter là file, database hay mock
```

---

#### **🚀 Rule Kiểm Tra Nhanh**

**Hỏi 3 câu sau:**

| Câu Hỏi                                          | ✅ ĐÚNG              | ❌ SAI         |
| ------------------------------------------------ | -------------------- | -------------- |
| Domain có import từ fs, path, CLI library không? | Không                | Có             |
| Interface (Port) nằm trong đâu?                  | Domain / Application | Infrastructure |
| Adapter có thể thay mà domain không đổi không?   | Có                   | Không          |

---

### 2️⃣ Separation of Concerns (Phân Tách Trách Nhiệm)

#### **📌 Separation of Concerns Là Gì?**

**Separation of Concerns (SoC)** là nguyên tắc:

> 🎯 **Mỗi phần của hệ thống chỉ chịu trách nhiệm cho một mối quan tâm cụ thể.**

**Trong Hexagonal Architecture:**

```
Domain → Nghiệp vụ
Application → Điều phối use cases
Adapters → Kết nối kỹ thuật
```

---

#### **🔀 Business Logic vs Infrastructure**

| Khía Cạnh      | Business Logic                           | Infrastructure                        |
| -------------- | ---------------------------------------- | ------------------------------------- |
| **Quyết Định** | Điều gì hợp lệ? Điều gì không được phép? | Lưu file, Kết nối DB, Parse input CLI |
| **Nằm Trong**  | Entity, Domain Service, Use Case         | Adapter                               |
| **Đặc Điểm**   | Quyết định logic nghiệp vụ               | Không quyết định luật nghiệp vụ       |

---

#### **🚨 Lỗi Thường Gặp**

| ❌ SAI                                     | ✅ ĐÚNG                        |
| ------------------------------------------ | ------------------------------ |
| CLI kiểm tra status hợp lệ                 | Adapter chỉ truyền dữ liệu     |
| File adapter từ chối update sai trạng thái | Domain quyết định đúng/sai     |
| Business rule nằm trong adapter            | Business rule nằm trong domain |

**→ Vi phạm SoC**
**→ Business logic bị phân tán**

---

#### **⚙️ Configuration vs Implementation**

**Hexagonal Architecture tách:**

| Khía Cạnh          | Mô Tả                        |
| ------------------ | ---------------------------- |
| **Configuration**  | Wiring, dependency injection |
| **Implementation** | Logic thực thi               |

**Trong Project:**

```
main.ts (Configuration)
├── Tạo adapter
├── Inject vào use case
│
Domain / application (Implementation)
├── Không biết ai tạo adapter
└── Chỉ know về logic
```

**Lợi Ích:**

- ✅ Dễ test
- ✅ Dễ thay adapter bằng mock/fake

---

#### **🧪 Testing Concerns**

**Testing cũng là một concern riêng:**

| Khía Cạnh           | Chi Tiết                           |
| ------------------- | ---------------------------------- |
| **Domain Testing**  | Test logic; Không dùng fs, DB, CLI |
| **Adapter Testing** | Test IO; Test mapping              |

> 💡 **Hexagonal Architecture tạo điều kiện tự nhiên cho testing, không cần hack.**

---

### 3️⃣ Các Quy Tắc "Sống Còn" Khi Áp Dụng Hexagonal Architecture

#### **Rule 1️⃣: Domain Phải Độc Lập Tuyệt Đối**

✅ Có thể compile riêng
✅ Có thể test riêng
✅ Không import infrastructure

#### **Rule 2️⃣: Ports Định Nghĩa Bởi Domain / Application**

✅ KHÔNG định nghĩa interface trong adapter
✅ Adapter chỉ implement

#### **Rule 3️⃣: Adapter KHÔNG Chứa Business Logic**

✅ Adapter làm nhiệm vụ **"dịch"**
✅ KHÔNG làm nhiệm vụ **"quyết định"**

#### **Rule 4️⃣: Composition Root Nằm Ngoài Domain**

✅ Mọi wiring xảy ra ở một chỗ
✅ KHÔNG new adapter trong domain

#### **Rule 5️⃣: Đơn Giản Hơn Là Tốt Hơn**

✅ Không thêm abstraction nếu không cần
✅ Hexagonal Architecture KHÔNG yêu cầu phức tạp

---

### 4️⃣ Áp Dụng Trực Tiếp Vào Ticket Manager CLI

#### **✅ Ví Dụ Luồng Đúng**

```
1. CLI nhận lệnh: tickets create
2. CLI parse input
3. CLI gọi CreateTicketUseCase
4. Use case gọi TicketRepository
5. File Adapter lưu JSON
```

**Không có bước nào:**

- ❌ Domain biết CLI
- ❌ Domain biết JSON

---

#### **❌ Ví Dụ Luồng Sai (Anti-pattern)**

```
1. CLI tự validate nghiệp vụ ← ❌
2. Use case import fs ← ❌
3. Repository nằm trong infrastructure nhưng interface cũng nằm ở đó ← ❌
```

➡️ **Trông có vẻ chạy được, nhưng vi phạm Hexagonal Architecture**

---

## IV. THIẾT KẾ DỰ ÁN TICKET MANAGER CLI

### 1️⃣ Phân Tích Yêu Cầu

#### **📋 Mô Tả Bài Toán**

Xây dựng một **CLI Ticket Manager** cho phép người dùng:

- ✅ Tạo ticket
- ✅ Xem danh sách ticket
- ✅ Xem chi tiết một ticket
- ✅ Cập nhật trạng thái ticket

**💾 Dữ Liệu:**

> Dữ liệu ticket được lưu trữ cục bộ (local) dưới dạng **JSON file**.

---

#### **📝 Danh Sách Command**

Hệ thống hỗ trợ các command sau:

| Command               | Mô Tả                      |
| --------------------- | -------------------------- |
| `tickets create`      | Tạo ticket mới             |
| `tickets list`        | Xem danh sách ticket       |
| `tickets show <id>`   | Xem chi tiết một ticket    |
| `tickets update <id>` | Cập nhật trạng thái ticket |

> 💡 **Mỗi command tương ứng một hành động nghiệp vụ rõ ràng**, rất phù hợp để map sang **Use Case** trong Hexagonal Architecture.

---

#### **🎯 Xác Định Ranh Giới Hệ Thống**

**Bên Ngoài Hệ Thống:**

- 👤 Người dùng
- 💻 CLI
- 📁 File system

**Bên Trong Hệ Thống:**

- 🎫 Ticket (Domain Model)
- 📜 Business rules
- 🔄 Use cases

**🔑 Yêu Cầu Hexagonal Architecture:**

> Mọi tương tác giữa **"bên ngoài"** và **"bên trong"** đều phải đi qua **Ports**.

---

### 2️⃣ Áp Dụng Hexagonal Architecture Cho Bài Toán

#### **🏛️ Xác Định Domain Model**

##### **🎫 Entity: Ticket**

**Ticket là Entity cốt lõi của hệ thống, bao gồm:**

```
Ticket
├── id (Danh tính duy nhất)
├── title (Tiêu đề)
├── description (Mô tả)
├── status (Trạng thái)
├── priority (Ưu tiên)
└── tags (Nhãn)
```

**Vai Trò:**

- ✅ Nắm giữ trạng thái
- ✅ Bảo vệ tính hợp lệ của chính nó

**Ticket KHÔNG Biết:**

- ❌ CLI
- ❌ JSON
- ❌ File system

---

##### **💎 Value Objects**

**Một số thuộc tính của Ticket có thể được xem là Value Object:**

- 🏷️ `TicketStatus`
- ⭐ `Priority`

**Lợi Ích:**

- ✅ Tránh dùng string tự do
- ✅ Giảm bug do giá trị không hợp lệ
- ✅ Làm rõ business rules

---

#### **🔌 Xác Định Use Cases (Primary Ports)**

**Mỗi hành động nghiệp vụ chính tương ứng một Use Case:**

```
✅ CreateTicket
✅ ListTickets
✅ ShowTicket
✅ UpdateTicket
```

**Đặc Điểm:**

- 🎯 Đóng vai trò **Primary Port**
- 🎯 Được gọi bởi **CLI** (Primary Adapter)
- 🎯 Điều phối domain logic

---

#### **📦 Xác Định Secondary Ports**

**Domain cần các khả năng từ bên ngoài:**

```
✅ Lưu ticket
✅ Lấy danh sách ticket
✅ Tìm ticket theo id
✅ Cập nhật ticket
```

➡️ **Tất cả được mô tả qua `TicketRepository` interface.**

**Domain Chỉ Biết Interface, KHÔNG Biết:**

- ❌ Lưu bằng JSON
- ❌ Hay database

---

### 3️⃣ Cấu Trúc Thư Mục Dự Án (TypeScript)

#### **🗂️ Cấu Trúc Tổng Thể**

```
src/
├── domain/                          ← 🏛️ LÕIC NGHIỆP VỤ
│   ├── entities/
│   │   └── Ticket.ts
│   ├── value-objects/
│   │   ├── TicketStatus.ts
│   │   └── Priority.ts
│   └── ports/
│       └── TicketRepository.ts
│
├── application/                     ← ⚙️ ĐIỀU PHỐI
│   └── use-cases/
│       ├── CreateTicket.ts
│       ├── ListTickets.ts
│       ├── ShowTicket.ts
│       └── UpdateTicket.ts
│
├── adapters/                        ← 🔌 KẾT NỐI KỸ THUẬT
│   ├── primary/
│   │   └── cli/
│   │       └── TicketsCommand.ts
│   └── secondary/
│       └── file/
│           └── FileTicketRepository.ts
│
└── main.ts                          ← 🔗 COMPOSITION ROOT
```

---

#### **📖 Giải Thích Từng Layer**

##### **🏛️ `domain/`**

**Chứa:**

- ✅ Entity
- ✅ Value Objects
- ✅ Ports (interfaces)

**Quy Tắc:**

- ❌ KHÔNG import bất kỳ adapter nào
- ❌ KHÔNG biết JSON, CLI, fs

---

##### **⚙️ `application/`**

**Chứa:**

- ✅ Use cases
- ✅ Điều phối domain

**Quy Tắc:**

- ✅ Phụ thuộc domain
- ❌ KHÔNG phụ thuộc adapters

---

##### **🔌 `adapters/primary/`**

**Chứa:**

- ✅ CLI logic

**Trách Nhiệm:**

- ✅ Parse input
- ✅ Gọi use case

---

##### **🔌 `adapters/secondary/`**

**Chứa:**

- ✅ Hiện thực ports
- ✅ Làm việc với file system

**Trách Nhiệm:**

- ✅ Biết JSON
- ✅ Implement TicketRepository

---

##### **🔗 `main.ts`**

**Composition Root:**

**Trách Nhiệm:**

- ✅ Tạo adapter
- ✅ Inject adapter vào use case
- ✅ Khởi chạy CLI

---

### 4️⃣ Luồng Xử Lý Chi Tiết Một Command

#### **📝 Ví Dụ: `tickets create`**

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

**💡 Domain Không Biết:**

- ❌ Có CLI
- ❌ Có JSON
- ❌ Có file

---

### 5️⃣ Thiết Kế Để Mở Rộng Trong Tương Lai

**Hexagonal Architecture cho phép:**

- 🔄 Thay `FileTicketRepository` bằng `DatabaseTicketRepository`
- ➕ Thêm Web API adapter
- ✅ Giữ nguyên domain & use case

**Điều Cần Làm:**

- ✅ Viết adapter mới
- ❌ KHÔNG sửa domain

---

### 6️⃣ Những Quyết Định Thiết Kế Có Chủ Đích

#### **❓ Vì Sao Không Dùng Framework CLI Nặng?**

**Mục Tiêu:**

- 🎯 Giữ domain clean
- 🎯 Tránh phụ thuộc framework

**Vấn Đề Của Framework:**

- ⚠️ Gây coupling không cần thiết
- ⚠️ Che mất kiến trúc thật

---

#### **❓ Vì Sao Không Đưa Logic Vào CLI?**

**Vì:**

- 🎯 CLI chỉ là adapter
- 🎯 Logic phải nằm trong domain/use case
- 🎯 **Đúng tinh thần Hexagonal Architecture**

---

## VI. SO SÁNH & ALTERNATIVES

### 1️⃣ So Sánh Với Layered Architecture

#### **📌 Layered Architecture Là Gì?**

**Layered Architecture** thường chia hệ thống thành:

```
Presentation (UI / CLI)
    ↓
Service
    ↓
Repository
    ↓
Database
```

**Luồng Phụ Thuộc:**

```
UI → Service → Repository → Database
```

---

#### **✅ Điểm Mạnh Của Layered Architecture**

- ✅ Dễ hiểu
- ✅ Phù hợp project nhỏ
- ✅ Setup nhanh

---

#### **❌ Hạn Chế So Với Hexagonal Architecture**

**Business Logic Thường:**

- ❌ Phụ thuộc ORM
- ❌ Phụ thuộc Database
- ❌ Khó test domain độc lập

**Khi Đổi Công Nghệ:**

- ❌ Thay đổi lan rộng

---

#### **📊 So Sánh Trực Tiếp**

| Tiêu Chí                     | Layered | Hexagonal     |
| ---------------------------- | ------- | ------------- |
| **Domain Độc Lập**           | ❌      | ✅            |
| **Test Domain Không Cần DB** | ❌      | ✅            |
| **Dễ Thay Storage**          | ❌      | ✅            |
| **Độ Phức Tạp**              | 📉 Thấp | 📈 Trung Bình |

> 💡 **Với Ticket Manager CLI:** Layered chạy được, nhưng khó mở rộng và test.

---

### 2️⃣ So Sánh Với Clean Architecture

#### **📌 Clean Architecture Là Gì?**

**Clean Architecture (Robert C. Martin)** tập trung vào:

```
Domain / Entities
    ↓
Use Cases
    ↓
Interface Adapters
    ↓
Frameworks
```

**🔑 Về Bản Chất:**

> Clean Architecture và Hexagonal Architecture chia sẻ cùng triết lý.

---

#### **📊 So Sánh Nhanh**

| Tiêu Chí                 | Clean     | Hexagonal        |
| ------------------------ | --------- | ---------------- |
| **Domain 중심**          | ✅        | ✅               |
| **Dependency Vào Trong** | ✅        | ✅               |
| **Testability Cao**      | ✅        | ✅               |
| **Trình Bày**            | Vòng Tròn | Ports & Adapters |
| **Ports Rõ Ràng**        | ⚠️        | ✅               |

> 💡 **Hexagonal dễ giải thích hơn trong bối cảnh CLI.**

---

### 3️⃣ So Sánh Với Onion Architecture

#### **📌 Onion Architecture Là Gì?**

**Onion Architecture** cũng xoay quanh domain, gồm:

```
Domain Model (Tâm)
    ↓
Domain Services
    ↓
Application Services
    ↓
Infrastructure (Ngoài cùng)
```

---

#### **📊 So Sánh Nhanh**

| Tiêu Chí             | Onion | Hexagonal |
| -------------------- | ----- | --------- |
| **Domain 중심**      | ✅    | ✅        |
| **Ports Rõ Ràng**    | ⚠️    | ✅        |
| **Adapter Explicit** | ❌    | ✅        |

> 💡 **Hexagonal nhấn mạnh Ports & Adapters rõ ràng hơn**, phù hợp khi cần thay đổi IO.

---

### 4️⃣ Microservices Architecture

#### **❓ Microservices Có Phải Alternative Trực Tiếp Không?**

**Trả Lời: KHÔNG.**

- 🎯 **Microservices** = Kiến trúc **HỆ THỐNG**
- 🎯 **Hexagonal** = Kiến trúc **BÊN TRONG MỘT SERVICE**

**→ Hai khái niệm KHÔNG cùng cấp độ.**

---

#### **✅ Mối Quan Hệ Đúng**

> 🔗 Một **microservice** có thể được thiết kế theo **Hexagonal Architecture**

**Hexagonal Giúp:**

- ✅ Mỗi service clean
- ✅ Dễ test
- ✅ Dễ thay adapter

---

### 6️⃣ Khi Nào Nên Sử Dụng Hexagonal Architecture?

#### **✅ Phù Hợp Khi:**

- ✅ Có business logic rõ ràng
- ✅ Cần test nghiêm túc
- ✅ Có khả năng thay đổi: **Storage**, **UI**
- ✅ Project sống lâu

---

#### **❌ KHÔNG Nên Dùng Khi:**

- ❌ Script nhỏ, one-off
- ❌ KHÔNG có domain logic
- ❌ Deadline cực gấp, team chưa quen

---

---

## VII. COMMON MISUNDERSTANDINGS & ANTI-PATTERNS 🚫

### 1️⃣ Hexagonal ≠ Layered + Interfaces

#### **❌ Hiểu Sai Phổ Biến**

Nhiều người nghĩ:

> **"Hexagonal Architecture chỉ là Layered Architecture, nhưng thêm interface cho repository."**

**→ ❌ SAI BẢN CHẤT.**

---

#### **🔍 Vì Sao Sai?**

| Khía Cạnh     | Layered Architecture      | Hexagonal Architecture                |
| ------------- | ------------------------- | ------------------------------------- |
| **Domain**    | Gọi repository cụ thể     | **Định nghĩa Ports**                  |
| **Domain**    | Biết database / ORM       | **Adapters phải phù hợp với Domain**  |
| **Interface** | Chỉ đóng vai trò kỹ thuật | **Dependency bị đảo chiều hoàn toàn** |

---

#### **⚠️ Dấu Hiệu Nhận Biết**

```
❌ Interface nằm trong adapters/ hoặc infrastructure/
❌ Domain import repository implementation
❌ Domain biết chi tiết lưu trữ

→ Đó KHÔNG phải Hexagonal Architecture.
```

---

### 2️⃣ Đưa Business Logic Vào Adapter

#### **❌ Anti-pattern Phổ Biến**

```
❌ CLI validate status hợp lệ
❌ File adapter từ chối update ticket "sai luật"
❌ Controller quyết định nghiệp vụ

→ Đây là VI PHẠM NGHIÊM TRỌNG.
```

---

#### **⚠️ Vì Sao Nguy Hiểm?**

- ❌ Business rules bị phân tán
- ❌ Mỗi adapter có thể xử lý khác nhau
- ❌ Domain KHÔNG còn là **nguồn sự thật duy nhất**

---

#### **✅ Cách Đúng**

```
Adapter:
  ✅ Parse input
  ✅ Map dữ liệu
  ✅ Gọi port

Domain:
  ✅ Quyết định đúng/sai
```

---

### 3️⃣ Đặt Ports Trong Infrastructure

#### **❌ Hiểu Sai Thường Gặp**

```
infrastructure/
└── TicketRepository.ts (interface)

Và domain import interface này.

→ ❌ VI PHẠM HEXAGONAL ARCHITECTURE.
```

---

#### **🔍 Lý Do**

> **Interface là luật chơi**
>
> **Luật phải do domain đặt ra**
>
> **Infrastructure KHÔNG có quyền quyết định luật**

---

#### **✅ Đúng**

```
domain/
└── ports/
    └── TicketRepository.ts
```

---

### 4️⃣ Adapter Gọi Trực Tiếp Adapter Khác

#### **❌ Anti-pattern Nguy Hiểm**

```
CLI gọi FileAdapter
FileAdapter gọi APIAdapter

→ ❌ ADAPTER CHAINING.
```

---

#### **⚠️ Vì Sao Sai?**

> **Adapter KHÔNG được biết adapter khác**
>
> **Mọi tương tác phải thông qua:**
>
> - Domain
> - Ports
> - Adapter

---

#### **✅ Cách Đúng**

```
Adapter → Use Case
        ↓
    Use Case → Port
        ↓
    Port → Adapter
```

---

### 5️⃣ Domain Biết Chi Tiết Kỹ Thuật

#### **❌ Ví Dụ Sai**

```
❌ Domain import fs
❌ Domain biết JSON structure
❌ Domain dùng thư viện logging kỹ thuật

→ Domain đã BỊ Ô NHIỄM.
```

---

#### **🚀 Rule Kiểm Tra**

> **Nếu xóa folder adapters/ mà domain KHÔNG compile → SAI.**

---

### 6️⃣ Over-engineering Cho Project Nhỏ

#### **⚠️ Biểu Hiện**

- ❌ Quá nhiều abstraction
- ❌ Tạo hàng loạt interface không cần thiết
- ❌ Use Case chỉ gọi 1 method nhưng vẫn bọc nhiều lớp

---

#### **⚠️ Vì Sao Nguy Hiểm?**

- ❌ Code khó đọc
- ❌ Intern-level project nhưng enterprise-level complexity

---

#### **✅ Cách Tránh**

**Chỉ tạo abstraction khi:**

- ✅ Có lý do rõ ràng
- ✅ Có khả năng thay đổi trong tương lai

---

### 7️⃣ Nhầm Lẫn Hexagonal Với Framework

#### **❌ Hiểu Sai**

```
❌ Dùng NestJS → Hexagonal
❌ Dùng Spring Boot → Hexagonal

→ FRAMEWORK KHÔNG QUYẾT ĐỊNH KIẾN TRÚC.
```

---

#### **✅ Thực Tế**

- ✅ Có thể dùng Hexagonal KHÔNG framework
- ✅ Có thể dùng framework nhưng KHÔNG phải Hexagonal

**Kiến Trúc Là:**

- ✅ Cách tổ chức code
- ✅ Cách kiểm soát dependency

---

### 8️⃣ "Clean Domain" Trên Lý Thuyết, Bẩn Trong Thực Tế

#### **⚠️ Dấu Hiệu**

```
❌ Domain import type từ adapter
❌ Domain dùng DTO của CLI
❌ Use case biết chi tiết JSON

→ VI PHẠM ÂM THẦM NHƯNG RẤT NGUY HIỂM.
```

---

> **"Nếu ngày mai bỏ CLI, domain có bị ảnh hưởng không?"**

| Trả Lời     | Kết Luận             |
| ----------- | -------------------- |
| **"Có"**    | → Kiến trúc **SAI**  |
| **"Không"** | → Kiến trúc **ĐÚNG** |

---

### 9️⃣ Áp Dụng Trực Tiếp Vào Ticket Manager CLI

#### **🚫 Những Lỗi Cần Tránh**

```
❌ Để CLI validate business rules
❌ Để FileAdapter quyết định logic
❌ Để domain phụ thuộc fs
```

---

## VIII. AI WORKFLOW & DECISION LOG 🤖

### 1️⃣ Vai Trò Của AI Trong Project Này

**Trong project Ticket Manager CLI, AI KHÔNG được sử dụng như:**

> ❌ **"Người viết code hay research thay"**

**Mà đóng vai trò:**

- ✅ **Công cụ hỗ trợ nghiên cứu**
- ✅ **Công cụ gợi ý phương án**
- ✅ **Công cụ phản biện và kiểm tra lại tư duy**
- ✅ **Công cụ đánh giá tổng quan trước khi chốt các phương án**

---

#### **🔑 Nguyên Tắc Cốt Lõi**

> ⚠️ **AI có thể đề xuất, nhưng con người phải đánh giá, chọn lọc và chịu trách nhiệm.**

**Mọi nội dung do AI gợi ý đều phải:**

- ✅ Được kiểm tra logic
- ✅ Được đối chiếu với yêu cầu bài toán
- ✅ Được xác nhận là phù hợp Hexagonal Architecture

---

### 2️⃣ Layered Questioning Workflow

#### **(Research → Brief → Example → Validation)**

**Workflow này được sử dụng xuyên suốt Phase 1 – Research.**

---

#### **2.1️⃣ Research – Nghiên Cứu Mở**

**Ở bước này, AI được sử dụng để:**

- ✅ Thu thập thông tin về:
  - Hexagonal Architecture
  - Ports & Adapters
  - Lịch sử, khái niệm, nguyên tắc

**Mục Tiêu:**

- ✅ Có bức tranh tổng thể
- ❌ KHÔNG áp dụng ngay vào code

**⚠️ Lưu Ý:**

> **KHÔNG tin ngay mọi câu trả lời**
> **Xem AI như nguồn tổng hợp, KHÔNG phải nguồn chân lý**
> **Cung cấp rule + context + các nguồn thông tin cho AI trước khi bắt đầu**

---

#### **2.2️⃣ Brief – Tóm Tắt Có Chọn Lọc**

**Sau khi có thông tin thô, bước tiếp theo là:**

- ✅ Tóm tắt lại theo ngôn ngữ của bản thân
- ✅ Loại bỏ:
  - Khái niệm không cần cho CLI
  - Nội dung quá enterprise-level

**Ví Dụ:**

| Giữ             | Loại Bỏ             |
| --------------- | ------------------- |
| Domain          | Event Sourcing      |
| Ports           | Distributed Systems |
| Adapters        | Advanced CQRS       |
| Dependency Rule | -                   |

---

#### **2.3️⃣ Example – Gắn Với Bài Toán Cụ Thể**

**Mọi khái niệm chỉ được giữ lại nếu:**

- ✅ Có thể **map trực tiếp** vào Ticket Manager CLI

**Ví Dụ Mapping:**

| Khái Niệm         | Map Với                   |
| ----------------- | ------------------------- |
| Primary Adapter   | CLI                       |
| Secondary Adapter | File JSON storage         |
| Primary Port      | Use Case như CreateTicket |
| Secondary Port    | TicketRepository          |

---

---

#### **2.4️⃣ Validation – Kiểm Chứng Và Phản Biện**

**Ở bước này, AI được dùng để:**

- ✅ Đặt câu hỏi ngược lại:
  - "Thiết kế này có vi phạm Hexagonal không?"
  - "Domain có bị phụ thuộc không?"

- ✅ Phát hiện các điểm:
  - Over-engineering
  - Hiểu sai thuật ngữ

---

### 3️⃣ Solution Exploration Workflow

#### **(Explore → Compare → Decide)**

**Workflow này được dùng khi có nhiều phương án hợp lệ.**

---

#### **3.1️⃣ Explore – Khám Phá Các Phương Án**

**Ví Dụ Trong Project:**

**Lưu Ticket Bằng:**

- In-memory
- JSON file
- Database

**Tổ Chức Project Theo:**

- Hexagonal Architecture

**AI Được Dùng Để:**

- ✅ Liệt kê phương án
- ✅ Chỉ ra ưu / nhược điểm
- ✅ Theo dõi quy trình

---

#### **3.2️⃣ Compare – So Sánh Trong Bối Cảnh Cụ Thể**

**Các phương án được so sánh dựa trên:**

- 🎯 Scope bài đơn giản (local)
- 🎯 Yêu cầu kỹ thuật
- 🎯 Deadline
- 🎯 Mục tiêu học Hexagonal Architecture

**Ví Dụ:**

| Phương Án | Đánh Giá                      |
| --------- | ----------------------------- |
| Database  | ❌ Quá nặng                   |
| In-memory | ❌ KHÔNG thể hiện rõ adapter  |
| JSON file | ✅ Đủ đơn giản, đúng mục tiêu |

---

#### **3.3️⃣ Decide – Quyết Định Có Lý Do**

**Quyết Định Cuối Cùng:**

- ✅ JSON file + File Adapter
- ✅ CLI thuần, KHÔNG framework nặng
- ✅ Hexagonal Architecture thay vì Layered

**Mỗi Quyết Định Đều Có:**

- ✅ Lý do rõ ràng
- ✅ Trade-off được chấp nhận

---

### 4️⃣ Iterative Refinement Workflow

#### **(Review → Improve → Validate)**

**Workflow này được áp dụng liên tục, KHÔNG chỉ một lần.**

---

#### **4.1️⃣ Review – Rà Soát Lại Đề Xuất Của AI**

**Mỗi khi AI đề xuất:**

- Thêm abstraction
- Thêm pattern
- Thêm framework

**Người Thực Hiện Sẽ Tự Hỏi:**

- ❓ Có thật sự cần không?
- ❓ Có phục vụ mục tiêu bài toán không?

---

#### **4.2️⃣ Improve – Điều Chỉnh Cho Phù Hợp**

**Ví Dụ:**

| Gợi Ý               | Quyết Định       | Lý Do           |
| ------------------- | ---------------- | --------------- |
| Thêm CQRS           | ❌ Loại bỏ       | Quá phức tạp    |
| Thêm Event Sourcing | ❌ Loại bỏ       | Không implement |
| Framework CLI       | ✅ Giữ CLI thuần | Tránh coupling  |

**Mục Tiêu:**

- ✅ Giữ kiến trúc đúng nhưng KHÔNG nặng

---

#### **4.3️⃣ Validate – Xác Nhận Lần Cuối**

**Một quyết định chỉ được giữ nếu:**

- ✅ KHÔNG vi phạm Hexagonal Architecture
- ✅ KHÔNG làm domain phụ thuộc
- ✅ Phục vụ cho mục đích hoàn thành check list

---

### 5️⃣ Decision Log – Một Số Quyết Định Tiêu Biểu

#### **🎯 Quyết Định 1: Chọn Hexagonal Architecture**

**Vì:**

- ✅ Thể hiện tư duy kiến trúc
- ✅ Domain-centric
- ✅ Dễ test, dễ mở rộng

---

#### **🎯 Quyết Định 2: Không Dùng Framework**

**Vì:**

- ✅ Tránh coupling không cần thiết
- ✅ Thể hiện kiến trúc rõ ràng hơn

---

#### **🎯 Quyết Định 3: Không Đưa Advanced Topics Vào Doc**
