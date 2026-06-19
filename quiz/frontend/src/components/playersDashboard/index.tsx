import type { ComponentProps } from "react";
import { motion } from "framer-motion";
import { Trophy, Target, Zap, Award } from "lucide-react";
import { StatCard } from "../common/StatCard";

import { RECOMMENDATIONAPI } from "@/api/recommendationApi";
import { ANALYTICSAPI } from "@/api/analyticsApi";
import { CATEGORYAPI } from "@/api/categoryApi";
import KMeansCard from "./KMeansCard";

/* ----------------------------------
   TYPES
-----------------------------------*/
type RecommendedCategory = {
  category:
    | {
        _id: string;
        name: string;
      }
    | string;
  score?: number;
  accuracy?: number;
};

type Category = {
  _id: string;
  name: string;
};

/* ----------------------------------
   DASHBOARD
-----------------------------------*/
export default function PlayerDashboard() {
  const { data: statsData, isLoading: statsLoading } =
    ANALYTICSAPI.useUserStats();

  const { data: categoriesData } = CATEGORYAPI.useCategories();

  const categoryMap = new Map(
    categoriesData?.map((c: Category) => [c._id, c.name]) || [],
  );

  const getCategoryName = (
    cat: RecommendedCategory["category"] | null | undefined,
  ): string => {
    if (!cat) return "Unknown";

    if (typeof cat === "object") return String(cat.name ?? "Unknown");

    return String(categoryMap.get(cat) || "Unknown");
  };

  const content = RECOMMENDATIONAPI.useRecommendations("content");
  const collaborative = RECOMMENDATIONAPI.useRecommendations("collaborative");
  const popular = RECOMMENDATIONAPI.useRecommendations("popular");
  const hybrid = RECOMMENDATIONAPI.useRecommendations("hybrid");
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
      title: "Content-Based Intelligence",
      color: "text-blue-500",
      query: content,
      type: "list",
    },

    {
      title: "Collaborative Filtering",
      color: "text-purple-500",
      query: collaborative,
      type: "list",
    },

    {
      title: "Popularity Trends",
      color: "text-orange-500",
      query: popular,
      type: "list",
    },

    {
      title: "Hybrid AI Engine",
      color: "text-green-500",
      query: hybrid,
      type: "list",
    },

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
            ) : section.query.data?.result?.recommendedCategories?.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.query.data.result.recommendedCategories.map(
                  (item: RecommendedCategory, i: number) => {
                    const categoryName = getCategoryName(item.category);

                    const score = item.score ?? item.accuracy ?? 0;

                    return (
                      <motion.div
                        key={i}
                        initial={{
                          opacity: 0,
                          scale: 0.95,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        transition={{
                          delay: i * 0.05,
                        }}
                        whileHover={{
                          scale: 1.04,
                        }}
                        className="
              relative
              rounded-xl
              border
              bg-background
              p-4
              shadow-sm
            "
                      >
                        {/* RANK */}

                        <div
                          className="
                absolute
                right-2
                top-2
                rounded-full
                bg-muted
                px-2
                py-1
                text-xs
              "
                        >
                          #{i + 1}
                        </div>

                        {/* CATEGORY NAME */}

                        <h3 className="text-base font-semibold">
                          {categoryName}
                        </h3>

                        {/* SCORE BAR */}

                        <div
                          className="
                mt-3
                h-2
                w-full
                overflow-hidden
                rounded-full
                bg-muted
              "
                        >
                          <div
                            className="
                  h-full
                  bg-linear-to-r
                  from-blue-500
                  to-purple-500
                "
                            style={{
                              width: `${Math.min(Number(score), 100)}%`,
                            }}
                          />
                        </div>

                        {/* SCORE */}

                        <p
                          className="
                mt-2
                text-xs
                text-muted-foreground
              "
                        >
                          Score: {Number(score).toFixed(2)}
                        </p>
                      </motion.div>
                    );
                  },
                )}
              </div>
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
