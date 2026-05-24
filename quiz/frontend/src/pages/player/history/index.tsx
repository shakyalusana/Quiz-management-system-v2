import { Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import LinkComponent from "@/components/Link";
import { HISTORYAPI } from "@/api/historyApi";

export default function PlayerHistory() {
  const { data } = HISTORYAPI.usePlayerHistory();

  const history = data?.history || [];

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Quiz History</h1>

        <p className="text-muted-foreground text-sm">
          Every quiz you've completed.
        </p>
      </div>

      {/* TABLE */}

      <Card>
        <CardHeader>
          <CardTitle>All Attempts</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>

                <TableHead>Score</TableHead>

                <TableHead>Accuracy</TableHead>

                <TableHead>Date</TableHead>

                <TableHead>Status</TableHead>

                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {history.map(
                (h: {
                  _id: string;
                  score: number;
                  totalQuestions: number;
                  category?: { name: string };
                  date: string;
                }) => {
                  const accuracy = Math.round(
                    (h.score / h.totalQuestions) * 100,
                  );

                  const status =
                    accuracy >= 80
                      ? "Perfect"
                      : accuracy >= 50
                        ? "Passed"
                        : "Failed";

                  return (
                    <TableRow key={h._id}>
                      {/* CATEGORY */}

                      <TableCell>
                        <Badge variant="outline">
                          {h.category?.name || "Unknown"}
                        </Badge>
                      </TableCell>

                      {/* SCORE */}

                      <TableCell>
                        {h.score}/{h.totalQuestions}
                      </TableCell>

                      {/* ACCURACY */}

                      <TableCell>{accuracy}%</TableCell>

                      {/* DATE */}

                      <TableCell className="text-muted-foreground">
                        {new Date(h.date).toLocaleDateString()}
                      </TableCell>

                      {/* STATUS */}

                      <TableCell>
                        <Badge
                          className={
                            status === "Failed"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : status === "Perfect"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-success/10 text-success border-success/20"
                          }
                          variant="outline"
                        >
                          {status}
                        </Badge>
                      </TableCell>

                      {/* ACTION */}

                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="ghost">
                          <LinkComponent href="/players/quiz-review">
                            <Eye className="h-4 w-4" />
                          </LinkComponent>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                },
              )}

              {/* EMPTY STATE */}

              {history.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No quiz history found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
