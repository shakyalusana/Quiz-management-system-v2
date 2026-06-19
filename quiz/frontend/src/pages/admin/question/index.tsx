import { useState } from "react";

import QuestionModal from "@/components/adminQuestionModel/questionModel";

import { toast } from "sonner";
import { QUESTIONAPI } from "@/api/questionApi";
import { CATEGORYAPI } from "@/api/categoryApi";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Edit2, Plus, Trash2 } from "lucide-react";

import PaginationControls from "@/components/pageintion";

import { useDebounce } from "@/hooks/useDebounce";
import { SUBCATEGORYAPI } from "@/api/subcatgeoryApi";

interface Question {
  _id: string;
  text: string;
  category?:
    | string
    | {
        _id: string;
        name: string;
      };
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
  subcategoryId: string;
}

const AdminQuestion = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading } = QUESTIONAPI.useQuestions({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
  });

  const questions = data?.questions || [];

  const pagination = data?.pagination;

  const totalPages = pagination?.totalPages ?? 1;

  const { data: categories = [] } = CATEGORYAPI.useCategories();
  const { data: subCategories = [] } = SUBCATEGORYAPI.useSubCategories();

  const createQuestion = QUESTIONAPI.useCreateQuestion();

  const updateQuestion = QUESTIONAPI.useUpdateQuestion();

  const deleteQuestion = QUESTIONAPI.useDeleteQuestion();

  const [open, setOpen] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState<Question>();

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleAdd = () => {
    setSelectedQuestion(undefined);
    setOpen(true);
  };

  const handleEdit = (question: Question) => {
    const normalizedCategory =
      typeof question.category === "string"
        ? categories.find((c: any) => c._id === question.category)
        : question.category;

    setSelectedQuestion({
      ...question,
      category: normalizedCategory,
    });

    setOpen(true);
  };

  const handleSubmit = async (data: QuestionFormData) => {
    try {
      const payload = {
        text: data.text,
        options: data.options,
        correctOption: data.correctOption,
        difficulty: data.difficulty,
        category: data.categoryId,
        subcategory: data.subcategoryId,
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
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-muted">Questions</h1>

          <p className="text-muted-foreground mt-1">Manage quiz questions</p>
        </div>

        <Button onClick={handleAdd} className="gap-2">
          <Plus size={18} />
          Add Question
        </Button>
      </div>

      <Card className="p-6">
        {/* SEARCH */}

        <div className="mb-4">
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-sm"
          />
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading questions...</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>

                  <TableHead>Category</TableHead>

                  <TableHead>Difficulty</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {questions.length > 0 ? (
                  questions.map((q: Question) => (
                    <TableRow key={q._id}>
                      <TableCell className="font-medium max-w-md">
                        {q.text}
                      </TableCell>

                      <TableCell>
                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-sm">
                          {typeof q.category === "object"
                            ? q.category.name
                            : categories.find((c: any) => c._id === q.category)
                                ?.name || "N/A"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-sm">
                          {q.difficulty}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(q)}
                          >
                            <Edit2 size={16} />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(q._id)}
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No questions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* PAGINATION */}

            <div className="flex items-center mt-4">
              {questions.length > 0 && (
                <PaginationControls
                  currentPage={currentPage}
                  pageSize={itemsPerPage}
                  totalItems={pagination?.totalItems ?? 0}
                  onPageChange={handlePageChange}
                  onPageSizeChange={(size) => {
                    setItemsPerPage(size);

                    setCurrentPage(1);
                  }}
                />
              )}
            </div>
          </div>
        )}
      </Card>

      <QuestionModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        question={selectedQuestion}
        categories={categories}
        subCategories={subCategories}
      />
    </div>
  );
};

export default AdminQuestion;
