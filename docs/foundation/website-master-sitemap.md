# Ads Learning Hub - Master Sitemap and Folder Structure

## 1. Purpose

This document is the single source of truth for:

- the project folder structure we will implement
- the complete website sitemap
- public pages, learning pages, practice pages, exercise pages
- student dashboard pages
- admin pages and their child pages
- route grouping for future development

This document is written to help us keep the product scope consistent during design, content planning, and development.

## 1.1 Product Language Rule

This sitemap may use English page names for technical planning, but the shipped product must follow:

- all user-facing interface copy uses `tiếng Việt UTF-8`
- lessons, wiki, blog, quiz, simulator and dashboard content use `tiếng Việt`
- all domain-specific ads terms stay in their standard English form; examples such as `CTR`, `CPM`, `ROAS`, `Pixel`, `Lookalike`, `Conversion` are illustrative only, not a limited list

## 2. Product Positioning

Ads Learning Hub is a learning platform focused on:

- Facebook Ads
- TikTok Ads
- Shopee Ads

The product combines:

- Theory: blog, wiki, glossary, learning paths, lessons
- Practice: simulator, quiz, scenario-based exercises, case analysis
- Application: templates, checklists, calculators, case studies

## 3. Product Areas

The website is divided into 6 main areas:

1. Marketing website
2. Learning hub
3. Practice hub
4. Student dashboard
5. Account and authentication
6. Admin CMS and operations

## 4. Proposed Project Folder Structure

Assumption for implementation:

- Web app uses a modern React framework with route-based pages
- We separate public pages, learning pages, practice pages, dashboard, and admin
- Content can be stored in DB and/or Markdown/MDX later

```text
ad-learning-hub/
├─ docs/
│  ├─ foundation/
│  │  ├─ website-master-sitemap.md
│  │  ├─ mvp-detailed-plan.md
│  │  ├─ design-style-guide.md
│  │  └─ project-technical-architecture.md
│  ├─ content-model.md
│  ├─ database-schema.md
│  └─ product-roadmap.md
├─ public/
│  ├─ images/
│  │  ├─ brand/
│  │  ├─ icons/
│  │  ├─ platforms/
│  │  ├─ blog/
│  │  └─ case-studies/
│  ├─ illustrations/
│  └─ simulator-assets/
├─ src/
│  ├─ app/
│  │  ├─ (marketing)/
│  │  │  ├─ page.tsx                          -> /
│  │  │  ├─ about/
│  │  │  ├─ pricing/
│  │  │  ├─ contact/
│  │  │  ├─ faq/
│  │  │  ├─ blog/
│  │  │  ├─ wiki/
│  │  │  ├─ glossary/
│  │  │  ├─ case-studies/
│  │  │  ├─ tools/
│  │  │  └─ compare-platforms/
│  │  ├─ (auth)/
│  │  │  ├─ login/
│  │  │  ├─ register/
│  │  │  ├─ forgot-password/
│  │  │  ├─ reset-password/
│  │  │  └─ verify-email/
│  │  ├─ (learn)/
│  │  │  ├─ learning-paths/
│  │  │  ├─ courses/
│  │  │  ├─ modules/
│  │  │  ├─ lessons/
│  │  │  ├─ quizzes/
│  │  │  └─ certificates/
│  │  ├─ (practice)/
│  │  │  ├─ practice/
│  │  │  ├─ simulators/
│  │  │  ├─ exercises/
│  │  │  ├─ scenarios/
│  │  │  └─ challenges/
│  │  ├─ dashboard/
│  │  │  ├─ overview/
│  │  │  ├─ my-courses/
│  │  │  ├─ my-practice/
│  │  │  ├─ bookmarks/
│  │  │  ├─ certificates/
│  │  │  ├─ settings/
│  │  │  └─ billing/
│  │  ├─ admin/
│  │  │  ├─ dashboard/
│  │  │  ├─ content/
│  │  │  ├─ learning/
│  │  │  ├─ practice/
│  │  │  ├─ users/
│  │  │  ├─ enrollments/
│  │  │  ├─ analytics/
│  │  │  ├─ marketing/
│  │  │  ├─ settings/
│  │  │  └─ media/
│  │  ├─ api/
│  │  │  ├─ auth/
│  │  │  ├─ content/
│  │  │  ├─ learning/
│  │  │  ├─ practice/
│  │  │  ├─ progress/
│  │  │  ├─ admin/
│  │  │  └─ webhooks/
│  │  ├─ sitemap.ts
│  │  ├─ robots.ts
│  │  ├─ not-found.tsx
│  │  └─ layout.tsx
│  ├─ components/
│  │  ├─ common/
│  │  ├─ layout/
│  │  ├─ marketing/
│  │  ├─ learning/
│  │  ├─ practice/
│  │  ├─ dashboard/
│  │  ├─ admin/
│  │  └─ ui/
│  ├─ features/
│  │  ├─ auth/
│  │  ├─ blog/
│  │  ├─ wiki/
│  │  ├─ glossary/
│  │  ├─ learning-paths/
│  │  ├─ lessons/
│  │  ├─ quizzes/
│  │  ├─ simulators/
│  │  ├─ exercises/
│  │  ├─ case-studies/
│  │  ├─ tools/
│  │  ├─ progress/
│  │  ├─ payments/
│  │  └─ admin/
│  ├─ content/
│  │  ├─ blog/
│  │  ├─ wiki/
│  │  ├─ glossary/
│  │  ├─ learning-paths/
│  │  ├─ lessons/
│  │  ├─ quizzes/
│  │  ├─ case-studies/
│  │  ├─ simulators/
│  │  ├─ exercises/
│  │  └─ templates/
│  ├─ lib/
│  │  ├─ auth/
│  │  ├─ db/
│  │  ├─ seo/
│  │  ├─ analytics/
│  │  ├─ permissions/
│  │  ├─ simulator/
│  │  └─ utils/
│  ├─ types/
│  ├─ config/
│  ├─ hooks/
│  ├─ styles/
│  └─ data/
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  └─ e2e/
├─ package.json
└─ README.md
```

