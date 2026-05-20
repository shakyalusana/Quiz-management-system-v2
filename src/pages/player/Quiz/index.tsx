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

/* ---------------- LOBBY STATE ---------------- */

interface Question {
  _id: string;
  text: string;
  options: string[];
  category: string;
  difficulty: string;
  correctOption?: string;
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

  const [settings, setSettings] = useState({
    categoryId: "",
    difficulty: "medium",
    count: 10,
    time: 600, // seconds
  });

  const [timeLeft, setTimeLeft] = useState(settings.time);

  const startQuizMutation = QUIZAPI.useStartQuiz();

  const submitQuizMutation = QUIZAPI.useSubmitQuiz();
  /* ---------------- FETCH QUIZ ---------------- */

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

      setTimeLeft(settings.time);
    } catch (err) {
      console.error("Failed to start quiz", err);
    } finally {
      setLoading(false);
    }
  };
  /* ---------------- SUBMIT QUIZ ---------------- */

  const handleSubmitQuiz = useCallback(async () => {
    try {
      const answers = questions.map((question, index) => {
        const selectedIndex = selected[index];

        const selectedOption =
          selectedIndex !== undefined
            ? question.options[Number(selectedIndex)]
            : null;

        // ⚠️ since backend no longer sends correct answer,
        // we cannot compute real correctness here
        // so we send only selected data

        return {
          questionId: question._id,
          // API expects a string for selectedOption; send empty string when none selected
          selectedOption: selectedOption ?? "",
        };
      });

      const payload = {
        categoryId: settings.categoryId,
        answers,
        score: 0,
        stats: {
          total: questions.length,
        },
      };

      await submitQuizMutation.mutateAsync(payload);

      alert("Quiz Submitted!");
      setStarted(false);
    } catch (err) {
      console.error(err);
    }
  }, [questions, selected, settings.categoryId, submitQuizMutation]);
  useEffect(() => {
    if (!started) return;

    if (timeLeft <= 0) {
      // avoid calling setState synchronously inside effect — defer submission
      const t = setTimeout(() => {
        handleSubmitQuiz();
      }, 0);

      return () => clearTimeout(t);
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmitQuiz, started, timeLeft]);

  /* ---------------- BLOCK BEFORE START ---------------- */

  if (!started) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-4 border rounded-xl">
        <h2 className="text-xl font-bold">Start Quiz</h2>

        {/* CATEGORY */}
        <Label className="text-sm font-medium">Category</Label>
        <select
          className="w-full border p-2 rounded border-border"
          value={settings.categoryId}
          onChange={(e) =>
            setSettings({
              ...settings,
              categoryId: e.target.value,
            })
          }
        >
          <option value="">
            {catLoading ? "Loading categories..." : "Select Category"}
          </option>

          {categories.map((cat: Category) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* DIFFICULTY */}
        <Label className="text-sm font-medium">Difficulty</Label>
        <select
          className="w-full border p-2 rounded border-border"
          value={settings.difficulty}
          onChange={(e) =>
            setSettings({
              ...settings,
              difficulty: e.target.value,
            })
          }
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* QUESTION COUNT */}
        <Label className="text-sm font-medium">Question Count</Label>
        <Input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Number of questions"
          value={settings.count}
          onChange={(e) =>
            setSettings({
              ...settings,
              count: Number(e.target.value),
            })
          }
        />

        {/* TIMER */}
        <Label className="text-sm font-medium">Time Limit (seconds)</Label>
        <Input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Time (seconds)"
          value={settings.time}
          onChange={(e) =>
            setSettings({
              ...settings,
              time: Number(e.target.value),
            })
          }
        />

        <Button
          onClick={startQuiz}
          disabled={!settings.categoryId || catLoading}
        >
          Start Quiz
        </Button>
      </div>
    );
  }

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return <div className="p-6">Loading quiz...</div>;
  }

  if (!questions.length) {
    return <div className="p-6">No questions found</div>;
  }

  /* ---------------- QUIZ UI ---------------- */

  /* ---------------- QUIZ UI ---------------- */

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 border px-3 py-2 rounded-lg">
          <Clock className="w-4 h-4" />

          <span>
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </span>
        </div>

        <div className="text-sm text-muted-foreground">
          {Object.keys(selected).length} / {questions.length} Answered
        </div>
      </div>

      {/* PROGRESS */}
      <Progress
        value={(Object.keys(selected).length / questions.length) * 100}
      />

      {/* ALL QUESTIONS */}
      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <Card key={question._id}>
            <CardHeader>
              <h2 className="font-semibold">
                Q{qIndex + 1}. {question.text}
              </h2>
            </CardHeader>

            <CardContent>
              <RadioGroup
                value={selected[qIndex] || ""}
                onValueChange={(v) =>
                  setSelected((prev) => ({
                    ...prev,
                    [qIndex]: v,
                  }))
                }
              >
                <div className="space-y-3">
                  {question.options.map((opt, i) => {
                    const optionId = `${question._id}-${i}`;

                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-3 border p-3 rounded-lg transition cursor-pointer ${
                          selected[qIndex] === String(i)
                            ? "border-primary bg-primary/10"
                            : "hover:bg-muted"
                        }`}
                      >
                        <RadioGroupItem id={optionId} value={String(i)} />

                        <Label
                          htmlFor={optionId}
                          className="flex-1 cursor-pointer"
                        >
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
      </div>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmitQuiz}
          disabled={submitQuizMutation.isPending}
        >
          {submitQuizMutation.isPending ? "Submitting..." : "Submit Quiz"}
        </Button>
      </div>
    </div>
  );
}
