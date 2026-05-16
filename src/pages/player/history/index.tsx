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

const history = [
  {
    id: 1,
    quiz: "World Capitals Sprint",
    category: "Geography",
    score: "9/10",
    accuracy: 90,
    date: "May 13, 2026",
    status: "Passed",
  },
  {
    id: 2,
    quiz: "JavaScript Deep Dive",
    category: "Programming",
    score: "14/20",
    accuracy: 70,
    date: "May 11, 2026",
    status: "Passed",
  },
  {
    id: 3,
    quiz: "Renaissance Art",
    category: "History",
    score: "8/15",
    accuracy: 53,
    date: "May 9, 2026",
    status: "Failed",
  },
  {
    id: 4,
    quiz: "General Knowledge",
    category: "Mixed",
    score: "3/5",
    accuracy: 60,
    date: "May 8, 2026",
    status: "Passed",
  },
  {
    id: 5,
    quiz: "Physics Basics",
    category: "Science",
    score: "12/12",
    accuracy: 100,
    date: "May 5, 2026",
    status: "Perfect",
  },
];

export default function PlayerHistory() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Quiz History</h1>
        <p className="text-muted-foreground text-sm">
          Every quiz you've completed.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="font-medium">{h.quiz}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{h.category}</Badge>
                  </TableCell>
                  <TableCell>{h.score}</TableCell>
                  <TableCell>{h.accuracy}%</TableCell>
                  <TableCell className="text-muted-foreground">
                    {h.date}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        h.status === "Failed"
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : h.status === "Perfect"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-success/10 text-success border-success/20"
                      }
                      variant="outline"
                    >
                      {h.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost">
                      <LinkComponent href="/players/quiz-review">
                        <Eye className="h-4 w-4" />
                      </LinkComponent>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
