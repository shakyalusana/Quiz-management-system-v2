import z from "zod";

export type UserRole = "admin" | "player";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  totalQuizzes: number;
  averageScore: number;
}

// Quiz types
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number; // in minutes
  questions: Question[];
  totalPoints: number;
  createdAt: Date;
  isActive: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  userId: string;
  answers: number[];
  score: number;
  totalPoints: number;
  percentage: number;
  completedAt: Date;
  timeTaken: number; // in seconds
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar?: string;
  totalScore: number;
  quizzesCompleted: number;
  averageScore: number;
}

// Question form schema
export const questionSchema = z.object({
  text: z.string().min(10, "Question must be at least 10 characters"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .length(4, "Must have exactly 4 options"),
  correctAnswer: z.number().min(0).max(3),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  points: z.number().min(1).max(100),
});

export type QuestionFormData = z.infer<typeof questionSchema>;

// Quiz form schema
export const quizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  timeLimit: z.number().min(1).max(120),
  isActive: z.boolean(),
});

export type QuizFormData = z.infer<typeof quizSchema>;
