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
    <div className={cn("kpi-card transition-all duration-500 hover:scale-105", variant, className)}>
      <div className="flex items-start justify-between p-8">
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-semibold text-muted-foreground/80">
            {title}
          </h3>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gradient animate-counter">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-muted-foreground/70">
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-3 mt-4">
                <span className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-full font-bold text-sm",
                  trend.isPositive 
                    ? "bg-success/20 text-success" 
                    : "bg-danger/20 text-danger"
                )}>
                  {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
                </span>
                <span className="text-sm text-muted-foreground/70">vs. mês anterior</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={cn(
          "p-4 rounded-2xl flex items-center justify-center shadow-lg",
          variant === "success" && "bg-gradient-to-r from-success to-success-glow text-success-foreground",
          variant === "danger" && "bg-gradient-to-r from-danger to-danger-glow text-danger-foreground", 
          variant === "warning" && "bg-gradient-to-r from-warning to-warning-glow text-warning-foreground",
          variant === "info" && "bg-gradient-to-r from-info to-info-glow text-info-foreground"
        )}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}