## 5. Information Architecture Overview

```text
Home
├─ About
├─ Pricing
├─ Contact
├─ FAQ
├─ Blog
├─ Wiki
├─ Glossary
├─ Learning Paths
│  ├─ Facebook Ads Path
│  ├─ TikTok Ads Path
│  ├─ Shopee Ads Path
│  └─ Cross-Platform Foundations
├─ Courses
├─ Practice
│  ├─ Simulators
│  ├─ Exercises
│  ├─ Scenarios
│  └─ Challenges
├─ Case Studies
├─ Tools
├─ Dashboard
└─ Admin
```

## 6. Full Public Sitemap

### 6.1 Core Marketing Pages

| Route | Page Name | Type | Notes |
| --- | --- | --- | --- |
| `/` | Home | Public | Main landing page |
| `/about` | About | Public | Brand story, mission, team |
| `/pricing` | Pricing | Public | Free, Pro, Membership |
| `/contact` | Contact | Public | Contact form, support info |
| `/faq` | FAQ | Public | Common product questions |
| `/terms` | Terms | Public | Legal |
| `/privacy` | Privacy Policy | Public | Legal |
| `/cookie-policy` | Cookie Policy | Public | Legal |

### 6.2 Blog and Knowledge Pages

| Route | Page Name | Type | Notes |
| --- | --- | --- | --- |
| `/blog` | Blog Listing | Public | Latest posts, categories |
| `/blog/[slug]` | Blog Detail | Public | SEO article page |
| `/blog/category/[slug]` | Blog Category | Public | Topic-based listing |
| `/wiki` | Wiki Home | Public | Structured knowledge base |
| `/wiki/[topic]` | Wiki Topic Page | Public | Topic overview |
| `/wiki/[topic]/[slug]` | Wiki Detail | Public | Deep knowledge article |
| `/glossary` | Glossary Listing | Public | Terminology index |
| `/glossary/[term]` | Glossary Detail | Public | Definition and related lessons |

### 6.3 Learning Path Pages

