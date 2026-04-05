import { DifficultyLevel, LessonBlockType, Platform, QuizQuestionType } from "@prisma/client";
import { z } from "zod";

export const adminEntityTypeSchema = z.enum([
  "LEARNING_PATH",
  "COURSE",
  "MODULE",
  "LESSON",
  "QUIZ",
]);

export const adminSortDirectionSchema = z.enum(["UP", "DOWN"]);

const optionalNullableString = z
  .string()
  .trim()
  .optional()
  .transform((value) => {
    if (!value) {
      return null;
    }

    return value;
  });

const optionalNullableInt = z
  .union([z.number().int(), z.nan()])
  .optional()
  .transform((value) => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return null;
    }

    return value;
  });

const baseLearningSchema = z.object({
  id: z.string().trim().min(1).optional(),
  title: z.string().trim().min(2, "Tiêu đề phải có ít nhất 2 ký tự."),
  slug: z.string().trim().min(2, "Slug phải có ít nhất 2 ký tự."),
  sortOrder: z.number().int().min(0, "Sort order không hợp lệ."),
});

export const adminLearningPathFormSchema = baseLearningSchema.extend({
  summary: z.string().trim().min(10, "Summary phải có ít nhất 10 ký tự."),
  description: optionalNullableString,
  platform: z.nativeEnum(Platform),
  level: z.nativeEnum(DifficultyLevel),
  estimatedHours: optionalNullableInt,
  courseIds: z.array(z.string().trim().min(1)).default([]),
});

export const adminCourseFormSchema = baseLearningSchema.extend({
  summary: z.string().trim().min(10, "Summary phải có ít nhất 10 ký tự."),
  description: optionalNullableString,
  platform: z.nativeEnum(Platform),
  level: z.nativeEnum(DifficultyLevel),
  estimatedHours: optionalNullableInt,
  thumbnailUrl: optionalNullableString,
  learningPathIds: z.array(z.string().trim().min(1)).default([]),
});

export const adminModuleFormSchema = baseLearningSchema.extend({
  courseId: z.string().trim().min(1, "Bạn cần chọn course."),
  summary: optionalNullableString,
  description: optionalNullableString,
});

export const adminLessonFormSchema = baseLearningSchema.extend({
  courseId: z.string().trim().min(1, "Bạn cần chọn course."),
  courseModuleId: z.string().trim().min(1, "Bạn cần chọn module."),
  summary: optionalNullableString,
  description: optionalNullableString,
  estimatedMinutes: optionalNullableInt,
});

export const adminQuizFormSchema = baseLearningSchema.extend({
  courseId: z.string().trim().min(1, "Bạn cần chọn course."),
  courseModuleId: optionalNullableString,
  lessonId: optionalNullableString,
  description: optionalNullableString,
  passingScore: z.number().int().min(0).max(100),
  timeLimitMinutes: optionalNullableInt,
  maxAttempts: optionalNullableInt,
});

export const adminLearningEntitySchema = z.discriminatedUnion("entityType", [
  z.object({
    entityType: z.literal("LEARNING_PATH"),
    values: adminLearningPathFormSchema,
  }),
  z.object({
    entityType: z.literal("COURSE"),
    values: adminCourseFormSchema,
  }),
  z.object({
    entityType: z.literal("MODULE"),
    values: adminModuleFormSchema,
  }),
  z.object({
    entityType: z.literal("LESSON"),
    values: adminLessonFormSchema,
  }),
  z.object({
    entityType: z.literal("QUIZ"),
    values: adminQuizFormSchema,
  }),
]);

export const adminLearningEntityReorderSchema = z.object({
  entityType: adminEntityTypeSchema,
  entityId: z.string().trim().min(1, "Entity không hợp lệ."),
  direction: adminSortDirectionSchema,
});

export const adminLearningEntityDeleteSchema = z.object({
  entityType: adminEntityTypeSchema,
  entityId: z.string().trim().min(1, "Entity không hợp lệ."),
  confirmationText: z.string().trim().min(1, "Bạn cần nhập tên xác nhận."),
});

export const adminLessonBlockFormSchema = z.object({
  id: z.string().trim().min(1).optional(),
  lessonId: z.string().trim().min(1, "Lesson không hợp lệ."),
  type: z.nativeEnum(LessonBlockType),
  title: optionalNullableString,
  sortOrder: z.number().int().min(0, "Sort order không hợp lệ."),
  body: optionalNullableString,
  tone: z.enum(["info", "success", "warning"]).optional().nullable(),
  itemsText: optionalNullableString,
  columnsText: optionalNullableString,
  rowsText: optionalNullableString,
  metricItemsText: optionalNullableString,
  src: optionalNullableString,
  alt: optionalNullableString,
  caption: optionalNullableString,
  poster: optionalNullableString,
});

export const adminQuizQuestionFormSchema = z.object({
  id: z.string().trim().min(1).optional(),
  quizId: z.string().trim().min(1, "Quiz không hợp lệ."),
  type: z.nativeEnum(QuizQuestionType),
  prompt: z.string().trim().min(2, "Prompt phải có ít nhất 2 ký tự."),
  explanation: optionalNullableString,
  points: z.number().int().min(1, "Points phải lớn hơn hoặc bằng 1."),
  sortOrder: z.number().int().min(0, "Sort order không hợp lệ."),
  choicesText: optionalNullableString,
});

export type AdminLearningPathFormInput = z.infer<typeof adminLearningPathFormSchema>;
export type AdminCourseFormInput = z.infer<typeof adminCourseFormSchema>;
export type AdminModuleFormInput = z.infer<typeof adminModuleFormSchema>;
export type AdminLessonFormInput = z.infer<typeof adminLessonFormSchema>;
export type AdminQuizFormInput = z.infer<typeof adminQuizFormSchema>;
export type AdminLearningEntityInput = z.infer<typeof adminLearningEntitySchema>;
export type AdminLearningEntityReorderInput = z.infer<typeof adminLearningEntityReorderSchema>;
export type AdminLearningEntityDeleteInput = z.infer<typeof adminLearningEntityDeleteSchema>;
export type AdminLessonBlockFormInput = z.infer<typeof adminLessonBlockFormSchema>;
export type AdminQuizQuestionFormInput = z.infer<typeof adminQuizQuestionFormSchema>;
