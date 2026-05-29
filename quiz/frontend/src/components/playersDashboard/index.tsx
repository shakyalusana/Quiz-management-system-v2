import { motion } from "framer-motion";
import { Trophy, Target, Zap, Award } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { QuizCard } from "../QuizCard";
import { StatCard } from "../common/StatCard";
import { RECOMMENDATIONAPI } from "@/api/recommendationApi";

/* ----------------------------------
   TYPES
-----------------------------------*/
type RecommendedCategory = {
  category: {
    _id: string;
    name: string;
  };
};

/* ----------------------------------
   DASHBOARD
-----------------------------------*/
export default function PlayerDashboard() {
  /* -------------------------------
     MULTI ALGORITHM QUERIES
  --------------------------------*/
  const content = RECOMMENDATIONAPI.useRecommendations("content");
  const collaborative = RECOMMENDATIONAPI.useRecommendations("collaborative");
  const popular = RECOMMENDATIONAPI.useRecommendations("popular");
  const hybrid = RECOMMENDATIONAPI.useRecommendations("hybrid");

  /* -------------------------------
     STATIC STATS
  --------------------------------*/
  type StatItem = {
    label: string;
    value: string | number;
    icon: LucideIcon;
    accent: "accent" | "primary" | "success" | "warning";
    trend?: string;
  };

  const stats: StatItem[] = [
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

  /* -------------------------------
     AI SECTIONS CONFIG
  --------------------------------*/
  const sections = [
    {
      title: "Content-Based Intelligence",
      color: "text-blue-500",
      query: content,
    },
    {
      title: "Collaborative Filtering",
      color: "text-purple-500",
      query: collaborative,
    },
    {
      title: "Popularity Trends",
      color: "text-orange-500",
      query: popular,
    },
    {
      title: "Hybrid AI Engine",
      color: "text-green-500",
      query: hybrid,
    },
  ];

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Four AI engines analyzing your quiz behavior in parallel 🧠⚡
        </p>
      </motion.div>

      {/* STATS */}
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

      {/* RECOMMENDATION SYSTEMS */}
      <div className="space-y-12">
        {sections.map((section, idx) => (
          <section key={idx} className="space-y-5">
            {/* TITLE */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-lg font-semibold ${section.color}`}
            >
              {section.title}
            </motion.h2>

            {/* LOADING */}
            {section.query.isLoading ? (
              <div className="text-sm text-muted-foreground">
                Loading AI recommendations...
              </div>
            ) : section.query.data?.recommendedCategories?.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.query.data.recommendedCategories.map(
                  (item: RecommendedCategory, i: number) => (
                    <motion.div
                      key={item.category._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <QuizCard
                        quiz={{
                          id: item.category._id,
                          title: `${item.category.name} Quiz`,
                          category: item.category.name,
                          difficulty:
                            section.query.data.recommendedDifficulty ||
                            "medium",
                          questions: 10,
                          durationMin: 10,
                        }}
                      />
                    </motion.div>
                  ),
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No recommendations available for this engine yet.
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
