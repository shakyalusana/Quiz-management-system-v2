import { Clock, HelpCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface QuizSummary {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questions: number;
  durationMin: number;
}

const diffStyle = {
  Easy: "bg-success/10 text-success border-success/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Hard: "bg-destructive/10 text-destructive border-destructive/20",
};

export function QuizCard({
  quiz,
  onStart,
}: {
  quiz: QuizSummary;
  onStart?: () => void;
}) {
  return (
    <Card className="group transition-all hover:shadow-[var(--shadow-elegant)] hover:-translate-y-0.5">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{quiz.category}</Badge>
          <Badge className={diffStyle[quiz.difficulty]} variant="outline">
            {quiz.difficulty}
          </Badge>
        </div>
        <h3 className="text-lg font-semibold leading-tight">{quiz.title}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4" /> {quiz.questions} Qs
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {quiz.durationMin} min
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button className="w-full" onClick={onStart}>
          <Sparkles className="h-4 w-4" /> Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}