| Route | Page Name | Type | Notes |
| --- | --- | --- | --- |
| `/learning-paths` | Learning Paths Listing | Public | All learning tracks |
| `/learning-paths/facebook-ads` | Facebook Ads Path | Public | Path landing page |
| `/learning-paths/tiktok-ads` | TikTok Ads Path | Public | Path landing page |
| `/learning-paths/shopee-ads` | Shopee Ads Path | Public | Path landing page |
| `/learning-paths/cross-platform-foundations` | Cross-Platform Foundations | Public | Shared fundamentals |

### 6.4 Course and Lesson Pages

| Route | Page Name | Type | Notes |
| --- | --- | --- | --- |
| `/courses` | Course Listing | Public | All available courses |
| `/courses/[course-slug]` | Course Landing | Public | Overview, modules, CTA |
| `/courses/[course-slug]/modules/[module-slug]` | Module Overview | Mixed | Can be gated |
| `/courses/[course-slug]/lessons/[lesson-slug]` | Lesson Detail | Mixed | Lesson content |
| `/courses/[course-slug]/quizzes/[quiz-slug]` | Quiz Page | Auth | Theory check |
| `/courses/[course-slug]/certificate` | Course Certificate | Auth | After completion |

### 6.5 Practice Hub Pages

| Route | Page Name | Type | Notes |
| --- | --- | --- | --- |
| `/practice` | Practice Hub Home | Public/Auth | Entry point for practice |
| `/simulators` | Simulator Listing | Public/Auth | All simulators |
| `/simulators/[simulator-slug]` | Simulator Detail | Auth | Overview and start |
| `/simulators/[simulator-slug]/start` | Simulator Session | Auth | Interactive practice |
| `/simulators/[simulator-slug]/result` | Simulator Result | Auth | Feedback and score |
| `/exercises` | Exercise Listing | Public/Auth | Practice tasks |
| `/exercises/[exercise-slug]` | Exercise Detail | Auth | Exercise page |
| `/scenarios` | Scenario Listing | Public/Auth | Case-based drills |
| `/scenarios/[scenario-slug]` | Scenario Detail | Auth | Guided situation page |
| `/challenges` | Challenge Listing | Public/Auth | Advanced timed challenges |
| `/challenges/[challenge-slug]` | Challenge Detail | Auth | Multi-step assessment |

### 6.6 Case Study and Tools Pages

| Route | Page Name | Type | Notes |
| --- | --- | --- | --- |
| `/case-studies` | Case Study Listing | Public | Filter by platform and industry |
| `/case-studies/[slug]` | Case Study Detail | Public/Auth | Deep applied analysis |
| `/tools` | Tools Listing | Public/Auth | Calculators and checklists |
| `/tools/break-even-roas` | Break-even ROAS Calculator | Public/Auth | Tool page |
| `/tools/budget-planner` | Budget Planner | Public/Auth | Tool page |
| `/tools/kpi-benchmark` | KPI Benchmark Tool | Public/Auth | Tool page |
| `/tools/campaign-audit-checklist` | Campaign Audit Checklist | Public/Auth | Tool page |
| `/tools/creative-checklist` | Creative Checklist | Public/Auth | Tool page |
| `/compare-platforms` | Platform Comparison Hub | Public | Compare Facebook, TikTok, Shopee |

## 7. Complete Learning Sitemap

### 7.1 Main Learning Tracks

1. Cross-Platform Foundations
2. Facebook Ads
3. TikTok Ads
4. Shopee Ads

### 7.2 Shared Foundations Track

```text
/learning-paths/cross-platform-foundations
├─ What Is Performance Marketing
├─ Customer Journey and Funnel
├─ Offer and Positioning
├─ Creative Strategy Fundamentals
├─ Metrics Fundamentals
├─ Budget and Bidding Fundamentals
├─ Landing Page and Conversion Basics
├─ Tracking and Attribution Basics
├─ Testing Mindset
└─ Reporting and Optimization Basics
```

### 7.3 Facebook Ads Learning Structure

