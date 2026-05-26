import { Trophy, Target, Zap, Award } from "lucide-react";
import { motion } from "framer-motion";

import { QuizCard } from "../QuizCard";
import { StatCard } from "../common/StatCard";
import { RECOMMENDATIONAPI } from "@/api/recommendationApi";

type RecommendedCategory = {
  category: {
    _id: string;
    name: string;
  };
};

export default function PlayerDashboard() {
  const { data, isLoading } = RECOMMENDATIONAPI.useRecommendations();

  const stats: Array<{
    label: string;
    value: string | number;
    icon: typeof Trophy;
    accent: "primary" | "accent" | "warning" | "success";
    trend?: string;
  }> = [
    {
      label: "Total Score",
      value: "4,820",
      icon: Trophy,
      accent: "primary",
      trend: "+320 this week",
    },
    {
      label: "Accuracy",
      value: "78%",
      icon: Target,
      accent: "accent",
      trend: "+4% vs last",
    },
    {
      label: "Streak",
      value: "7",
      icon: Zap,
      accent: "warning",
      trend: "Personal best!",
    },
    {
      label: "Badges",
      value: 12,
      icon: Award,
      accent: "success",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Your quiz progress at a glance.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      <section className="space-y-5">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-semibold"
        >
          Recommended for you
        </motion.h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">
              Loading recommendations...
            </div>
          ) : data?.recommendedCategories?.length ? (
            data.recommendedCategories.map(
              (item: RecommendedCategory, i: number) => (
                <motion.div
                  key={item.category._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <QuizCard
                    quiz={{
                      id: item.category._id,
                      title: `${item.category.name} Quiz`,
                      category: item.category.name,
                      difficulty: data.recommendedDifficulty,
                      questions: 10,
                      durationMin: 10,
                    }}
                  />
                </motion.div>
              ),
            )
          ) : (
            <div className="text-sm text-muted-foreground">
              No recommendations yet. Play quizzes to personalize your feed.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
