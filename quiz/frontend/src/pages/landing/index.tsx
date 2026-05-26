import LinkComponent from "@/components/Link";
import { Logo } from "@/components/Logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Brain, PlayCircle, Trophy, Users } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground relative">
      {/* 🌫️ Soft animated background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-112 w-md rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 h-112 w-md rounded-full bg-purple-500/10 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 h-80 w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[120px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />

          <div className="flex items-center gap-2">
            <AnimatedThemeToggler />

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button asChild variant="ghost">
                <LinkComponent href="/login">Sign in</LinkComponent>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button
                asChild
                className="shadow-lg shadow-primary/30 transition-all"
              >
                <LinkComponent href="/register">Get started</LinkComponent>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium backdrop-blur-xl"
          >
            <Brain className="h-4 w-4 text-primary" />
            Quiz Management System
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-4xl text-5xl font-black tracking-tight sm:text-7xl"
          >
            The Future of{" "}
            <span className="bg-linear-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Interactive Quizzing
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl"
          >
            Create lightning-fast quizzes, host live competitions, track
            rankings in real-time, and transform learning into a battlefield of
            brilliance.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button
                asChild
                size="lg"
                className="h-12 px-8 text-base shadow-xl shadow-primary/30"
              >
                <LinkComponent href="/players">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Player Demo
                </LinkComponent>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/10 bg-white/5 px-8 text-base backdrop-blur-xl hover:bg-white/10"
              >
                <LinkComponent href="/admin/dashboard">
                  Admin Demo
                </LinkComponent>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              ["10K+", "Questions Created"],
              ["5K+", "Active Players"],
              ["99%", "Quiz Completion"],
            ].map(([value, label], i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="text-3xl font-black text-primary">{value}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {label}
                </div>
              </motion.div>
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
        ].map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <f.icon className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-bold">{f.title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Index;