```text
/learning-paths/facebook-ads
├─ Beginner
│  ├─ Introduction to Facebook Ads
│  ├─ Ads Manager Basics
│  ├─ Campaign Objectives
│  ├─ Campaign Structure
│  ├─ Audience Basics
│  ├─ Budget Basics
│  ├─ Creative Basics
│  ├─ Tracking Basics
│  └─ First Campaign Walkthrough
├─ Intermediate
│  ├─ Testing Audiences
│  ├─ Testing Creatives
│  ├─ Retargeting
│  ├─ Scaling Rules
│  ├─ KPI Reading
│  ├─ Diagnosing Bad Performance
│  └─ Budget Allocation
└─ Advanced
   ├─ Advanced Funnel Strategy
   ├─ Advanced Creative Systems
   ├─ Multi-angle Testing
   ├─ Scaling Under Constraints
   ├─ Reporting Framework
   └─ Troubleshooting Cases
```

### 7.4 TikTok Ads Learning Structure

```text
/learning-paths/tiktok-ads
├─ Beginner
│  ├─ Introduction to TikTok Ads
│  ├─ TikTok Ads Manager Basics
│  ├─ Campaign Objectives
│  ├─ TikTok Creative Principles
│  ├─ Hook and Retention Basics
│  ├─ Budget Basics
│  ├─ Event Tracking Basics
│  └─ First Campaign Walkthrough
├─ Intermediate
│  ├─ Creative Testing
│  ├─ UGC and Native-Style Ads
│  ├─ KPI Reading
│  ├─ Optimization Decisions
│  ├─ Scaling Video Winners
│  └─ Conversion Troubleshooting
└─ Advanced
   ├─ Advanced Creative Pipeline
   ├─ Iteration Systems
   ├─ Offer Matching
   ├─ Broad vs Structured Testing
   ├─ Advanced Reporting
   └─ Troubleshooting Cases
```

### 7.5 Shopee Ads Learning Structure

```text
/learning-paths/shopee-ads
├─ Beginner
│  ├─ Introduction to Shopee Ads
│  ├─ Seller Center Basics
│  ├─ Search Ads Basics
│  ├─ Discovery Ads Basics
│  ├─ Keyword Basics
│  ├─ Product Page Basics
│  ├─ Budget Basics
│  └─ First Campaign Walkthrough
├─ Intermediate
│  ├─ Keyword Optimization
│  ├─ Product Selection Strategy
│  ├─ Reading Shopee Metrics
│  ├─ Improving Conversion Rate
│  ├─ Budget Allocation
│  └─ Troubleshooting Poor ROAS
└─ Advanced
   ├─ Catalog Prioritization
   ├─ Search Intent Strategy
   ├─ Offer and Pricing Impact
   ├─ Advanced Optimization Framework
   ├─ Reporting
   └─ Troubleshooting Cases
```

## 8. Practice and Exercise Sitemap

This section is important because it defines which pages are theory pages and which pages are practice pages.

### 8.1 Practice Page Categories

1. Quiz pages
2. Simulator pages
3. Exercise pages
4. Scenario pages
5. Challenge pages

### 8.2 Which Pages Are Practice Pages

| Route Group | Practice Type | Purpose |
| --- | --- | --- |
| `/courses/[course-slug]/quizzes/[quiz-slug]` | Theory quiz | Test lesson understanding |
| `/simulators/[simulator-slug]/start` | Interactive simulator | Hands-on practice |
| `/exercises/[exercise-slug]` | Structured exercise | Guided practice |
| `/scenarios/[scenario-slug]` | Situation drill | Decision-making practice |
| `/challenges/[challenge-slug]` | Timed assessment | End-of-module evaluation |

### 8.3 Simulator Categories

