import { useCallback, useEffect, useMemo, useState } from "react";
import { Clock, Trophy, CheckCircle2, XCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

import { CATEGORYAPI } from "@/api/categoryApi";
import { QUIZAPI } from "@/api/quizApi";
import { Label } from "@/components/ui/label";

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctOption: number;
}

interface Category {
  _id: string;
  name: string;
}

export default function PlayerQuiz() {
  const { data: categories = [] } = CATEGORYAPI.useCategories();
  const startQuizMutation = QUIZAPI.useStartQuiz();
  const submitQuizMutation = QUIZAPI.useSubmitQuiz();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [started, setStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [selected, setSelected] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    categoryId: "",
    difficulty: "medium",
    count: 10,
  });

  /* ---------------- TIMER ---------------- */
  const initialTime = useMemo(() => {
    return settings.difficulty === "easy"
      ? 120
      : settings.difficulty === "hard"
        ? 600
        : 300;
  }, [settings.difficulty]);

  const [timeLeft, setTimeLeft] = useState(initialTime);

  /* ---------------- START QUIZ ---------------- */

  const startQuiz = async () => {
    if (!settings.categoryId) return;

    try {
      setLoading(true);

      const res = await startQuizMutation.mutateAsync({
        categoryId: settings.categoryId,
        difficulty: settings.difficulty,
        count: settings.count,
      });

      const questionsData = Array.isArray(res)
        ? res
        : res?.data || res?.questions || [];

      setQuestions(questionsData);
      setSelected({});
      setScore(0);
      setShowResults(false);
      setStarted(true);
      setTimeLeft(initialTime);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SCORE ---------------- */
  const calculateScore = useCallback(() => {
    return questions.reduce((acc, q) => {
      return selected[q._id] === q.correctOption ? acc + 1 : acc;
    }, 0);
  }, [questions, selected]);

  /* ---------------- SUBMIT ---------------- */
  const submitQuiz = useCallback(async () => {
    if (!questions.length) return;

    const finalScore = calculateScore();
    setScore(finalScore);

    await submitQuizMutation.mutateAsync({
      categoryId: settings.categoryId,
      answers: questions.map((q) => ({
        questionId: q._id,
        selectedOption: selected[q._id] ?? -1,
      })),
      score: finalScore,
    });

    setShowResults(true);
    setStarted(false);
  }, [
    questions,
    calculateScore,
    submitQuizMutation,
    settings.categoryId,
    selected,
  ]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (!started || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, showResults, submitQuiz]);

  const progress =
    (Object.keys(selected).length / (questions.length || 1)) * 100;

  /* ---------------- START SCREEN ---------------- */

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6 rounded-2xl border shadow space-y-4 text-center">
        <h1 className="text-xl font-bold">Loading Quiz...</h1>
        <p className="text-muted-foreground">Preparing your challenge</p>
      </div>
    );
  }
  if (!started && !showResults) {
    return (
      <div className="max-w-xl mx-auto p-6 rounded-2xl border shadow space-y-4">
        <h1 className="text-xl font-bold">Quiz Arena</h1>

        <Label className="text-sm text-muted-foreground">Select Category</Label>
        <select
          className="w-full border p-2 rounded"
          value={settings.categoryId}
          onChange={(e) =>
            setSettings({ ...settings, categoryId: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map((c: Category) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <Label className="text-sm text-muted-foreground">
          Select Difficulty
        </Label>
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

        <Label className="text-sm text-muted-foreground">
          Number of Questions
        </Label>
        <Input
          type="number"
          value={settings.count}
          onChange={(e) =>
            setSettings({ ...settings, count: Number(e.target.value) })
          }
        />

        <Button onClick={startQuiz} className="w-full">
          Start Challenge
        </Button>
      </div>
    );
  }

  /* ---------------- RESULTS SCREEN ---------------- */
  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="text-center border rounded-2xl p-6 shadow">
          <Trophy className="mx-auto text-yellow-500 w-10 h-10 mb-2" />
          <h2 className="text-xl font-bold">Results</h2>

          <p className="mt-2 text-lg">
            Score: <b>{score}</b> / {questions.length}
          </p>

          <p className="text-sm text-gray-500">
            Accuracy: {Math.round((score / questions.length) * 100)}%
          </p>

          <Button
            className="mt-4"
            onClick={() => {
              setStarted(false);
              setShowResults(false);
            }}
          >
            Play Again
          </Button>
        </div>

        {/* REVIEW SECTION */}
        <div className="space-y-4">
          {questions.map((q) => {
            const userAnswer = selected[q._id];

            return (
              <Card key={q._id} className="p-4 space-y-2">
                <div className="font-semibold">{q.text}</div>

                {q.options.map((opt, i) => {
                  const isUser = userAnswer === i;
                  const isRight = q.correctOption === i;

                  return (
                    <div
                      key={i}
                      className={`p-2 rounded border flex items-center justify-between
                        ${
                          isRight
                            ? "bg-green-100 border-green-500 text-green-600"
                            : isUser
                              ? "bg-red-100 border-red-500 text-red-600"
                              : ""
                        }`}
                    >
                      {opt}

                      {isRight && <CheckCircle2 className="text-green-600" />}
                      {isUser && !isRight && (
                        <XCircle className="text-red-600" />
                      )}
                    </div>
                  );
                })}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------------- QUIZ SCREEN (ALL QUESTIONS) ---------------- */
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* TOP BAR */}
      <div className="flex justify-between items-center p-3 border rounded-xl">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </div>

        <div>Answered: {Object.keys(selected).length}</div>
      </div>

      <Progress value={progress} />

      {/* ALL QUESTIONS */}
      <div className="space-y-6">
        {questions.map((q) => (
          <Card key={q._id} className="p-5 space-y-3">
            <h2 className="font-semibold">{q.text}</h2>

            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isSelected = selected[q._id] === i;

                return (
                  <div
                    key={i}
                    onClick={() =>
                      setSelected((prev) => ({
                        ...prev,
                        [q._id]: i,
                      }))
                    }
                    className={`p-3 border rounded-lg cursor-pointer transition
                      ${
                        isSelected
                          ? "bg-green-100 border-green-500 text-green-600"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={submitQuiz} className="w-full">
        Finish Quiz
      </Button>
    </div>
  );
}
