import { Sparkles, Zap, Target, Trophy } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Modern Bento Grid Branding */}
      <div className="hidden lg:flex lg:w-[55%] p-6">
        <div className="w-full rounded-3xl bg-gradient-to-br from-card via-card to-muted/30 border border-border/50 p-8 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary glow-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">
              QuizMaster
            </span>
          </div>

          {/* Bento Grid */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {/* Large hero card */}
            <div className="col-span-2 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 flex flex-col justify-end card-hover">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium w-fit">
                  <Zap className="h-3.5 w-3.5" />
                  Interactive Learning
                </div>
                <h1 className="text-3xl xl:text-4xl font-bold text-foreground text-balance leading-tight">
                  Challenge Your Mind,
                  <br />
                  Master Every Topic
                </h1>
                <p className="text-muted-foreground text-pretty max-w-lg">
                  Join thousands of learners testing their skills. Track
                  progress, climb leaderboards, and become a champion.
                </p>
              </div>
            </div>

            {/* Stats cards */}
            <div className="rounded-2xl bg-secondary/50 border border-border/50 p-6 flex flex-col justify-between card-hover">
              <Target className="h-8 w-8 text-primary mb-4" />
              <div>
                <p className="text-4xl font-bold text-foreground">500+</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Questions Available
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-secondary/50 border border-border/50 p-6 flex flex-col justify-between card-hover">
              <Trophy className="h-8 w-8 text-chart-3 mb-4" />
              <div>
                <p className="text-4xl font-bold text-foreground">1,200+</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Active Players
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
            <p>Built for curious minds</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
