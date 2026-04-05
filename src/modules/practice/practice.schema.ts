import { z } from "zod";

export const practiceSubmissionSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      selectedOptionId: z.string().min(1),
    }),
  ),
});

export type PracticeSubmissionInput = z.infer<typeof practiceSubmissionSchema>;
