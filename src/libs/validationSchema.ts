import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters." })
  .max(128, { message: "Password must be at most 128 characters." })
  .refine((p) => !/\s/.test(p), {
    message: "Password must not contain spaces.",
  })
  .refine((p) => /[a-z]/.test(p), {
    message: "Password must contain a lowercase letter.",
  })
  .refine((p) => /[A-Z]/.test(p), {
    message: "Password must contain an uppercase letter.",
  })
  .refine((p) => /[0-9]/.test(p), {
    message: "Password must contain a number.",
  })
  .refine((p) => /[^A-Za-z0-9]/.test(p), {
    message: "Password must contain a symbol (e.g. !@#$%).",
  });
const emailSchema = z
  .string()
  .trim()
  .min(5, { message: "Please enter your email." })
  .max(254, { message: "Email is too long." })
  .email({ message: "Please provide a valid email address." });

const fullNameSchema = z
  .string()
  .trim()
  .min(2, { message: "Full name must be at least 2 characters." })
  .max(100, { message: "Full name must be at most 100 characters." })
  .refine((name) => /^[a-zA-Z\s]+$/.test(name), {
    message: "Full name can only contain letters and spaces.",
  });

// register schema
export const registerSchema = z
  .object({
    email: emailSchema,
    name: fullNameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;
// login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
