"use client";

import {
  Trophy,
  Target,
  TrendingUp,
  Flame,
  Clock,
  Play,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import LinkComponent from "../Link";
import {
  mockDashboardStats,
  mockQuizAttempts,
  mockQuizzes,
  playerScoreHistory,
} from "@/libs/mock-data";

const stats = mockDashboardStats.player;

export default function PlayerDashboardPage() {
  const recentAttempts = mockQuizAttempts.slice(0, 3);
  const availableQuizzes = mockQuizzes.filter((q) => q.isActive).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, Player
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to test your knowledge today?
          </p>
        </div>
        <LinkComponent href="/player/quiz">
          <Button className="glow-primary gap-2">
            <Play className="h-4 w-4" />
            Start New Quiz
          </Button>
        </LinkComponent>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/20 card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Score
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.totalScore.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="secondary"
                className="text-xs bg-primary/10 text-primary border-0"
              >
                Rank #{stats.rank}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quizzes Completed
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Target className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.quizzesCompleted}</div>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-primary">+3</span> this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-chart-3/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-chart-3" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.averageScore}%</div>
            <Progress
              value={stats.averageScore}
              className="mt-3 h-1.5 bg-muted"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-chart-5/10 via-card to-card border-chart-5/20 card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Streak
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-chart-5/20 flex items-center justify-center">
              <Flame className="h-4 w-4 text-chart-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.streak} days</div>
            <p className="text-xs text-muted-foreground mt-2">Keep it going!</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Score Progress Chart */}
        <Card className="lg:col-span-3 bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Your Progress</CardTitle>
              <p className="text-sm text-muted-foreground">
                Weekly score trends
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Last 7 days
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={playerScoreHistory}>
                  <defs>
                    <linearGradient
                      id="scoreGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Available Quizzes */}
        <Card className="lg:col-span-2 bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Available Quizzes</CardTitle>
              <p className="text-sm text-muted-foreground">
                Start a new challenge
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="group flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
              >
                <div className="space-y-1.5">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {quiz.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge
                      variant="outline"
                      className={`text-xs border-0 ${
                        quiz.difficulty === "easy"
                          ? "bg-success/10 text-success"
                          : quiz.difficulty === "medium"
                            ? "bg-chart-3/10 text-chart-3"
                            : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {quiz.difficulty}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {quiz.timeLimit}m
                    </span>
                    <span>{quiz.questions.length}Q</span>
                  </div>
                </div>
                <LinkComponent href={`/player/quiz/${quiz.id}`}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </LinkComponent>
              </div>
            ))}
            <LinkComponent href="/player/quiz" className="block">
              <Button variant="outline" className="w-full mt-2 gap-2">
                View All Quizzes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </LinkComponent>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your latest quiz attempts
              </p>
            </div>
          </div>
          <LinkComponent href="/player/history">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-foreground"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </LinkComponent>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAttempts.map((attempt, index) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {attempt.quizTitle}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {attempt.completedAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xl font-bold ${
                      attempt.percentage >= 80
                        ? "text-primary"
                        : attempt.percentage >= 60
                          ? "text-chart-3"
                          : "text-destructive"
                    }`}
                  >
                    {attempt.percentage.toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {attempt.score}/{attempt.totalPoints} pts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
