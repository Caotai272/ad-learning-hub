# Ads Learning Hub - Detailed MVP Plan

## 1. Why This File Exists

Yes, this file is different from `website-master-sitemap.md`.

Difference:

- `website-master-sitemap.md` = the full product map for the long-term website
- `mvp-detailed-plan.md` = the exact first version we should build now

This file defines:

- which pages are included in MVP
- which pages are excluded from MVP
- what order we should build things
- what the minimum complete product looks like
- how admin and learner flows should work in the MVP

## 1.1 Language Rule For This MVP

Although some route names and page labels in this planning document are written in English for technical clarity, the actual product must follow these rules:

- all user-facing UI is in `tiếng Việt UTF-8`
- all lessons, quizzes, simulator instructions and dashboard copy are in `tiếng Việt`
- all domain-specific ads terms remain in English and are not translated into Vietnamese; items such as `CTR`, `CPM`, `ROAS`, `Pixel`, `Lookalike`, `Conversion` are examples only, not a limited list

## 2. MVP Goal

The MVP must prove 3 things:

1. Users want to learn ads on this platform
2. Users are willing to consume both theory and practice together
3. The simulator-based learning approach is useful enough to continue building

So the MVP should allow one learner to:

1. Discover the platform
2. Create an account
3. Choose a learning path
4. Open a course
5. Study lessons
6. Complete a quiz
7. Try a simulator
8. See their progress in dashboard

And the MVP should allow one admin to:

1. Create learning paths
2. Create courses, modules, lessons
3. Create quizzes
4. Create basic simulator content
5. Publish blog and wiki content
6. Track learner progress at a basic level

## 3. MVP Product Principle

The MVP is not a small brochure site.

The MVP is a working learning platform with 4 real capabilities:

1. Content learning
2. Practice
3. Progress tracking
4. Admin content operations

## 4. MVP Scope Summary

### Included In MVP

- Marketing homepage
- Basic marketing pages
- Blog
- Wiki
- Learning paths
- 3 beginner-level courses
- Lesson pages
- Quiz pages
- Practice hub
- 2 simulators
- Student dashboard
- Admin panel for content and learning management
- Admin panel for practice management
- Basic analytics summary

### Excluded From MVP

- Community
- Comments
- Certificates
- Membership tiers with complex billing
- Advanced scenario engine
- Advanced challenges
- AI mentor
- Email automation journeys
- Coupons and refunds
- Multi-instructor workflows
- Full advanced analytics

## 5. MVP User Roles

We only need these roles in MVP:

1. Guest
2. Student
3. Admin

Optional later:

- Instructor
- Editor
- Support

## 6. MVP Page List

This is the exact page set that should exist in MVP.

## 6.1 Public Marketing Pages

| Route | Page | MVP Status | Notes |
| --- | --- | --- | --- |
| `/` | Home | Required | Main landing page |
| `/about` | About | Required | Brand and platform explanation |
| `/pricing` | Pricing | Required | Even if only Free vs Pro placeholder |
| `/contact` | Contact | Required | Contact form or contact info |
| `/faq` | FAQ | Optional MVP+ | Can launch slightly later |
| `/terms` | Terms | Required | Legal |
| `/privacy` | Privacy | Required | Legal |

## 6.2 Content Pages

| Route | Page | MVP Status | Notes |
| --- | --- | --- | --- |
| `/blog` | Blog Listing | Required | SEO and top-funnel content |
| `/blog/[slug]` | Blog Detail | Required | Individual article |
| `/wiki` | Wiki Listing | Required | Structured knowledge hub |
| `/wiki/[topic]/[slug]` | Wiki Detail | Required | Core educational content |
| `/glossary` | Glossary Listing | Optional MVP+ | Can be added right after launch |
| `/glossary/[term]` | Glossary Detail | Optional MVP+ | Can be phase 1.5 |

## 6.3 Learning Pages

| Route | Page | MVP Status | Notes |
| --- | --- | --- | --- |
| `/learning-paths` | Learning Paths Listing | Required | Main path overview |
| `/learning-paths/facebook-ads` | Facebook Path Page | Required | Beginner scope |
| `/learning-paths/tiktok-ads` | TikTok Path Page | Required | Beginner scope |
| `/learning-paths/shopee-ads` | Shopee Path Page | Required | Beginner scope |
| `/courses` | Course Listing | Required | All available courses |
| `/courses/[course-slug]` | Course Detail | Required | Course intro, modules, CTA |
| `/courses/[course-slug]/modules/[module-slug]` | Module Page | Required | Module overview |
| `/courses/[course-slug]/lessons/[lesson-slug]` | Lesson Page | Required | Main learning page |
| `/courses/[course-slug]/quizzes/[quiz-slug]` | Quiz Page | Required | Lesson/module assessment |