```text
/simulators
├─ Campaign Setup Simulator
│  ├─ Facebook Campaign Setup
│  ├─ TikTok Campaign Setup
│  └─ Shopee Campaign Setup
├─ Metrics Reading Simulator
│  ├─ Facebook Metrics Diagnosis
│  ├─ TikTok Metrics Diagnosis
│  └─ Shopee Metrics Diagnosis
├─ Optimization Decision Simulator
│  ├─ Facebook Optimization Lab
│  ├─ TikTok Optimization Lab
│  └─ Shopee Optimization Lab
├─ Creative Evaluation Simulator
│  ├─ Facebook Creative Review
│  ├─ TikTok Creative Review
│  └─ Shopee Listing and Creative Review
└─ Budget Allocation Simulator
   ├─ Facebook Budget Planner Drill
   ├─ TikTok Budget Planner Drill
   └─ Shopee Budget Planner Drill
```

### 8.4 Exercise Categories

```text
/exercises
├─ Foundation Exercises
│  ├─ Identify Funnel Stage
│  ├─ Match KPI to Problem
│  ├─ Choose the Right Objective
│  └─ Pick the Right Audience
├─ Facebook Exercises
│  ├─ Build a Campaign Structure
│  ├─ Diagnose High CPM
│  ├─ Diagnose Low CTR
│  ├─ Diagnose Low Conversion Rate
│  └─ Decide Whether to Scale
├─ TikTok Exercises
│  ├─ Pick Best Hook
│  ├─ Diagnose High CPC
│  ├─ Diagnose Creative Fatigue
│  ├─ Improve Video Concept
│  └─ Decide Whether to Iterate or Kill
└─ Shopee Exercises
   ├─ Select Best Product to Promote
   ├─ Keyword Selection
   ├─ Diagnose Low Product Conversion
   ├─ Diagnose Poor ROAS
   └─ Improve Listing Before Scaling
```

### 8.5 Scenario Pages

Scenarios are case-based practice pages where the learner receives a business context and must make decisions.

```text
/scenarios
├─ New Product Launch Scenario
├─ Low Budget Starter Scenario
├─ High Traffic No Sales Scenario
├─ Retargeting Recovery Scenario
├─ Shopee Search Optimization Scenario
├─ TikTok Viral but No Conversion Scenario
└─ Facebook Scaling After Winning Creative Scenario
```

### 8.6 Challenge Pages

Challenges are larger, more assessment-style pages.

```text
/challenges
├─ Facebook Beginner Certification Challenge
├─ TikTok Beginner Certification Challenge
├─ Shopee Beginner Certification Challenge
├─ Cross-Platform KPI Diagnosis Challenge
├─ Creative Strategy Challenge
└─ Full Funnel Media Buying Challenge
```

## 9. Detailed Public Page Tree

```text
/
├─ /about
├─ /pricing
├─ /contact
├─ /faq
├─ /terms
├─ /privacy
├─ /cookie-policy
├─ /blog
│  ├─ /blog/category/[slug]
│  └─ /blog/[slug]
├─ /wiki
│  ├─ /wiki/facebook-ads
│  ├─ /wiki/tiktok-ads
│  ├─ /wiki/shopee-ads
│  ├─ /wiki/metrics
│  ├─ /wiki/creative-strategy
│  ├─ /wiki/tracking
│  └─ /wiki/[topic]/[slug]
├─ /glossary
│  └─ /glossary/[term]
├─ /learning-paths
│  ├─ /learning-paths/cross-platform-foundations
│  ├─ /learning-paths/facebook-ads
│  ├─ /learning-paths/tiktok-ads
│  └─ /learning-paths/shopee-ads
├─ /courses
│  └─ /courses/[course-slug]
│     ├─ /modules/[module-slug]
│     ├─ /lessons/[lesson-slug]
│     ├─ /quizzes/[quiz-slug]
│     └─ /certificate
├─ /practice
├─ /simulators
│  └─ /simulators/[simulator-slug]
│     ├─ /start
│     └─ /result
├─ /exercises
│  └─ /exercises/[exercise-slug]
├─ /scenarios
│  └─ /scenarios/[scenario-slug]
├─ /challenges
│  └─ /challenges/[challenge-slug]
├─ /case-studies
│  └─ /case-studies/[slug]
├─ /tools
│  ├─ /tools/break-even-roas
│  ├─ /tools/budget-planner
│  ├─ /tools/kpi-benchmark
│  ├─ /tools/campaign-audit-checklist
│  └─ /tools/creative-checklist
└─ /compare-platforms
```

