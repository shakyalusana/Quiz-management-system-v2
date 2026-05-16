import { useMemo } from "react";

interface Question {
  text: string;
  category?: { _id: string };
  difficulty: string;
}

interface QuestionFiltersParams {
  questions: Question[];
  search: string;
  category: string;
  difficulty: string;
}

export const useQuestionFilters = ({
  questions,
  search,
  category,
  difficulty,
}: QuestionFiltersParams) => {
  return useMemo(() => {
    return questions?.filter((question: Question) => {
      const matchesSearch = question.text
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || question.category?._id === category;

      const matchesDifficulty =
        difficulty === "all" || question.difficulty === difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [questions, search, category, difficulty]);
};
