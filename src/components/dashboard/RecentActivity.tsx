import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, User, ClipboardList, Send } from "lucide-react";

const recentActivities = [
  {
    id: 1,
    type: "test_completed",
    user: "Ana Silva",
    action: "concluiu o teste",
    target: "Avaliação de Liderança",
    time: "há 5 minutos",
    status: "completed",
  },
  {
    id: 2,
    type: "batch_sent",
    user: "Sistema",
    action: "enviou batch",
    target: "Avaliação Completa para João Santos",
    time: "há 12 minutos",
    status: "sent",
  },
  {
    id: 3,
    type: "test_started",
    user: "Carlos Mendes",
    action: "iniciou o teste",
    target: "Perfil de Personalidade DISC",
    time: "há 18 minutos",
    status: "in_progress",
  },
  {
    id: 4,
    type: "candidate_added",
    user: "Maria Costa",
    action: "adicionou candidato",
    target: "Pedro Oliveira",
    time: "há 1 hora",
    status: "added",
  },
  {
    id: 5,
    type: "test_created",
    user: "Admin",
    action: "criou novo teste",
    target: "Avaliação de Soft Skills",
    time: "há 2 horas",
    status: "created",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Concluído</Badge>;
    case "sent":
      return <Badge variant="secondary" className="bg-info/10 text-info border-info/20">Enviado</Badge>;
    case "in_progress":
      return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Em Andamento</Badge>;
    case "added":
      return <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Adicionado</Badge>;
    case "created":
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

export function RecentActivity() {
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
        {recentActivities.map((activity) => (
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
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          Ver todas as atividades →
        </button>
      </div>
    </Card>
  );
}