## 10. Account and Student Dashboard Sitemap

### 10.1 Authentication Pages

| Route | Page Name | Notes |
| --- | --- | --- |
| `/login` | Login | Email/password or social login |
| `/register` | Register | New account |
| `/forgot-password` | Forgot Password | Send reset email |
| `/reset-password` | Reset Password | New password |
| `/verify-email` | Verify Email | Email confirmation |

### 10.2 Student Dashboard Pages

| Route | Page Name | Purpose |
| --- | --- | --- |
| `/dashboard` | Dashboard Home | Overall progress |
| `/dashboard/overview` | Overview | Summary cards |
| `/dashboard/my-courses` | My Courses | Enrolled courses |
| `/dashboard/my-courses/[course-slug]` | My Course Detail | Continue learning |
| `/dashboard/my-practice` | My Practice | Practice history |
| `/dashboard/my-practice/simulators` | Simulator History | Past sessions |
| `/dashboard/my-practice/exercises` | Exercise History | Completed exercises |
| `/dashboard/my-practice/challenges` | Challenge History | Challenge results |
| `/dashboard/bookmarks` | Saved Content | Saved lessons and articles |
| `/dashboard/certificates` | Certificates | Completed certifications |
| `/dashboard/settings` | Account Settings | Profile, password |
| `/dashboard/billing` | Billing | Subscription and invoices |
| `/dashboard/notifications` | Notifications | Learning reminders |

## 11. Admin Sitemap

Admin must be treated as a full system, not just a few edit screens.

### 11.1 Admin Main Areas

1. Admin dashboard
2. Content management
3. Learning management
4. Practice management
5. User management
6. Enrollment and subscription management
7. Analytics and reporting
8. Marketing management
9. Media management
10. Settings and permissions

### 11.2 Admin Route Tree

```text
/admin
├─ /admin/dashboard
├─ /admin/content
│  ├─ /blog
│  ├─ /wiki
│  ├─ /glossary
│  ├─ /case-studies
│  ├─ /categories
│  ├─ /tags
│  └─ /authors
├─ /admin/learning
│  ├─ /paths
│  ├─ /courses
│  ├─ /modules
│  ├─ /lessons
│  ├─ /quizzes
│  ├─ /question-bank
│  └─ /certificates
├─ /admin/practice
│  ├─ /simulators
│  ├─ /simulator-sessions
│  ├─ /exercises
│  ├─ /scenarios
│  ├─ /challenges
│  ├─ /grading-rules
│  └─ /feedback-templates
├─ /admin/users
│  ├─ /students
│  ├─ /instructors
│  ├─ /admins
│  ├─ /roles
│  └─ /permissions
├─ /admin/enrollments
│  ├─ /courses
│  ├─ /subscriptions
│  ├─ /orders
│  ├─ /coupons
│  └─ /refunds
├─ /admin/analytics
│  ├─ /content
│  ├─ /learning
│  ├─ /practice
│  ├─ /revenue
│  └─ /retention
├─ /admin/marketing
│  ├─ /landing-pages
│  ├─ /seo
│  ├─ /email-campaigns
│  ├─ /hero-banners
│  └─ /testimonials
├─ /admin/media
│  ├─ /library
│  ├─ /uploads
│  └─ /folders
└─ /admin/settings
   ├─ /general
   ├─ /branding
   ├─ /navigation
   ├─ /integrations
   ├─ /payment
   ├─ /email
   └─ /audit-log
```

### 11.3 Detailed Admin Page List

