import { Users, FileQuestion, PlayCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StatCard } from "../common/StatCard";
import { Badge } from "../ui/badge";

const recent = [
  { user: "Sarah Chen", quiz: "World Capitals", score: "9/10", time: "2m ago" },
  { user: "Marcus Liu", quiz: "JS Deep Dive", score: "18/20", time: "12m ago" },
  {
    user: "Aisha Patel",
    quiz: "Renaissance Art",
    score: "11/15",
    time: "1h ago",
  },
  {
    user: "Diego Rivera",
    quiz: "Physics Basics",
    score: "12/12",
    time: "3h ago",
  },
];

function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Platform overview and recent activity.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Players"
          value="2,481"
          icon={Users}
          accent="primary"
          trend="+128 this week"
        />
        <StatCard
          label="Active Quizzes"
          value={42}
          icon={PlayCircle}
          accent="accent"
        />
        <StatCard
          label="Questions"
          value="1,204"
          icon={FileQuestion}
          accent="success"
        />
        <StatCard
          label="Avg. Accuracy"
          value="71%"
          icon={TrendingUp}
          accent="warning"
          trend="+2.4%"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {recent.map((r, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{r.user}</p>
                <p className="text-sm text-muted-foreground">
                  Completed {r.quiz}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">{r.score}</Badge>
                <span className="text-xs text-muted-foreground">{r.time}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
