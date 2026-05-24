import { useCallback, useEffect, useState } from "react";
import { Clock } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CATEGORYAPI } from "@/api/categoryApi";
import { QUIZAPI } from "@/api/quizApi";
import { Input } from "@/components/ui/input";

interface Question {
  _id: string;
  text: string;
  options: string[];
  category: string;
  difficulty: string;
  correctOption?: number;
}

interface Category {
  _id: string;
  name: string;
}

export default function PlayerQuiz() {
  const { data: categories = [], isLoading: catLoading } =
    CATEGORYAPI.useCategories();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Record<number, string>>({});

  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const [showResults, setShowResults] = useState(false);

  const [settings, setSettings] = useState({
    categoryId: "",
    difficulty: "medium",
    count: 10,
  });

  const calculateTime = (difficulty: string, count: number) => {
    let baseMinutes = 5;

    if (difficulty === "easy") baseMinutes = 2;
    if (difficulty === "medium") baseMinutes = 5;
    if (difficulty === "hard") baseMinutes = 10;

    const extraMinutes = count > 10 ? count - 10 : 0;

    return (baseMinutes + extraMinutes) * 60;
  };

  const [timeLeft, setTimeLeft] = useState(
    calculateTime(settings.difficulty, settings.count),
  );

  const startQuizMutation = QUIZAPI.useStartQuiz();
  const submitQuizMutation = QUIZAPI.useSubmitQuiz();

  /* ---------------- START QUIZ ---------------- */
  const startQuiz = async () => {
    try {
      setLoading(true);

      const data = await startQuizMutation.mutateAsync({
        categoryId: settings.categoryId,
        difficulty: settings.difficulty,
        count: settings.count,
      });

      setQuestions(data);
      setSelected({});
      setStarted(true);
      setShowResults(false);

      setTimeLeft(calculateTime(settings.difficulty, settings.count));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SUBMIT QUIZ ---------------- */
  const handleSubmitQuiz = useCallback(async () => {
    try {
      const answers = questions.map((q, i) => {
        const selectedIndex = selected[i];

        return {
          questionId: q._id,
          selectedOption:
            selectedIndex !== undefined ? q.options[Number(selectedIndex)] : "",
        };
      });

      const payload = {
        categoryId: settings.categoryId,
        difficulty: settings.difficulty,
        score: questions.reduce((acc, q, i) => {
          const selectedIndex = selected[i];
          return selectedIndex !== undefined &&
            q.correctOption !== undefined &&
            Number(selectedIndex) === q.correctOption
            ? acc + 1
            : acc;
        }, 0),
        answers,
        stats: {
          total: questions.length,
        },
      };

      await submitQuizMutation.mutateAsync(payload);

      setShowResults(true);
    } catch (err) {
      console.error(err);
    }
  }, [questions, selected, settings, submitQuizMutation]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (!started || showResults) return;

    if (timeLeft <= 0) {
      const timeoutId = window.setTimeout(() => {
        handleSubmitQuiz();
      }, 0);

      return () => window.clearTimeout(timeoutId);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, started, showResults, handleSubmitQuiz]);

  /* ---------------- BLOCK BACK / REFRESH ---------------- */
  useEffect(() => {
    if (!started) return;

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [started]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-4 border rounded-xl">
        <h2 className="text-xl font-bold">Loading Quiz...</h2>
      </div>
    );
  }
  /* ---------------- START SCREEN ---------------- */
  if (!started) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-4 border rounded-xl">
        <h2 className="text-xl font-bold">Start Quiz</h2>

        <Label>Category</Label>
        <select
          className="w-full border p-2 rounded"
          value={settings.categoryId}
          onChange={(e) =>
            setSettings({ ...settings, categoryId: e.target.value })
          }
        >
          <option value="">
            {catLoading ? "Loading..." : "Select Category"}
          </option>

          {categories.map((c: Category) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <Label>Difficulty</Label>
        <select
          className="w-full border p-2 rounded"
          value={settings.difficulty}
          onChange={(e) =>
            setSettings({ ...settings, difficulty: e.target.value })
          }
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <Label>Question Count</Label>
        <Input
          type="number"
          value={settings.count}
          onChange={(e) =>
            setSettings({ ...settings, count: Number(e.target.value) })
          }
        />

        <Button onClick={startQuiz} disabled={!settings.categoryId}>
          Start Quiz
        </Button>
      </div>
    );
  }

  /* ---------------- QUIZ SCREEN ---------------- */
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 border px-3 py-2 rounded-lg">
          <Clock className="w-4 h-4" />
          <span>
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </span>
        </div>

        <div>
          {Object.keys(selected).length}/{questions.length} Answered
        </div>
      </div>

      <Progress
        value={(Object.keys(selected).length / questions.length) * 100}
      />

      {/* QUESTIONS */}
      {questions.map((q, qIndex) => (
        <Card key={q._id}>
          <CardHeader>
            <h2 className="font-semibold">
              Q{qIndex + 1}. {q.text}
            </h2>
          </CardHeader>

          <CardContent>
            <RadioGroup
              disabled={showResults}
              value={selected[qIndex] || ""}
              onValueChange={(v) => setSelected((p) => ({ ...p, [qIndex]: v }))}
            >
              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const isSelected = selected[qIndex] === String(i);
                  const isCorrect = q.correctOption === i;

                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 border p-3 rounded-lg transition ${
                        showResults
                          ? isCorrect
                            ? "border-green-500 bg-green-100 dark:bg-green-900/40"
                            : isSelected
                              ? "border-red-500 bg-red-100 dark:bg-red-900/40"
                              : ""
                          : isSelected
                            ? "border-lime-500 bg-lime-100 dark:bg-lime-900/40"
                            : "hover:bg-muted"
                      }`}
                    >
                      <RadioGroupItem value={String(i)} id={`${q._id}-${i}`} />

                      <Label htmlFor={`${q._id}-${i}`} className="flex-1">
                        {opt}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      {/* SUBMIT */}
      {!showResults && (
        <div className="flex justify-end">
          <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
        </div>
      )}

      {/* RESULT DONE */}
      {showResults && (
        <div className="text-center p-4 border rounded-lg bg-muted">
          Quiz Completed! Results shown above
        </div>
      )}
    </div>
  );
}
