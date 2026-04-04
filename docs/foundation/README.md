# Ads Learning Hub - Foundation Docs README

## 1. Mục đích của file này

File này là điểm vào duy nhất cho bộ tài liệu nền của dự án.

Sau này khi bắt đầu làm việc, chỉ cần mở file này trước để biết:

- phải đọc tài liệu nào trước
- mỗi tài liệu dùng để quyết định điều gì
- phạm vi MVP hiện tại là gì
- định hướng kỹ thuật đang chốt là gì
- phong cách thiết kế và quy chuẩn ngôn ngữ của sản phẩm là gì
- roadmap triển khai chi tiết đang chia theo giai đoạn ra sao

## 2. Quy tắc đọc tài liệu

Thứ tự đọc chuẩn:

1. `website-master-sitemap.md`
2. `mvp-detailed-plan.md`
3. `project-technical-architecture.md`
4. `design-style-guide.md`
5. `development-phases-detailed.md`
6. `phase-0-foundation-lock.md`

## 3. Vì sao đọc theo thứ tự này

### Bước 1: Đọc sitemap trước

File: `website-master-sitemap.md`

Mục tiêu:

- hiểu toàn bộ cấu trúc website
- hiểu tất cả nhóm trang public, learning, practice, dashboard, admin
- nắm khung route và information architecture dài hạn

Khi cần trả lời câu hỏi:

- website có những khu nào
- route nào sẽ tồn tại
- phần nào thuộc public, student, admin

Thì đọc file này trước.

### Bước 2: Đọc MVP plan sau

File: `mvp-detailed-plan.md`

Mục tiêu:

- biết chính xác giai đoạn đầu phải làm gì trước
- biết cái gì nằm trong MVP
- biết cái gì chưa làm ở MVP
- biết user flow learner và admin tối thiểu

Khi cần trả lời câu hỏi:

- tuần này phải build phần nào
- phần nào chưa nên làm
- launch version đầu tiên gồm những gì

Thì đọc file này.

### Bước 3: Đọc technical architecture

File: `project-technical-architecture.md`

Mục tiêu:

- chốt stack frontend/backend
- chốt database, API, Docker, storage, cache
- chốt cấu trúc thư mục source code
- chốt hướng tổ chức module và service

Khi cần trả lời câu hỏi:

- dùng công nghệ gì
- nên đặt file ở đâu
- quản lý API, auth, database ra sao

Thì đọc file này.

### Bước 4: Đọc design style guide

File: `design-style-guide.md`

Mục tiêu:

- chốt phong cách giao diện
- chốt nguyên tắc content-first, education-first
- chốt cách thiết kế UI cho public pages, dashboard, admin, simulator
- chốt quy chuẩn ngôn ngữ hiển thị

Khi cần trả lời câu hỏi:

- website nên trông như thế nào
- viết copy ra sao
- dùng tiếng Việt như thế nào
- nên giữ thuật ngữ ads nào ở tiếng Anh

Thì đọc file này.

### Bước 5: Đọc roadmap chi tiết theo giai đoạn

File: `development-phases-detailed.md`

Mục tiêu:

- kiểm soát tiến độ theo phase
- biết từng phase phải có đầu ra gì
- biết điều kiện hoàn thành trước khi qua phase tiếp theo
- biết mốc chặn và rủi ro cần khóa

Khi cần trả lời câu hỏi:

- nên làm gì trước
- khi nào được chuyển phase
- thiếu gì để launch
- phase hiện tại còn blocker nào

Thì đọc file này.

### Bước 6: Đọc biên bản khóa phase 0

File: `phase-0-foundation-lock.md`

Mục tiêu:

- xác nhận phase 0 đã chốt những gì
- biết điều gì không được tự ý đổi
- biết có đủ điều kiện bắt đầu phase 1 hay chưa

Khi cần trả lời câu hỏi:

- phase 0 đã hoàn tất thật chưa
- thay đổi nào bị coi là thay đổi nền
- có được phép triển khai code chưa

Thì đọc file này.

## 4. Tóm tắt cực ngắn của 4 tài liệu

| File | Vai trò chính | Khi nào mở |
| --- | --- | --- |
| `website-master-sitemap.md` | Bản đồ toàn bộ website | Khi cần nhìn scope tổng thể |
| `mvp-detailed-plan.md` | Kế hoạch build phiên bản đầu tiên | Khi cần quyết định ưu tiên triển khai |
| `project-technical-architecture.md` | Kiến trúc kỹ thuật và cấu trúc code | Khi cần code, dựng hạ tầng, dựng API |
| `design-style-guide.md` | Ngôn ngữ thiết kế và quy chuẩn UI/content | Khi cần làm giao diện và nội dung |
| `development-phases-detailed.md` | Roadmap triển khai chi tiết theo giai đoạn | Khi cần kiểm soát tiến độ và mốc chặn |
| `phase-0-foundation-lock.md` | Biên bản khóa nền tảng và điều kiện qua phase 1 | Khi cần xác nhận phase 0 đã chốt xong |

