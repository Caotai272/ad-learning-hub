import { z } from "zod";

export const bookmarkToggleSchema = z.object({
  targetType: z.enum(["LESSON", "GLOSSARY_TERM"]),
  targetId: z.string().min(1),
});

export type BookmarkToggleInput = z.infer<typeof bookmarkToggleSchema>;