## 6.4 Practice Pages

| Route | Page | MVP Status | Notes |
| --- | --- | --- | --- |
| `/practice` | Practice Hub | Required | Landing page for practice area |
| `/simulators` | Simulator Listing | Required | All available simulators |
| `/simulators/metrics-reading` | Metrics Simulator Detail | Required | MVP simulator 1 |
| `/simulators/metrics-reading/start` | Metrics Simulator Session | Required | Interactive flow |
| `/simulators/metrics-reading/result` | Metrics Simulator Result | Required | Feedback and score |
| `/simulators/campaign-setup-basic` | Campaign Setup Simulator Detail | Required | MVP simulator 2 |
| `/simulators/campaign-setup-basic/start` | Campaign Setup Session | Required | Interactive flow |
| `/simulators/campaign-setup-basic/result` | Campaign Setup Result | Required | Feedback and score |
| `/exercises` | Exercise Listing | Optional MVP+ | Can be replaced by quizzes first |
| `/scenarios` | Scenario Listing | Excluded | Not in MVP |
| `/challenges` | Challenge Listing | Excluded | Not in MVP |

## 6.5 Auth Pages

| Route | Page | MVP Status | Notes |
| --- | --- | --- | --- |
| `/login` | Login | Required | Student/admin login |
| `/register` | Register | Required | Student registration |
| `/forgot-password` | Forgot Password | Required | Basic password reset |
| `/reset-password` | Reset Password | Required | Reset form |

## 6.6 Student Dashboard Pages

| Route | Page | MVP Status | Notes |
| --- | --- | --- | --- |
| `/dashboard` | Dashboard Home | Required | Main entry after login |
| `/dashboard/overview` | Overview | Required | Summary widgets |
| `/dashboard/my-courses` | My Courses | Required | Continue learning |
| `/dashboard/my-courses/[course-slug]` | My Course Detail | Required | Resume course |
| `/dashboard/my-practice` | My Practice | Required | Practice history |
| `/dashboard/bookmarks` | Bookmarks | Optional MVP+ | Can be phase 1.5 |
| `/dashboard/settings` | Settings | Required | Profile and password |
| `/dashboard/billing` | Billing | Optional MVP+ | Only if payment launches immediately |

## 6.7 Admin Pages

| Route | Page | MVP Status | Notes |
| --- | --- | --- | --- |
| `/admin/dashboard` | Admin Dashboard | Required | Basic platform overview |
| `/admin/content/blog` | Manage Blog | Required | CRUD blog |
| `/admin/content/wiki` | Manage Wiki | Required | CRUD wiki |
| `/admin/learning/paths` | Manage Learning Paths | Required | CRUD path |
| `/admin/learning/courses` | Manage Courses | Required | CRUD course |
| `/admin/learning/modules` | Manage Modules | Required | CRUD module |
| `/admin/learning/lessons` | Manage Lessons | Required | CRUD lesson |
| `/admin/learning/quizzes` | Manage Quizzes | Required | CRUD quiz |
| `/admin/practice/simulators` | Manage Simulators | Required | CRUD simulator definitions |
| `/admin/practice/simulator-sessions` | Simulator Sessions | Optional MVP+ | Useful but not day-1 required |
| `/admin/users/students` | Manage Students | Required | View learner accounts |
| `/admin/analytics/learning` | Learning Analytics | Required | Basic completion summary |
| `/admin/settings/general` | General Settings | Optional MVP+ | Minimal version acceptable |

## 7. MVP Content Inventory

To launch MVP properly, we should not launch with empty pages.

Minimum content required:

### 7.1 Learning Paths

- 1 Facebook Ads beginner path
- 1 TikTok Ads beginner path
- 1 Shopee Ads beginner path

### 7.2 Courses

- 3 beginner courses total
- 1 course per platform

Suggested course names:

1. Facebook Ads Beginner Foundations
2. TikTok Ads Beginner Foundations
3. Shopee Ads Beginner Foundations

### 7.3 Modules Per Course

Minimum:

- 4 modules per course

Recommended MVP module structure:

1. Platform introduction
2. Campaign basics
3. Metrics basics
4. First optimization basics

### 7.4 Lessons Per Module

Minimum:

- 3 lessons per module

This means:

- 4 modules x 3 lessons = 12 lessons per course
- 3 courses x 12 lessons = 36 lessons total in MVP

### 7.5 Quizzes

Minimum:

- 1 quiz per module

This means:

- 4 quizzes per course
- 12 quizzes total

### 7.6 Simulators

MVP only needs 2 simulators:

1. Metrics Reading Simulator
2. Campaign Setup Basic Simulator

These can be cross-platform first, then personalized later by platform.

## 8. MVP Learning Flow

This is the learner journey the MVP must support.

