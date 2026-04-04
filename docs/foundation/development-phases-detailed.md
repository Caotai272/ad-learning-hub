# Ads Learning Hub - Development Phases Detailed

## 1. Mục tiêu của tài liệu

Tài liệu này chia toàn bộ dự án thành các giai đoạn triển khai chi tiết để phục vụ việc kiểm soát chặt chẽ:

- biết chính xác từng giai đoạn phải làm gì
- biết khi nào được phép chuyển giai đoạn
- biết đầu ra bắt buộc của từng giai đoạn
- biết rủi ro nào phải khóa lại trước khi đi tiếp
- biết hạng mục nào là bắt buộc cho MVP và hạng mục nào phải hoãn

Tài liệu này dùng như roadmap triển khai thực tế, không chỉ là bản tóm tắt định hướng.

## 2. Nguyên tắc quản lý theo giai đoạn

Mỗi giai đoạn phải có đủ 6 nhóm thông tin:

1. mục tiêu
2. phạm vi công việc
3. đầu ra bắt buộc
4. điều kiện hoàn thành
5. rủi ro cần kiểm soát
6. điều không làm ở giai đoạn đó

Không chuyển sang giai đoạn tiếp theo nếu:

- chưa có đầu ra bắt buộc
- chưa chốt tiêu chuẩn dữ liệu hoặc kiến trúc liên quan
- chưa test được luồng chính của giai đoạn hiện tại
- còn thay đổi lớn chưa thống nhất trong tài liệu nền

## 3. Bản đồ tổng thể các giai đoạn

| Giai đoạn | Tên giai đoạn | Mục tiêu chính |
| --- | --- | --- |
| 0 | Chuẩn bị và khóa nền tảng | Chốt tài liệu, phạm vi, nguyên tắc làm việc |
| 1 | Dựng nền kỹ thuật | Khởi tạo source, auth, database, folder structure |
| 2 | Dựng lớp nội dung và dữ liệu học tập | Model hóa learning path, course, lesson, quiz |
| 3 | Xây public website và SEO layer | Hoàn thiện homepage, blog, wiki, learning pages |
| 4 | Xây student experience cốt lõi | Đăng ký, đăng nhập, học bài, làm quiz, xem tiến độ |
| 5 | Xây admin CMS và vận hành nội dung | Admin CRUD cho content, learning, practice |
| 6 | Xây practice hub và simulator MVP | Thực hành có chấm điểm và lưu kết quả |
| 7 | Ổn định hệ thống và chuẩn bị launch | Test, tối ưu, seed dữ liệu, staging, production |
| 8 | Mở rộng sau MVP | Analytics sâu hơn, Redis, queue, search, tính năng nâng cao |

## 4. Giai đoạn 0: Chuẩn bị và khóa nền tảng

### 4.1 Mục tiêu

Khóa toàn bộ định hướng ở mức tài liệu trước khi bắt tay dựng code.

### 4.2 Phạm vi công việc

- chốt sitemap tổng thể
- chốt phạm vi MVP
- chốt technical architecture
- chốt design style guide
- chốt quy chuẩn ngôn ngữ tiếng Việt UTF-8
- chốt nguyên tắc rằng toàn bộ thuật ngữ chuyên ngành riêng của ads đều giữ nguyên tiếng Anh; các ví dụ như `CTR`, `CPM`, `ROAS`, `Pixel`, `Lookalike`, `Conversion` không phải danh sách giới hạn
- chốt định nghĩa role: `guest`, `student`, `admin`
- chốt triết lý không tách frontend/backend ở MVP

### 4.3 Đầu ra bắt buộc

- `docs/foundation/README.md`
- `docs/foundation/website-master-sitemap.md`
- `docs/foundation/mvp-detailed-plan.md`
- `docs/foundation/project-technical-architecture.md`
- `docs/foundation/design-style-guide.md`
- `docs/foundation/development-phases-detailed.md`

### 4.4 Checklist kiểm soát

- đã có thứ tự đọc tài liệu chuẩn
- đã xác định rõ trang nào thuộc MVP
- đã xác định rõ công nghệ chính
- đã xác định rõ giao diện dùng tiếng Việt
- đã xác định rõ Docker dùng ở mức nào
- đã xác định rõ database và ORM

