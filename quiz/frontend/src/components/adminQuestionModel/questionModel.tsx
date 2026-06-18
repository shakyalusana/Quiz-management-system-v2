import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { questionSchema } from "@/schema/questionSchema";
import type { QuestionInput } from "@/schema/questionSchema";

interface Category {
  _id: string;
  name: string;
}

interface Question {
  text: string;
  options: string[];
  correctOption: number;
  category?: Category;
  categoryId?: string;
  difficulty: "easy" | "medium" | "hard";
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: QuestionInput) => void;
  categories: Category[];
  question?: Question;
}

export default function QuestionModal({
  open,
  onClose,
  onSubmit,
  categories,
  question,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionInput>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: "",
      options: ["", "", "", ""],
      correctOption: 0,
      categoryId: "",
      difficulty: "medium",
    },
  });

  useEffect(() => {
    if (question) {
      reset({
        text: question.text || "",
        options: question.options || ["", "", "", ""],
        correctOption: question.correctOption ?? 0,
        categoryId: question.category?._id || question.categoryId || "",
        difficulty: question.difficulty || "medium",
      });
    } else {
      reset({
        text: "",
        options: ["", "", "", ""],
        correctOption: 0,
        categoryId: "",
        difficulty: "medium",
      });
    }
  }, [question, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      {/* MODAL CONTAINER */}

      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-xl ">
        <h2 className="text-xl sm:text-2xl font-bold  mb-5">
          {question ? "Edit Question" : "Add Question"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* QUESTION */}

          <div>
            <label className="font-medium text-sm">Question</label>

            <textarea
              {...register("text")}
              placeholder="Enter question"
              className="w-full border rounded-xl p-3 mt-1 min-h-25 resize-none focus:ring-2 focus:ring-purple-500 outline-none"
            />

            {errors.text && (
              <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>
            )}
          </div>

          {/* OPTIONS */}

          <div className="space-y-3">
            <label className="font-medium text-sm">Options</label>

            {[0, 1, 2, 3].map((index) => (
              <div key={index}>
                <input
                  {...register(`options.${index}` as const)}
                  placeholder={`Option ${index + 1}`}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none"
                />

                {errors.options?.[index] && (
                  <p className="text-red-500 text-sm">
                    {errors.options[index]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* CORRECT OPTION */}

          <div>
            <label className="font-medium text-sm">Correct Option</label>

            <select
              {...register("correctOption", {
                valueAsNumber: true,
              })}
              className="w-full border rounded-xl p-3 mt-1"
            >
              {[0, 1, 2, 3].map((i) => (
                <option key={i} value={i}>
                  Option {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* CATEGORY */}

          <div>
            <label className="font-medium text-sm">Category</label>

            <select
              {...register("categoryId")}
              className="w-full border rounded-xl p-3 mt-1"
            >
              <option value="">Select Category</option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {errors.categoryId && (
              <p className="text-red-500 text-sm">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* DIFFICULTY */}

          <div>
            <label className="font-medium text-sm">Difficulty</label>

            <select
              {...register("difficulty")}
              className="w-full border rounded-xl p-3 mt-1"
            >
              <option value="easy">Easy</option>

              <option value="medium">Medium</option>

              <option value="hard">Hard</option>
            </select>
          </div>

          {/* BUTTONS */}

          <div className=" flex flex-col-reverse sm:flex-row justify-end gap-3 pt-5">
            <button
              type="button"
              onClick={onClose}
              className=" w-full sm:w-auto px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 "
            >
              Save Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
