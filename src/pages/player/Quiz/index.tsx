import { useEffect, useState } from "react";
import { Clock, ChevronRight, ChevronLeft } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CATEGORYAPI } from "@/api/categoryApi";
import { QUIZAPI } from "@/api/quizApi";

/* ---------------- LOBBY STATE ---------------- */

interface Question {
  _id: string;
  text: string;
  options: string[];
  category: string;
  difficulty: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function PlayerQuiz() {
  const { data: categories = [], isLoading: catLoading } =
    CATEGORYAPI.useCategories();
  const [questions, setQuestions] = useState<Question[]>([]);

  const [current, setCurrent] = useState(0);
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

      setStarted(true);

      setTimeLeft(settings.time);
    } catch (err) {
      console.error("Failed to start quiz", err);
    } finally {
      setLoading(false);
    }
  };
  /* ---------------- SUBMIT QUIZ ---------------- */

  const handleSubmitQuiz = async () => {
    try {
      const answers = Object.entries(selected).map(([index, value]) => ({
        questionId: questions[Number(index)]._id,
        selectedOption: value,
      }));

      await submitQuizMutation.mutateAsync({
        categoryId: settings.categoryId,

        answers,

        score: 0,

        stats: {
          total: questions.length,
        },
      });

      alert("Quiz Submitted!");

      setStarted(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!started) return;

    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  /* ---------------- BLOCK BEFORE START ---------------- */

  if (!started) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-4 border rounded-xl">
        <h2 className="text-xl font-bold">Start Quiz</h2>

        {/* CATEGORY */}
        <select
          className="w-full border p-2 rounded"
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
        <select
          className="w-full border p-2 rounded"
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
        <input
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
        <input
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

  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent((p) => p + 1);
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent((p) => p - 1);
    }
  };

  /* ---------------- QUIZ UI ---------------- */

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <Badge>{question.category}</Badge>

        <div className="flex items-center gap-2 border px-3 py-2 rounded-lg">
          <Clock className="w-4 h-4" />
          <span>
            {Math.floor(timeLeft / 60)}:{timeLeft % 60}
          </span>
        </div>
      </div>

      {/* PROGRESS */}
      <Progress value={progress} />

      {/* QUESTION */}
      <Card>
        <CardHeader>{question.text}</CardHeader>

        <CardContent>
          <RadioGroup
            value={selected[current] || ""}
            onValueChange={(v) =>
              setSelected({
                ...selected,
                [current]: v,
              })
            }
          >
            {question.options.map((opt, i) => (
              <Label key={i} className="flex gap-2 border p-3 rounded">
                <RadioGroupItem value={String(i)} />
                {opt}
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* CONTROLS */}
      <div className="flex justify-between">
        <Button onClick={prev} disabled={current === 0}>
          <ChevronLeft /> Prev
        </Button>

        {current === questions.length - 1 ? (
          <Button onClick={handleSubmitQuiz}>Submit</Button>
        ) : (
          <Button onClick={next}>
            Next <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  );
}
