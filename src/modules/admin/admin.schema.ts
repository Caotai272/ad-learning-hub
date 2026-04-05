import { DifficultyLevel, Platform } from "@prisma/client";
import { z } from "zod";

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

export type AdminLearningPathFormInput = z.infer<typeof adminLearningPathFormSchema>;
export type AdminCourseFormInput = z.infer<typeof adminCourseFormSchema>;
export type AdminModuleFormInput = z.infer<typeof adminModuleFormSchema>;
export type AdminLessonFormInput = z.infer<typeof adminLessonFormSchema>;
export type AdminQuizFormInput = z.infer<typeof adminQuizFormSchema>;
export type AdminLearningEntityInput = z.infer<typeof adminLearningEntitySchema>;
