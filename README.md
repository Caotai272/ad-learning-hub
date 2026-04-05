# Ads Learning Hub

Ads Learning Hub hiện đang ở `Giai đoạn 8: Mở rộng sau MVP`.

Repo này đã có:

- public website cho homepage, learning paths, courses, pricing, practice hub
- auth cho student/admin với register, login, forgot password, reset password
- student dashboard với lesson progress, quiz analytics, practice analytics
- admin CMS cho learning content, quiz, lesson blocks, content workflow
- practice simulator MVP có lưu attempt vào database
- health endpoint, launch readiness script, legal pages và error boundaries cơ bản
- glossary public và dashboard bookmarks cho nhịp học sau MVP

## Tài liệu nền

Điểm vào chuẩn của tài liệu dự án nằm tại:

- `docs/foundation/README.md`

## Lệnh chính

```bash
docker compose -f infra/docker/compose.yaml up -d
corepack pnpm install
corepack pnpm db:generate
corepack pnpm db:push
corepack pnpm db:seed
corepack pnpm dev
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm build
corepack pnpm launch:check
```

## Biến môi trường

Sao chép một trong các file sau để tạo env phù hợp:

- `.env.example` cho local
- `.env.staging.example` cho staging

Các biến cốt lõi:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_TRUST_HOST`
- `APP_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

## Local database

PostgreSQL local có thể chạy bằng Docker:

```bash
docker compose -f infra/docker/compose.yaml up -d
```

Sau khi database lên:

```bash
corepack pnpm db:push
corepack pnpm db:seed
```

## Launch readiness

Các điểm kiểm tra hiện có:

- `GET /api/v1/public/health`
- `corepack pnpm launch:check`

Hai nhánh này sẽ kiểm tra tối thiểu:

- env cốt lõi
- kết nối database
- số lượng admin account
- inventory learning publish
- số lượng scenario practice sẵn sàng

## Trạng thái hiện tại

Đã khóa tương đối tốt:

- học lesson
- làm quiz và lưu attempt
- luyện practice simulator và lưu attempt
- admin publish learning content
- legal pages cơ bản
- error boundary ở root, dashboard và admin
- glossary term DB-backed
- bookmark lesson và glossary term cho student

Chưa khóa hoàn toàn cho production lớn:

- e2e test automation đầy đủ
- logging service ngoài như Sentry/Datadog
- CMS riêng cho practice scenario
- deployment pipeline staging/production tự động