### 4.5 Điều kiện hoàn thành

- không còn tranh luận mở về stack nền
- không còn tranh luận mở về phạm vi MVP
- mọi quyết định nền đã có văn bản

### 4.6 Rủi ro cần kiểm soát

- thay đổi stack quá muộn
- mở scope quá sớm
- tài liệu một đằng, code đi một nẻo

### 4.7 Không làm trong giai đoạn này

- chưa code tính năng lớn
- chưa làm UI production
- chưa tối ưu chi tiết performance

## 5. Giai đoạn 1: Dựng nền kỹ thuật

### 5.1 Mục tiêu

Tạo bộ khung kỹ thuật đủ sạch để các giai đoạn sau chỉ tập trung vào tính năng.

### 5.2 Phạm vi công việc

- khởi tạo dự án `Next.js + TypeScript + App Router`
- cài `pnpm`, cấu hình scripts chuẩn
- dựng `src/app`, `src/modules`, `src/server`, `src/components`
- dựng `Prisma` và kết nối `PostgreSQL`
- thiết lập `.env.example`
- dựng `Auth.js`
- dựng middleware phân quyền cơ bản
- dựng layout cho `marketing`, `dashboard`, `admin`
- dựng `Tailwind CSS` và component base ban đầu
- dựng logging/error boundary tối thiểu

### 5.3 Nhiệm vụ chi tiết

#### 5.3.1 Khởi tạo source

- tạo app bằng khung sạch
- cấu hình alias import
- cấu hình lint, format, typecheck
- cấu hình cấu trúc thư mục theo tài liệu kiến trúc

#### 5.3.2 Thiết lập môi trường

- tạo file `.env.example`
- định nghĩa biến môi trường cho app, db, auth, storage
- chuẩn hóa naming env

#### 5.3.3 Thiết lập database

- tạo `prisma/schema.prisma`
- tạo migration đầu tiên
- cấu hình `Prisma Client`
- tạo script seed khởi tạo dữ liệu tối thiểu

#### 5.3.4 Thiết lập auth

- login bằng email/password
- register student
- session management
- route protection cho student/admin
- role check ở middleware hoặc server layer

#### 5.3.5 Thiết lập UI base

- typography foundation
- color tokens
- button, input, textarea, dialog, card, table
- layout shell cho public, dashboard, admin

### 5.4 Đầu ra bắt buộc

- app chạy local ổn định
- kết nối được database
- đăng ký và đăng nhập được
- có khung route public, dashboard, admin
- có migration đầu tiên
- có 1 admin seed account hoặc script tạo admin

### 5.5 Điều kiện hoàn thành

- `pnpm dev` chạy được
- `pnpm typecheck` qua
- `pnpm lint` qua
- login/register hoạt động
- route admin bị chặn nếu không đúng role
- DB migration áp dụng được từ đầu trên máy mới

### 5.6 Cổng kiểm soát trước khi qua giai đoạn 2

Chỉ qua giai đoạn 2 nếu:

- team có thể clone repo và chạy local được
- auth không còn blocker lớn
- database layer đã đủ ổn định để bắt đầu model dữ liệu nghiệp vụ

### 5.7 Rủi ro cần kiểm soát

- folder structure thay đổi liên tục
- auth làm nửa vời rồi phải đập lại
- thiếu convention cho server/service/repository

### 5.8 Không làm trong giai đoạn này

- chưa xây quiz đầy đủ
- chưa xây simulator
- chưa làm admin CRUD hoàn chỉnh

## 6. Giai đoạn 2: Dựng lớp nội dung và dữ liệu học tập

### 6.1 Mục tiêu

Khóa mô hình dữ liệu học tập để tránh sửa database liên tục về sau.

### 6.2 Phạm vi công việc

- thiết kế schema cho learning paths
- thiết kế schema cho courses, modules, lessons
- thiết kế schema cho quizzes
- thiết kế schema cho enrollments và progress
- thiết kế schema cho blog, wiki, media
- chuẩn hóa slug, status, publish flow

### 6.3 Nhiệm vụ chi tiết

#### 6.3.1 Dữ liệu học tập

