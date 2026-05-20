import { Trophy, Target, Zap, Award } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
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
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Your quiz progress at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Score"
          value="4,820"
          icon={Trophy}
          accent="primary"
          trend="+320 this week"
        />
        <StatCard
          label="Accuracy"
          value="78%"
          icon={Target}
          accent="accent"
          trend="+4% vs last"
        />
        <StatCard
          label="Streak"
          value="7"
          icon={Zap}
          accent="warning"
          trend="Personal best!"
        />
        <StatCard label="Badges" value={12} icon={Award} accent="success" />
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Level Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Level 8 — Quiz Apprentice</span>
            <span className="text-muted-foreground">820 / 1,000 XP</span>
          </div>
          <Progress value={82} />
        </CardContent>
      </Card> */}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recommended for you</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">
              Loading recommendations...
            </div>
          ) : data?.recommendedCategories?.length ? (
            data.recommendedCategories.map((item: RecommendedCategory) => (
              <QuizCard
                key={item.category._id}
                quiz={{
                  id: item.category._id,
                  title: `${item.category.name} Quiz`,
                  category: item.category.name,
                  difficulty: data.recommendedDifficulty,
                  questions: 10,
                  durationMin: 10,
                }}
              />
            ))
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
