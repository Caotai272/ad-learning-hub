# Ads Learning Hub - Design Style Guide

## 1. Mục tiêu của file này

File này là tài liệu thống nhất về phong cách thiết kế cho Ads Learning Hub.

Nó dùng để định hướng cho:

- thiết kế giao diện
- code frontend
- xây dựng design system
- viết component UI
- giữ tính nhất quán giữa các trang public, learning, practice, dashboard và admin

Khác với `website-master-sitemap.md` và `mvp-detailed-plan.md`:

- `website-master-sitemap.md` trả lời: website có những khu nào và các route nào
- `mvp-detailed-plan.md` trả lời: giai đoạn đầu tiên cần làm những trang nào
- `design-style-guide.md` trả lời: toàn bộ website nên trông như thế nào và vận hành theo ngôn ngữ thiết kế nào

## 1.1 Quy chuẩn ngôn ngữ hiển thị

Ads Learning Hub ở giai đoạn hiện tại chỉ phục vụ thị trường Việt Nam.

Vì vậy:

- toàn bộ giao diện hiển thị cho người dùng phải dùng `tiếng Việt UTF-8`
- toàn bộ lesson, quiz, simulator, hướng dẫn học và nội dung dashboard phải dùng `tiếng Việt`
- blog, wiki và nội dung marketing public cũng ưu tiên `tiếng Việt`
- không dùng CTA tiếng Anh kiểu `Start now`, `Continue`, `Submit`, `Reset password` trên giao diện người dùng

Toàn bộ thuật ngữ chuyên ngành riêng của lĩnh vực ads được giữ nguyên tiếng Anh, không dịch sang tiếng Việt.

Danh sách như `CTR`, `CPM`, `CPC`, `CPA`, `ROAS`, `Pixel`, `Lookalike`, `Conversion`, `Ad Set`, `Campaign`, `Creative`, `A/B Test`, `Audience`, `Retargeting`, `Attribution`, `Impression`, `Frequency`, `Reach`, `Bid`, `Budget`, `Placement`, `Objective`, `Hook`, `Offer`, `Landing Page` chỉ là ví dụ, không phải danh sách giới hạn.

Nguyên tắc viết nội dung:

- câu chữ phải rõ, ngắn, dễ hiểu với người Việt đang học ads
- giữ nguyên toàn bộ thuật ngữ chuyên ngành ads vì đây là ngôn ngữ vận hành thực tế của ngành
- tránh trộn Anh - Việt trong cùng một cụm giao diện nếu không thật sự cần thiết
- nếu trong tài liệu quy hoạch còn xuất hiện ví dụ tiếng Anh thì hiểu đó là nhãn tham chiếu, không phải copy final để đưa lên giao diện

## 2. Nguồn tham khảo chính

Phong cách trong file này được xây dựng dựa trên tinh thần học hỏi từ các website sau:

1. HubSpot Academy
2. Google Skillshop
3. TikTok Academy
4. Salesforce Trailhead
5. Khan Academy
6. Duolingo
7. Thinkific
8. Teachable

## 3. Tư duy thiết kế tổng thể

### 3.1 Thiết kế theo phong cách gì

Ads Learning Hub nên theo phong cách:

- Clean / Structured / Practical
- Education-first UI
- Content-driven
- Performance dashboard inspired
- Simulator-friendly
- Trustworthy and modern

Nói ngắn gọn:

Đây không nên là một website bán khóa học kiểu landing page quá màu mè.

Nó nên là sự kết hợp giữa:

- một học viện marketing đáng tin cậy
- một hệ thống học tập có lộ trình rõ ràng
- một môi trường thực hành giống “lab” để người học ra quyết định

### 3.2 Tinh thần thiết kế cốt lõi

Website phải truyền được 4 cảm giác:

1. Dễ học
2. Có cấu trúc
3. Thực chiến
4. Có tiến bộ rõ ràng

### 3.3 Thiết kế không nên đi theo hướng nào

Không nên làm theo kiểu:

- quá giống landing page bán khóa học giá rẻ
- quá nhiều gradient loè loẹt
- quá nhiều hiệu ứng gây mất tập trung
- quá giống dashboard tài chính khô cứng
- quá giống blog tin tức thông thường

## 4. Design Language của Ads Learning Hub

