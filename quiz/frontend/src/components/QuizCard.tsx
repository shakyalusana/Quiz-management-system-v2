import { Clock, HelpCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export interface QuizSummary {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questions: number;
  durationMin: number;
}

const diffStyle = {
  Easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Hard: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function QuizCard({
  quiz,
  onStart,
}: {
  quiz: QuizSummary;
  onStart?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <Card className="group relative overflow-hidden border-border bg-card/60 backdrop-blur-xl transition-all hover:shadow-xl">
        {/* soft glow */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition" />

        <CardContent className="relative p-5 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {quiz.category}
            </Badge>

            <Badge className={diffStyle[quiz.difficulty]} variant="outline">
              {quiz.difficulty}
            </Badge>
          </div>

          <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition">
            {quiz.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" /> {quiz.questions} Qs
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {quiz.durationMin} min
            </span>
          </div>
        </CardContent>

        <CardFooter className="relative p-5 pt-0">
          <Button
            className="w-full group-hover:shadow-md transition"
            onClick={onStart}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
