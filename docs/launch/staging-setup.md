# Staging Setup

## 1. Mục tiêu

Tài liệu này mô tả cách dựng môi trường staging tối thiểu cho Ads Learning Hub trong Giai đoạn 7.

## 2. Biến môi trường

Tạo file env từ `.env.staging.example` và thay giá trị thật cho:

- `DATABASE_URL`
- `AUTH_SECRET`
- `APP_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

## 3. Trình tự dựng staging

1. Tạo database staging riêng.
2. Cấu hình `APP_URL` về domain staging.
3. Chạy `corepack pnpm db:generate`.
4. Chạy `corepack pnpm db:push`.
5. Chạy `corepack pnpm db:seed`.
6. Chạy `corepack pnpm launch:check`.
7. Truy cập `GET /api/v1/public/health` để xác nhận readiness.

## 4. Kiểm tra sau khi dựng

- mở homepage, pricing, learning paths, courses, practice, privacy, terms
- đăng nhập bằng admin staging
- đăng nhập bằng student test
- thử nộp quiz và practice simulator
- kiểm tra admin practice, admin learning và dashboard student

## 5. Điều chưa có trong repo hiện tại

- pipeline deploy staging tự động
- logging ngoài như Sentry
- rollback tự động theo migration

Các mục trên có thể làm ở nhánh tiếp theo nếu cần bước sang chuẩn production cao hơn MVP launch.