### 4.1 Công thức ngôn ngữ thiết kế

Ngôn ngữ thiết kế nên là:

- 60% Academy and structured learning
- 25% Product dashboard and performance UI
- 15% Playful progress and practice motivation

Điều này nghĩa là:

- phần học lý thuyết phải sạch, rõ, dễ đọc
- phần thực hành phải có cảm giác “phòng lab” và ra quyết định
- phần tiến độ phải tạo động lực như game nhẹ, nhưng không trẻ con

### 4.2 Từ khóa nhận diện phong cách

- Sharp
- Intentional
- Practical
- Focused
- Clear
- Motivating
- Analytical

### 4.3 Insight quan trọng

Người học chạy quảng cáo không chỉ muốn “xem đẹp”.

Họ muốn:

- hiểu nhanh
- tìm đúng nội dung
- thấy mình đang tiến bộ
- được luyện tư duy quyết định

Vì vậy giao diện phải ưu tiên:

- clarity hơn decoration
- hierarchy hơn hiệu ứng
- action hơn trình diễn

## 5. Brand Personality

Ads Learning Hub nên có personality như sau:

- Chuyên nghiệp nhưng không lạnh
- Hiện đại nhưng không startup sáo rỗng
- Thực chiến nhưng không áp lực
- Học thuật vừa đủ, không hàn lâm nặng
- Có cảm giác mentor đồng hành, không phải chỉ bán khóa học

## 6. Typography

## 6.1 Hướng chọn font

Khuyến nghị dùng 3 nhóm font rõ vai trò:

- Heading font: `Sora`
- Body UI font: `IBM Plex Sans`
- Monospace and metrics font: `IBM Plex Mono`

Lý do:

- `Sora` tạo cảm giác hiện đại, rõ cá tính, khác các website khóa học đại trà
- `IBM Plex Sans` đọc rất ổn cho bài học dài, dashboard, table và admin
- `IBM Plex Mono` phù hợp cho số liệu, simulator, KPI block, trạng thái và technical feel

Không nên dùng mặc định:

- Inter nếu chưa có lý do rõ ràng
- font quá mềm hoặc quá rounded như website trẻ em
- serif cho body text

## 6.2 Typography Scale

| Level | Size đề xuất | Weight | Usage |
| --- | --- | --- | --- |
| Display | 56-72px | 600 | Hero lớn ngoài trang chủ |
| H1 | 40-48px | 600 | Tiêu đề trang |
| H2 | 30-36px | 600 | Tiêu đề section |
| H3 | 24-28px | 600 | Tiêu đề card lớn hoặc block |
| H4 | 20-22px | 600 | Tiêu đề module, widget |
| Body L | 18px | 400 | Intro, đoạn mô tả quan trọng |
| Body M | 16px | 400 | Nội dung chuẩn |
| Body S | 14px | 400/500 | Meta, ghi chú |
| Caption | 12-13px | 500 | Label, trạng thái, chú thích |
| Mono Data | 13-15px | 500 | KPI, data table, simulator values |

## 6.3 Quy tắc dùng chữ

- Heading dùng `Sora`
- Body và UI dùng `IBM Plex Sans`
- Số liệu, trạng thái, command-like block dùng `IBM Plex Mono`
- Không dùng quá nhiều cỡ chữ lẻ
- Không dùng chữ in nghiêng làm nhấn mạnh chính
- Không dùng toàn chữ viết hoa cho đoạn dài

## 6.4 Line-height và letter spacing

- Display/H1: `1.05 - 1.15`
- H2/H3: `1.15 - 1.25`
- Body: `1.6 - 1.75`
- Caption: `1.4 - 1.5`
- Letter spacing heading: hơi âm nhẹ nếu cần
- Letter spacing label nhỏ: có thể tăng nhẹ để rõ hơn

## 7. Color System

## 7.1 Hướng bảng màu

Bảng màu nên đi theo tinh thần:

- nền sáng, dễ đọc
- có chiều sâu kiểu product UI
- đủ phân biệt phần học, phần thực hành, phần dashboard
- không quá nhiều màu thương mại điện tử chói mắt

## 7.2 Core Palette đề xuất

### Neutral