- `learning_paths`
- `courses`
- `course_modules`
- `lessons`
- `lesson_blocks`
- quan hệ giữa path và course

#### 6.3.2 Dữ liệu đánh giá

- `quizzes`
- `quiz_questions`
- `quiz_choices`
- `quiz_attempts`
- `quiz_answers`

#### 6.3.3 Dữ liệu học viên

- `enrollments`
- `lesson_progress`
- `course_progress`
- `bookmarks` nếu cần cho phase sau

#### 6.3.4 Dữ liệu nội dung public

- `blog_posts`
- `wiki_articles`
- `glossary_terms`
- `media_assets`

#### 6.3.5 Trạng thái xuất bản

Mỗi thực thể quan trọng nên có ít nhất:

- `draft`
- `published`
- `archived`

### 6.4 Đầu ra bắt buộc

- schema Prisma cho core entities
- migration rõ ràng
- seed mẫu cho ít nhất:
  - 3 learning paths
  - 3 courses
  - vài module và lesson mẫu
  - 1 quiz mẫu
- tài liệu schema hoặc ERD đơn giản

### 6.5 Điều kiện hoàn thành

- không còn lỗ hổng lớn trong quan hệ dữ liệu
- progress có thể tính từ lesson và quiz
- publish flow có thể áp dụng cho nội dung

### 6.6 Cổng kiểm soát trước khi qua giai đoạn 3

Chỉ qua khi:

- có thể seed dữ liệu và hiển thị lên giao diện
- schema không phải sửa kiến trúc lớn nữa
- slug và route mapping đã đủ ổn

### 6.7 Rủi ro cần kiểm soát

- schema thiếu trường phục vụ admin
- quan hệ lesson, module, course thiết kế sai dẫn tới sửa dây chuyền
- progress logic bị gắn cứng vào UI thay vì model dữ liệu

### 6.8 Không làm trong giai đoạn này

- chưa dồn sức vào pixel-perfect UI
- chưa triển khai analytics sâu

## 7. Giai đoạn 3: Xây public website và SEO layer

### 7.1 Mục tiêu

Hoàn thiện lớp public-facing để sản phẩm có thể được giới thiệu, tìm thấy và truy cập dễ dàng.

### 7.2 Phạm vi công việc

- homepage
- about
- pricing
- contact
- terms
- privacy
- blog list/detail
- wiki list/detail
- learning paths list/detail
- course list/detail
- metadata, sitemap, robots, Open Graph

### 7.3 Nhiệm vụ chi tiết

#### 7.3.1 Marketing core pages

- thiết kế và code homepage
- tạo hero, proof section, learning path highlights
- tạo CTA đăng ký và CTA bắt đầu học

#### 7.3.2 Knowledge content pages

- blog listing
- blog detail
- wiki listing
- wiki detail
- render nội dung chuẩn tiếng Việt UTF-8

#### 7.3.3 Learning discovery pages

- learning paths listing
- từng learning path detail
- courses listing
- course detail có CTA học

#### 7.3.4 SEO layer

- metadata theo route
- canonical URL
- sitemap generation
- robots
- structured headings
- slug strategy

### 7.4 Đầu ra bắt buộc

- các route public chính render ổn
- nội dung public có thể quản lý từ seed hoặc DB
- các route có metadata cơ bản
- website có thể demo được cho người ngoài

### 7.5 Điều kiện hoàn thành

- public pages hiển thị tốt trên mobile và desktop
- route không bị đứt luồng CTA
- có thể đi từ homepage sang learning path, course, register

### 7.6 Cổng kiểm soát trước khi qua giai đoạn 4

Chỉ qua khi:

- website public đủ sạch để cho người dùng thử
- không còn blocker lớn ở routing và rendering
- nội dung public và learning discovery đã nối được với data layer

### 7.7 Rủi ro cần kiểm soát

- quá tập trung vào landing page mà quên learning flow
- SEO bị làm sau khiến phải sửa lại route/meta
- copy giao diện bị lẫn tiếng Anh

### 7.8 Không làm trong giai đoạn này

- chưa triển khai simulator thực chiến
- chưa mở rộng community hoặc comment

## 8. Giai đoạn 4: Xây student experience cốt lõi