| Route | Page Name | Purpose |
| --- | --- | --- |
| `/admin/dashboard` | Admin Dashboard | KPIs, latest activity, quick actions |
| `/admin/content/blog` | Manage Blog Posts | Create, edit, publish, archive |
| `/admin/content/wiki` | Manage Wiki Articles | Structured knowledge management |
| `/admin/content/glossary` | Manage Glossary | Term management |
| `/admin/content/case-studies` | Manage Case Studies | Publish practical examples |
| `/admin/content/categories` | Manage Categories | Content taxonomy |
| `/admin/content/tags` | Manage Tags | Search and grouping |
| `/admin/content/authors` | Manage Authors | Author profile management |
| `/admin/learning/paths` | Manage Learning Paths | Control learning tracks |
| `/admin/learning/courses` | Manage Courses | Course overview management |
| `/admin/learning/modules` | Manage Modules | Module ordering and gating |
| `/admin/learning/lessons` | Manage Lessons | Lesson content editing |
| `/admin/learning/quizzes` | Manage Quizzes | Quiz setup |
| `/admin/learning/question-bank` | Question Bank | Reusable quiz questions |
| `/admin/learning/certificates` | Manage Certificates | Certificate templates |
| `/admin/practice/simulators` | Manage Simulators | Practice engine setup |
| `/admin/practice/simulator-sessions` | Simulator Sessions | Review learner attempts |
| `/admin/practice/exercises` | Manage Exercises | Guided tasks |
| `/admin/practice/scenarios` | Manage Scenarios | Case-based practice setup |
| `/admin/practice/challenges` | Manage Challenges | Assessment flows |
| `/admin/practice/grading-rules` | Grading Rules | Scoring logic |
| `/admin/practice/feedback-templates` | Feedback Templates | Automated feedback text |
| `/admin/users/students` | Manage Students | Student accounts |
| `/admin/users/instructors` | Manage Instructors | Instructor accounts |
| `/admin/users/admins` | Manage Admins | Internal accounts |
| `/admin/users/roles` | Manage Roles | RBAC |
| `/admin/users/permissions` | Manage Permissions | Access control |
| `/admin/enrollments/courses` | Course Enrollments | Enrollment management |
| `/admin/enrollments/subscriptions` | Subscriptions | Membership status |
| `/admin/enrollments/orders` | Orders | Payment records |
| `/admin/enrollments/coupons` | Coupons | Promotions |
| `/admin/enrollments/refunds` | Refunds | Refund handling |
| `/admin/analytics/content` | Content Analytics | Blog and wiki views |
| `/admin/analytics/learning` | Learning Analytics | Progress and completion |
| `/admin/analytics/practice` | Practice Analytics | Attempts, scores, pass rate |
| `/admin/analytics/revenue` | Revenue Analytics | Sales metrics |
| `/admin/analytics/retention` | Retention Analytics | Return usage and cohort data |
| `/admin/marketing/landing-pages` | Landing Pages | SEO and conversions |
| `/admin/marketing/seo` | SEO Manager | Metadata and indexing |
| `/admin/marketing/email-campaigns` | Email Campaigns | Lifecycle communication |
| `/admin/marketing/hero-banners` | Hero Banners | Home page promo control |
| `/admin/marketing/testimonials` | Testimonials | Social proof management |
| `/admin/media/library` | Media Library | Asset browsing |
| `/admin/media/uploads` | Uploads | New media |
| `/admin/media/folders` | Media Folders | Asset organization |
| `/admin/settings/general` | General Settings | Site basics |
| `/admin/settings/branding` | Branding Settings | Logo, colors, assets |
| `/admin/settings/navigation` | Navigation Settings | Menus and footer |
| `/admin/settings/integrations` | Integrations | Analytics, CRM, email |
| `/admin/settings/payment` | Payment Settings | Payment providers |
| `/admin/settings/email` | Email Settings | SMTP or transactional mail |
| `/admin/settings/audit-log` | Audit Log | Admin activity logs |

## 12. Content Types We Need

The system should support these content entities from the beginning:

1. Blog post
2. Wiki article
3. Glossary term
4. Learning path
5. Course
6. Module
7. Lesson
8. Quiz
9. Question
10. Simulator
11. Exercise
12. Scenario
13. Challenge
14. Case study
15. Tool
16. Certificate
17. Category
18. Tag
19. User
20. Enrollment
21. Subscription

## 13. Navigation Structure

### 13.1 Main Header Navigation

