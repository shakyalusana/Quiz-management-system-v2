import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HistoryDialogProps {
  open: boolean;
  onClose: () => void;
  auditData: any;
  isLoading: boolean;
}

const HistoryDialog = ({
  open,
  onClose,
  auditData,
  isLoading,
}: HistoryDialogProps) => {
  const audit = auditData?.audit;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[95vw]
          max-w-3xl
          max-h-[90vh]
          overflow-hidden
          rounded-xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Quiz Audit Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-10 text-center">Loading audit details...</div>
        ) : audit ? (
          <div
            className="
              space-y-5
              overflow-y-auto
              max-h-[75vh]
              pr-2
            "
          >
            {/* BASIC INFO */}

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-3
              "
            >
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Category</p>

                  <p className="font-semibold">
                    {audit.category?.name || "Unknown"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Score</p>

                  <p className="text-2xl font-bold">
                    {audit.score}
                    <span className="text-sm text-muted-foreground">
                      /{audit.totalQuestions * 10}
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Questions</p>

                  <p className="text-2xl font-bold">{audit.totalQuestions}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Accuracy</p>

                  <p className="text-2xl font-bold">
                    {Math.round(
                      (audit.score / (audit.totalQuestions * 10)) * 100,
                    )}
                    %
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* DATE */}

            <div className="text-sm text-muted-foreground">
              Completed on:
              <span className="ml-2 font-medium">
                {new Date(audit.createdAt).toLocaleString()}
              </span>
            </div>

            {/* QUESTION AUDIT */}

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Question Analysis</h3>

              {audit.audit?.map((item: any, index: number) => (
                <Card key={item._id}>
                  <CardContent
                    className="
                      p-4
                      space-y-3
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-2
                      "
                    >
                      <p className="font-medium">Question {index + 1}</p>

                      <Badge
                        variant="outline"
                        className={
                          item.isCorrect
                            ? "text-green-600 border-green-300"
                            : "text-red-600 border-red-300"
                        }
                      >
                        {item.isCorrect ? "Correct" : "Wrong"}
                      </Badge>
                    </div>

                    <div
                      className="
                        grid
                        grid-cols-1
                        sm:grid-cols-3
                        gap-3
                        text-sm
                      "
                    >
                      <div>
                        <p className="text-muted-foreground">Difficulty</p>

                        <p className="font-medium capitalize">
                          {item.difficulty}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Selected Option</p>

                        <p className="font-medium">
                          Option {item.selectedOption}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Correct Option</p>

                        <p className="font-medium">
                          Option {item.correctOption}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center py-10">No audit data found</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HistoryDialog;
