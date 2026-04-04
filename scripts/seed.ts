import { hash } from "bcryptjs";

import { prisma as basePrisma } from "@/server/db";

const publishedAt = new Date();
// Prisma Client đã generate đúng schema mới; seed script dùng cast cục bộ để tránh lỗi type ở lớp script.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = basePrisma as any;

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@adslearninghub.vn";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const adminName = process.env.ADMIN_NAME ?? "Quản trị viên";

  const passwordHash = await hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Seeded admin account: ${admin.email}`);
  return admin;
}

async function seedLearningCatalog() {
  const facebookPath = await prisma.learningPath.upsert({
    where: { slug: "facebook-ads" },
    update: {
      title: "Lộ trình Facebook Ads từ nền tảng đến tối ưu",
      summary: "Học Facebook Ads theo từng bước: Campaign, Ad Set, Creative, Pixel và Conversion.",
      description:
        "Lộ trình dành cho người mới muốn hiểu đúng cấu trúc tài khoản, tư duy setup và cách đọc chỉ số trong Facebook Ads.",
      platform: "FACEBOOK_ADS",
      level: "BEGINNER",
      status: "PUBLISHED",
      sortOrder: 1,
      estimatedHours: 14,
      publishedAt,
    },
    create: {
      slug: "facebook-ads",
      title: "Lộ trình Facebook Ads từ nền tảng đến tối ưu",
      summary: "Học Facebook Ads theo từng bước: Campaign, Ad Set, Creative, Pixel và Conversion.",
      description:
        "Lộ trình dành cho người mới muốn hiểu đúng cấu trúc tài khoản, tư duy setup và cách đọc chỉ số trong Facebook Ads.",
      platform: "FACEBOOK_ADS",
      level: "BEGINNER",
      status: "PUBLISHED",
      sortOrder: 1,
      estimatedHours: 14,
      publishedAt,
    },
  });

  const tiktokPath = await prisma.learningPath.upsert({
    where: { slug: "tiktok-ads" },
    update: {
      title: "Lộ trình TikTok Ads thực chiến cho người mới",
      summary: "Tập trung vào Creative, Hook, Audience, Testing và tối ưu Conversion trên TikTok Ads.",
      description:
        "Lộ trình giúp người học hiểu sự khác nhau giữa TikTok Ads và các nền tảng khác, đặc biệt ở phần Creative Testing.",
      platform: "TIKTOK_ADS",
      level: "BEGINNER",
      status: "PUBLISHED",
      sortOrder: 2,
      estimatedHours: 12,
      publishedAt,
    },
    create: {
      slug: "tiktok-ads",
      title: "Lộ trình TikTok Ads thực chiến cho người mới",
      summary: "Tập trung vào Creative, Hook, Audience, Testing và tối ưu Conversion trên TikTok Ads.",
      description:
        "Lộ trình giúp người học hiểu sự khác nhau giữa TikTok Ads và các nền tảng khác, đặc biệt ở phần Creative Testing.",
      platform: "TIKTOK_ADS",
      level: "BEGINNER",
      status: "PUBLISHED",
      sortOrder: 2,
      estimatedHours: 12,
      publishedAt,
    },
  });

  const shopeePath = await prisma.learningPath.upsert({
    where: { slug: "shopee-ads" },
    update: {
      title: "Lộ trình Shopee Ads cho người bán mới",
      summary: "Làm quen với Sponsored Discovery, Sponsored Search, từ khóa và tối ưu ROAS trong Shopee Ads.",
      description:
        "Lộ trình dành cho người bán muốn xây nền hiểu biết đúng về cấu trúc quảng cáo bên trong hệ sinh thái Shopee.",
      platform: "SHOPEE_ADS",
      level: "BEGINNER",
      status: "PUBLISHED",
      sortOrder: 3,
      estimatedHours: 10,
      publishedAt,
    },
    create: {
      slug: "shopee-ads",
      title: "Lộ trình Shopee Ads cho người bán mới",
      summary: "Làm quen với Sponsored Discovery, Sponsored Search, từ khóa và tối ưu ROAS trong Shopee Ads.",
      description:
        "Lộ trình dành cho người bán muốn xây nền hiểu biết đúng về cấu trúc quảng cáo bên trong hệ sinh thái Shopee.",
      platform: "SHOPEE_ADS",
      level: "BEGINNER",
      status: "PUBLISHED",
      sortOrder: 3,
      estimatedHours: 10,
      publishedAt,
    },
  });

  const facebookCourse = await prisma.course.upsert({
    where: { slug: "facebook-ads-beginner-foundations" },
    update: {
      title: "Facebook Ads Beginner Foundations",
      summary: "Nắm cấu trúc Campaign, Ad Set, Creative và cách đọc các chỉ số nền tảng.",
      description:
        "Khóa học mở đầu cho người mới bắt đầu với Facebook Ads, tập trung vào nền tảng setup và tư duy tối ưu ban đầu.",
      platform: "FACEBOOK_ADS",
      level: "BEGINNER",
      status: "PUBLISHED",
      sortOrder: 1,
      estimatedHours: 8,
      publishedAt,
    },
    create: {
      slug: "facebook-ads-beginner-foundations",
      title: "Facebook Ads Beginner Foundations",
      summary: "Nắm cấu trúc Campaign, Ad Set, Creative và cách đọc các chỉ số nền tảng.",
      description:
        "Khóa học mở đầu cho người mới bắt đầu với Facebook Ads, tập trung vào nền tảng setup và tư duy tối ưu ban đầu.",
      platform: "FACEBOOK_ADS",
      level: "BEGINNER",
      status: "PUBLISHED",
      sortOrder: 1,
      estimatedHours: 8,
      publishedAt,
    },
  });

  const tiktokCourse = await prisma.course.upsert({
    where: { slug: "tiktok-ads-beginner-foundations" },
    update: {
      title: "TikTok Ads Beginner Foundations",
      summary: "Hiểu cách hoạt động của TikTok Ads, Creative Testing và các chỉ số cần theo dõi.",
      description:
        "Khóa học giúp người mới nắm được sự khác biệt trong tư duy Creative và cách vận hành quảng cáo trên TikTok.",
      platform: "TIKTOK_ADS",
      level: "BEGINNER",
      status: "PUBLISHED",
      sortOrder: 2,
      estimatedHours: 8,
      publishedAt,
    },
    create: {
      slug: "tiktok-ads-beginner-foundations",
      title: "TikTok Ads Beginner Foundations",
      summary: "Hiểu cách hoạt động của TikTok Ads, Creative Testing và các chỉ số cần theo dõi.",
      description:
        "Khóa học giúp người mới nắm được sự khác biệt trong tư duy Creative và cách vận hành quảng cáo trên TikTok.",
      platform: "TIKTOK_ADS",
      level: "BEGINNER",
      status: "PUBLISHED",
      sortOrder: 2,
      estimatedHours: 8,
      publishedAt,
    },
  });

  const shopeeCourse = await prisma.course.upsert({
    where: { slug: "shopee-ads-beginner-foundations" },
    update: {
      title: "Shopee Ads Beginner Foundations",
      summary: "Làm quen với Sponsored Discovery, Sponsored Search và logic phân bổ ngân sách trong Shopee Ads.",
      description:
        "Khóa học nền cho người mới muốn hiểu cách setup và tối ưu quảng cáo ngay trong hệ sinh thái Shopee.",
      platform: "SHOPEE_ADS",
      level: "BEGINNER",
      status: "PUBLISHED",
      sortOrder: 3,
      estimatedHours: 7,
      publishedAt,
    },
    create: {
      slug: "shopee-ads-beginner-foundations",
      title: "Shopee Ads Beginner Foundations",
      summary: "Làm quen với Sponsored Discovery, Sponsored Search và logic phân bổ ngân sách trong Shopee Ads.",
      description:
        "Khóa học nền cho người mới muốn hiểu cách setup và tối ưu quảng cáo ngay trong hệ sinh thái Shopee.",
      platform: "SHOPEE_ADS",
      level: "BEGINNER",
      status: "PUBLISHED",
      sortOrder: 3,
      estimatedHours: 7,
      publishedAt,
    },
  });

  await prisma.learningPathCourse.upsert({
    where: {
      learningPathId_courseId: {
        learningPathId: facebookPath.id,
        courseId: facebookCourse.id,
      },
    },
    update: { sortOrder: 1 },
    create: {
      learningPathId: facebookPath.id,
      courseId: facebookCourse.id,
      sortOrder: 1,
    },
  });

  await prisma.learningPathCourse.upsert({
    where: {
      learningPathId_courseId: {
        learningPathId: tiktokPath.id,
        courseId: tiktokCourse.id,
      },
    },
    update: { sortOrder: 1 },
    create: {
      learningPathId: tiktokPath.id,
      courseId: tiktokCourse.id,
      sortOrder: 1,
    },
  });

  await prisma.learningPathCourse.upsert({
    where: {
      learningPathId_courseId: {
        learningPathId: shopeePath.id,
        courseId: shopeeCourse.id,
      },
    },
    update: { sortOrder: 1 },
    create: {
      learningPathId: shopeePath.id,
      courseId: shopeeCourse.id,
      sortOrder: 1,
    },
  });

  const facebookModule = await prisma.courseModule.upsert({
    where: {
      courseId_slug: {
        courseId: facebookCourse.id,
        slug: "facebook-campaign-basics",
      },
    },
    update: {
      title: "Campaign Basics",
      summary: "Hiểu Campaign Objective, Ad Set, Creative và Pixel trong Facebook Ads.",
      description:
        "Module này giúp người học nắm được cấu trúc cơ bản trước khi bắt đầu đọc số liệu và tối ưu.",
      status: "PUBLISHED",
      sortOrder: 1,
      publishedAt,
    },
    create: {
      courseId: facebookCourse.id,
      slug: "facebook-campaign-basics",
      title: "Campaign Basics",
      summary: "Hiểu Campaign Objective, Ad Set, Creative và Pixel trong Facebook Ads.",
      description:
        "Module này giúp người học nắm được cấu trúc cơ bản trước khi bắt đầu đọc số liệu và tối ưu.",
      status: "PUBLISHED",
      sortOrder: 1,
      publishedAt,
    },
  });

  const tiktokModule = await prisma.courseModule.upsert({
    where: {
      courseId_slug: {
        courseId: tiktokCourse.id,
        slug: "tiktok-creative-testing",
      },
    },
    update: {
      title: "Creative Testing Foundations",
      summary: "Học cách test Hook, Angle và Creative trong TikTok Ads.",
      description:
        "Module nền cho việc hiểu Creative Testing và cách phân tích kết quả ban đầu trên TikTok.",
      status: "PUBLISHED",
      sortOrder: 1,
      publishedAt,
    },
    create: {
      courseId: tiktokCourse.id,
      slug: "tiktok-creative-testing",
      title: "Creative Testing Foundations",
      summary: "Học cách test Hook, Angle và Creative trong TikTok Ads.",
      description:
        "Module nền cho việc hiểu Creative Testing và cách phân tích kết quả ban đầu trên TikTok.",
      status: "PUBLISHED",
      sortOrder: 1,
      publishedAt,
    },
  });

  const shopeeModule = await prisma.courseModule.upsert({
    where: {
      courseId_slug: {
        courseId: shopeeCourse.id,
        slug: "shopee-search-discovery-basics",
      },
    },
    update: {
      title: "Sponsored Search & Discovery Basics",
      summary: "Hiểu cấu trúc quảng cáo cơ bản và logic phân bổ ngân sách trong Shopee Ads.",
      description:
        "Module giúp người học làm quen với từ khóa, vị trí hiển thị và cách đọc kết quả quảng cáo trên Shopee.",
      status: "PUBLISHED",
      sortOrder: 1,
      publishedAt,
    },
    create: {
      courseId: shopeeCourse.id,
      slug: "shopee-search-discovery-basics",
      title: "Sponsored Search & Discovery Basics",
      summary: "Hiểu cấu trúc quảng cáo cơ bản và logic phân bổ ngân sách trong Shopee Ads.",
      description:
        "Module giúp người học làm quen với từ khóa, vị trí hiển thị và cách đọc kết quả quảng cáo trên Shopee.",
      status: "PUBLISHED",
      sortOrder: 1,
      publishedAt,
    },
  });

  const facebookLesson = await prisma.lesson.upsert({
    where: {
      courseId_slug: {
        courseId: facebookCourse.id,
        slug: "cau-truc-facebook-ads-tu-campaign-den-creative",
      },
    },
    update: {
      courseModuleId: facebookModule.id,
      title: "Cấu trúc Facebook Ads từ Campaign đến Creative",
      summary: "Hiểu mối quan hệ giữa Campaign, Ad Set, Creative và Pixel.",
      description:
        "Lesson giới thiệu cấu trúc tài khoản và giải thích vai trò của từng lớp trong quá trình setup.",
      status: "PUBLISHED",
      sortOrder: 1,
      estimatedMinutes: 18,
      publishedAt,
    },
    create: {
      courseId: facebookCourse.id,
      courseModuleId: facebookModule.id,
      slug: "cau-truc-facebook-ads-tu-campaign-den-creative",
      title: "Cấu trúc Facebook Ads từ Campaign đến Creative",
      summary: "Hiểu mối quan hệ giữa Campaign, Ad Set, Creative và Pixel.",
      description:
        "Lesson giới thiệu cấu trúc tài khoản và giải thích vai trò của từng lớp trong quá trình setup.",
      status: "PUBLISHED",
      sortOrder: 1,
      estimatedMinutes: 18,
      publishedAt,
    },
  });

  const tiktokLesson = await prisma.lesson.upsert({
    where: {
      courseId_slug: {
        courseId: tiktokCourse.id,
        slug: "creative-testing-tren-tiktok-ads",
      },
    },
    update: {
      courseModuleId: tiktokModule.id,
      title: "Creative Testing trên TikTok Ads",
      summary: "Hiểu cách tách Hook, Angle và Offer khi test Creative.",
      description:
        "Lesson giúp người học tránh test quá nhiều biến cùng lúc và hiểu cách đọc phản hồi từ chỉ số.",
      status: "PUBLISHED",
      sortOrder: 1,
      estimatedMinutes: 16,
      publishedAt,
    },
    create: {
      courseId: tiktokCourse.id,
      courseModuleId: tiktokModule.id,
      slug: "creative-testing-tren-tiktok-ads",
      title: "Creative Testing trên TikTok Ads",
      summary: "Hiểu cách tách Hook, Angle và Offer khi test Creative.",
      description:
        "Lesson giúp người học tránh test quá nhiều biến cùng lúc và hiểu cách đọc phản hồi từ chỉ số.",
      status: "PUBLISHED",
      sortOrder: 1,
      estimatedMinutes: 16,
      publishedAt,
    },
  });

  const shopeeLesson = await prisma.lesson.upsert({
    where: {
      courseId_slug: {
        courseId: shopeeCourse.id,
        slug: "doc-so-lieu-co-ban-trong-shopee-ads",
      },
    },
    update: {
      courseModuleId: shopeeModule.id,
      title: "Đọc số liệu cơ bản trong Shopee Ads",
      summary: "Hiểu CPC, CTR, CR và ROAS trong ngữ cảnh Shopee Ads.",
      description:
        "Lesson nền giúp người học nắm được các metric quan trọng trước khi tối ưu ngân sách và từ khóa.",
      status: "PUBLISHED",
      sortOrder: 1,
      estimatedMinutes: 15,
      publishedAt,
    },
    create: {
      courseId: shopeeCourse.id,
      courseModuleId: shopeeModule.id,
      slug: "doc-so-lieu-co-ban-trong-shopee-ads",
      title: "Đọc số liệu cơ bản trong Shopee Ads",
      summary: "Hiểu CPC, CTR, CR và ROAS trong ngữ cảnh Shopee Ads.",
      description:
        "Lesson nền giúp người học nắm được các metric quan trọng trước khi tối ưu ngân sách và từ khóa.",
      status: "PUBLISHED",
      sortOrder: 1,
      estimatedMinutes: 15,
      publishedAt,
    },
  });

  await prisma.lessonBlock.deleteMany({
    where: {
      lessonId: {
        in: [facebookLesson.id, tiktokLesson.id, shopeeLesson.id],
      },
    },
  });

  await prisma.lessonBlock.createMany({
    data: [
      {
        lessonId: facebookLesson.id,
        type: "TEXT",
        title: "Tư duy đúng về cấu trúc tài khoản",
        sortOrder: 1,
        content: {
          body: "Trong Facebook Ads, Campaign quyết định Objective, Ad Set quyết định Audience và ngân sách, còn Creative là nơi người dùng thực sự tương tác.",
        },
      },
      {
        lessonId: facebookLesson.id,
        type: "CALLOUT",
        title: "Điểm cần nhớ",
        sortOrder: 2,
        content: {
          body: "Đừng tối ưu CTR mà bỏ qua Conversion. Một Creative có CTR cao nhưng Conversion thấp vẫn có thể làm CPA xấu.",
        },
      },
      {
        lessonId: tiktokLesson.id,
        type: "TEXT",
        title: "Creative Testing không phải đổi mọi thứ cùng lúc",
        sortOrder: 1,
        content: {
          body: "Khi test trên TikTok Ads, nên tách từng biến như Hook, Angle, Offer hoặc CTA để hiểu nguyên nhân khiến kết quả thay đổi.",
        },
      },
      {
        lessonId: shopeeLesson.id,
        type: "TEXT",
        title: "Đọc metric trong bối cảnh đúng",
        sortOrder: 1,
        content: {
          body: "CPC thấp chưa chắc tốt nếu từ khóa không mang lại Conversion. Cần nhìn đồng thời CTR, CR và ROAS.",
        },
      },
    ],
  });

  const facebookQuiz = await prisma.quiz.upsert({
    where: {
      courseId_slug: {
        courseId: facebookCourse.id,
        slug: "facebook-campaign-structure-quiz",
      },
    },
    update: {
      courseModuleId: facebookModule.id,
      lessonId: facebookLesson.id,
      title: "Quiz: Campaign Structure Foundations",
      description: "Đánh giá nhanh mức độ hiểu về Campaign, Ad Set, Creative và Conversion.",
      status: "PUBLISHED",
      passingScore: 70,
      timeLimitMinutes: 10,
      maxAttempts: 3,
      sortOrder: 1,
      publishedAt,
    },
    create: {
      courseId: facebookCourse.id,
      courseModuleId: facebookModule.id,
      lessonId: facebookLesson.id,
      slug: "facebook-campaign-structure-quiz",
      title: "Quiz: Campaign Structure Foundations",
      description: "Đánh giá nhanh mức độ hiểu về Campaign, Ad Set, Creative và Conversion.",
      status: "PUBLISHED",
      passingScore: 70,
      timeLimitMinutes: 10,
      maxAttempts: 3,
      sortOrder: 1,
      publishedAt,
    },
  });

  await prisma.quizQuestion.deleteMany({
    where: {
      quizId: facebookQuiz.id,
    },
  });

  const questionOne = await prisma.quizQuestion.create({
    data: {
      quizId: facebookQuiz.id,
      type: "SINGLE_CHOICE",
      prompt: "Trong Facebook Ads, lớp nào thường quyết định Audience và budget?",
      explanation:
        "Campaign quyết định Objective. Ad Set là nơi thường cấu hình Audience, Placement, Bid hoặc budget tùy cấu trúc chiến dịch.",
      points: 1,
      sortOrder: 1,
    },
  });

  const questionTwo = await prisma.quizQuestion.create({
    data: {
      quizId: facebookQuiz.id,
      type: "SINGLE_CHOICE",
      prompt: "Metric nào nên được nhìn cùng Conversion để tránh tối ưu lệch?",
      explanation:
        "CTR chỉ phản ánh mức hấp dẫn của Creative ở tầng click. Muốn tránh lệch, cần đọc CTR cùng Conversion hoặc CR.",
      points: 1,
      sortOrder: 2,
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        questionId: questionOne.id,
        label: "Campaign",
        isCorrect: false,
        sortOrder: 1,
      },
      {
        questionId: questionOne.id,
        label: "Ad Set",
        isCorrect: true,
        sortOrder: 2,
      },
      {
        questionId: questionOne.id,
        label: "Creative",
        isCorrect: false,
        sortOrder: 3,
      },
      {
        questionId: questionOne.id,
        label: "Pixel",
        isCorrect: false,
        sortOrder: 4,
      },
      {
        questionId: questionTwo.id,
        label: "CTR",
        isCorrect: true,
        sortOrder: 1,
      },
      {
        questionId: questionTwo.id,
        label: "Frequency",
        isCorrect: false,
        sortOrder: 2,
      },
      {
        questionId: questionTwo.id,
        label: "Reach",
        isCorrect: false,
        sortOrder: 3,
      },
      {
        questionId: questionTwo.id,
        label: "Impression",
        isCorrect: false,
        sortOrder: 4,
      },
    ],
  });

  console.log("Seeded learning paths, courses, modules, lessons and sample quiz.");
}

async function main() {
  await seedAdmin();
  await seedLearningCatalog();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
