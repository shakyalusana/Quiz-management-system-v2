import { z } from "zod";

export const questionSchema = z.object({
  text: z.string().min(5, "Question is required"),

  options: z.array(z.string().min(1, "Option required")).min(2),

  correctOption: z.number(),

  categoryId: z.string().min(1, "Category required"),

  difficulty: z.enum(["easy", "medium", "hard"]),
});

export type QuestionInput = z.infer<typeof questionSchema>;