```text
Home
-> Learning Path
-> Course Detail
-> Module
-> Lesson
-> Quiz
-> Next Lesson
-> Module Completion
-> Simulator
-> Dashboard Progress
```

Required learner flow:

1. User lands on homepage
2. User chooses a learning path
3. User opens a course
4. User reads lesson content
5. User takes quiz
6. User gets a score
7. User opens simulator
8. User receives simulator result and feedback
9. User sees progress in dashboard

## 9. MVP Admin Flow

This is the admin journey we must support in MVP.

```text
Admin login
-> Create learning path
-> Create course
-> Create modules
-> Create lessons
-> Create quizzes
-> Create simulator
-> Publish content
-> Track users and progress
```

Required admin flow:

1. Admin logs in
2. Admin creates a learning path
3. Admin creates a course and assigns it to a path
4. Admin creates modules under the course
5. Admin creates lessons under modules
6. Admin creates quizzes under modules or lessons
7. Admin creates simulator configuration
8. Admin publishes content
9. Admin checks learner activity

## 10. MVP Features By Area

## 10.1 Home Page MVP Features

The homepage must include:

- Hero section
- Value proposition
- 3 platform cards: Facebook, TikTok, Shopee
- Learn + Practice explanation
- Featured learning paths
- Featured blog or wiki content
- Featured simulator section
- CTA to register

## 10.2 Course Page MVP Features

Each course page must include:

- Course title
- Course description
- Skill level
- Platform tag
- Module list
- Estimated duration
- CTA to start learning
- Progress if logged in

## 10.3 Lesson Page MVP Features

Each lesson page must include:

- Lesson title
- Breadcrumb
- Reading content
- Related wiki links
- Next and previous lesson navigation
- Mark as complete
- CTA to quiz

## 10.4 Quiz Page MVP Features

Each quiz page must include:

- Quiz title
- Question list
- Multiple choice answers
- Submit action
- Score result
- Explanation for correct answer
- CTA to continue learning

## 10.5 Simulator Page MVP Features

Each simulator in MVP must include:

- Intro screen
- Instructions
- Scenario prompt
- Input choices or form selections
- Submit action
- Score or diagnostic result
- Feedback
- Suggested lesson links

## 10.6 Dashboard MVP Features

Dashboard must include:

- Current enrolled courses
- Progress percentage
- Recently completed lessons
- Recent quiz scores
- Recent simulator results
- Continue learning shortcut

## 10.7 Admin MVP Features

Admin must support:

- Create/edit/delete blog posts
- Create/edit/delete wiki articles
- Create/edit/delete learning paths
- Create/edit/delete courses
- Create/edit/delete modules
- Create/edit/delete lessons
- Create/edit/delete quizzes
- Create/edit/delete simulators
- View student list
- View basic analytics

## 11. Pages Excluded From Day-1 MVP

These pages belong to the long-term sitemap but should not be implemented in day-1 MVP:

- `/case-studies`
- `/tools`
- `/glossary`
- `/exercises/[exercise-slug]`
- `/scenarios/[scenario-slug]`
- `/challenges/[challenge-slug]`
- `/dashboard/certificates`
- `/admin/enrollments/*`
- `/admin/marketing/*`
- `/admin/media/*`
- `/admin/settings/*` full version

These can become MVP+ or Phase 2.

## 12. Build Order

This is the recommended implementation order.

We should not start with fancy UI. We should start from the skeleton and core product flows.

## Step 1. Foundation Setup

Goal:

- initialize app structure
- route groups
- layout system
- auth foundation
- database foundation

Tasks:

1. Create app shell
2. Create route groups
3. Create base layout and navigation
4. Set up auth
5. Set up database models
6. Set up admin route protection
7. Set up student route protection

Deliverable:

- app can run with empty pages and protected routes

## Step 2. Core Data Models

Goal:

- define entities needed for MVP

Data models to build first:

1. User
2. LearningPath
3. Course
4. Module
5. Lesson
6. Quiz
7. QuizQuestion
8. BlogPost
9. WikiArticle
10. Simulator
11. SimulatorSession
12. CourseProgress
13. LessonProgress
14. QuizAttempt

Deliverable:

- backend can store content and learner progress

## Step 3. Public Site Skeleton

Goal:

- create first visible product pages

Pages to build now:

1. `/`
2. `/about`
3. `/pricing`
4. `/contact`
5. `/terms`
6. `/privacy`

Deliverable:

- public marketing site is navigable

## Step 4. Content Engine

Goal:

- publish and render educational content

Pages to build:

1. `/blog`
2. `/blog/[slug]`
3. `/wiki`
4. `/wiki/[topic]/[slug]`

Admin screens to build:

1. `/admin/content/blog`
2. `/admin/content/wiki`

Deliverable:

- admin can publish content and public can read it

## Step 5. Learning Path and Course Engine

Goal:

