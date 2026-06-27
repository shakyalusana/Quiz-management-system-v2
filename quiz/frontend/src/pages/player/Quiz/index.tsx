import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Clock,
  Trophy,
  CheckCircle2,
  XCircle,
  Star,
  Brain,
  Users,
  Zap,
  Check,
  RefreshCw,
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
import { RecommendationCard } from "./recommendationCard";

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

  const apriori = RECOMMENDATIONAPI.useApriori();
  const contentBased = RECOMMENDATIONAPI.useContentBased();
  const collaborative = RECOMMENDATIONAPI.useCollaborative();
  const hybrid = RECOMMENDATIONAPI.useHybrid();
  const popularity = RECOMMENDATIONAPI.usePopularity();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [started, setStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [selected, setSelected] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  // =============== ALGORITHM 1: A-PRIORI (Association Rules) ===============
  const recommendedCategories = useMemo(() => {
    if (!apriori.data) return [];

    const data = apriori.data?.data;

    if (!data) return [];
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
      .filter((category) => ids.has(category._id))
      .map((category) => ({
        category,
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
      <div className="p-6 rounded-2xl border shadow space-y-4 text-center">
        <h1 className="text-xl font-bold">Loading Quiz...</h1>
        <p className="text-muted-foreground">Preparing your challenge</p>
      </div>
    );
  }

  /* =============== START SCREEN =============== */
  if (!started && !showResults) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Quiz Arena
          </h1>
          <p className="text-muted-foreground">
            Choose your challenge and level up your knowledge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* =============== A-PRIORI RECOMMENDATIONS (ASSOCIATION RULES) =============== */}
          <RecommendationCard
            title="Recommended for You"
            description="Based on your quiz history patterns"
            items={
              apriori.data?.data?.recommendations?.length
                ? recommendedCategories.slice(0, 3)
                : []
            }
            icon={Star}
            gradient="from-amber-50 to-yellow-50"
            isLoading={apriori.isLoading}
          />

          {/* =============== COLLABORATIVE FILTERING =============== */}
          <RecommendationCard
            title="Popular with Users Like You"
            description="Trending among users with similar performance"
            items={collaborative.data?.data?.recommendedCategories?.slice(0, 3)}
            icon={Users}
            gradient="from-purple-50 to-pink-50"
            isLoading={collaborative.isLoading}
          />

          {/* =============== HYBRID RECOMMENDATIONS =============== */}
          <RecommendationCard
            title="Popular & Trending"
            description="Categories that are both popular and trending"
            items={popularity.data?.data?.recommendedCategories?.slice(0, 3)}
            icon={Zap}
            gradient="from-green-50 to-emerald-50"
            isLoading={popularity.isLoading}
          />
        </div>

        {/* QUIZ SETTINGS */}
        <div className="border rounded-xl p-6 space-y-4 bg-slate-50">
          <h2 className="font-semibold text-lg">Quiz Settings</h2>

          {/* CATEGORY SELECT */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Category</Label>
            <select
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.categoryId ? "border-red-500" : "border-gray-300"
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
            <Label className="text-sm font-medium">Select Subcategory</Label>
            <select
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.subcategoryId ? "border-red-500" : "border-gray-300"
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
            <Label className="text-sm font-medium">Select Difficulty</Label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <Label className="text-sm font-medium">Number of Questions</Label>
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
              className={`p-3 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.count ? "border-red-500" : ""
              }`}
            />

            {errors.count && (
              <p className="text-sm text-red-500">{errors.count}</p>
            )}
          </div>

          <Button
            onClick={startQuiz}
            className="w-full py-6 text-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Start Challenge
          </Button>
        </div>
      </div>
    );
  }

  /* =============== RESULTS SCREEN =============== */
  if (showResults) {
    return (
      <div className="p-6 space-y-6">
        {/* RESULTS CARD */}
        <div className="text-center border rounded-2xl p-8 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
          <Trophy className="mx-auto text-yellow-500 w-12 h-12 mb-4" />
          <h2 className="text-2xl font-bold">Quiz Complete!</h2>

          <p className="mt-4 text-3xl font-bold text-blue-600">
            {score} / {questions.length}
          </p>

          <p className="text-lg text-gray-600 mt-2">
            Accuracy:{" "}
            <span className="font-semibold">
              {quizMetrics.accuracy.toFixed(1)}%
            </span>
          </p>

          <p className="text-lg mt-3 font-semibold">
            {quizMetrics.performance === "excellent"
              ? "🌟 Excellent Performance!"
              : quizMetrics.performance === "good"
                ? "👍 Great Job!"
                : "📈 Keep Practicing!"}
          </p>
        </div>

        {/* REVIEW SECTION */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Question Review</h3>
          {questions.map((q, idx) => {
            const userAnswer = selected[q._id];
            const isCorrect = userAnswer === q.correctOption;

            return (
              <Card
                key={q._id}
                className="p-5 space-y-3 border-l-4 border-l-blue-500"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">
                    Question {idx + 1} of {questions.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{q.text}</div>
                  {isCorrect ? (
                    <CheckCircle2 className="text-green-600 w-5 h-5" />
                  ) : (
                    <XCircle className="text-red-600 w-5 h-5" />
                  )}
                </div>

                {q.options.map((opt, i) => {
                  const isUser = userAnswer === i;
                  const isRight = q.correctOption === i;

                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border-2 flex items-center justify-between transition ${
                        isRight
                          ? "bg-green-100 border-green-500 text-green-700"
                          : isUser
                            ? "bg-red-100 border-red-500 text-red-700"
                            : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <span>{opt}</span>
                      {isRight && <CheckCircle2 size={18} />}
                      {isUser && !isRight && <XCircle size={18} />}
                    </div>
                  );
                })}
              </Card>
            );
          })}
        </div>

        {/* =============== POST-QUIZ RECOMMENDATIONS =============== */}
        <div className="space-y-4 ">
          <h3 className="text-xl font-semibold">What's Next?</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CONTENT-BASED RECOMMENDATIONS */}
            <RecommendationCard
              title="Based on Your Performance"
              description="Similar categories where you can apply your knowledge"
              items={contentBased.data?.data?.recommendedCategories?.slice(
                0,
                3,
              )}
              icon={Brain}
              gradient="from-blue-50 to-cyan-50"
              isLoading={contentBased.isLoading}
            />

            {/* HYBRID RECOMMENDATIONS */}
            <RecommendationCard
              title="Smart Recommendations"
              description="Combined insights from all algorithms"
              items={hybrid.data?.data?.recommendedCategories
                ?.slice(0, 3)
                .map((rec: any) => ({
                  category: rec.category,
                  accuracy: rec.score * 100,
                }))}
              icon={Zap}
              gradient="from-green-50 to-emerald-50"
              isLoading={hybrid.isLoading}
            />
          </div>
        </div>

        <Button
          className="w-full py-6 text-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => {
            setStarted(false);
            setShowResults(false);
          }}
        >
          <RefreshCw className="w-5 h-5 mr-2" /> Play Again
        </Button>
      </div>
    );
  }

  /* =============== QUIZ SCREEN =============== */
  return (
    <div className="p-6 space-y-6">
      {/* TOP BAR */}
      <div className="flex justify-between items-center p-4 border rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm">
        <div className="flex items-center gap-2 font-semibold">
          <Clock size={18} className="text-blue-600" />
          <span className="text-lg">
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </span>
        </div>

        <div className="text-sm font-medium">
          Answered:{" "}
          <span className="font-bold text-blue-600">
            {Object.keys(selected).length}
          </span>{" "}
          / {questions.length}
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      {/* ALL QUESTIONS */}
      <div className="space-y-6 pb-6">
        {questions.map((q, idx) => (
          <Card
            key={q._id}
            className="p-6 space-y-4 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-600">
                Question {idx + 1} of {questions.length}
              </span>
              {selected[q._id] !== undefined && (
                <CheckCircle2 size={20} className="text-green-600" />
              )}
            </div>

            <h3 className="font-semibold text-lg">{q.text}</h3>

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
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      isSelected
                        ? "bg-blue-100 border-blue-500 text-blue-700 font-medium"
                        : "hover:bg-gray-50 border-gray-200 text-gray-700"
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

      <Button
        onClick={submitQuiz}
        className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 "
      >
        <Check size={18} className="mr-2" /> Finish Quiz
      </Button>
    </div>
  );
}
