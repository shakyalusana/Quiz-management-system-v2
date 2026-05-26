import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  accent?: "primary" | "accent" | "success" | "warning";
}

const accentMap = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-emerald-500/10 text-emerald-500",
  warning: "bg-yellow-500/10 text-yellow-500",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "primary",
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <Card className="bg-card/60 backdrop-blur-xl border border-border/50">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {label}
              </p>

              <p className="text-3xl font-bold tracking-tight">{value}</p>

              {trend && (
                <p className="text-xs text-muted-foreground">{trend}</p>
              )}
            </div>

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentMap[accent]}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
