# Ads Learning Hub - Phase 0 Foundation Lock

## 1. Mục đích của file này

File này là biên bản khóa `Giai đoạn 0`.

Nó không thay thế các tài liệu nền khác, mà dùng để:

- xác nhận những gì đã được chốt
- ghi rõ cái gì không được tự ý đổi
- xác định điều kiện chính thức để bắt đầu `Giai đoạn 1`
- tạo điểm kiểm soát rõ ràng cho quản lý dự án

Nếu có thay đổi lớn sau khi file này được tạo, phải cập nhật lại file này thay vì chỉ sửa rải rác các tài liệu khác.

## 2. Trạng thái phase

- Phase: `0`
- Tên phase: `Chuẩn bị và khóa nền tảng`
- Trạng thái hiện tại: `LOCKED`
- Quyết định chuyển phase: `Có thể bắt đầu Giai đoạn 1`

## 3. Bộ tài liệu nền đã khóa

Các tài liệu nền đang là nguồn sự thật chính thức:

1. `docs/foundation/README.md`
2. `docs/foundation/website-master-sitemap.md`
3. `docs/foundation/mvp-detailed-plan.md`
4. `docs/foundation/project-technical-architecture.md`
5. `docs/foundation/design-style-guide.md`
6. `docs/foundation/development-phases-detailed.md`
7. `docs/foundation/phase-0-foundation-lock.md`

## 4. Các quyết định đã chốt trong phase 0

### 4.1 Phạm vi sản phẩm

Đã chốt:

- sản phẩm là một nền tảng học ads cho người Việt
- tập trung vào `Facebook Ads`, `TikTok Ads`, `Shopee Ads`
- MVP bao gồm public website, learning hub, quiz, practice hub, student dashboard và admin panel

Chưa làm ở MVP:

- community
- comments
- certificates
- advanced billing
- advanced simulator engine
- AI mentor

### 4.2 Kiến trúc kỹ thuật

Đã chốt:

- `1 repo`
- `1 codebase full-stack`
- `Next.js App Router + React + TypeScript`
- `PostgreSQL + Prisma`
- `Auth.js`
- `Tailwind CSS + shadcn/ui`
- `REST API có versioning`

Chưa làm ở MVP:

- microservices
- backend tách riêng
- GraphQL
- headless CMS nặng làm lõi hệ thống

### 4.3 Quy chuẩn ngôn ngữ

Đã chốt:

- giao diện người dùng dùng `tiếng Việt UTF-8`
- lesson, quiz, simulator, dashboard, blog, wiki dùng `tiếng Việt`
- toàn bộ thuật ngữ chuyên ngành riêng của ngành ads giữ nguyên tiếng Anh
- code, table name, API path, enum, biến trong source code vẫn dùng tiếng Anh

### 4.4 Quy chuẩn tổ chức dự án

Đã chốt:

- bộ tài liệu nền nằm tập trung trong `docs/foundation`
- README trong thư mục này là điểm vào duy nhất
- mọi phase phát triển phải bám theo `development-phases-detailed.md`
- mọi thay đổi nền phải sửa cả tài liệu liên quan, không sửa miệng

## 5. Checklist khóa phase 0

### 5.1 Tài liệu bắt buộc

- [x] Có sitemap tổng thể
- [x] Có phạm vi MVP
- [x] Có technical architecture
- [x] Có design style guide
- [x] Có roadmap chi tiết theo phase
- [x] Có README điều hướng tài liệu
- [x] Có biên bản khóa phase 0

### 5.2 Quyết định nền bắt buộc

- [x] Đã chốt đối tượng người dùng chính
- [x] Đã chốt role `guest`, `student`, `admin`
- [x] Đã chốt stack chính
- [x] Đã chốt database và ORM
- [x] Đã chốt hướng Docker
- [x] Đã chốt quy chuẩn tiếng Việt UTF-8
- [x] Đã chốt nguyên tắc giữ nguyên thuật ngữ ads

### 5.3 Quyết định quản trị phạm vi

- [x] Đã phân biệt rõ full product và MVP
- [x] Đã xác định rõ cái gì chưa làm ở MVP
- [x] Đã xác định rõ thứ tự đọc và ra quyết định
- [x] Đã xác định rõ thứ tự triển khai theo phase

## 6. Các thay đổi bị coi là thay đổi nền

Nếu thay đổi một trong các mục dưới đây, phải cập nhật tối thiểu:

- `project-technical-architecture.md`
- `development-phases-detailed.md`
- `phase-0-foundation-lock.md`

Các thay đổi nền gồm:

- đổi framework chính
- đổi database
- đổi ORM
- đổi cách tổ chức repo
- đổi role chính của MVP
- đổi quy chuẩn ngôn ngữ sản phẩm
- thêm tính năng lớn vào MVP
- bỏ một cụm tính năng cốt lõi khỏi MVP

## 7. Điều kiện để chính thức qua giai đoạn 1

Được phép qua `Giai đoạn 1: Dựng nền kỹ thuật` khi tất cả điều kiện sau là đúng:

- không còn tranh luận mở về stack nền
- không còn tranh luận mở về phạm vi MVP
- các tài liệu nền không mâu thuẫn nhau
- team có thể dùng `README.md` trong `docs/foundation` làm điểm vào chung
- đã chốt nguyên tắc tiếng Việt UTF-8 và giữ nguyên thuật ngữ ngành ads

## 8. Điều không được làm sau khi phase 0 đã khóa

- không tự ý đổi stack giữa chừng mà không cập nhật tài liệu nền
- không thêm feature vào MVP chỉ vì phát sinh ý tưởng mới
- không dùng tiếng Anh cho giao diện người dùng cuối nếu chưa được chốt lại
- không dịch các thuật ngữ ads chuyên ngành sang tiếng Việt theo cách tùy hứng
- không bắt đầu code phase 1 mà bỏ qua tài liệu nền

## 9. Khuyến nghị vận hành sau phase 0

Khi bước sang `Giai đoạn 1`, mọi task kỹ thuật mới nên được đối chiếu theo trình tự:

1. có nằm trong sitemap không
2. có thuộc MVP không
3. có đúng kiến trúc đã chốt không
4. có đúng quy chuẩn ngôn ngữ và UI không
5. có đúng phase hiện tại không

## 10. Kết luận

`Giai đoạn 0` hiện được xem là đã hoàn thành ở mức tài liệu và nguyên tắc quản trị.

Điều này có nghĩa:

- đã có thể bắt đầu dựng code
- nhưng mọi thay đổi nền sau thời điểm này phải được kiểm soát như một quyết định kiến trúc, không phải thay đổi nhỏ
