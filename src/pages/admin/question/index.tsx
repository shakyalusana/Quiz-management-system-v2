import { useState } from "react";
import QuestionModal from "@/components/adminQuestionModel/questionModel";

import {
  useQuestions,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from "@/hooks/useQuestions";

import { useCategories } from "@/hooks/useCategories";
import { toast } from "sonner";

interface Question {
  _id: string;
  text: string;
  category?: string | { _id: string; name: string };
  difficulty: string;
  options: string[];
  correctOption: number;
}

interface QuestionFormData {
  text: string;
  options: string[];
  correctOption: number;
  difficulty: string;
  categoryId: string;
}

const AdminQuestion = () => {
  const { data: questions = [], isLoading } = useQuestions();
  const { data: categories = [] } = useCategories();

  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();

  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<
    Question | undefined
  >(undefined);

  // Open modal for create
  const handleAdd = () => {
    setSelectedQuestion(undefined);
    setOpen(true);
  };

  // Open modal for edit
  const handleEdit = (question: Question) => {
    // Normalize category to object if it's a string
    const normalizedCategory =
      typeof question.category === "string"
        ? categories.find(
            (c: { _id: string; name: string }) => c._id === question.category,
          )
        : question.category;

    const normalizedQuestion: Question = {
      ...question,
      category: normalizedCategory,
    };
    setSelectedQuestion(normalizedQuestion);
    setOpen(true);
  };

  // Save handler (create or update)
  const handleSubmit = async (data: QuestionFormData) => {
    try {
      const payload = {
        text: data.text,
        options: data.options,
        correctOption: data.correctOption,
        difficulty: data.difficulty,

        // 🔥 IMPORTANT FIX
        category: data.categoryId,
      };

      if (selectedQuestion) {
        await updateQuestion.mutateAsync({
          id: selectedQuestion._id,
          payload,
        });

        toast.success("Question updated");
      } else {
        await createQuestion.mutateAsync(payload);
        toast.success("Question created");
      }

      setOpen(false);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQuestion.mutateAsync(id);
      toast.success("Deleted successfully");
    } catch (_err) {
      toast.error("Delete failed");
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading questions...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Questions</h1>

        <button
          onClick={handleAdd}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl"
        >
          Add Question
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Question</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Difficulty</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {questions.map((q) => (
              <tr key={q._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{q.text}</td>

                <td className="p-3">
                  {q.category?.name ||
                    categories.find(
                      (c: { _id: string; name: string }) =>
                        c._id === q.category,
                    )?.name ||
                    "N/A"}
                </td>

                <td className="p-3 capitalize">{q.difficulty}</td>

                <td className="p-3">
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => handleEdit(q)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(q._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {questions.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-500">
                  No questions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <QuestionModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        categories={categories}
        question={selectedQuestion}
      />
    </div>
  );
};

export default AdminQuestion;
