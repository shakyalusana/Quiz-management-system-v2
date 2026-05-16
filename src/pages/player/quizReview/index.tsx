import { Check, X, Trophy, Target, Clock, RotateCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LinkComponent from "@/components/Link";
import { StatCard } from "@/components/common/StatCard";

const review = [
  {
    q: "What is the capital of France?",
    your: "Paris",
    correct: "Paris",
    ok: true,
  },
  {
    q: "Which planet is the Red Planet?",
    your: "Venus",
    correct: "Mars",
    ok: false,
  },
  {
    q: "Largest ocean on Earth?",
    your: "Pacific",
    correct: "Pacific",
    ok: true,
  },
  {
    q: "Author of '1984'?",
    your: "George Orwell",
    correct: "George Orwell",
    ok: true,
  },
  { q: "Square root of 144?", your: "14", correct: "12", ok: false },
];

export default function PlayerQuizReview() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Quiz Review</h1>
        <p className="text-muted-foreground text-sm">
          General Knowledge — completed 2 minutes ago
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Score" value="3 / 5" icon={Trophy} accent="primary" />
        <StatCard label="Accuracy" value="60%" icon={Target} accent="warning" />
        <StatCard label="Time" value="4m 12s" icon={Clock} accent="accent" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Answer Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {review.map((r, i) => (
            <div
              key={i}
              className={`rounded-lg border p-4 ${
                r.ok
                  ? "border-success/30 bg-success/5"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    r.ok
                      ? "bg-success text-primary-foreground"
                      : "bg-destructive text-primary-foreground"
                  }`}
                >
                  {r.ok ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-medium">
                    {i + 1}. {r.q}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Badge variant="outline">Your answer: {r.your}</Badge>
                    {!r.ok && (
                      <Badge
                        className="bg-success/10 text-success border-success/20"
                        variant="outline"
                      >
                        Correct: {r.correct}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button asChild variant="outline">
          <LinkComponent href="/players/history">View History</LinkComponent>
        </Button>
        <Button asChild>
          <LinkComponent href="/players/quiz">
            <RotateCw className="h-4 w-4" /> Try Another
          </LinkComponent>
        </Button>
      </div>
    </div>
  );
}
