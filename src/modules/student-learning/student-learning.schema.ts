import { z } from "zod";

export const quizSubmissionSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      selectedChoiceIds: z.array(z.string().min(1)).default([]),
      answerText: z.string().trim().max(2000).optional(),
    }),
  ),
});

export const pricingPlanActivationSchema = z.object({
  planCode: z.enum(["STARTER", "GROWTH", "LIBRARY"]),
});

export type QuizSubmissionInput = z.infer<typeof quizSubmissionSchema>;
export type PricingPlanActivationInput = z.infer<typeof pricingPlanActivationSchema>;
