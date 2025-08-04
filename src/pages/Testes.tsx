import { useState } from "react";
import { Plus, Eye, Edit, Trash2, Copy, Play, Pause, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { KPICard } from "@/components/dashboard/KPICard";
import { TesteForm } from "@/components/testes/TesteForm";
import { useTestes, type Teste } from "@/hooks/useTestes";

export default function Testes() {
  const { testes, stats, loading, createTeste, updateTeste, deleteTeste, updateStatus, duplicateTeste } = useTestes();
  const [selectedTeste, setSelectedTeste] = useState<Teste | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTestes = testes.filter(teste => {
    const matchesSearch = teste.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teste.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || teste.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTeste = () => {
    setSelectedTeste(null);
    setShowForm(true);
  };

  const handleEditTeste = (teste: Teste) => {
    setSelectedTeste(teste);
    setShowForm(true);
  };

  const handleSubmit = async (data: any) => {
    if (selectedTeste) {
      await updateTeste(selectedTeste.id, data);
    } else {
      await createTeste(data);
    }
    setShowForm(false);
    setSelectedTeste(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedTeste(null);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ativo': return 'default';
      case 'rascunho': return 'secondary';
      case 'inativo': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'text-success';
      case 'rascunho': return 'text-warning';
      case 'inativo': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  if (showForm) {
    return (
      <TesteForm
        teste={selectedTeste || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Testes</h1>
          <p className="text-muted-foreground">
            Gerencie seus testes psicométricos
          </p>
        </div>
        <Button onClick={handleCreateTeste} className="gap-2">
          <Plus className="w-4 h-4" />
          Criar Teste
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total de Testes"
          value={stats.total.toString()}
          subtitle="Testes criados"
          icon={Eye}
          variant="info"
        />
        <KPICard
          title="Testes Ativos"
          value={stats.ativos.toString()}
          subtitle="Em funcionamento"
          icon={Play}
          variant="success"
        />
        <KPICard
          title="Rascunhos"
          value={stats.rascunhos.toString()}
          subtitle="Em desenvolvimento"
          icon={Edit}
          variant="warning"
        />
        <KPICard
          title="Inativos"
          value={stats.inativos.toString()}
          subtitle="Pausados"
          icon={Pause}
          variant="danger"
        />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar testes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Testes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTestes.map((teste) => (
          <Card key={teste.id} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground truncate">
                    {teste.titulo}
                  </h3>
                  <Badge variant={getStatusVariant(teste.status)}>
                    {teste.status}
                  </Badge>
                </div>
                {teste.descricao && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {teste.descricao}
                  </p>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    ⋮
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditTeste(teste)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => duplicateTeste(teste.id)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {teste.status === 'ativo' ? (
                    <DropdownMenuItem onClick={() => updateStatus(teste.id, 'inativo')}>
                      <Pause className="w-4 h-4 mr-2" />
                      Desativar
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => updateStatus(teste.id, 'ativo')}>
                      <Play className="w-4 h-4 mr-2" />
                      Ativar
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o teste "{teste.titulo}"? 
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteTeste(teste.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Questões:</span>
                <span className="font-medium">{teste.questoes?.length || 0}</span>
              </div>
              
              {teste.data_inicio && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Início:</span>
                  <span className="font-medium">
                    {new Date(teste.data_inicio).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
              
              {teste.data_fim && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fim:</span>
                  <span className="font-medium">
                    {new Date(teste.data_fim).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Criado em:</span>
                <span className="font-medium">
                  {new Date(teste.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditTeste(teste)}
                className="flex-1 gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Button>
              {teste.status === 'ativo' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStatus(teste.id, 'inativo')}
                  className="gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Pausar
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStatus(teste.id, 'ativo')}
                  className="gap-2"
                >
                  <Play className="w-4 h-4" />
                  Ativar
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredTestes.length === 0 && !loading && (
        <Card className="p-8 text-center">
          <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum teste encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all" 
              ? "Tente ajustar os filtros de busca"
              : "Comece criando seu primeiro teste"
            }
          </p>
          {!searchTerm && statusFilter === "all" && (
            <Button onClick={handleCreateTeste} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeiro Teste
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}