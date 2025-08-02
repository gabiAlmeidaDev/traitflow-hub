import { useState } from "react";
import { Plus, Search, Filter, Send, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const mockBatches = [
  {
    id: 1,
    title: "Avaliação Completa - João Santos",
    candidate: "João Santos",
    tests: ["Liderança", "DISC", "Soft Skills"],
    status: "concluido",
    progress: 100,
    sentDate: "2024-01-18",
    completedDate: "2024-01-20",
    link: "https://traitview.com/batch/abc123",
  },
  {
    id: 2,
    title: "Perfil Gerencial - Ana Silva",
    candidate: "Ana Silva",
    tests: ["Liderança", "Tomada de Decisão"],
    status: "em_andamento",
    progress: 50,
    sentDate: "2024-01-19",
    completedDate: null,
    link: "https://traitview.com/batch/def456",
  },
  {
    id: 3,
    title: "Avaliação Técnica - Carlos Mendes",
    candidate: "Carlos Mendes",
    tests: ["Personalidade", "Competências"],
    status: "pendente",
    progress: 0,
    sentDate: "2024-01-20",
    completedDate: null,
    link: "https://traitview.com/batch/ghi789",
  },
];

export default function Batches() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "concluido":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "em_andamento":
        return <Clock className="w-4 h-4 text-warning" />;
      case "pendente":
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "concluido":
        return <Badge className="bg-success/10 text-success border-success/20">Concluído</Badge>;
      case "em_andamento":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Em Andamento</Badge>;
      case "pendente":
        return <Badge className="bg-muted/10 text-muted-foreground border-muted/20">Pendente</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Batches de Testes</h1>
          <p className="text-muted-foreground">
            Gerencie grupos de testes enviados para candidatos
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Criar Batch
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-foreground">34</div>
          <div className="text-sm text-muted-foreground">Total de Batches</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-warning">8</div>
          <div className="text-sm text-muted-foreground">Em Andamento</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-success">23</div>
          <div className="text-sm text-muted-foreground">Concluídos</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-info">94%</div>
          <div className="text-sm text-muted-foreground">Taxa de Conclusão</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar batches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockBatches.map((batch) => (
          <Card key={batch.id} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(batch.status)}
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {batch.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Candidato: {batch.candidate}
                    </p>
                  </div>
                </div>
                {getStatusBadge(batch.status)}
              </div>

              {/* Tests */}
              <div>
                <span className="text-sm text-muted-foreground mb-2 block">
                  Testes incluídos:
                </span>
                <div className="flex flex-wrap gap-1">
                  {batch.tests.map((test, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {test}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">{batch.progress}%</span>
                </div>
                <Progress value={batch.progress} className="h-2" />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Enviado em:</span>
                  <p className="font-medium">
                    {new Date(batch.sentDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Concluído em:</span>
                  <p className="font-medium">
                    {batch.completedDate 
                      ? new Date(batch.completedDate).toLocaleDateString('pt-BR')
                      : "—"
                    }
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Send className="w-3 h-3" />
                  Reenviar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Resultados
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockBatches.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhum batch encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Comece criando seu primeiro batch de testes
          </p>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Criar Primeiro Batch
          </Button>
        </div>
      )}
    </div>
  );
}