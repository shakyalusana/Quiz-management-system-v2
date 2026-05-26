"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Sparkles, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkComponent } from "@/components/Link";
import { loginSchema } from "@/libs/validationSchema";
import type { z } from "zod";
import { useAuthHandler } from "@/libs/useAuthHandler";
import { zodResolver } from "@hookform/resolvers/zod";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { handleLogin, isLoggingIn } = useAuthHandler();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <div className="space-y-8">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center justify-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <span className="text-xl font-bold">QuizMaster</span>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2 text-center lg:text-left"
      >
        <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-5"
      >
        {/* Email */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Label className="font-medium">Email</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className="h-12 bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 backdrop-blur-sm transition-all duration-200"
          />
          {errors.email && (
            <motion.p
              className="text-sm text-rose-500 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.email.message}
            </motion.p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label className="font-medium">Password</Label>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className="h-12 bg-white/5 border border-white/10 pr-12 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 backdrop-blur-sm transition-all duration-200"
            />

            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </motion.button>
          </div>

          {errors.password && (
            <motion.p
              className="text-sm text-rose-500 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.password.message}
            </motion.p>
          )}
        </motion.div>

        {/* Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Button
            type="submit"
            disabled={isLoggingIn}
            className="w-full h-12 font-semibold shadow-primary/40 text-muted transition-all duration-200"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <LinkComponent
          href="/register"
          className="text-primary font-medium hover:underline"
        >
          Create one
        </LinkComponent>
      </p>
    </div>
  );
}