- `--bg`: `#f6f4ee`
- `--surface`: `#fffdf8`
- `--surface-strong`: `#ffffff`
- `--border`: `#ded8cc`
- `--border-strong`: `#b9b09f`
- `--text`: `#14181f`
- `--text-muted`: `#5a6472`
- `--text-soft`: `#7b8492`

### Primary

- `--primary-50`: `#eef4ff`
- `--primary-100`: `#d8e6ff`
- `--primary-500`: `#2563eb`
- `--primary-600`: `#1d4ed8`
- `--primary-700`: `#173ea8`

### Secondary Support

- `--teal-500`: `#0f9d8a`
- `--green-500`: `#2f9e44`
- `--amber-500`: `#d97706`
- `--orange-500`: `#ea580c`
- `--red-500`: `#dc2626`

### Deep UI Accent

- `--ink-panel`: `#101826`
- `--ink-panel-soft`: `#192235`
- `--ink-panel-border`: `#2a3853`

## 7.3 Ý nghĩa màu trong sản phẩm

- Xanh dương: hành động chính, học tập, CTA, link quan trọng
- Xanh teal: thực hành, simulator, kết quả tốt
- Xanh lá: trạng thái hoàn thành, tiến bộ, pass
- Cam: cảnh báo, cần chú ý, pending
- Đỏ: lỗi, sai nghiêm trọng, fail
- Nền ink đậm: dùng có kiểm soát cho panel dữ liệu, simulator result, analytics card

## 7.4 Tỷ lệ dùng màu

- 70% neutral background và surface
- 15% text and structural contrast
- 10% primary blue
- 5% trạng thái và màu chức năng khác

## 7.5 Nền và bầu không khí thị giác

Không nên dùng nền trắng phẳng hoàn toàn cho toàn site.

Nên dùng:

- nền kem sáng hoặc xám ấm rất nhẹ
- gradient rất nhẹ ở hero và dashboard header
- pattern mềm hoặc shape mờ để tạo cảm giác hiện đại

Ví dụ hero background:

- linear gradient sáng từ kem nhạt sang xanh rất nhạt
- thêm vài shape blur rất nhẹ ở góc, không che nội dung

## 8. Spacing và Layout System

## 8.1 Grid

- Max content width: `1200px`
- Wide marketing section: `1280px`
- Reading content width: `720px - 780px`
- Dashboard layout: sidebar + content area
- Admin layout: denser layout hơn dashboard học viên

## 8.2 Spacing Scale

Dùng hệ thống 8pt làm gốc.

| Token | Value |
| --- | --- |
| 1 | 4px |
| 2 | 8px |
| 3 | 12px |
| 4 | 16px |
| 5 | 20px |
| 6 | 24px |
| 8 | 32px |
| 10 | 40px |
| 12 | 48px |
| 16 | 64px |
| 20 | 80px |
| 24 | 96px |

## 8.3 Whitespace Strategy

- Marketing section spacing: `80px - 120px`
- Nội dung lesson/blog: khoảng trắng vừa phải, ưu tiên readability
- Card padding: `20px - 28px`
- Form spacing: `12px - 16px`
- Simulator block spacing: `16px - 24px`

## 8.4 Border Radius

- Button: `12px`
- Input: `12px`
- Card thường: `20px`
- Card lớn / hero panel: `24px`
- Badge: `999px`
- Table container: `18px`

Nên theo hướng bo vừa đủ, không vuông cứng và cũng không quá tròn.

## 9. Layout định hướng theo khu vực

## 9.1 Marketing Pages

Đặc điểm:

- airy
- nhiều khoảng trắng
- hero rõ thông điệp
- ít khối gây nhiễu
- section-based storytelling

## 9.2 Learning Pages

Đặc điểm:

- cấu trúc rõ ràng
- điều hướng tốt
- đọc dài không mệt
- liên kết mạnh giữa lesson, quiz và practice

## 9.3 Practice Pages

Đặc điểm:

- cảm giác “interactive lab”
- tập trung vào decision making
- có kết quả, feedback, score, explanation
- UI đậm hơn learning pages một chút

## 9.4 Student Dashboard

Đặc điểm:

- có cảm giác tiến bộ
- summary rõ ràng
- card KPI vừa đủ
- không quá enterprise

## 9.5 Admin Pages

Đặc điểm:

- rõ ràng, dense hơn, tối ưu thao tác
- ưu tiên table, filter, bulk action, CRUD flow
- gần product management tool hơn là marketing website

