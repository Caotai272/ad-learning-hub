# Ads Learning Hub - Technical Architecture

## 1. Mục tiêu của tài liệu

Tài liệu này là nguồn thống nhất để chốt:

- cấu trúc thư mục thực tế chúng ta sẽ triển khai
- ngôn ngữ và framework cho frontend và backend
- database, cache, storage và cách quản lý dữ liệu
- cách dùng Docker cho local, staging và production
- các mã nguồn mở nên tái sử dụng để tăng tốc phát triển
- cách quản lý API, phân quyền và versioning
- các luồng hoạt động chính của website cho guest, student và admin

Tài liệu này bám theo phạm vi đã xác định trong:

- `docs/foundation/mvp-detailed-plan.md`
- `docs/foundation/website-master-sitemap.md`

## 2. Quyết định kiến trúc tổng thể

### 2.1 Hướng triển khai

Chúng ta sẽ đi theo hướng:

- `1 repo`
- `1 ứng dụng web chính`
- `1 codebase TypeScript xuyên suốt frontend + backend`
- `1 database PostgreSQL trung tâm`

Không tách frontend và backend thành 2 repo riêng ở giai đoạn MVP.

Lý do:

- MVP cần tốc độ build nhanh hơn là chia nhỏ hạ tầng
- website có cả SEO pages, dashboard, admin, quiz, simulator và auth, nên dùng chung một codebase sẽ dễ đồng bộ hơn
- giảm chi phí CI/CD, auth, permission, type sharing và maintenance

### 2.2 Kiến trúc đề xuất

- Frontend: `Next.js App Router + React + TypeScript`
- Backend: `Next.js Route Handlers + Server Actions + TypeScript`
- ORM: `Prisma`
- Database: `PostgreSQL`
- Auth: `Auth.js`
- UI system: `Tailwind CSS + shadcn/ui`

Đây là kiến trúc full-stack thống nhất, phù hợp cho:

- marketing pages cần SEO
- learning pages cần render tốt và nhanh
- dashboard và admin cần thao tác dữ liệu sâu
- simulator cần business logic custom

### 2.3 Điều chưa nên làm ở MVP

Không nên làm ngay:

- microservices
- tách riêng NestJS backend
- GraphQL gateway
- Strapi hoặc headless CMS nặng cho toàn hệ thống
- Docker hóa toàn bộ quy trình dev ngay từ ngày đầu

Các hướng trên chỉ nên cân nhắc khi:

- team backend riêng đủ lớn
- traffic cao và có bottleneck thật
- cần nhiều worker hoặc external integrations phức tạp

## 3. Stack kỹ thuật chốt cho dự án

| Nhóm | Công nghệ chốt | Vai trò |
| --- | --- | --- |
| Frontend language | TypeScript | Đồng bộ type giữa UI và server |
| Frontend framework | Next.js App Router | SEO, SSR, routing, full-stack |
| UI | React | Thành phần giao diện |
| Styling | Tailwind CSS | Tốc độ build UI cao |
| Component base | shadcn/ui | Dùng source code mở, dễ tùy biến |
| Form | React Hook Form + Zod | Form ổn định, validate rõ ràng |
| Rich text editor | Tiptap | Soạn lesson, blog, wiki trong admin |
| Backend language | TypeScript | Một ngôn ngữ xuyên suốt hệ thống |
| Backend runtime | Node.js LTS | Runtime chính cho ứng dụng |
| API layer | Next.js Route Handlers | REST API nội bộ và external |
| DB | PostgreSQL | Quan hệ dữ liệu mạnh, phù hợp LMS |
| ORM | Prisma | Schema, migration, type-safe queries |
| Auth | Auth.js | Đăng nhập, session, provider integration |
| File storage | S3-compatible storage | Lưu media, thumbnail, tài liệu |
| Cache/queue | Redis (optional giai đoạn 2) | Rate limit, queue, cache nóng |
| Analytics | PostHog + bảng event nội bộ | Theo dõi hành vi và học tập |
| Test | Vitest + Playwright | Unit, integration, e2e |
| Package manager | pnpm | Nhanh, gọn, ổn định cho workspace |

### 3.1 Quy chuẩn ngôn ngữ sản phẩm

Toàn bộ sản phẩm hiện tại chỉ phục vụ người dùng Việt Nam.

Quy chuẩn bắt buộc:

