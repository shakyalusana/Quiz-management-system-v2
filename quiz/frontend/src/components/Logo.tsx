import { Brain } from "lucide-react";
import LinkComponent from "./Link";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <LinkComponent href={to} className="flex items-center gap-2 group">
      {/* Icon Container */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg transition-transform duration-300 group-hover:scale-105">
        {/* Brain Icon */}
        <Brain className="h-5 w-5 text-white" />
      </div>

      {/* Text Logo */}
      <div className="flex flex-col leading-tight">
        <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          QuizMind
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Think • Learn • Win
        </span>
      </div>
    </LinkComponent>
  );
}
