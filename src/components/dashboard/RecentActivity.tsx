import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, User, ClipboardList, Send } from "lucide-react";
import { RecentActivity as RecentActivityType } from "@/hooks/useDashboardData";

interface RecentActivityProps {
  activities: RecentActivityType[];
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
    case "concluido":
      return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Concluído</Badge>;
    case "sent":
    case "enviado":
      return <Badge variant="secondary" className="bg-info/10 text-info border-info/20">Enviado</Badge>;
    case "in_progress":
    case "em_andamento":
      return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Em Andamento</Badge>;
    case "added":
    case "adicionado":
      return <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Adicionado</Badge>;
    case "created":
    case "criado":
      return <Badge variant="secondary" className="bg-info/10 text-info border-info/20">Criado</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "test_completed":
    case "test_started":
      return <ClipboardList className="w-4 h-4" />;
    case "batch_sent":
      return <Send className="w-4 h-4" />;
    case "candidate_added":
      return <User className="w-4 h-4" />;
    case "test_created":
      return <ClipboardList className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Atividade Recente
        </h3>
        <Badge variant="outline" className="text-xs">
          Tempo Real
        </Badge>
      </div>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma atividade recente encontrada</p>
          </div>
        ) : (
          activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
          >
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getActivityIcon(activity.type)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.user}
                </p>
                {getStatusBadge(activity.status)}
              </div>
              <p className="text-sm text-muted-foreground">
                {activity.action}{" "}
                <span className="font-medium text-foreground">
                  {activity.target}
                </span>
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            </div>
          </div>
          ))
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          Ver todas as atividades →
        </button>
      </div>
    </Card>
  );
}