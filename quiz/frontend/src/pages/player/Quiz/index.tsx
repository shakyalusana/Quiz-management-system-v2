import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Clock,
  Trophy,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Star,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

import { CATEGORYAPI } from "@/api/categoryApi";
import { QUIZAPI } from "@/api/quizApi";
import { Label } from "@/components/ui/label";
import { SUBCATEGORYAPI } from "@/api/subcatgeoryApi";
import { RECOMMENDATIONAPI } from "@/api/recommendationApi";

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

interface SubCategory {
  _id: string;
  name: string;
  category?: string;
}

interface RecommendedCategory extends Category {
  isRecommended?: boolean;
  fromRule?: boolean;
}

export default function PlayerQuiz() {
  const [settings, setSettings] = useState({
    categoryId: "",
    subcategoryId: "",
    difficulty: "medium",
    count: 10,
  });

  const { data: categories = [] } = CATEGORYAPI.useCategories();
  const { data: subCategories = [] } = SUBCATEGORYAPI.useSubCategories(
    settings.categoryId,
  );
  const startQuizMutation = QUIZAPI.useStartQuiz();
  const submitQuizMutation = QUIZAPI.useSubmitQuiz();

  // =============== ALGORITHM INTEGRATION POINTS ===============
  // Get multiple recommendation algorithms for different sections
  const apriori = RECOMMENDATIONAPI.useAprioriRecommendation();
  const contentBased = RECOMMENDATIONAPI.useRecommendations("content");
  const collaborative = RECOMMENDATIONAPI.useRecommendations("collaborative");
  const hybrid = RECOMMENDATIONAPI.useRecommendations("hybrid");
  const popularity = RECOMMENDATIONAPI.useRecommendations("popular");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [started, setStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [selected, setSelected] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  // =============== ALGORITHM 1: A-PRIORI (Association Rules) ===============
  const recommendedCategories = useMemo(() => {
    if (!apriori.data) return [];

    const data = apriori.data.result || apriori.data;

    const ids = new Set<string>();

    // Keep recommendations
    data.recommendations?.forEach((id: string) => {
      ids.add(id);
    });

    // Keep rule consequents
    data.rules?.forEach((rule: any) => {
      rule.consequent?.forEach((id: string) => {
        ids.add(id);
      });
    });

    // Return category objects + recommendation info
    return categories
      .filter((category: Category) => ids.has(category._id))
      .map((category: Category) => ({
        ...category,
        isRecommended: data.recommendations?.includes(category._id),
        fromRule: data.rules?.some((rule: any) =>
          rule.consequent?.includes(category._id),
        ),
      }));
  }, [apriori.data, categories]);

  // =============== TIMER ===============
  const initialTime = useMemo(() => {
    return settings.difficulty === "easy"
      ? 120
      : settings.difficulty === "hard"
        ? 600
        : 300;
  }, [settings.difficulty]);

  const [timeLeft, setTimeLeft] = useState(initialTime);

  const [errors, setErrors] = useState({
    categoryId: "",
    subcategoryId: "",
    count: "",
  });

  const validateQuiz = () => {
    let valid = true;

    const newErrors = {
      categoryId: "",
      subcategoryId: "",
      count: "",
    };

    if (!settings.categoryId) {
      newErrors.categoryId = "Please select a category";
      valid = false;
    }

    if (!settings.subcategoryId) {
      newErrors.subcategoryId = "Please select a subcategory";
      valid = false;
    }

    if (!settings.count || settings.count < 1) {
      newErrors.count = "Minimum 1 question required";
      valid = false;
    } else if (settings.count > 50) {
      newErrors.count = "Maximum 50 questions allowed";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  /* =============== START QUIZ =============== */
  const startQuiz = async () => {
    if (!validateQuiz()) return;

    try {
      setLoading(true);

      const res = await startQuizMutation.mutateAsync({
        categoryId: settings.categoryId,
        subcategoryId: settings.subcategoryId,
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

  /* =============== CALCULATE SCORE =============== */
  const calculateScore = useCallback(() => {
    return questions.reduce((acc, q) => {
      return selected[q._id] === q.correctOption ? acc + 1 : acc;
    }, 0);
  }, [questions, selected]);

  // =============== ALGORITHM 2-5: POST-QUIZ RECOMMENDATIONS ===============
  // Calculate performance metrics for algorithms
  const quizMetrics = useMemo(() => {
    const finalScore = calculateScore();
    const accuracy = questions.length
      ? (finalScore / questions.length) * 100
      : 0;
    const wrongAnswers = questions.length - finalScore;

    return {
      score: finalScore,
      accuracy,
      wrongAnswers,
      performance:
        accuracy > 80
          ? "excellent"
          : accuracy > 60
            ? "good"
            : "needs-improvement",
    };
  }, [calculateScore, questions.length]);

  /* =============== SUBMIT QUIZ =============== */
  const submitQuiz = useCallback(async () => {
    if (!questions.length) return;

    const finalScore = calculateScore();
    setScore(finalScore);

    await submitQuizMutation.mutateAsync({
      categoryId: settings.categoryId,
      subcategoryId: settings.subcategoryId,
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
    settings.subcategoryId,
    selected,
  ]);

  /* =============== TIMER =============== */
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

  /* =============== LOADING STATE =============== */
  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6 rounded-2xl border shadow space-y-4 text-center">
        <h1 className="text-xl font-bold">Loading Quiz...</h1>
        <p className="text-muted-foreground">Preparing your challenge</p>
      </div>
    );
  }

  /* =============== START SCREEN =============== */
  if (!started && !showResults) {
    return (
      <div className="max-w-xl mx-auto p-6 rounded-2xl border shadow space-y-4">
        <h1 className="text-xl font-bold">Quiz Arena</h1>

        {/* =============== ALGORITHM 1: A-PRIORI RECOMMENDATIONS =============== */}
        {apriori.isLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading smart recommendations...
          </div>
        ) : recommendedCategories.length > 0 ? (
          <div className="rounded-xl border p-4 bg-muted/30 space-y-3">
            <h2 className="font-semibold flex items-center gap-2">
              <Lightbulb size={16} />
              A-Priori Recommended Categories
            </h2>

            <p className="text-sm text-muted-foreground">
              Based on association rule mining of your quiz history
            </p>

            <div className="flex flex-wrap gap-3">
              {recommendedCategories.map((category: RecommendedCategory) => (
                <Button
                  key={category._id}
                  variant="outline"
                  onClick={() => {
                    setSettings({
                      ...settings,
                      categoryId: category._id,
                      subcategoryId: "",
                    });

                    setErrors({
                      categoryId: "",
                      subcategoryId: "",
                      count: "",
                    });
                  }}
                >
                  {category.name}

                  {category.isRecommended && (
                    <span className="ml-2 text-xs">
                      <Star size={16} />
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        {/* CATEGORY SELECT */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Select Category
          </Label>

          <select
            className={`w-full border p-2 rounded ${
              errors.categoryId ? "border-red-500" : ""
            }`}
            value={settings.categoryId}
            onChange={(e) => {
              setSettings({
                ...settings,
                categoryId: e.target.value,
                subcategoryId: "",
              });

              setErrors((prev) => ({
                ...prev,
                categoryId: "",
              }));
            }}
          >
            <option value="">Select Category</option>

            {categories.map((c: Category) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {errors.categoryId && (
            <p className="text-sm text-red-500">{errors.categoryId}</p>
          )}
        </div>

        {/* SUBCATEGORY SELECT */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Select Subcategory
          </Label>

          <select
            className={`w-full border p-2 rounded ${
              errors.subcategoryId ? "border-red-500" : ""
            }`}
            value={settings.subcategoryId}
            onChange={(e) => {
              setSettings({
                ...settings,
                subcategoryId: e.target.value,
              });

              setErrors((prev) => ({
                ...prev,
                subcategoryId: "",
              }));
            }}
          >
            <option value="">Select Subcategory</option>

            {subCategories.map((s: SubCategory) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          {errors.subcategoryId && (
            <p className="text-sm text-red-500">{errors.subcategoryId}</p>
          )}
        </div>

        {/* DIFFICULTY SELECT */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Select Difficulty
          </Label>

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
        </div>

        {/* QUESTION COUNT */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Number of Questions
          </Label>

          <Input
            type="number"
            min={1}
            max={50}
            value={settings.count}
            onChange={(e) => {
              setSettings({
                ...settings,
                count: Number(e.target.value),
              });

              setErrors((prev) => ({
                ...prev,
                count: "",
              }));
            }}
            className={errors.count ? "border-red-500" : ""}
          />

          {errors.count && (
            <p className="text-sm text-red-500">{errors.count}</p>
          )}
        </div>

        <Button onClick={startQuiz} className="w-full">
          Start Challenge
        </Button>
      </div>
    );
  }

  /* =============== RESULTS SCREEN =============== */
  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* =============== ALGORITHM 2-5: POST-QUIZ RECOMMENDATIONS =============== */}
        {/* These algorithms use the quiz results to recommend next steps */}

        {/* CONTENT-BASED RECOMMENDATIONS */}
        {contentBased.isLoading ? null : contentBased.data?.result
            ?.recommendedCategories?.length ? (
          <div className="rounded-xl border p-4 bg-blue-50 space-y-3">
            <h3 className="font-semibold text-blue-900">
              📚 Content-Based Recommendations
            </h3>
            <p className="text-sm text-blue-700">
              Similar to categories you've done well in
            </p>
            <div className="flex flex-wrap gap-2">
              {contentBased.data.result.recommendedCategories
                .slice(0, 3)
                .map((rec: any) => (
                  <span
                    key={rec.category._id}
                    className="px-3 py-1 rounded-full bg-blue-200 text-blue-900 text-sm"
                  >
                    {rec.category.name} ({rec.accuracy.toFixed(1)}%)
                  </span>
                ))}
            </div>
          </div>
        ) : null}

        {/* COLLABORATIVE FILTERING RECOMMENDATIONS */}
        {collaborative.isLoading ? null : collaborative.data?.result
            ?.recommendedCategories?.length ? (
          <div className="rounded-xl border p-4 bg-purple-50 space-y-3">
            <h3 className="font-semibold text-purple-900">
              👥 Collaborative Filtering
            </h3>
            <p className="text-sm text-purple-700">
              Popular among users with similar performance
            </p>
            <div className="flex flex-wrap gap-2">
              {collaborative.data.result.recommendedCategories
                .slice(0, 3)
                .map((rec: any) => (
                  <span
                    key={rec.category._id}
                    className="px-3 py-1 rounded-full bg-purple-200 text-purple-900 text-sm"
                  >
                    {rec.category.name}
                  </span>
                ))}
            </div>
          </div>
        ) : null}

        {/* HYBRID RECOMMENDATIONS */}
        {hybrid.isLoading ? null : hybrid.data?.result?.recommendedCategories
            ?.length ? (
          <div className="rounded-xl border p-4 bg-green-50 space-y-3">
            <h3 className="font-semibold text-green-900">
              🎯 Hybrid AI Engine
            </h3>
            <p className="text-sm text-green-700">
              Best of all algorithms combined
            </p>
            <div className="flex flex-wrap gap-2">
              {hybrid.data.result.recommendedCategories
                .slice(0, 3)
                .map((rec: any) => (
                  <span
                    key={rec.category._id}
                    className="px-3 py-1 rounded-full bg-green-200 text-green-900 text-sm"
                  >
                    {rec.category.name}
                  </span>
                ))}
            </div>
          </div>
        ) : null}

        {/* POPULARITY-BASED RECOMMENDATIONS */}
        {popularity.isLoading ? null : popularity.data?.result
            ?.recommendedCategories?.length ? (
          <div className="rounded-xl border p-4 bg-orange-50 space-y-3">
            <h3 className="font-semibold text-orange-900">🔥 Trending Now</h3>
            <p className="text-sm text-orange-700">
              Most popular categories across all players
            </p>
            <div className="flex flex-wrap gap-2">
              {popularity.data.result.recommendedCategories
                .slice(0, 3)
                .map((rec: any) => (
                  <span
                    key={rec.category._id}
                    className="px-3 py-1 rounded-full bg-orange-200 text-orange-900 text-sm"
                  >
                    {rec.category.name}
                  </span>
                ))}
            </div>
          </div>
        ) : null}

        {/* REVIEW SECTION */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Question Review</h2>
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

        {/* RESULTS CARD */}
        <div className="text-center border rounded-2xl p-6 shadow">
          <Trophy className="mx-auto text-yellow-500 w-10 h-10 mb-2" />
          <h2 className="text-xl font-bold">Results</h2>

          <p className="mt-2 text-lg">
            Score: <b>{score}</b> / {questions.length}
          </p>

          <p className="text-sm text-gray-500">
            Accuracy: {quizMetrics.accuracy.toFixed(1)}%
          </p>

          <p className="text-sm mt-2 font-semibold">
            Performance:{" "}
            {quizMetrics.performance === "excellent"
              ? "🌟 Excellent!"
              : quizMetrics.performance === "good"
                ? "👍 Good Job!"
                : "📈 Keep Practicing!"}
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
      </div>
    );
  }

  /* =============== QUIZ SCREEN =============== */
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Question {questions.indexOf(q) + 1} of {questions.length}
              </span>
            </div>
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
