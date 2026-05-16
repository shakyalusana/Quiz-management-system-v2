import { useState } from "react";
import { Clock, ChevronRight, ChevronLeft, Flag } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const question = {
  number: 4,
  total: 10,
  category: "Programming",
  text: "Which of the following is NOT a primitive type in JavaScript?",
  options: [
    { id: "a", text: "string" },
    { id: "b", text: "number" },
    { id: "c", text: "object" },
    { id: "d", text: "boolean" },
  ],
};

export default function PlayerQuiz() {
  const [selected, setSelected] = useState<string>();
  const progress = (question.number / question.total) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Badge variant="outline">{question.category}</Badge>
          <h1 className="text-xl font-semibold">JavaScript Deep Dive</h1>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium">
          <Clock className="h-4 w-4 text-primary" />
          <span>14:32</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Question {question.number} of {question.total}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card className="shadow-(--shadow-elegant)">
        <CardHeader>
          <h2 className="text-xl font-semibold leading-relaxed">
            {question.text}
          </h2>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selected}
            onValueChange={setSelected}
            className="gap-3"
          >
            {question.options.map((o) => (
              <Label
                key={o.id}
                htmlFor={o.id}
                className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all hover:border-primary/50 hover:bg-accent/5 ${
                  selected === o.id ? "border-primary bg-primary/5" : ""
                }`}
              >
                <RadioGroupItem value={o.id} id={o.id} />
                <span className="text-sm font-medium uppercase text-muted-foreground">
                  {o.id}.
                </span>
                <span className="text-base">{o.text}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between gap-3">
        <Button variant="outline">
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost">
            <Flag className="h-4 w-4" /> Flag
          </Button>
          <Button>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
