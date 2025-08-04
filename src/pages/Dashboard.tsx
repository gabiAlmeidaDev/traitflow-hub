import { TestTube, Users, Layers, TrendingUp, AlertCircle } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Dashboard() {
  const { stats, chartData, recentActivities, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das suas avaliações de personalidade
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar dados do dashboard: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Visão geral das suas avaliações de personalidade
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Testes Aplicados"
          value={stats?.totalTests || 0}
          subtitle="Este mês"
          icon={TestTube}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Candidatos Ativos"
          value={stats?.activeCandidates || 0}
          subtitle="Em avaliação"
          icon={Users}
          variant="danger"
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Batches Enviados"
          value={stats?.sentBatches || 0}
          subtitle="Este mês"
          icon={Layers}
          variant="warning"
          trend={{ value: 5, isPositive: false }}
        />
        <KPICard
          title="Taxa de Conclusão"
          value={`${stats?.completionRate || 0}%`}
          subtitle="Média mensal"
          icon={TrendingUp}
          variant="info"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Charts Section */}
      <DashboardCharts data={chartData} />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivities} />
        </div>
        
        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Estatísticas Rápidas
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Testes Criados</span>
                <span className="font-semibold text-foreground">
                  {stats?.totalCreatedTests || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Empresas Ativas</span>
                <span className="font-semibold text-foreground">
                  {stats?.activeCompanies || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Relatórios Gerados</span>
                <span className="font-semibold text-foreground">
                  {stats?.generatedReports || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tempo Médio</span>
                <span className="font-semibold text-foreground">
                  {stats?.averageTime || '0 min'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-primary/10 to-info/10 rounded-xl p-6 border border-primary/20 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Upgrade para Pro
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Acesse relatórios avançados e envie batches ilimitados
            </p>
            <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Fazer Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}