- Home
- Learning Paths
- Courses
- Practice
- Blog
- Wiki
- Case Studies
- Tools
- Pricing
- Login or Dashboard

### 13.2 Footer Navigation

- About
- Contact
- FAQ
- Terms
- Privacy
- Blog
- Wiki
- Case Studies
- Tools

### 13.3 Dashboard Navigation

- Overview
- My Courses
- My Practice
- Bookmarks
- Certificates
- Settings
- Billing

### 13.4 Admin Navigation

- Dashboard
- Content
- Learning
- Practice
- Users
- Enrollments
- Analytics
- Marketing
- Media
- Settings

## 14. Suggested MVP Scope

To avoid building too much at once, this is the recommended MVP cut:

### Phase 1

- Home
- About
- Pricing
- Contact
- Blog listing and detail
- Wiki listing and detail
- Learning paths listing
- 3 learning path landing pages
- Course structure for Facebook, TikTok, Shopee beginner tracks
- Lesson pages
- Quiz pages
- Practice hub
- 1 metrics reading simulator
- 1 campaign setup simulator
- Student dashboard overview
- Admin content management basic screens
- Admin learning management basic screens
- Admin practice management basic screens

### Phase 2

- Case studies
- Tools
- Scenarios
- Challenges
- Certificates
- Payments and subscriptions
- Advanced analytics pages

### Phase 3

- Community features
- Instructor workflows
- AI feedback assistant
- Personalized recommendations

## 15. Final Route Ownership Summary

### Public and Marketing

- `/`
- `/about`
- `/pricing`
- `/contact`
- `/faq`
- `/terms`
- `/privacy`
- `/cookie-policy`

### Knowledge and Content

- `/blog`
- `/blog/[slug]`
- `/wiki`
- `/wiki/[topic]`
- `/wiki/[topic]/[slug]`
- `/glossary`
- `/glossary/[term]`
- `/case-studies`
- `/case-studies/[slug]`
- `/tools`

### Learning

- `/learning-paths`
- `/learning-paths/[path-slug]`
- `/courses`
- `/courses/[course-slug]`
- `/courses/[course-slug]/modules/[module-slug]`
- `/courses/[course-slug]/lessons/[lesson-slug]`
- `/courses/[course-slug]/quizzes/[quiz-slug]`
- `/courses/[course-slug]/certificate`

### Practice

- `/practice`
- `/simulators`
- `/simulators/[simulator-slug]`
- `/simulators/[simulator-slug]/start`
- `/simulators/[simulator-slug]/result`
- `/exercises`
- `/exercises/[exercise-slug]`
- `/scenarios`
- `/scenarios/[scenario-slug]`
- `/challenges`
- `/challenges/[challenge-slug]`

### Account and Dashboard

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/verify-email`
- `/dashboard`
- `/dashboard/overview`
- `/dashboard/my-courses`
- `/dashboard/my-practice`
- `/dashboard/bookmarks`
- `/dashboard/certificates`
- `/dashboard/settings`
- `/dashboard/billing`
- `/dashboard/notifications`

### Admin

- `/admin/dashboard`
- `/admin/content/*`
- `/admin/learning/*`
- `/admin/practice/*`
- `/admin/users/*`
- `/admin/enrollments/*`
- `/admin/analytics/*`
- `/admin/marketing/*`
- `/admin/media/*`
- `/admin/settings/*`

## 16. Decision Lock For Future Development

The following principles are now fixed unless we intentionally revise this document:

1. Theory and practice are separate but tightly linked product areas.
2. Practice pages include quizzes, simulators, exercises, scenarios, and challenges.
3. The platform must support three main ad ecosystems: Facebook, TikTok, Shopee.
4. Admin is a real operating system with content, learning, practice, analytics, and settings.
5. Learning paths and course pages are separate concepts.
6. The document in this file is the baseline sitemap for future UI and database planning.

## 17. Recommended Next Documents

After this file, the next useful documents should be:

1. content-model.md
2. database-schema.md
3. user-flow.md
4. admin-workflow.md
5. MVP-screen-list.md
