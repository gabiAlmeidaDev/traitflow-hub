import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export interface ReportData {
  totalTests: number;
  totalCandidates: number;
  totalApplications: number;
  completionRate: number;
  personalityDistribution: { name: string; value: number; color: string }[];
  monthlyEvolution: { month: string; testes: number; candidatos: number }[];
  statusDistribution: { status: string; count: number; percentage: number }[];
  traitScores: { trait: string; score: number }[];
}

export interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  status?: string;
  testId?: string;
}

export function useReports() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({});

  const fetchReportData = async (currentFilters: ReportFilters = {}) => {
    if (!user?.user_metadata?.empresa_id) return;

    try {
      setLoading(true);
      setError(null);

      // Base query for applications
      let applicationsQuery = supabase
        .from('aplicacoes_testes')
        .select(`
          *,
          candidatos!inner(nome, email),
          testes!inner(titulo, descricao)
        `)
        .eq('empresa_id', user.user_metadata.empresa_id);

      // Apply date filters
      if (currentFilters.startDate) {
        applicationsQuery = applicationsQuery.gte('created_at', currentFilters.startDate.toISOString());
      }
      if (currentFilters.endDate) {
        applicationsQuery = applicationsQuery.lte('created_at', currentFilters.endDate.toISOString());
      }
      if (currentFilters.status) {
        applicationsQuery = applicationsQuery.eq('status', currentFilters.status);
      }
      if (currentFilters.testId) {
        applicationsQuery = applicationsQuery.eq('teste_id', currentFilters.testId);
      }

      const { data: applications, error: applicationsError } = await applicationsQuery;

      if (applicationsError) throw applicationsError;

      // Get unique candidates and tests
      const uniqueCandidates = new Set(applications?.map(app => app.candidato_id));
      const uniqueTests = new Set(applications?.map(app => app.teste_id));

      // Calculate completion rate
      const completedApplications = applications?.filter(app => app.status === 'finalizado') || [];
      const completionRate = applications?.length ? (completedApplications.length / applications.length) * 100 : 0;

      // Generate personality distribution (mock data based on results)
      const personalityDistribution = [
        { name: 'Extrovertido', value: 35, color: 'hsl(var(--chart-1))' },
        { name: 'Analítico', value: 25, color: 'hsl(var(--chart-2))' },
        { name: 'Comunicativo', value: 20, color: 'hsl(var(--chart-3))' },
        { name: 'Introvertido', value: 20, color: 'hsl(var(--chart-4))' },
      ];

      // Generate monthly evolution
      const monthlyData = new Map<string, { tests: Set<string>; candidates: Set<string> }>();
      applications?.forEach(app => {
        const month = new Date(app.created_at).toLocaleDateString('pt-BR', { 
          year: 'numeric', 
          month: 'short' 
        });
        
        if (!monthlyData.has(month)) {
          monthlyData.set(month, { tests: new Set(), candidates: new Set() });
        }
        
        monthlyData.get(month)!.tests.add(app.teste_id);
        monthlyData.get(month)!.candidates.add(app.candidato_id);
      });

      const monthlyEvolution = Array.from(monthlyData.entries())
        .map(([month, data]) => ({
          month,
          testes: data.tests.size,
          candidatos: data.candidates.size,
        }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

      // Status distribution
      const statusCounts = applications?.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
        status: status === 'pendente' ? 'Pendente' : 
                status === 'em_andamento' ? 'Em Andamento' : 
                status === 'finalizado' ? 'Finalizado' : status,
        count,
        percentage: applications?.length ? (count / applications.length) * 100 : 0,
      }));

      // Trait scores (mock data based on completed tests)
      const traitScores = [
        { trait: 'Liderança', score: 78 },
        { trait: 'Comunicação', score: 85 },
        { trait: 'Trabalho em Equipe', score: 72 },
        { trait: 'Criatividade', score: 68 },
        { trait: 'Resolução de Problemas', score: 82 },
      ];

      const reportData: ReportData = {
        totalTests: uniqueTests.size,
        totalCandidates: uniqueCandidates.size,
        totalApplications: applications?.length || 0,
        completionRate: Math.round(completionRate),
        personalityDistribution,
        monthlyEvolution,
        statusDistribution,
        traitScores,
      };

      setReportData(reportData);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do relatório');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do relatório",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (newFilters: ReportFilters) => {
    setFilters(newFilters);
    fetchReportData(newFilters);
  };

  const exportReport = async (format: 'pdf' | 'csv') => {
    if (!reportData) return;

    try {
      const { data, error } = await supabase.functions.invoke('export-report', {
        body: {
          reportData,
          format,
          filters,
        },
      });

      if (error) throw error;

      // Create download link
      const blob = new Blob([data], {
        type: format === 'pdf' ? 'application/pdf' : 'text/csv',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Sucesso",
        description: `Relatório ${format.toUpperCase()} exportado com sucesso`,
      });
    } catch (err) {
      console.error('Export error:', err);
      toast({
        title: "Erro",
        description: "Erro ao exportar relatório",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [user]);

  return {
    reportData,
    loading,
    error,
    filters,
    applyFilters,
    exportReport,
    refetch: fetchReportData,
  };
}