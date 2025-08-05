import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Users, DollarSign, Activity, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Company {
  id: string;
  nome: string;
  email: string;
  status: string;
  created_at: string;
  planos: {
    nome: string;
    tipo: string;
  } | null;
  profiles: { count: number }[];
}

interface Metrics {
  totalEmpresas: number;
  empresasAtivas: number;
  totalUsuarios: number;
  receitaMensal: number;
}

export default function AdminDashboard() {
  const { isSuperAdmin } = useAuth();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (isSuperAdmin) {
      fetchData();
    }
  }, [isSuperAdmin]);

  const fetchData = async () => {
    try {
      // Buscar empresas com dados relacionados
      const { data: companiesData, error: companiesError } = await supabase
        .from('empresas')
        .select(`
          *,
          planos:plano_id (nome, tipo),
          profiles (count)
        `)
        .order('created_at', { ascending: false });

      if (companiesError) throw companiesError;

      // Calcular métricas manualmente
      const totalEmpresas = companiesData?.length || 0;
      const empresasAtivas = companiesData?.filter(c => c.status === 'active').length || 0;
      
      const { count: totalUsuarios } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const calculatedMetrics: Metrics = {
        totalEmpresas,
        empresasAtivas,
        totalUsuarios: totalUsuarios || 0,
        receitaMensal: 0 // TODO: Calcular baseado nas assinaturas
      };

      setCompanies(companiesData || []);
      setMetrics(calculatedMetrics);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do painel administrativo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isSuperAdmin) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Acesso Negado</h1>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie empresas, usuários e visualize métricas da plataforma
          </p>
        </div>
      </div>

      {/* Métricas Principais */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{metrics.totalEmpresas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{metrics.empresasAtivas}</div>
              <p className="text-xs text-muted-foreground">
                {((metrics.empresasAtivas / metrics.totalEmpresas) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{metrics.totalUsuarios}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">R$ {metrics.receitaMensal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Calculado a partir das assinaturas ativas
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de Empresas */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
          <CardDescription>
            Gerencie todas as empresas da plataforma
          </CardDescription>
          
          {/* Filtros */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCompanies.map((company) => (
              <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{company.nome}</div>
                  <div className="text-sm text-muted-foreground">{company.email}</div>
                  <div className="text-xs text-muted-foreground">
                    Cadastrada em {new Date(company.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={company.status === 'active' ? 'default' : 'secondary'}
                  >
                    {company.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                  
                  {company.planos && (
                    <Badge variant="outline">
                      {company.planos.nome}
                    </Badge>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    {company.profiles[0]?.count || 0} usuários
                  </div>
                </div>
              </div>
            ))}
            
            {filteredCompanies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma empresa encontrada
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}