## 5. Quy chuẩn ngôn ngữ của sản phẩm

Ads Learning Hub hiện chỉ phục vụ người dùng Việt Nam.

Quy chuẩn bắt buộc:

- toàn bộ giao diện hiển thị dùng `tiếng Việt UTF-8`
- toàn bộ lesson, quiz, simulator, dashboard, blog, wiki dùng `tiếng Việt`
- tên biến, tên bảng, API path, code symbol trong source code vẫn dùng tiếng Anh
- toàn bộ thuật ngữ chuyên ngành riêng của lĩnh vực ads giữ nguyên tiếng Anh, không dịch sang tiếng Việt

Danh sách như `CTR`, `CPM`, `CPC`, `CPA`, `ROAS`, `Pixel`, `Lookalike`, `Conversion` chỉ là ví dụ, không phải danh sách giới hạn.

## 6. Các giai đoạn phát triển dự án

Phiên bản tóm tắt nằm ở đây. Phiên bản chi tiết để kiểm soát chặt nằm trong:

- `development-phases-detailed.md`

### Giai đoạn 1: Nền móng hệ thống

Mục tiêu:

- khởi tạo codebase
- dựng cấu trúc thư mục chuẩn
- dựng auth cơ bản
- dựng PostgreSQL + Prisma
- dựng design system nền
- dựng layout public, dashboard và admin

Đầu ra mong đợi:

- project chạy local ổn định
- có login/register cơ bản
- có database migration đầu tiên
- có khung route chính

### Giai đoạn 2: MVP học tập cốt lõi

Mục tiêu:

- làm marketing pages
- làm learning paths
- làm courses, modules, lessons
- làm quiz cơ bản
- làm progress tracking cơ bản

Đầu ra mong đợi:

- người học có thể đăng ký
- vào course
- học lesson
- làm quiz
- xem tiến độ cơ bản

### Giai đoạn 3: MVP thực hành và vận hành

Mục tiêu:

- làm practice hub
- làm 2 simulator MVP đầu tiên
- làm admin CRUD cho content và learning
- làm admin CRUD cho simulator
- làm analytics summary cơ bản

Đầu ra mong đợi:

- admin có thể tạo và publish nội dung
- student có thể thực hành simulator
- hệ thống lưu kết quả quiz và simulator

### Giai đoạn 4: Launch-ready

Mục tiêu:

- tối ưu SEO
- tối ưu hiệu năng
- seed dữ liệu ban đầu
- hoàn thiện legal pages
- rà soát tracking, logging, error states
- test e2e các luồng chính

Đầu ra mong đợi:

- có thể đưa bản MVP lên staging rồi production
- dữ liệu ban đầu đủ để demo và dùng thật

### Giai đoạn 5: Mở rộng sau MVP

Mục tiêu:

- thêm Redis nếu cần
- thêm queue/background jobs
- mở rộng analytics
- thêm bookmarks, glossary, billing hoặc content nâng cao
- tối ưu search và media management

Đầu ra mong đợi:

- hệ thống ổn định hơn
- admin vận hành thuận hơn
- student có trải nghiệm học sâu hơn

## 7. Cách dùng bộ tài liệu này về sau

Nếu cần làm tính năng mới:

1. đọc `website-master-sitemap.md` để biết tính năng nằm ở khu nào
2. đọc `mvp-detailed-plan.md` để biết có thuộc MVP hay chưa
3. đọc `project-technical-architecture.md` để biết phải đặt code ở đâu và dùng stack nào
4. đọc `design-style-guide.md` để biết UI và content phải thể hiện ra sao
5. đọc `development-phases-detailed.md` để biết feature đó thuộc phase nào và có đang đúng thứ tự ưu tiên không

## 8. Kết luận ngắn

Nếu chỉ mở một file để bắt đầu làm việc, hãy mở file này trước.

Sau đó đi theo đúng thứ tự:

`website-master-sitemap.md` -> `mvp-detailed-plan.md` -> `project-technical-architecture.md` -> `design-style-guide.md` -> `development-phases-detailed.md` -> `phase-0-foundation-lock.md`
