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
    { label: "At least 6 characters", met: password?.length >= 6 },
  ];

  return (
    <div className="space-y-8">
      {/* Mobile header */}
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
        <h1 className="text-4xl font-bold tracking-tight">Create account</h1>
        <p className="text-muted-foreground">
          Start your quiz journey in seconds
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-5"
      >
        {/* Name */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Label className="font-medium">Full name</Label>
          <Input
            type="text"
            placeholder="John Doe"
            {...register("name")}
            className="h-12 bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 backdrop-blur-sm transition-all duration-200"
          />
          {errors.name && (
            <motion.p
              className="text-sm text-rose-500 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.name.message}
            </motion.p>
          )}
        </motion.div>

        {/* Email */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
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
          transition={{ delay: 0.35 }}
        >
          <Label className="font-medium">Password</Label>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
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

          {/* Requirements */}
          <div className="space-y-2 pt-1">
            {passwordRequirements.map((req, i) => (
              <motion.div
                key={req.label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center gap-2 text-xs"
              >
                <div
                  className={`h-4 w-4 rounded-full flex items-center justify-center transition ${
                    req.met ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {req.met && <Check className="h-2.5 w-2.5" />}
                </div>
                <span
                  className={
                    req.met ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  {req.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Confirm Password */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label className="font-medium">Confirm password</Label>

          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              {...register("confirmPassword")}
              className="h-12 bg-white/5 border border-white/10 pr-12 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 backdrop-blur-sm transition-all duration-200"
            />

            <motion.button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </motion.button>
          </div>

          {errors.confirmPassword && (
            <motion.p
              className="text-sm text-rose-500 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.confirmPassword.message}
            </motion.p>
          )}
        </motion.div>

        {/* Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Button
            type="submit"
            disabled={isRegistering}
            className="w-full h-12 font-semibold  shadow-primary/40 text-muted transition-all duration-200"
          >
            {isRegistering ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.form>

      {/* Terms */}
      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        By creating an account, you agree to our{" "}
        <span className="text-primary hover:underline cursor-pointer">
          Terms of Service
        </span>{" "}
        and{" "}
        <span className="text-primary hover:underline cursor-pointer">
          Privacy Policy
        </span>
      </p>

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <LinkComponent
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </LinkComponent>
      </p>
    </div>
  );
}
