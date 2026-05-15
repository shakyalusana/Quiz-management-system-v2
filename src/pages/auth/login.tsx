"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Sparkles,
  Eye,
  EyeOff,
  Loader2,
  User,
  Shield,
  ArrowRight,
} from "lucide-react";
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
  const [selectedRole, setSelectedRole] = useState("player");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="space-y-8">
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold">QuizMaster</span>
      </div>

      {/* Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">
          Sign in to continue your learning journey
        </p>
      </div>

      {/* Role Selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setSelectedRole("player")}
          className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
            selectedRole === "player"
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border bg-card hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-sm font-medium">Player</span>
          {selectedRole === "player" && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setSelectedRole("admin")}
          className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
            selectedRole === "admin"
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border bg-card hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Shield className="h-5 w-5" />
          <span className="text-sm font-medium">Admin</span>
          {selectedRole === "admin" && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
          )}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className="h-12 bg-card border-border/50 focus:border-primary"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              className="h-12 bg-card border-border/50 focus:border-primary pr-12"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold glow-primary"
          disabled={isLoggingIn}
        >
          ={" "}
          {isLoggingIn ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Logging in...
            </>
          ) : (
            <>
              Sign In <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Demo Credentials */}
      <div className="rounded-xl bg-card border border-border/50 p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Demo Accounts
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="font-medium text-foreground">Admin</p>
            <p className="text-muted-foreground text-xs">admin@quiz.com</p>
            <p className="text-muted-foreground text-xs">admin123</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">Player</p>
            <p className="text-muted-foreground text-xs">player@quiz.com</p>
            <p className="text-muted-foreground text-xs">player123</p>
          </div>
        </div>
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <LinkComponent
          href="/register"
          className="text-primary hover:underline font-medium"
        >
          Create one
        </LinkComponent>
      </p>
    </div>
  );
}