- toàn bộ giao diện website dùng `tiếng Việt UTF-8`
- toàn bộ bài học, quiz, simulator, dashboard và admin hiển thị cho người dùng đều dùng `tiếng Việt`
- blog, wiki, learning paths, CTA, thông báo lỗi, empty state, email và hướng dẫn sử dụng cũng dùng `tiếng Việt`
- không dùng tiếng Anh cho label hoặc CTA giao diện nếu có thể viết rõ bằng tiếng Việt

Toàn bộ thuật ngữ chuyên ngành riêng của lĩnh vực ads được giữ nguyên tiếng Anh, không dịch sang tiếng Việt ở lớp hiển thị nội dung học tập hay giao diện chuyên môn.

Danh sách như `CTR`, `CPM`, `CPC`, `CPA`, `ROAS`, `Pixel`, `Lookalike`, `Conversion`, `Campaign`, `Ad Set`, `Creative`, `Audience`, `Retargeting`, `Attribution`, `Bid`, `Placement`, `Objective`, `Landing Page` chỉ là ví dụ, không phải giới hạn.

Quy tắc bổ sung:

- phần hiển thị cho người dùng cuối dùng tiếng Việt
- tên bảng DB, field, enum, API path, code symbol và biến trong source code vẫn dùng tiếng Anh để dễ bảo trì
- tránh dịch thuật ngữ ads sang tiếng Việt nếu cách dịch làm sai ngữ nghĩa hoặc lệch với cách người làm ngành đang dùng

## 4. Cấu trúc thư mục sẽ triển khai

```text
ad-learning-hub/
├─ docs/
│  ├─ foundation/
│  │  ├─ website-master-sitemap.md
│  │  ├─ mvp-detailed-plan.md
│  │  ├─ design-style-guide.md
│  │  └─ project-technical-architecture.md
│  ├─ database-schema.md
│  ├─ api-contract.md
│  └─ product-roadmap.md
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  └─ seeds/
├─ public/
│  ├─ images/
│  ├─ icons/
│  └─ simulator-assets/
├─ scripts/
│  ├─ seed.ts
│  ├─ create-admin.ts
│  └─ import-content.ts
├─ src/
│  ├─ app/
│  │  ├─ (marketing)/
│  │  │  ├─ page.tsx
│  │  │  ├─ about/
│  │  │  ├─ pricing/
│  │  │  ├─ contact/
│  │  │  ├─ blog/
│  │  │  ├─ wiki/
│  │  │  ├─ glossary/
│  │  │  ├─ terms/
│  │  │  └─ privacy/
│  │  ├─ (auth)/
│  │  │  ├─ login/
│  │  │  ├─ register/
│  │  │  ├─ forgot-password/
│  │  │  └─ reset-password/
│  │  ├─ (learning)/
│  │  │  ├─ learning-paths/
│  │  │  ├─ courses/
│  │  │  └─ lessons/
│  │  ├─ (practice)/
│  │  │  ├─ practice/
│  │  │  └─ simulators/
│  │  ├─ dashboard/
│  │  │  ├─ overview/
│  │  │  ├─ my-courses/
│  │  │  ├─ my-practice/
│  │  │  └─ settings/
│  │  ├─ admin/
│  │  │  ├─ dashboard/
│  │  │  ├─ content/
│  │  │  ├─ learning/
│  │  │  ├─ practice/
│  │  │  ├─ users/
│  │  │  ├─ analytics/
│  │  │  └─ settings/
│  │  ├─ api/
│  │  │  └─ v1/
│  │  │     ├─ auth/
│  │  │     ├─ public/
│  │  │     ├─ student/
│  │  │     ├─ admin/
│  │  │     └─ webhooks/
│  │  ├─ sitemap.ts
│  │  ├─ robots.ts
│  │  ├─ not-found.tsx
│  │  └─ layout.tsx
│  ├─ modules/
│  │  ├─ auth/
│  │  ├─ users/
│  │  ├─ blog/
│  │  ├─ wiki/
│  │  ├─ glossary/
│  │  ├─ learning-paths/
│  │  ├─ courses/
│  │  ├─ course-modules/
│  │  ├─ lessons/
│  │  ├─ quizzes/
│  │  ├─ simulators/
│  │  ├─ enrollments/
│  │  ├─ progress/
│  │  ├─ analytics/
│  │  └─ media/
│  ├─ components/
│  │  ├─ ui/
│  │  ├─ shared/
│  │  ├─ marketing/
│  │  ├─ learning/
│  │  ├─ practice/
│  │  ├─ dashboard/
│  │  └─ admin/
│  ├─ server/
│  │  ├─ auth/
│  │  ├─ db/
│  │  ├─ api/
│  │  ├─ permissions/
│  │  ├─ repositories/
│  │  ├─ services/
│  │  ├─ cache/
│  │  └─ events/
│  ├─ lib/
│  │  ├─ utils/
│  │  ├─ constants/
│  │  ├─ env/
│  │  └─ helpers/
│  ├─ hooks/
│  ├─ styles/
│  ├─ types/
│  ├─ config/
│  └─ content/
│     └─ seeds/
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  └─ e2e/
├─ infra/
│  └─ docker/
│     ├─ compose.yaml
│     ├─ postgres/
│     ├─ minio/
│     └─ mailpit/
├─ .env.example
├─ package.json
├─ README.md
└─ tsconfig.json
```

