import { Brain, Layers, Gauge, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function KMeansCard({ data }: { data: any }) {
  if (!data?.result) return null;

  const { cluster, recommendedDifficulty, method } = data.result;

  const difficultyColor =
    recommendedDifficulty === "easy"
      ? "text-green-500"
      : recommendedDifficulty === "medium"
        ? "text-yellow-500"
        : "text-red-500";

  const clusterInfo = [
    {
      name: "Beginner Cluster",
      description: "Players with lower scores and learning progress",
      icon: "🌱",
    },

    {
      name: "Intermediate Cluster",
      description: "Balanced players improving their skills",
      icon: "⚡",
    },

    {
      name: "Advanced Cluster",
      description: "High performing competitive players",
      icon: "🔥",
    },
  ];

  const current = clusterInfo[cluster] || clusterInfo[1];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-red-500/10 via-background to-purple-500/10 p-6 shadow-lg"
    >
      {/* Glow */}

      <div
        className="absolute -right-10 -top-10 h-32 w-32
        rounded-full
        bg-red-500/20
        blur-3xl
        "
      />

      <div className="relative space-y-5">
        {/* Header */}

        <div className="flex items-center gap-3">
          <div
            className="
          rounded-xl
          bg-red-500/10
          p-3
          "
          >
            <Brain
              className="
            h-7
            w-7
            text-red-500
            "
            />
          </div>

          <div>
            <h3
              className="
            text-lg
            font-bold
            "
            >
              K-Means AI Clustering
            </h3>

            <p
              className="
            text-xs
            text-muted-foreground
            "
            >
              Machine Learning Player Segmentation
            </p>
          </div>
        </div>

        {/* Cluster */}

        <div
          className="
        grid
        grid-cols-2
        gap-4
        "
        >
          <div
            className="
          rounded-xl
          border
          bg-background
          p-4
          "
          >
            <Layers
              className="
            mb-2
            text-purple-500
            "
            />

            <p
              className="
            text-xs
            text-muted-foreground
            "
            >
              Player Cluster
            </p>

            <p
              className="
            text-3xl
            font-bold
            "
            >
              {cluster}
            </p>
          </div>

          <div
            className="
          rounded-xl
          border
          bg-background
          p-4
          "
          >
            <Gauge
              className="
            mb-2
            text-blue-500
            "
            />

            <p
              className="
            text-xs
            text-muted-foreground
            "
            >
              Difficulty
            </p>

            <p
              className={`
            text-xl
            font-bold
            capitalize
            ${difficultyColor}
            `}
            >
              {recommendedDifficulty}
            </p>
          </div>
        </div>

        {/* Cluster Description */}

        <div
          className="
        rounded-xl
        bg-muted/40
        p-4
        "
        >
          <div
            className="
          flex
          items-center
          gap-2
          "
          >
            <Sparkles
              className="
            h-5
            text-yellow-500
            "
            />

            <h4
              className="
            font-semibold
            "
            >
              {current.icon} {current.name}
            </h4>
          </div>

          <p
            className="
          mt-2
          text-sm
          text-muted-foreground
          "
          >
            {current.description}
          </p>
        </div>

        {/* Algorithm */}

        <div
          className="
        text-xs
        text-muted-foreground
        "
        >
          Algorithm:
          <span
            className="
          ml-2
          rounded-full
          bg-red-500/10
          px-3
          py-1
          text-red-500
          "
          >
            {method}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default KMeansCard;
