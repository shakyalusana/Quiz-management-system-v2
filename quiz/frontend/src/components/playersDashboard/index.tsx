import type { ComponentProps } from "react";
import { motion } from "framer-motion";
import { Trophy, Target, Zap, Award } from "lucide-react";
import { StatCard } from "../common/StatCard";

import { RECOMMENDATIONAPI } from "@/api/recommendationApi";
import { ANALYTICSAPI } from "@/api/analyticsApi";
import KMeansCard from "./KMeansCard";

export default function PlayerDashboard() {
  const { data: statsData, isLoading: statsLoading } =
    ANALYTICSAPI.useUserStats();

  const kmeans = RECOMMENDATIONAPI.useRecommendations("kmeans");

  type StatCardProps = ComponentProps<typeof StatCard>;

  const stats = [
    {
      label: "Total Score",
      value: statsData?.totalScore ?? 0,
      icon: Trophy,
      accent: "primary",
      trend: "Overall performance",
    },
    {
      label: "Accuracy",
      value: `${statsData?.accuracy ?? 0}%`,
      icon: Target,
      accent: "primary",
      trend: "Correct answers rate",
    },
    {
      label: "Streak",
      value: statsData?.streak ?? 0,
      icon: Zap,
      accent: "warning",
      trend: "Current streak",
    },
    {
      label: "Badges",
      value: statsData?.badges ?? 0,
      icon: Award,
      accent: "success",
      trend: "Achievements earned",
    },
  ] satisfies StatCardProps[];

  /* ----------------------------------
     AI SECTIONS
  -----------------------------------*/
  const sections = [
    {
      title: "K-Means Clustering",
      color: "text-red-500",
      query: kmeans,
      type: "cluster",
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
      </motion.div>

      {/* STATS */}
      {statsLoading ? (
        <div className="text-sm text-muted-foreground">
          Loading analytics...
        </div>
      ) : (
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
      )}

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
            {/* LOADING */}
            {section.query.isLoading ? (
              <div className="text-sm text-muted-foreground">
                Running AI model...
              </div>
            ) : section.type === "cluster" ? (
              <KMeansCard data={section.query.data} />
            ) : (
              <div className="text-sm text-muted-foreground">
                No recommendations available
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
