import { Trophy, Target, Zap, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "../ui/progress";
import { StatCard } from "../common/StatCard";
import { QuizCard, type QuizSummary } from "../QuizCard";

const recommended: QuizSummary[] = [
  {
    id: "1",
    title: "World Capitals Sprint",
    category: "Geography",
    difficulty: "Easy",
    questions: 10,
    durationMin: 5,
  },
  {
    id: "2",
    title: "JavaScript Deep Dive",
    category: "Programming",
    difficulty: "Hard",
    questions: 20,
    durationMin: 25,
  },
  {
    id: "3",
    title: "Renaissance Art",
    category: "History",
    difficulty: "Medium",
    questions: 15,
    durationMin: 12,
  },
];

function PlayerDashboard() {
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

      <Card>
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
      </Card>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recommended for you</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((q) => (
            <QuizCard key={q.id} quiz={q} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default PlayerDashboard;
