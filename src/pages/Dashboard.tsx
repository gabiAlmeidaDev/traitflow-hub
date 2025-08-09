// src/pages/Dashboard.tsx - DASHBOARD FUNCIONAL
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Clock, 
  TrendingUp,
  Eye,
  Download,
  Plus
} from 'lucide-react';

// Dados mockados para desenvolvimento
const mockData = {
  totalCandidatos: 45,
  testesAtivos: 8,
  avaliacoesPendentes: 12,
  taxaSucesso: 78,
  recentActivities: [
    {
      id: 1,
      type: 'candidate',
      message: 'Novo candidato João Silva cadastrado',
      time: '5 min atrás'
    },
    {
      id: 2,
      type: 'test',
      message: 'Teste de JavaScript finalizado por Maria Santos',
      time: '15 min atrás'
    },
    {
      id: 3,
      type: 'evaluation',
      message: 'Avaliação de Pedro Costa aprovada',
      time: '1h atrás'
    }
  ]
};

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  console.log('📊 Dashboard renderizado para:', user?.email);

  useEffect(() => {
    // Simular carregamento de dados
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo de volta, {user?.email?.split('@')[0]}! 👋
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Teste
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Candidatos
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {mockData.totalCandidatos}
            </div>
            <p className="text-xs text-green-600 mt-1">
              +12% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Testes Ativos
            </CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {mockData.testesAtivos}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              3 criados esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avaliações Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {mockData.avaliacoesPendentes}
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              Requer atenção
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Sucesso
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {mockData.taxaSucesso}%
            </div>
            <p className="text-xs text-purple-600 mt-1">
              +5% desde o último mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockData.recentActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className={`p-2 rounded-full ${
                  activity.type === 'candidate' ? 'bg-blue-100' :
                  activity.type === 'test' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  {activity.type === 'candidate' && <Users className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'test' && <FileText className="h-4 w-4 text-green-600" />}
                  {activity.type === 'evaluation' && <TrendingUp className="h-4 w-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button variant="outline" className="w-full mt-4">
              Ver Todas as Atividades
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Criar Novo Teste
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Adicionar Candidato
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Dados
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Sistema Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">8 Testes Ativos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">12 Pendências</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Última atualização: agora
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}