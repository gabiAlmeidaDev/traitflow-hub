import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardStats {
  totalTests: number;
  activeCandidates: number;
  sentBatches: number;
  completionRate: number;
  totalCreatedTests: number;
  activeCompanies: number;
  generatedReports: number;
  averageTime: string;
}

export interface ChartData {
  personalityDistribution: { name: string; value: number; color: string }[];
  monthlyEvolution: { month: string; testes: number; candidatos: number }[];
  traitScores: { trait: string; score: number }[];
}

export interface RecentActivity {
  id: string;
  type: string;
  user: string;
  action: string;
  target: string;
  time: string;
  status: string;
}

export function useDashboardData() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !profile?.empresa_id) return;

    fetchDashboardData();
  }, [user, profile?.empresa_id]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch basic stats
      const [testsResult, candidatesResult, batchesResult, applicationsResult] = await Promise.all([
        supabase
          .from('testes')
          .select('*')
          .eq('empresa_id', profile?.empresa_id),
        supabase
          .from('candidatos')
          .select('*')
          .eq('empresa_id', profile?.empresa_id),
        supabase
          .from('batches_testes')
          .select('*')
          .eq('empresa_id', profile?.empresa_id),
        supabase
          .from('aplicacoes_testes')
          .select('*')
          .eq('empresa_id', profile?.empresa_id)
      ]);

      if (testsResult.error) throw testsResult.error;
      if (candidatesResult.error) throw candidatesResult.error;
      if (batchesResult.error) throw batchesResult.error;
      if (applicationsResult.error) throw applicationsResult.error;

      const tests = testsResult.data || [];
      const candidates = candidatesResult.data || [];
      const batches = batchesResult.data || [];
      const applications = applicationsResult.data || [];

      // Calculate stats
      const completedApplications = applications.filter(app => app.status === 'concluido');
      const completionRate = applications.length > 0 
        ? Math.round((completedApplications.length / applications.length) * 100)
        : 0;

      const activeCandidates = candidates.filter(c => c.status === 'ativo').length;
      const thisMonthBatches = batches.filter(b => {
        const batchDate = new Date(b.created_at);
        const now = new Date();
        return batchDate.getMonth() === now.getMonth() && 
               batchDate.getFullYear() === now.getFullYear();
      }).length;

      const thisMonthApplications = applications.filter(app => {
        const appDate = new Date(app.created_at);
        const now = new Date();
        return appDate.getMonth() === now.getMonth() && 
               appDate.getFullYear() === now.getFullYear();
      }).length;

      setStats({
        totalTests: thisMonthApplications,
        activeCandidates,
        sentBatches: thisMonthBatches,
        completionRate,
        totalCreatedTests: tests.length,
        activeCompanies: 1, // Current company
        generatedReports: completedApplications.length,
        averageTime: '12 min' // This would need more complex calculation
      });

      // Generate chart data (simplified for now)
      setChartData({
        personalityDistribution: [
          { name: "Extrovertido", value: 35, color: "hsl(var(--success))" },
          { name: "Introvertido", value: 25, color: "hsl(var(--danger))" },
          { name: "Analítico", value: 20, color: "hsl(var(--warning))" },
          { name: "Criativo", value: 20, color: "hsl(var(--info))" },
        ],
        monthlyEvolution: generateMonthlyData(applications),
        traitScores: [
          { trait: "Liderança", score: 85 },
          { trait: "Comunicação", score: 78 },
          { trait: "Criatividade", score: 92 },
          { trait: "Análise", score: 67 },
          { trait: "Trabalho em Equipe", score: 74 },
        ]
      });

      // Generate recent activities from real data
      setRecentActivities(generateRecentActivities(applications, candidates, tests, batches));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    chartData,
    recentActivities,
    loading,
    error,
    refetch: fetchDashboardData
  };
}

function generateMonthlyData(applications: any[]) {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const monthlyData = months.map(month => ({
    month,
    testes: 0,
    candidatos: 0
  }));

  // Simplified - in a real app, you'd calculate this properly
  applications.forEach(app => {
    const monthIndex = new Date(app.created_at).getMonth();
    if (monthIndex < 6) {
      monthlyData[monthIndex].testes += 1;
    }
  });

  return monthlyData;
}

function generateRecentActivities(applications: any[], candidates: any[], tests: any[], batches: any[]): RecentActivity[] {
  const activities: RecentActivity[] = [];

  // Add recent applications
  applications.slice(0, 3).forEach(app => {
    activities.push({
      id: app.id,
      type: app.status === 'concluido' ? 'test_completed' : 'test_started',
      user: `Candidato`,
      action: app.status === 'concluido' ? 'concluiu o teste' : 'iniciou o teste',
      target: 'Avaliação de Personalidade',
      time: formatTimeAgo(app.created_at),
      status: app.status === 'concluido' ? 'completed' : 'in_progress'
    });
  });

  // Add recent batches
  batches.slice(0, 2).forEach(batch => {
    activities.push({
      id: batch.id,
      type: 'batch_sent',
      user: 'Sistema',
      action: 'criou batch',
      target: batch.nome,
      time: formatTimeAgo(batch.created_at),
      status: 'sent'
    });
  });

  return activities.sort((a, b) => 
    new Date(b.time).getTime() - new Date(a.time).getTime()
  ).slice(0, 5);
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `há ${diffMins} minutos`;
  } else if (diffHours < 24) {
    return `há ${diffHours} horas`;
  } else {
    return `há ${diffDays} dias`;
  }
}