## 10. Component System

## 10.1 Nguyên tắc component

Component phải có 3 nhóm:

1. Marketing components
2. Learning components
3. Product components

Marketing components dùng cho:

- hero
- feature sections
- testimonials
- pricing

Learning components dùng cho:

- lesson blocks
- module accordion
- path roadmap
- quiz cards
- note box
- glossary link chip

Product components dùng cho:

- dashboard cards
- data rows
- progress widgets
- simulator steps
- result panels
- admin tables

## 10.2 Buttons

### Primary button

- nền xanh primary
- chữ trắng hoặc gần trắng
- hover đậm hơn một nấc
- height khoảng `44px - 48px`
- padding ngang lớn vừa phải
- radius `12px`

### Secondary button

- nền sáng
- viền rõ
- chữ màu text chính
- hover đổi nền nhẹ

### Ghost button

- không nền
- dùng cho link hành động phụ
- hover có nền mờ rất nhẹ

### Danger button

- dùng đỏ có kiểm soát
- chỉ xuất hiện ở admin hoặc destructive action

## 10.3 Cards

Các loại card nên có:

1. Content card
2. Learning path card
3. Course card
4. Lesson progress card
5. Simulator card
6. KPI card
7. Admin stat card

Quy tắc chung:

- viền rõ hơn shadow
- shadow nhẹ và mềm
- card có header, content, action rõ thứ bậc
- card simulator có thể dùng nền đậm hơn card thường

## 10.4 Inputs và Forms

- chiều cao input `44px - 48px`
- label nằm trên input
- helper text rõ ràng
- trạng thái lỗi hiển thị ngay dưới field
- không dùng placeholder thay cho label
- form trong admin ưu tiên hiệu quả, form ngoài public ưu tiên cảm giác nhẹ nhàng

## 10.5 Navigation

### Main navbar

- sticky top
- nền sáng có blur nhẹ hoặc solid nhẹ
- logo trái
- nav chính ở giữa hoặc phải
- CTA rõ ở góc phải

### Dashboard sidebar

- nhóm điều hướng rõ
- icon tối giản
- section active nổi bật bằng background mềm

### Admin sidebar

- compact hơn dashboard học viên
- nhóm menu theo nghiệp vụ
- dễ quét nhanh

## 10.6 Tables

Bắt buộc cho admin.

Phong cách:

- nền sáng
- header rõ
- row divider mềm
- có hover row
- có empty state rõ ràng
- có filter và search trên đầu

## 10.7 Progress Components

Bắt buộc có cho learning product.

Gồm:

- progress bar
- completion ring
- module completion badge
- streak-like progress chip nếu dùng
- lesson completed status

## 10.8 Quiz Components

- question card
- answer option card
- explanation box
- result summary card
- next lesson CTA

## 10.9 Simulator Components

- scenario intro panel
- decision card
- metric table
- score block
- feedback panel
- recommended action list
- retry CTA

## 11. Phong cách cho từng loại trang

## 11.1 Trang chủ

Trang chủ phải mang 3 tầng thông điệp:

1. Học quảng cáo có lộ trình
2. Không chỉ học lý thuyết mà còn được thực hành
3. Học đa nền tảng: Facebook, TikTok, Shopee

Trang chủ nên có:

- Hero mạnh, headline rõ
- visual kiểu “academy x lab”
- section giải thích 3 nền tảng
- section learning path
- section simulator demo
- section why this is different
- section testimonial hoặc proof
- CTA đăng ký

Visual tone:

- sạch, hiện đại, nhiều khoảng trắng
- có khối dữ liệu minh họa nhẹ
- không dùng mockup rối

## 11.2 Learning Path Page

Cảm giác giống roadmap.

Cần có:

- tiêu đề path
- mô tả path
- mức độ
- outcome sau khi học xong
- danh sách module theo thứ tự
- estimated time
- progress nếu đã đăng nhập
- CTA bắt đầu hoặc tiếp tục

Phong cách:

- cấu trúc dọc rõ ràng
- từng module như một checkpoint
- có icon hoặc số thứ tự rõ

## 11.3 Course Page

Nên là sự kết hợp của:

- sales clarity
- curriculum clarity
- product confidence

Cần có:

