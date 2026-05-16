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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6">
          {question ? "Edit Question" : "Add Question"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Question Text */}
          <div>
            <textarea
              {...register("text")}
              placeholder="Enter question"
              className="w-full border rounded-xl p-3"
            />
            {errors.text && (
              <p className="text-red-500 text-sm">{errors.text.message}</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="font-medium">Options</label>

            {[0, 1, 2, 3].map((index) => (
              <div key={index}>
                <input
                  {...register(`options.${index}` as const)}
                  placeholder={`Option ${index + 1}`}
                  className="w-full border rounded-xl p-3"
                />

                {errors.options?.[index] && (
                  <p className="text-red-500 text-sm">
                    {errors.options[index]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Correct Option */}
          <div>
            <label className="font-medium">Correct Option</label>

            <select
              {...register("correctOption", {
                valueAsNumber: true,
              })}
              className="w-full border rounded-xl p-3"
            >
              {[0, 1, 2, 3].map((i) => (
                <option key={i} value={i}>
                  Option {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="font-medium">Category</label>

            <select
              {...register("categoryId")}
              className="w-full border rounded-xl p-3"
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

          {/* Difficulty */}
          <div>
            <label className="font-medium">Difficulty</label>

            <select
              {...register("difficulty")}
              className="w-full border rounded-xl p-3"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 text-white"
            >
              Save Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
