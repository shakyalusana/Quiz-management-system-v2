import LinkComponent from "@/components/Link";
import { Logo } from "@/components/Logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Brain, PlayCircle, Trophy, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background Glow Effects */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-30 -left-30 h-80 w-[320px] rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-30 -right-30 h-80 w-[320px] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute top-[40%] left-[50%] h-62.5 w-62.5 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />

          <div className="flex items-center gap-2">
            <AnimatedThemeToggler />

            <Button asChild variant="ghost">
              <LinkComponent href="/login">Sign in</LinkComponent>
            </Button>

            <Button
              asChild
              className="shadow-lg shadow-primary/30 transition-all hover:scale-105"
            >
              <LinkComponent href="/register">Get started</LinkComponent>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background to-purple-500/10" />

        <div className="relative mx-auto max-w-6xl px-6 py-28 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium backdrop-blur-xl">
            <Brain className="h-4 w-4 text-primary" />
            Quiz Management System
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
            The Future of{" "}
            <span className="bg-linear-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Interactive Quizzing
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Create lightning-fast quizzes, host live competitions, track
            rankings in real-time, and transform learning into a battlefield of
            brilliance.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-base shadow-xl shadow-primary/30 transition-all hover:scale-105"
            >
              <LinkComponent href="/players">
                <PlayCircle className="mr-2 h-5 w-5" />
                Player Demo
              </LinkComponent>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/10 bg-white/5 px-8 text-base backdrop-blur-xl hover:bg-white/10"
            >
              <LinkComponent href="/admin/dashboard">Admin Demo</LinkComponent>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              ["10K+", "Questions Created"],
              ["5K+", "Active Players"],
              ["99%", "Quiz Completion"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="text-3xl font-black text-primary">{value}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-24 md:grid-cols-3">
        {[
          {
            icon: PlayCircle,
            title: "Take Quizzes",
            desc: "Real-time gameplay with instant scoring and immersive UX.",
          },
          {
            icon: Trophy,
            title: "Dominate Rankings",
            desc: "Battle through competitive leaderboards and achievements.",
          },
          {
            icon: Users,
            title: "Powerful Admin Tools",
            desc: "Manage questions, players, analytics, and live sessions.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <f.icon className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-bold">{f.title}</h3>

              <p className="mt-3 leading-7 text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Index;
