import { Users, FileQuestion, PlayCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/StatCard";
import { ADMINAPI } from "@/api/adminDashboardApi";

function AdminDashboard() {
  const { data, isLoading } = ADMINAPI.useAdminDashboard();

  if (isLoading) {
    return (
      <div className="p-10 text-muted-foreground">Loading dashboard...</div>
    );
  }
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
          value={data?.stats?.totalPlayers ?? 0}
          icon={Users}
          accent="primary"
        />

        <StatCard
          label="Active Quizzes"
          value={data?.stats?.totalQuizzes ?? 0}
          icon={PlayCircle}
          accent="accent"
        />

        <StatCard
          label="Questions"
          value={data?.stats?.totalQuestions ?? 0}
          icon={FileQuestion}
          accent="success"
        />

        <StatCard
          label="Categories"
          value={data?.stats?.totalCategories ?? 0}
          icon={TrendingUp}
          accent="warning"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {data?.recentPlayers?.length ? (
            data.recentPlayers.map((r, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-sm text-muted-foreground">Last activity</p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="outline">{r.lastScore}%</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.lastQuizDate).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-4">
              No recent activity found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
