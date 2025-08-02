import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant: "success" | "danger" | "warning" | "info";
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant,
  trend,
  className 
}: KPICardProps) {
  return (
    <div className={cn("kpi-card", `kpi-card-${variant}`, className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {title}
          </h3>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-foreground animate-counter">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                <span className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full",
                  trend.isPositive 
                    ? "bg-success/10 text-success" 
                    : "bg-danger/10 text-danger"
                )}>
                  {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
                </span>
                <span className="text-muted-foreground">vs. mês anterior</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={cn(
          "p-3 rounded-xl flex items-center justify-center",
          variant === "success" && "bg-success text-success-foreground",
          variant === "danger" && "bg-danger text-danger-foreground", 
          variant === "warning" && "bg-warning text-warning-foreground",
          variant === "info" && "bg-info text-info-foreground"
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}