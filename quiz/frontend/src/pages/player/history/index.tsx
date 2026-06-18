import { Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LinkComponent from "@/components/Link";
import { HISTORYAPI } from "@/api/historyApi";

type HistoryItem = {
  _id: string;
  score: number;
  totalQuestions: number;
  date: string;
  category?: {
    name?: string;
  };
};

export default function PlayerHistory() {
  const { data } = HISTORYAPI.usePlayerHistory();
  const history: HistoryItem[] = data?.history || [];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Quiz History</h1>
        <p className="text-muted-foreground">
          Every quiz attempt you’ve completed.
        </p>
      </div>

      {/* TABLE */}
      <Card className="rounded-md overflow-hidden border shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            {/* HEADER */}
            <thead className="bg-muted/40 text-muted-foreground">
              <tr className="text-left">
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Score</th>
                <th className="p-4 font-medium">Questions Attempted</th>
                <th className="p-4 font-medium">Accuracy</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 text-right font-medium">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {history.map((h) => {
                const accuracy =
                  h.totalQuestions > 0
                    ? Math.round((h.score / h.totalQuestions) * 10)
                    : 0;

                const status =
                  accuracy >= 8
                    ? "Perfect"
                    : accuracy >= 5
                      ? "Passed"
                      : "Failed";

                const statusStyle =
                  status === "Perfect"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : status === "Passed"
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : "bg-red-100 text-red-700 border-red-200";

                return (
                  <tr
                    key={h._id}
                    className="border-t hover:bg-muted/30 transition"
                  >
                    {/* CATEGORY */}
                    <td className="p-4">
                      <Badge variant="outline" className="rounded-full">
                        {h.category?.name || "Unknown"}
                      </Badge>
                    </td>

                    {/* SCORE */}
                    <td className="p-4 font-medium">{h.score}</td>

                    {/* QUESTIONS ATTEMPTED */}
                    <td className="p-4 ">{h.totalQuestions}</td>

                    {/* ACCURACY */}
                    <td className="p-4 text-muted-foreground">{accuracy}%</td>

                    {/* DATE */}
                    <td className="p-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {new Date(h.date).toLocaleDateString()}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <Badge className={`${statusStyle} border`}>
                        {status}
                      </Badge>
                    </td>

                    {/* ACTION */}
                    <td className="p-4 text-right">
                      <Button asChild size="sm" variant="ghost">
                        <LinkComponent href={`/players/quiz-review/${h._id}`}>
                          <Eye className="w-4 h-4" />
                        </LinkComponent>
                      </Button>
                    </td>
                  </tr>
                );
              })}

              {/* EMPTY STATE */}
              {history.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No quiz history found 💤
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