## 5. Quy tắc tổ chức code

### 5.1 Nguyên tắc

- route nằm ở `src/app`
- business domain nằm ở `src/modules`
- logic server dùng lại nhiều nơi nằm ở `src/server`
- component chia theo ngữ cảnh, không nhồi tất cả vào `components/common`
- schema DB chỉ đi qua `prisma/schema.prisma`

### 5.2 Cách chia domain

Mỗi module trong `src/modules` nên có cấu trúc gần giống nhau:

```text
src/modules/lessons/
├─ lesson.types.ts
├─ lesson.schema.ts
├─ lesson.repository.ts
├─ lesson.service.ts
├─ lesson.permissions.ts
└─ lesson.mapper.ts
```

Mục tiêu là:

- dễ test
- dễ thay đổi business logic
- tránh để route handler xử lý quá nhiều logic

## 6. Frontend sẽ dùng gì

### 6.1 Ngôn ngữ và framework

- `TypeScript`
- `React`
- `Next.js App Router`

### 6.2 Vì sao phù hợp

- marketing pages cần SEO và tốc độ index
- lesson, blog, wiki cần render tốt trên mobile
- dashboard và admin cần route-based layout rõ ràng
- App Router hỗ trợ tốt cho layout lồng nhau, server rendering và data fetching theo route

### 6.3 Cách xây frontend

- Public pages: ưu tiên `Server Components`
- Dashboard/Admin: dùng `Client Components` khi có form, table, tương tác mạnh
- Data fetching: ưu tiên fetch ở server với page/layout, chỉ dùng client fetching khi thực sự cần realtime hoặc tương tác tức thời
- UI system: tạo design tokens và component base ngay từ đầu, không dùng UI rời rạc

## 7. Backend sẽ dùng gì

### 7.1 Ngôn ngữ backend

Backend cũng dùng `TypeScript`.

### 7.2 Framework backend

Không dựng backend riêng ở MVP.

Ta sẽ dùng:

- `Next.js Route Handlers` cho REST API
- `Server Actions` cho các thao tác form nội bộ đơn giản
- `src/server/services` cho business logic

### 7.3 Khi nào cần tách backend riêng

Chỉ tách riêng khi xuất hiện một trong các trường hợp:

- mobile app hoặc third-party integrations tăng mạnh
- simulator engine trở nên nặng và cần scaling riêng
- background jobs, queue và analytics ingestion đủ lớn để tách service

## 8. Database, cache và storage

### 8.1 Database chính

Database chốt là `PostgreSQL`.

Lý do:

- dữ liệu quan hệ của course, lesson, quiz, progress, enrollments và admin CRUD rất phù hợp với SQL
- dễ kiểm soát transaction
- mạnh cho filtering, reporting, joins
- Prisma hỗ trợ PostgreSQL tốt

### 8.2 ORM và migration

Chúng ta dùng `Prisma` để quản lý:

- schema
- migration
- seeding
- type-safe client

Quy tắc:

- thay đổi DB luôn đi qua migration
- không sửa tay production schema ngoài Prisma migration
- mọi environment phải có `prisma migrate` rõ ràng

### 8.3 Nhóm bảng dữ liệu chính

Các nhóm bảng cốt lõi của MVP:

- `users`, `accounts`, `sessions`, `roles`
- `learning_paths`
- `courses`
- `course_modules`
- `lessons`
- `lesson_blocks`
- `quizzes`, `quiz_questions`, `quiz_choices`
- `quiz_attempts`, `quiz_answers`
- `simulators`, `simulator_scenarios`, `simulator_sessions`
- `enrollments`
- `lesson_progress`, `course_progress`
- `bookmarks`
- `blog_posts`, `wiki_articles`, `glossary_terms`
- `media_assets`
- `activity_events`

