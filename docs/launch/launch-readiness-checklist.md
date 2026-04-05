# Launch Readiness Checklist

## 1. Mục tiêu

Checklist này dùng để khóa Giai đoạn 7 trước khi đưa hệ thống sang staging hoặc launch public.

## 2. Kiểm tra kỹ thuật bắt buộc

- `corepack pnpm lint` phải pass
- `corepack pnpm typecheck` phải pass
- `corepack pnpm build` phải pass
- `corepack pnpm launch:check` phải pass
- `GET /api/v1/public/health` phải trả về `status: ok` hoặc ít nhất không ở trạng thái `down`

## 3. Kiểm tra dữ liệu launch

- phải có ít nhất 3 learning paths `PUBLISHED`
- phải có ít nhất 3 courses `PUBLISHED`
- phải có lesson mẫu đủ để demo flow học
- phải có ít nhất 1 quiz publish để test submit thật
- phải có ít nhất 2 scenario practice sẵn sàng
- phải có ít nhất 1 tài khoản admin có thể đăng nhập

## 4. Kiểm tra luồng nghiệp vụ

- guest vào homepage được và đi sang `register`
- student đăng ký hoặc đăng nhập được
- student vào course, học lesson và đánh dấu hoàn thành được
- student nộp quiz và thấy score, progress được cập nhật
- student vào practice hub, làm simulator và thấy attempt được lưu
- admin đăng nhập, vào learning inventory và publish flow hoạt động

## 5. Kiểm tra giao diện và nội dung

- giao diện public hiển thị tiếng Việt UTF-8 nhất quán
- các thuật ngữ ads như `CTR`, `CPM`, `CPA`, `ROAS`, `Pixel`, `Lookalike`, `Conversion` giữ nguyên tiếng Anh
- không còn button nền đen bị chìm chữ
- mobile và desktop đều không có lỗi layout chồng lấn lớn
- trang `privacy` và `terms` truy cập được từ footer

## 6. Kiểm tra staging

- `APP_URL` trỏ đúng domain hoặc subdomain staging
- staging database tách biệt với local
- env staging không dùng secret mặc định của local
- seed staging chạy được mà không phá dữ liệu hiện hữu
- route admin và dashboard không bị index bởi robots

## 7. Rollback tối thiểu

- giữ snapshot database trước khi deploy staging lớn
- nếu deploy lỗi: rollback code về commit build xanh gần nhất
- chạy lại `corepack pnpm launch:check`
- xác nhận `GET /api/v1/public/health` trả về bình thường trước khi mở traffic
