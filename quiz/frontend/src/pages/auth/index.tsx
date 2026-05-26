import { Sparkles, Zap, Target, Trophy } from "lucide-react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* 🌫️ Soft background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[26rem] w-[26rem] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full bg-purple-500/10 blur-[140px]" />
      </div>

      {/* Left branding */}
      <div className="hidden lg:flex lg:w-[55%] p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 flex flex-col"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              QuizMaster
            </span>
          </div>

          {/* Grid */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {/* Hero */}
            <div className="col-span-2 rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-8 flex flex-col justify-end">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm w-fit">
                  <Zap className="h-3.5 w-3.5" />
                  Interactive Learning
                </div>

                <h1 className="text-3xl xl:text-4xl font-bold leading-tight">
                  Challenge Your Mind,
                  <br />
                  Master Every Topic
                </h1>

                <p className="text-muted-foreground max-w-md">
                  Track progress, compete with others, and turn learning into a
                  game of skill and speed.
                </p>
              </div>
            </div>

            {/* Card 1 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border/50 bg-muted/30 p-6"
            >
              <Target className="h-7 w-7 text-primary mb-4" />
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-muted-foreground mt-1">
                Questions Available
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border/50 bg-muted/30 p-6"
            >
              <Trophy className="h-7 w-7 text-yellow-500 mb-4" />
              <p className="text-3xl font-bold">1.2K+</p>
              <p className="text-sm text-muted-foreground mt-1">
                Active Players
              </p>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
            <span>Built for curious minds</span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live system
            </span>
          </div>
        </motion.div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
