import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Copy, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockTests = [
  {
    id: 1,
    title: "Avaliação de Liderança",
    description: "Teste completo para identificar competências de liderança",
    questions: 25,
    category: "Liderança",
    status: "ativo",
    created: "2024-01-15",
    applications: 45,
  },
  {
    id: 2,
    title: "Perfil DISC",
    description: "Avaliação de personalidade baseada no modelo DISC",
    questions: 30,
    category: "Personalidade",
    status: "ativo",
    created: "2024-01-10",
    applications: 78,
  },
  {
    id: 3,
    title: "Soft Skills Assessment",
    description: "Avaliação de habilidades interpessoais e comportamentais",
    questions: 20,
    category: "Competências",
    status: "rascunho",
    created: "2024-01-20",
    applications: 12,
  },
];

export default function Testes() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Testes</h1>
          <p className="text-muted-foreground">
            Gerencie seus testes de personalidade
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Criar Teste
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar testes..."
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

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTests.map((test) => (
          <Card key={test.id} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {test.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {test.description}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      •••
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Edit className="w-4 h-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Copy className="w-4 h-4" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Play className="w-4 h-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-danger">
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{test.category}</Badge>
                <Badge 
                  variant="secondary" 
                  className={
                    test.status === "ativo" 
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-warning/10 text-warning border-warning/20"
                  }
                >
                  {test.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Perguntas:</span>
                  <p className="font-medium">{test.questions}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Aplicações:</span>
                  <p className="font-medium">{test.applications}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Criado em {new Date(test.created).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockTests.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhum teste encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Comece criando seu primeiro teste de personalidade
          </p>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Criar Primeiro Teste
          </Button>
        </div>
      )}
    </div>
  );
}