- course hero
- thông tin level, duration, platform
- danh sách module
- instructor hoặc source note nếu có
- CTA học ngay
- related wiki hoặc practice

## 11.4 Lesson Page

Đây là trang đọc dài nên ưu tiên readability.

Nên có:

- breadcrumb
- lesson title
- lesson meta
- nội dung chia section rõ
- callout box
- key takeaways
- related wiki links
- next/previous navigation
- mark complete
- CTA làm quiz

Visual rules:

- cột nội dung không quá rộng
- heading rõ cấp bậc
- danh sách, blockquote, note box dễ đọc
- có vùng sticky side TOC nếu cần ở desktop

## 11.5 Quiz Page

Cần tạo cảm giác kiểm tra nhẹ nhàng, không quá áp lực.

Nên có:

- progress của quiz
- 1 câu một màn hình hoặc block rõ ràng
- answer states trực quan
- submit rõ ràng
- result page dễ hiểu
- explanation ưu tiên học lại hơn chỉ chấm đúng sai

## 11.6 Practice Hub

Nên khác lesson page một chút để người dùng hiểu đây là khu thực hành.

Đặc trưng:

- hero ngắn gọn hơn
- card simulator nổi bật
- dùng teal và ink panel nhiều hơn learning area
- có nhãn difficulty và estimated time

## 11.7 Simulator Page

Đây là trang cần đầu tư nhất sau homepage.

Simulator nên có cảm giác:

- giống một phòng lab
- tập trung vào quyết định
- số liệu và feedback rõ ràng

Cấu trúc lý tưởng:

1. Intro
2. Context
3. Input or choice
4. Submit
5. Result
6. Explanation
7. Retry or continue

Visual tone:

- dùng panel nền sáng + block dữ liệu nền đậm
- dùng mono font cho KPI
- làm rõ trạng thái đúng, sai, tạm ổn, tối ưu hơn

## 11.8 Dashboard học viên

Dashboard học viên không nên quá enterprise.

Nó nên mang cảm giác:

- bạn đang tiến bộ
- bạn có việc tiếp theo rõ ràng
- bạn có lịch sử học và thực hành

Section nên có:

- greeting và summary
- continue learning card
- progress by course
- recent practice results
- recommended next action
- upcoming milestone

## 11.9 Admin

Admin nên đi theo hướng:

- functional first
- speed first
- dense but clear

Admin không cần cố làm đẹp như public site.

Ưu tiên:

- table tốt
- form rõ
- search tốt
- bulk action rõ
- status rõ
- publish workflow rõ

## 12. Hình ảnh và minh họa

## 12.1 Hướng minh họa

Không nên phụ thuộc quá nhiều vào stock photo người ngồi laptop.

Nên ưu tiên:

- abstract product illustration
- data-inspired shapes
- dashboard snippets
- visual cards minh họa logic học
- icon-based explanation

## 12.2 Ảnh cho từng khu

- Home: abstract learning + dashboard visual
- Learning path: roadmap visual
- Lesson: hạn chế hình quá nhiều
- Simulator: UI-based mock panel
- Blog/Wiki: cover ảnh có hệ thống, cùng style

## 12.3 Iconography

Khuyến nghị:

- icon line hoặc duotone nhẹ
- nét gọn
- không quá cartoon
- nhất quán stroke width

## 13. Motion và interaction

## 13.1 Motion principle

Motion nên có nhưng phải tiết chế.

Mục tiêu:

- tăng clarity
- tăng cảm giác chất lượng
- giúp người dùng hiểu trạng thái thay đổi

Không dùng motion để phô diễn.

## 13.2 Motion rules

- hover transition: `150ms - 200ms`
- page reveal nhẹ: `200ms - 300ms`
- accordion/module expand: mượt nhưng ngắn
- card hover: dịch lên rất nhẹ hoặc đổi shadow nhẹ
- progress animation: vừa đủ, không kéo dài

## 13.3 Motion theo khu vực

- Home: có stagger reveal nhẹ
- Learning pages: motion tối thiểu
- Simulator: trạng thái phản hồi rõ ràng hơn
- Dashboard: số liệu có thể animate nhẹ khi load
- Admin: hầu như không cần motion trang trí

## 14. Copywriting trong UI

Ngôn ngữ UI nên là:

- rõ
- ngắn
- hỗ trợ học tập
- mang tính hướng dẫn

