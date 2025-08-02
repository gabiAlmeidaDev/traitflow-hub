import { TestTube, Users, Layers, TrendingUp } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function Dashboard() {
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
          value="247"
          subtitle="Este mês"
          icon={TestTube}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Candidatos Ativos"
          value="89"
          subtitle="Em avaliação"
          icon={Users}
          variant="danger"
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Batches Enviados"
          value="34"
          subtitle="Este mês"
          icon={Layers}
          variant="warning"
          trend={{ value: 5, isPositive: false }}
        />
        <KPICard
          title="Taxa de Conclusão"
          value="94%"
          subtitle="Média mensal"
          icon={TrendingUp}
          variant="info"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Charts Section */}
      <DashboardCharts />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
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
                <span className="font-semibold text-foreground">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Empresas Ativas</span>
                <span className="font-semibold text-foreground">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Relatórios Gerados</span>
                <span className="font-semibold text-foreground">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tempo Médio</span>
                <span className="font-semibold text-foreground">12 min</span>
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