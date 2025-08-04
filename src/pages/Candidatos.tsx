import { useState } from "react";
import { Plus, Search, Filter, Mail, Phone, MoreHorizontal, Upload, Edit, Trash, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCandidatos, Candidato } from "@/hooks/useCandidatos";
import { CandidatoForm } from "@/components/candidatos/CandidatoForm";

export default function Candidatos() {
  const { candidatos, stats, loading, error, createCandidato, updateCandidato, deleteCandidato } = useCandidatos();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);
  const [candidatoToDelete, setCandidatoToDelete] = useState<Candidato | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-success/10 text-success border-success/20">Ativo</Badge>;
      case "em_avaliacao":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Em Avaliação</Badge>;
      case "concluido":
        return <Badge className="bg-info/10 text-info border-info/20">Concluído</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const filteredCandidatos = candidatos.filter(candidato =>
    candidato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidato.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (candidato.dados_adicionais?.cargo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCandidato = () => {
    setSelectedCandidato(null);
    setShowForm(true);
  };

  const handleEditCandidato = (candidato: Candidato) => {
    setSelectedCandidato(candidato);
    setShowForm(true);
  };

  const handleDeleteCandidato = async () => {
    if (candidatoToDelete) {
      await deleteCandidato(candidatoToDelete.id);
      setCandidatoToDelete(null);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (selectedCandidato) {
      return await updateCandidato(selectedCandidato.id, data);
    } else {
      return await createCandidato(data);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-96 mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Candidatos</h1>
            <p className="text-muted-foreground">Gerencie sua base de candidatos</p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar candidatos: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Candidatos</h1>
          <p className="text-muted-foreground">
            Gerencie sua base de candidatos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Importar CSV
          </Button>
          <Button className="gap-2" onClick={handleAddCandidato}>
            <Plus className="w-4 h-4" />
            Adicionar Candidato
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total de Candidatos</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-warning">{stats.emAvaliacao}</div>
          <div className="text-sm text-muted-foreground">Em Avaliação</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-success">{stats.concluidos}</div>
          <div className="text-sm text-muted-foreground">Avaliações Concluídas</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar candidatos..."
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

      {/* Candidates Table */}
      <Card>
        {filteredCandidatos.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Nenhum candidato encontrado' : 'Nenhum candidato cadastrado'}
            </p>
            {!searchTerm && (
              <Button onClick={handleAddCandidato}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Candidato
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidato</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastrado em</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidatos.map((candidato) => (
                <TableRow key={candidato.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {candidato.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{candidato.nome}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        {candidato.email}
                      </div>
                      {candidato.telefone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {candidato.telefone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {candidato.dados_adicionais?.cargo || '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(candidato.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(candidato.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditCandidato(candidato)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                        <DropdownMenuItem>Enviar Teste</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-danger"
                          onClick={() => setCandidatoToDelete(candidato)}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Form Dialog */}
      <CandidatoForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleFormSubmit}
        candidato={selectedCandidato}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!candidatoToDelete} onOpenChange={() => setCandidatoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o candidato "{candidatoToDelete?.nome}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCandidato} className="bg-danger hover:bg-danger/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}