### 8.1 Mục tiêu

Cho phép một học viên đi trọn luồng chính từ đăng ký đến học bài và xem tiến độ.

### 8.2 Phạm vi công việc

- register
- login
- forgot password
- dashboard overview
- my courses
- course detail cho học viên
- lesson page
- quiz page
- progress tracking

### 8.3 Nhiệm vụ chi tiết

#### 8.3.1 Auth flow hoàn chỉnh

- đăng ký student
- đăng nhập
- quên mật khẩu
- đặt lại mật khẩu
- logout

#### 8.3.2 Dashboard

- overview widgets
- continue learning card
- danh sách khóa học đang học
- tiến độ gần đây

#### 8.3.3 Lesson experience

- lesson header
- lesson content blocks
- đánh dấu hoàn thành bài học
- điều hướng bài trước/bài sau

#### 8.3.4 Quiz experience

- hiển thị câu hỏi
- chọn đáp án
- submit
- chấm điểm
- lưu attempt
- phản hồi cơ bản

#### 8.3.5 Progress tracking

- lesson completed
- quiz completed
- tổng hợp tiến độ course
- hiển thị phần trăm trong dashboard

### 8.4 Đầu ra bắt buộc

- học viên có thể tạo tài khoản
- học viên có thể học lesson
- học viên có thể làm quiz
- học viên có thể thấy tiến độ

### 8.5 Điều kiện hoàn thành

- luồng `register -> login -> dashboard -> course -> lesson -> quiz -> dashboard` chạy được end-to-end
- không mất dữ liệu progress
- dashboard phản ánh đúng trạng thái học

### 8.6 Cổng kiểm soát trước khi qua giai đoạn 5

Chỉ qua khi:

- learning flow của student đã đủ dùng thật
- dữ liệu quiz và progress được lưu ổn định
- không còn bug blocker ở auth/dashboard/lesson/quiz

### 8.7 Rủi ro cần kiểm soát

- quiz UI làm xong nhưng không chốt cách lưu attempt
- progress bị tính sai
- dashboard chỉ là giao diện giả, chưa lấy từ dữ liệu thật

### 8.8 Không làm trong giai đoạn này

- chưa thêm features nâng cao như certificates, gamification, community

## 9. Giai đoạn 5: Xây admin CMS và vận hành nội dung

### 9.1 Mục tiêu

Cho phép admin tự vận hành sản phẩm mà không cần sửa code cho từng nội dung.

### 9.2 Phạm vi công việc

- admin dashboard
- CRUD blog
- CRUD wiki
- CRUD learning paths
- CRUD courses
- CRUD modules
- CRUD lessons
- CRUD quizzes
- CRUD users ở mức cơ bản

### 9.3 Nhiệm vụ chi tiết

#### 9.3.1 Admin dashboard

- số lượng học viên
- số khóa học
- nội dung mới nhất
- tóm tắt học tập cơ bản

#### 9.3.2 CMS cho content public

- tạo/sửa/xóa blog
- tạo/sửa/xóa wiki
- upload thumbnail hoặc ảnh bài viết
- publish/unpublish

#### 9.3.3 CMS cho learning

- tạo learning path
- tạo course
- tạo module
- tạo lesson
- soạn lesson blocks
- gắn quiz cho lesson hoặc module

#### 9.3.4 User management cơ bản

- xem danh sách student
- xem trạng thái tài khoản
- xem enrollment cơ bản

### 9.4 Đầu ra bắt buộc

- admin có thể tạo nội dung mà không cần sửa file code
- admin có thể publish course và lesson
- admin có thể tạo quiz và gắn vào luồng học

### 9.5 Điều kiện hoàn thành

- dữ liệu tạo từ admin hiển thị đúng ngoài frontend
- publish flow hoạt động
- role protection chặt, student không vào được admin

### 9.6 Cổng kiểm soát trước khi qua giai đoạn 6

Chỉ qua khi:

- admin workflow đủ để vận hành nội dung MVP
- không còn phụ thuộc vào việc seed thủ công cho mọi nội dung mới

### 9.7 Rủi ro cần kiểm soát

- admin form quá yếu, không validate
- publish flow gây lộ draft ra public
- editor nội dung không đủ tốt khiến lesson khó quản lý

