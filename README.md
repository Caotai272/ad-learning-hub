# Ads Learning Hub

Ads Learning Hub đang ở `Giai đoạn 1: Dựng nền kỹ thuật`.

Mục tiêu hiện tại:

- dựng codebase `Next.js + TypeScript + Tailwind`
- dựng auth foundation với `Auth.js`
- dựng database layer với `PostgreSQL + Prisma`
- dựng shell cho public site, dashboard và admin
- chuẩn hóa env, scripts và route protection

## Tài liệu nền

Điểm vào chuẩn của tài liệu dự án nằm tại:

- `docs/foundation/README.md`

## Lệnh chính

```bash
docker compose -f infra/docker/compose.yaml up -d
corepack pnpm install
corepack pnpm dev
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm db:generate
corepack pnpm db:push
corepack pnpm db:seed
```

## Biến môi trường

Sao chép `.env.example` thành `.env` rồi cập nhật:

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

## Trạng thái hiện tại

Đã có:

- trang chủ nền
- route `login`, `register`
- dashboard shell
- admin shell
- Prisma schema ban đầu
- register API
- health API

Chưa có:

- lesson flow thật
- quiz flow thật
- simulator flow thật
- admin CRUD thật
