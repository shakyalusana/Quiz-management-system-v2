import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Sparkles,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Check,
} from "lucide-react";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuthHandler } from "@/libs/useAuthHandler";
import { registerSchema } from "@/libs/validationSchema";

import LinkComponent from "@/components/Link";

import type { z } from "zod";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { handleRegister, isRegistering } = useAuthHandler();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const passwordRequirements = [
    {
      label: "At least 8 characters",
      met: password?.length >= 8,
    },

    {
      label: "One lowercase letter",
      met: /[a-z]/.test(password || ""),
    },

    {
      label: "One uppercase letter",
      met: /[A-Z]/.test(password || ""),
    },

    {
      label: "One number",
      met: /[0-9]/.test(password || ""),
    },

    {
      label: "One special character",
      met: /[^A-Za-z0-9]/.test(password || ""),
    },
  ];

  return (
    <div className="space-y-8">
      {/* MOBILE HEADER */}

      <div className="lg:hidden flex items-center justify-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>

        <span className="text-xl font-bold">QuizMaster</span>
      </div>

      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.1,
        }}
        className="space-y-2 text-center lg:text-left"
      >
        <h1 className="text-4xl font-bold tracking-tight">Create account</h1>

        <p className="text-muted-foreground">
          Start your quiz journey in seconds
        </p>
      </motion.div>

      {/* FORM */}

      <motion.form
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
        }}
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-5"
      >
        {/* NAME */}

        <div className="space-y-2">
          <Label>Full name</Label>

          <Input
            placeholder="John Doe"
            {...register("name")}
            className="h-12 bg-white/5 border border-white/10"
          />

          {errors.name && (
            <p className="text-sm text-rose-500 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* EMAIL */}

        <div className="space-y-2">
          <Label>Email</Label>

          <Input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className="h-12 bg-white/5 border border-white/10"
          />

          {errors.email && (
            <p className="text-sm text-rose-500 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* PASSWORD */}

        <div className="space-y-2">
          <Label>Password</Label>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              {...register("password")}
              className="
h-12
pr-12
bg-white/5
border
border-white/10
"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
absolute
right-3
top-1/2
-translate-y-1/2
"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.password && (
            <p
              className="
text-sm
text-rose-500
font-medium
"
            >
              {errors.password.message}
            </p>
          )}

          {/* PASSWORD RULES */}

          <div className="space-y-2">
            {passwordRequirements.map((req, index) => (
              <div
                key={req.label}
                className="
flex
items-center
gap-2
text-xs
"
              >
                <div
                  className={`

h-4
w-4
rounded-full
flex
items-center
justify-center

${req.met ? "bg-primary text-primary-foreground" : "bg-muted"}

`}
                >
                  {req.met && <Check className="h-3 w-3" />}
                </div>

                <span>{req.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CONFIRM PASSWORD */}

        <div className="space-y-2">
          <Label>Confirm password</Label>

          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              {...register("confirmPassword")}
              className="
h-12
pr-12
bg-white/5
border
border-white/10
"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="
absolute
right-3
top-1/2
-translate-y-1/2
"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p
              className="
text-sm
text-rose-500
font-medium
"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* SUBMIT BUTTON */}

        <Button
          type="submit"
          disabled={isRegistering}
          className="
w-full
h-12
font-semibold
"
        >
          {isRegistering ? (
            <>
              <Loader2
                className="
h-5
w-5
mr-2
animate-spin
"
              />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight
                className="
ml-2
h-4
w-4
"
              />
            </>
          )}
        </Button>
      </motion.form>

      {/* TERMS */}

      <p
        className="
text-xs
text-muted-foreground
text-center
"
      >
        By creating an account, you agree to our{" "}
        <span className="text-primary hover:underline">Terms of Service</span>{" "}
        and <span className="text-primary hover:underline">Privacy Policy</span>
      </p>

      {/* LOGIN */}

      <p
        className="
text-center
text-sm
text-muted-foreground
"
      >
        Already have an account?{" "}
        <LinkComponent
          href="/login"
          className="
text-primary
font-medium
hover:underline
"
        >
          Sign in
        </LinkComponent>
      </p>
    </div>
  );
}