### 9.8 Không làm trong giai đoạn này

- chưa mở rộng multi-editor workflow
- chưa xây permission matrix quá phức tạp

## 10. Giai đoạn 6: Xây practice hub và simulator MVP

### 10.1 Mục tiêu

Hiện thực hóa giá trị khác biệt của sản phẩm: học lý thuyết đi kèm thực hành.

### 10.2 Phạm vi công việc

- practice hub
- simulator listing
- simulator detail
- simulator session
- simulator result
- admin CRUD simulator definitions

### 10.3 Nhiệm vụ chi tiết

#### 10.3.1 Practice area

- trang giới thiệu khu thực hành
- danh sách simulator đang có
- mô tả mục tiêu từng simulator

#### 10.3.2 Simulator 1: Metrics Reading

- mô tả tình huống
- hiển thị dữ liệu chỉ số
- câu hỏi đánh giá
- chấm điểm và phản hồi

#### 10.3.3 Simulator 2: Campaign Setup Basic

- flow thiết lập chiến dịch cơ bản
- câu hỏi theo từng bước
- đánh giá lựa chọn
- chấm điểm cuối phiên

#### 10.3.4 Session và result

- tạo session khi bắt đầu
- lưu từng bước hoặc payload cuối
- submit
- chấm điểm
- lưu kết quả
- hiển thị feedback

#### 10.3.5 Admin quản trị simulator

- tạo simulator
- tạo scenario
- tạo expected answers hoặc scoring rules
- publish/unpublish simulator

### 10.4 Đầu ra bắt buộc

- có 2 simulator MVP hoạt động thật
- student có thể thực hành
- hệ thống lưu session result
- admin có thể chỉnh nội dung simulator

### 10.5 Điều kiện hoàn thành

- simulator chạy ổn định trên desktop và mobile
- result không sai logic
- dữ liệu session có thể dùng cho analytics cơ bản

### 10.6 Cổng kiểm soát trước khi qua giai đoạn 7

Chỉ qua khi:

- sản phẩm chứng minh được 3 lớp giá trị:
  - học nội dung
  - làm quiz
  - thực hành simulator

### 10.7 Rủi ro cần kiểm soát

- simulator bị làm như form tĩnh, không có giá trị thực hành
- scoring rule hard-code quá mức
- session không lưu được dữ liệu hữu ích

### 10.8 Không làm trong giai đoạn này

- chưa triển khai scenario engine nâng cao
- chưa làm challenge system
- chưa thêm AI mentor

## 11. Giai đoạn 7: Ổn định hệ thống và chuẩn bị launch

### 11.1 Mục tiêu

Đưa MVP từ trạng thái "đã có chức năng" sang trạng thái "có thể demo, staging và launch".

### 11.2 Phạm vi công việc

- seed dữ liệu launch
- tối ưu SEO
- tối ưu performance
- log và error tracking
- test unit/integration/e2e
- rà soát quyền truy cập
- dựng staging environment
- chuẩn bị production checklist

### 11.3 Nhiệm vụ chi tiết

#### 11.3.1 Dữ liệu launch

- seed 3 learning paths
- seed 3 course cơ bản
- seed đủ lessons mẫu
- seed quiz mẫu
- seed 2 simulator MVP

#### 11.3.2 Chất lượng kỹ thuật

- typecheck
- lint
- smoke test
- error boundaries
- không để crash ở route chính

#### 11.3.3 Test luồng chính

- guest vào homepage và đăng ký
- student học lesson và làm quiz
- student thực hành simulator
- admin tạo nội dung và publish

#### 11.3.4 Hạ tầng launch

- cấu hình env staging
- cấu hình database staging
- cấu hình storage staging
- cấu hình domain hoặc subdomain staging

### 11.4 Đầu ra bắt buộc

- staging chạy được
- các luồng chính test được
- dữ liệu khởi tạo đủ để demo thật
- không còn bug blocker mức nghiêm trọng

### 11.5 Điều kiện hoàn thành

- đã test end-to-end các luồng chính
- có checklist launch
- có rollback plan cơ bản nếu deploy lỗi

