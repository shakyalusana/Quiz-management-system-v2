import LinkComponent from "@/components/Link";
import { Logo } from "@/components/Logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Brain, PlayCircle, Trophy, Users } from "lucide-react";

const index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex gap-2">
            <AnimatedThemeToggler />

            <Button asChild variant="ghost">
              <LinkComponent href="/login">Sign in</LinkComponent>
            </Button>
            <Button asChild>
              <LinkComponent href="/register">Get started</LinkComponent>
            </Button>
          </div>
        </div>
      </header>
      <section className="bg-(image:--gradient-hero) text-primary-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-medium backdrop-blur">
            <Brain className="h-4 w-4" /> Quiz Management System
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl mx-auto">
            Run quizzes that players actually love.
          </h1>
          <p className="text-primary-foreground/80 max-w-xl mx-auto text-lg">
            Create question banks, host live quizzes, track player history, and
            see your top minds rise on the leaderboard.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Button asChild size="lg" variant="secondary">
              <LinkComponent href="/players">
                <PlayCircle className="h-5 w-5" /> Player demo
              </LinkComponent>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LinkComponent href="/admin/dashboard">Admin demo</LinkComponent>
            </Button>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-20 grid gap-8 md:grid-cols-3">
        {[
          {
            icon: PlayCircle,
            title: "Take quizzes",
            desc: "Timed, categorized, with instant scoring and review.",
          },
          {
            icon: Trophy,
            title: "Climb leaderboards",
            desc: "Compete globally and watch your rank rise.",
          },
          {
            icon: Users,
            title: "Manage players",
            desc: "Admins manage users, questions, and analytics.",
          },
        ].map((f) => (
          <div key={f.title} className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="text-muted-foreground text-sm">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default index;