### 8.4 Cache

`Redis` chưa bắt buộc cho ngày đầu MVP.

Kế hoạch:

- Phase 1: chưa cần Redis
- Phase 2: thêm Redis cho rate limit, queue, session hot cache hoặc throttling

### 8.5 File storage

Media không nên lưu trực tiếp trong database.

Dùng:

- local dev: `MinIO`
- production: `S3-compatible storage` như Cloudflare R2 hoặc AWS S3

## 9. Quản lý dự án kỹ thuật ra sao

### 9.1 Môi trường

Tách rõ 3 môi trường:

- `local`
- `staging`
- `production`

Mỗi môi trường có:

- database riêng
- storage bucket riêng
- biến môi trường riêng
- domain riêng

### 9.2 Git workflow

Khuyến nghị:

- `main`: production-ready
- `develop`: staging integration
- `feature/*`: nhánh tính năng
- `fix/*`: nhánh sửa lỗi

### 9.3 Quy trình dữ liệu

- schema thay đổi qua Prisma migration
- dữ liệu mẫu qua `prisma/seeds`
- admin account đầu tiên tạo qua script riêng
- dữ liệu blog/wiki ban đầu có thể import từ seed JSON hoặc MDX

### 9.4 Quản lý nội dung

Nội dung chia thành 2 nhóm:

- Nội dung động trong DB: course, lesson, quiz, simulator, progress, user
- Nội dung bán tĩnh: legal pages, docs, seed content, hướng dẫn nội bộ

### 9.5 Logging và giám sát

Tối thiểu phải có:

- request log
- auth log
- error log
- event log cho quiz và simulator

## 10. Có nên dùng Docker không

### 10.1 Câu trả lời ngắn

Có, nhưng dùng đúng phạm vi.

### 10.2 Cách dùng khuyến nghị

Nên dùng Docker cho:

- PostgreSQL local
- MinIO local
- Mailpit local
- Redis local nếu cần

Không bắt buộc phải chạy app Next.js trong container trong giai đoạn đầu.

### 10.3 Vì sao

Nếu Docker hóa cả app quá sớm:

- dev loop chậm hơn
- hot reload phức tạp hơn trên máy một số thành viên
- tăng độ khó debug

Phương án tốt hơn:

- app chạy native trên máy dev
- services phụ chạy bằng `docker compose`

### 10.4 Khi nào nên containerize toàn bộ app

Nên làm khi:

- cần staging đồng nhất tuyệt đối
- deploy lên nền tảng container
- CI cần test integration với môi trường gần production

## 11. Mã nguồn mở và source có sẵn nên tái sử dụng

### 11.1 Nên dùng

| Nguồn | Dùng để làm gì | Lợi ích |
| --- | --- | --- |
| `create-next-app` | Khởi tạo nền dự án sạch | Nhanh, ít rác, chuẩn Next.js |
| `shadcn/ui` | Base components | Source mở, dễ sửa theo design system |
| `Auth.js` example | Auth flow, session, provider setup | Không phải tự dựng auth từ đầu |
| `Prisma` examples | Schema, migration, seeding | Giảm lỗi phần data layer |
| `Tiptap` starter | Editor cho lesson/blog/wiki | Tự chủ nội dung tốt hơn editor đóng |
| `TanStack Table` examples | Admin tables | Phù hợp CRUD, filter, sorting |

### 11.2 Không nên bê nguyên vào

Không nên kéo nguyên các hệ thống như:

- Moodle
- Open edX
- LMS boilerplate quá nặng
- headless CMS tổng quát làm trung tâm hệ thống

Lý do:

- stack khác biệt, khó đồng bộ với Next.js full-stack
- logic simulator, progress và practice của chúng ta là custom
- kéo theo quá nhiều module không cần cho MVP

### 11.3 Kết luận về reuse

Hướng tối ưu nhất là:

- dùng framework sạch
- tái sử dụng component source
- tái sử dụng auth và editor foundation
- tự xây business modules quan trọng của Ads Learning Hub

## 12. Quản lý API ra sao

### 12.1 Phong cách API

Chúng ta dùng `REST JSON API` cho MVP.

Lý do:

- dễ đọc
- dễ debug
- dễ chia quyền theo route
- phù hợp admin CRUD, dashboard, analytics cơ bản

### 12.2 Namespace API