### 11.6 Cổng kiểm soát trước khi launch

Chỉ launch nếu:

- auth ổn định
- progress ổn định
- admin publish ổn định
- simulator ổn định
- legal pages có đủ
- giao diện tiếng Việt nhất quán

### 11.7 Rủi ro cần kiểm soát

- launch khi chưa có dữ liệu đủ dùng
- launch khi progress hoặc session result còn sai
- thiếu logging nên không debug được lỗi production

### 11.8 Không làm trong giai đoạn này

- chưa mở rộng feature ngoài MVP
- chưa refactor lớn nếu không phục vụ launch

## 12. Giai đoạn 8: Mở rộng sau MVP

### 12.1 Mục tiêu

Mở rộng hệ thống theo dữ liệu sử dụng thực tế thay vì đoán trước.

### 12.2 Phạm vi công việc

- thêm Redis nếu cần
- thêm queue/background jobs
- analytics chi tiết hơn
- bookmarks
- glossary hoàn chỉnh
- billing nếu thật sự mở monetization
- search nâng cao
- media management tốt hơn

### 12.3 Hướng ưu tiên sau MVP

#### 12.3.1 Ưu tiên theo dữ liệu

Chỉ làm tiếp nếu có bằng chứng:

- người dùng học thường xuyên
- người dùng dùng simulator thật
- admin cần công cụ vận hành sâu hơn

#### 12.3.2 Các hướng có thể mở

- learning recommendations
- advanced scenarios
- detailed attempt review
- cohort analytics
- event queue
- audit logs

### 12.4 Đầu ra mong đợi

- hệ thống chịu tải tốt hơn
- insight học tập sâu hơn
- luồng vận hành admin tốt hơn

### 12.5 Rủi ro cần kiểm soát

- mở rộng quá sớm khi MVP chưa chứng minh giá trị
- thêm nhiều công nghệ mới làm đội chi phí vận hành

## 13. Kiểm soát dự án theo mốc chặn

Đây là các mốc chặn quan trọng phải xác nhận bằng checklist:

### Mốc chặn A: Tài liệu nền đã khóa

Phải có:

- sitemap
- MVP scope
- technical architecture
- design guide
- language rule

### Mốc chặn B: Nền kỹ thuật chạy được

Phải có:

- app chạy local
- auth hoạt động
- db migration chạy được
- role protection hoạt động

### Mốc chặn C: Học viên học được

Phải có:

- course
- lesson
- quiz
- dashboard
- progress

### Mốc chặn D: Admin vận hành được

Phải có:

- CRUD content
- CRUD learning
- publish flow
- user listing cơ bản

### Mốc chặn E: Giá trị khác biệt đã hình thành

Phải có:

- practice hub
- 2 simulator MVP
- result lưu được
- feedback hiển thị được

### Mốc chặn F: Có thể launch

Phải có:

- staging
- seed data
- test luồng chính
- legal pages
- logging cơ bản

## 14. Thứ tự ưu tiên tuyệt đối

Nếu bị thiếu nguồn lực, giữ đúng ưu tiên này:

1. auth và data integrity
2. lesson và quiz flow
3. admin CRUD cho learning content
4. simulator MVP
5. public SEO pages
6. analytics nâng cao
7. feature mở rộng sau MVP

## 15. Điều bắt buộc để bạn kiểm soát chặt dự án

Mỗi giai đoạn nên có thêm 1 bảng theo dõi thực thi với các cột:

- hạng mục
- người phụ trách
- trạng thái
- blocker
- ngày bắt đầu
- ngày cần xong
- mức độ ưu tiên
- ghi chú

Mỗi cuối giai đoạn phải có:

- danh sách việc hoàn thành
- danh sách việc chưa hoàn thành
- quyết định có qua phase tiếp theo hay không
- lý do nếu giữ lại hoặc hoãn tính năng

## 16. Kết luận

Nếu muốn kiểm soát chặt dự án, không nên chỉ nhìn theo danh sách tính năng.

Phải nhìn theo:

- giai đoạn
- mốc chặn
- đầu ra bắt buộc
- điều kiện hoàn thành
- rủi ro cần khóa trước khi đi tiếp

File này là roadmap chi tiết để làm điều đó.
