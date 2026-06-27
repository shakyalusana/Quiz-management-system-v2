import type { ComponentProps } from "react";
import { motion } from "framer-motion";
import { Trophy, Target, Zap, Award } from "lucide-react";
import { StatCard } from "../common/StatCard";

import { RECOMMENDATIONAPI } from "@/api/recommendationApi";
import { ANALYTICSAPI } from "@/api/analyticsApi";
import KMeansCard from "./KMeansCard";
import { HISTORYAPI } from "@/api/historyApi";

export default function PlayerDashboard() {
  const { data: statsData, isLoading: statsLoading } =
    ANALYTICSAPI.useUserStats();

  const { data: historyData, isLoading: historyLoading } =
    HISTORYAPI.usePlayerHistory();

  const kmeans = RECOMMENDATIONAPI.useKMeans();
  type StatCardProps = ComponentProps<typeof StatCard>;

  const bestPerformances = (historyData?.history ?? [])
    .map((quiz: any) => ({
      ...quiz,
      accuracy:
        quiz.totalQuestions > 0 ? (quiz.score / quiz.totalQuestions) * 10 : 0,
    }))
    .sort((a: any, b: any) => b.accuracy - a.accuracy)
    .slice(0, 5);

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

  const hasKMeansData =
    !!kmeans.data?.result &&
    kmeans.data.result.cluster !== undefined &&
    !!kmeans.data.result.recommendedDifficulty;

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

      {/* K-MEANS RECOMMENDATION */}
      {kmeans.isLoading ? (
        <div className="text-sm text-muted-foreground">Running AI model...</div>
      ) : hasKMeansData ? (
        <KMeansCard data={kmeans.data} />
      ) : null}

      {/* BEST PERFORMANCE */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">🏆 Best Quiz Performances</h2>
          <p className="text-sm text-muted-foreground">
            Your top 5 quiz attempts
          </p>
        </div>

        {historyLoading ? (
          <div className="p-6 text-sm text-muted-foreground">
            Loading history...
          </div>
        ) : bestPerformances.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">
            No quiz history available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Subcategory</th>
                  <th className="px-4 py-3 text-center">Questions Attempted</th>
                  <th className="px-4 py-3 text-center">Score</th>
                  <th className="px-4 py-3 text-center">Accuracy</th>
                  <th className="px-4 py-3 text-center">Date</th>
                </tr>
              </thead>

              <tbody>
                {bestPerformances.map((quiz: any) => (
                  <tr
                    key={quiz._id}
                    className="border-t hover:bg-muted/20 transition"
                  >
                    <td className="px-4 py-3">{quiz.category?.name}</td>

                    <td className="px-4 py-3">{quiz.subcategory?.name}</td>

                    <td className="px-4 py-3 text-center capitalize">
                      {quiz.totalQuestions}
                    </td>

                    <td className="px-4 py-3 text-center font-semibold">
                      {quiz.score}
                    </td>

                    <td className="px-4 py-3 text-center text-green-600 font-semibold">
                      {quiz.accuracy.toFixed(1)}%
                    </td>

                    <td className="px-4 py-3 text-center">
                      {new Date(quiz.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