```text
/api/v1/auth/*
/api/v1/public/*
/api/v1/student/*
/api/v1/admin/*
/api/v1/webhooks/*
```

### 12.3 Quy ước response

Nên thống nhất envelope:

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

Khi lỗi:

```json
{
  "data": null,
  "meta": {},
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid payload"
  }
}
```

### 12.4 Quy tắc quản lý API

- version hóa từ đầu bằng `/api/v1`
- validate request bằng `Zod`
- kiểm tra auth và role ở API boundary
- chỉ service layer mới chạm business logic chính
- không query DB trực tiếp rải rác trong route handler
- log `requestId` cho request quan trọng
- pagination, filtering, sorting phải thống nhất quy ước

### 12.5 Phân quyền API

Ba role MVP:

- `guest`
- `student`
- `admin`

Quy tắc:

- `public` chỉ đọc nội dung public
- `student` được học, làm quiz, dùng simulator, xem progress
- `admin` được CRUD content, simulator, user cơ bản, analytics

### 12.6 Tài liệu API

Phải có:

- `docs/api-contract.md`
- `docs/openapi.yaml` ở phase implement API rõ hơn

## 13. Luồng hoạt động chính của website

### 13.1 Guest flow

```text
Home
-> Learning Paths / Blog / Wiki
-> Course Detail
-> Register
-> Login
-> Dashboard
```

### 13.2 Student learning flow

```text
Register/Login
-> Dashboard
-> Chọn learning path
-> Vào course
-> Vào lesson
-> Hoàn thành quiz
-> Thử simulator
-> Ghi nhận progress
-> Quay lại dashboard xem tiến độ
```

### 13.3 Student simulator flow

```text
Simulator Detail
-> Start session
-> Trả lời từng bước
-> Submit
-> Chấm điểm / phản hồi
-> Lưu session result
-> Hiển thị kết quả trong dashboard
```

### 13.4 Admin content flow

```text
Admin Login
-> Admin Dashboard
-> Tạo learning path
-> Tạo course
-> Tạo module
-> Tạo lesson
-> Tạo quiz
-> Publish
-> Student nhìn thấy ngoài website
```

### 13.5 Admin practice flow

```text
Admin Login
-> Manage Simulators
-> Tạo simulator definition
-> Tạo scenario / answer rules
-> Publish simulator
-> Student thực hành
-> Admin xem session summary
```

### 13.6 Progress tracking flow

```text
Student mở lesson
-> Hệ thống ghi event xem bài
-> Student hoàn thành lesson hoặc quiz
-> Cập nhật lesson_progress
-> Tổng hợp course_progress
-> Dashboard hiển thị phần trăm hoàn thành
```

## 14. Kế hoạch triển khai theo thứ tự

### Phase 1

- khởi tạo Next.js app
- dựng auth
- dựng PostgreSQL + Prisma
- dựng marketing pages
- dựng learning paths, courses, lessons

### Phase 2

- quiz system
- simulator system MVP
- dashboard student
- admin CRUD content

### Phase 3

- analytics cơ bản
- media management
- seed/import content tốt hơn
- tối ưu SEO và performance

### Phase 4

- Redis
- queue/background jobs
- advanced analytics
- search nâng cao

## 15. Kết luận chốt

Kiến trúc tốt nhất cho Ads Learning Hub ở giai đoạn hiện tại là:

- `Next.js full-stack`
- `TypeScript cho cả frontend và backend`
- `PostgreSQL + Prisma`
- `Auth.js`
- `Tailwind + shadcn/ui`
- `Docker Compose cho local services`
- `REST API có versioning`
- `business logic custom cho learning, quiz, simulator và progress`

Đây là hướng cân bằng tốt nhất giữa:

- tốc độ làm MVP
- độ sạch của codebase
- khả năng mở rộng sau này
- chi phí vận hành hợp lý

## 16. Tham chiếu kỹ thuật

- Next.js App Router: https://nextjs.org/docs/app
- Prisma + PostgreSQL: https://www.prisma.io/docs/orm/overview/databases/postgresql
- Prisma schema: https://docs.prisma.io/docs/v6/orm/prisma-schema/overview
- PostgreSQL docs: https://www.postgresql.org/docs/current/
- Docker Compose: https://docs.docker.com/compose/intro/compose-application-model/
- Auth.js: https://authjs.dev/
- shadcn/ui: https://ui.shadcn.com/docs
- Tiptap: https://tiptap.dev/docs
