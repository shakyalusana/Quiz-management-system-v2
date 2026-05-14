import { Brain } from "lucide-react";
import LinkComponent from "./Link";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <LinkComponent href={to} className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] shadow-[var(--shadow-elegant)]">
        <Brain className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-lg font-bold tracking-tight">QuizMind</span>
    </LinkComponent>
  );
}