- build the structured learning experience

Pages to build:

1. `/learning-paths`
2. `/learning-paths/facebook-ads`
3. `/learning-paths/tiktok-ads`
4. `/learning-paths/shopee-ads`
5. `/courses`
6. `/courses/[course-slug]`
7. `/courses/[course-slug]/modules/[module-slug]`
8. `/courses/[course-slug]/lessons/[lesson-slug]`

Admin screens to build:

1. `/admin/learning/paths`
2. `/admin/learning/courses`
3. `/admin/learning/modules`
4. `/admin/learning/lessons`

Deliverable:

- complete lesson-based learning flow is available

## Step 6. Quiz System

Goal:

- validate lesson understanding

Pages to build:

1. `/courses/[course-slug]/quizzes/[quiz-slug]`

Admin screens:

1. `/admin/learning/quizzes`

Core features:

1. create quiz
2. attach to module or lesson
3. submit attempt
4. grade attempt
5. show explanation
6. save score

Deliverable:

- users can complete quizzes and receive results

## Step 7. Practice Hub and Simulator 1

Goal:

- launch first practical experience

Pages to build:

1. `/practice`
2. `/simulators`
3. `/simulators/metrics-reading`
4. `/simulators/metrics-reading/start`
5. `/simulators/metrics-reading/result`

Admin screens:

1. `/admin/practice/simulators`

Deliverable:

- first hands-on simulator is usable end to end

## Step 8. Simulator 2

Goal:

- validate the second practice format

Pages to build:

1. `/simulators/campaign-setup-basic`
2. `/simulators/campaign-setup-basic/start`
3. `/simulators/campaign-setup-basic/result`

Deliverable:

- second simulator is live

## Step 9. Dashboard

Goal:

- give learners a place to track progress

Pages to build:

1. `/dashboard`
2. `/dashboard/overview`
3. `/dashboard/my-courses`
4. `/dashboard/my-courses/[course-slug]`
5. `/dashboard/my-practice`
6. `/dashboard/settings`

Deliverable:

- learner can resume learning and view progress

## Step 10. Admin Monitoring and Basic Analytics

Goal:

- support basic operations after launch

Pages to build:

1. `/admin/dashboard`
2. `/admin/users/students`
3. `/admin/analytics/learning`

Deliverable:

- admin can observe early platform usage

## Step 11. MVP Content Population

Goal:

- avoid launching with empty framework only

Content creation order:

1. 3 learning path landing pages
2. 3 course pages
3. 12 modules
4. 36 lessons
5. 12 quizzes
6. 10 blog posts
7. 15 wiki articles
8. 2 simulators

Deliverable:

- website is actually useful on launch day

## Step 12. QA and Launch Preparation

Goal:

- verify key flows before public launch

Test these flows:

1. guest opens homepage to course page
2. guest registers
3. student completes a lesson
4. student submits quiz
5. student runs simulator
6. dashboard updates progress
7. admin creates lesson
8. admin publishes quiz
9. admin updates simulator

Deliverable:

- stable MVP launch candidate

## 13. Recommended Sprint Order

If we split this into sprints, I recommend:

### Sprint 1

- Foundation setup
- Data models
- Public site skeleton

### Sprint 2

- Blog and wiki engine
- Admin content management

### Sprint 3

- Learning paths
- Courses
- Modules
- Lessons
- Admin learning management

### Sprint 4

- Quiz system
- Student progress basics

### Sprint 5

- Practice hub
- Metrics simulator

### Sprint 6

- Campaign setup simulator
- Dashboard
- Admin analytics basics

### Sprint 7

- Content population
- QA
- Launch preparation

## 14. MVP Launch Checklist

The MVP is launch-ready only if all items below are true.

### Product

- Home page is complete
- 3 path pages are complete
- 3 beginner courses are live
- lessons can be read
- quizzes can be submitted
- 2 simulators are usable
- dashboard shows progress

### Admin

- admin can create and edit content
- admin can create and edit learning structure
- admin can create and edit quizzes
- admin can create and edit simulators
- admin can view learners

### Content

- no major empty sections
- all learning paths have enough content
- wiki has foundational support content
- at least 10 blog posts are published

### Technical

- login and registration work
- protected routes work
- progress saves correctly
- result pages work
- navigation works on mobile and desktop
- SEO metadata exists on key pages

## 15. Final MVP Definition

If we want one short sentence:

The MVP is a working ads-learning platform where a student can learn Facebook, TikTok, and Shopee ads through beginner courses, quizzes, and two practical simulators, while an admin can manage all core content from an internal panel.

## 16. What We Should Do Immediately After This File

Recommended next files:

1. `database-schema.md`
2. `user-flow.md`
3. `admin-workflow.md`
4. `mvp-screen-list.md`
5. `content-seeding-plan.md`