Nên viết như một mentor hướng dẫn người học.

Ví dụ tốt:

- Start your first simulator
- Continue lesson
- Review why this answer works
- You improved from your last attempt

Không nên viết kiểu marketing quá đà:

- Become a master instantly
- Hack the algorithm now
- Secret formula revealed

## 15. Accessibility

Bắt buộc có từ đầu:

- contrast đạt mức đọc tốt
- focus state rõ ràng
- keyboard navigation cho quiz và simulator
- label đúng cho form
- không chỉ dùng màu để biểu đạt đúng sai
- font size body không dưới 16px ở nội dung chính
- click target đủ lớn

## 16. Responsive Design

## 16.1 Breakpoints đề xuất

- Mobile: `0 - 767px`
- Tablet: `768 - 1023px`
- Desktop: `1024 - 1439px`
- Large desktop: `1440px+`

## 16.2 Quy tắc responsive

- lesson content luôn ưu tiên đọc được trên mobile
- dashboard card stack hợp lý
- simulator trên mobile nên chia step rõ hơn desktop
- bảng admin trên mobile cần fallback thành card list hoặc horizontal scroll có kiểm soát

## 17. Design Tokens khuyến nghị

Ví dụ token nên tạo sớm:

### Color tokens

- `color.bg.default`
- `color.bg.surface`
- `color.bg.elevated`
- `color.bg.ink`
- `color.text.primary`
- `color.text.secondary`
- `color.text.inverse`
- `color.border.default`
- `color.brand.primary`
- `color.state.success`
- `color.state.warning`
- `color.state.error`

### Typography tokens

- `font.heading`
- `font.body`
- `font.mono`
- `text.display`
- `text.h1`
- `text.h2`
- `text.body`
- `text.caption`

### Spacing tokens

- `space.1`
- `space.2`
- `space.3`
- `space.4`
- `space.6`
- `space.8`
- `space.12`
- `space.16`
- `space.20`

### Radius tokens

- `radius.sm`
- `radius.md`
- `radius.lg`
- `radius.xl`
- `radius.full`

### Shadow tokens

- `shadow.sm`
- `shadow.md`
- `shadow.lg`

## 18. Gợi ý CSS Variables ban đầu

```css
:root {
  --bg: #f6f4ee;
  --surface: #fffdf8;
  --surface-strong: #ffffff;
  --text: #14181f;
  --text-muted: #5a6472;
  --border: #ded8cc;
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --teal: #0f9d8a;
  --green: #2f9e44;
  --amber: #d97706;
  --red: #dc2626;
  --ink-panel: #101826;
  --ink-panel-soft: #192235;

  --font-heading: 'Sora', sans-serif;
  --font-body: 'IBM Plex Sans', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  --radius-sm: 10px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;

  --shadow-sm: 0 6px 16px rgba(20, 24, 31, 0.06);
  --shadow-md: 0 12px 32px rgba(20, 24, 31, 0.08);
  --shadow-lg: 0 18px 48px rgba(20, 24, 31, 0.1);
}
```

## 19. Do and Don't

### Do

- ưu tiên hierarchy rõ ràng
- ưu tiên readability cho lesson và wiki
- tạo khác biệt thị giác giữa học và thực hành
- dùng data UI vừa đủ để gợi cảm giác chạy ads thật
- dùng progress để giữ động lực học
- giữ admin functional và nhanh

### Don't

- không làm mọi trang giống nhau
- không lạm dụng gradient và glow
- không dùng quá nhiều màu thương hiệu cùng lúc
- không biến simulator thành form khô cứng
- không biến lesson page thành một bài blog không điều hướng
- không làm dashboard học viên quá giống admin

## 20. Kết luận phong cách

Nếu mô tả trong một câu:

Ads Learning Hub nên trông như một học viện performance marketing hiện đại, nơi nội dung rõ ràng như docs, lộ trình mạch lạc như learning platform, và phần thực hành mang cảm giác của một lab tối ưu quảng cáo thực thụ.

## 21. Việc nên làm tiếp theo

Sau file này, các tài liệu nên tạo tiếp là:

1. `ui-component-inventory.md`
2. `page-wireframe-notes.md`
3. `design-tokens.md`
4. `homepage-art-direction.md`
5. `simulator-ui-rules.md`
