import { Brain, ArrowRight, Sparkles } from "lucide-react";

type Props = {
  data: any;
};

export default function AprioriCard({ data }: Props) {
  if (!data) return null;

  const recommendations = data.recommendations || [];

  const attempted = data.attempted || [];

  const rules = data.rules || [];

  return (
    <div className="space-y-6">
      {/* ATTEMPTED */}
      <div className="rounded-xl border p-4">
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <Brain className="h-4 w-4" />
          Previously Attempted
        </h3>

        <div className="flex flex-wrap gap-2">
          {attempted.map((item: string, i: number) => (
            <span key={i} className="rounded-full bg-muted px-3 py-1 text-sm">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div className="rounded-xl border p-4">
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <Sparkles className="h-4 w-4 text-green-500" />
          Apriori Recommendations
        </h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((item: string, i: number) => (
            <div key={i} className="rounded-lg border p-3">
              <p className="font-medium">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RULES */}
      <div className="rounded-xl border p-4">
        <h3 className="mb-3 font-semibold">Association Rules</h3>

        <div className="space-y-2">
          {rules.slice(0, 5).map((rule: any, i: number) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span>{rule.antecedent.join(", ")}</span>

              <ArrowRight className="h-4 w-4" />

              <span>{rule.consequent.join(", ")}</span>

              <span className="ml-auto text-muted-foreground">
                {(rule.confidence * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
