import { FileText, Download, Filter, Calendar, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { ReportFilters } from "@/components/relatorios/ReportFilters";
import { useReports } from "@/hooks/useReports";
import { KPICard } from "@/components/dashboard/KPICard";

export default function Relatorios() {
  const { reportData, loading, filters, applyFilters, exportReport } = useReports();

  const transformedChartData = reportData ? {
    personalityDistribution: reportData.personalityDistribution,
    monthlyEvolution: reportData.monthlyEvolution,
    traitScores: reportData.traitScores,
  } : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Analytics e insights das suas avaliações
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      {reportData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total de Testes"
            value={reportData.totalTests.toString()}
            subtitle="Testes realizados"
            icon={BarChart3}
            variant="success"
          />
          <KPICard
            title="Total de Candidatos"
            value={reportData.totalCandidates.toString()}
            subtitle="Candidatos avaliados"
            icon={PieChart}
            variant="info"
          />
          <KPICard
            title="Aplicações Totais"
            value={reportData.totalApplications.toString()}
            subtitle="Testes aplicados"
            icon={TrendingUp}
            variant="warning"
          />
          <KPICard
            title="Taxa de Conclusão"
            value={`${reportData.completionRate}%`}
            subtitle="Testes finalizados"
            icon={Calendar}
            variant={reportData.completionRate >= 80 ? "success" : "danger"}
          />
        </div>
      )}

      {/* Filters */}
      <ReportFilters
        filters={filters}
        onFiltersChange={applyFilters}
        onExport={exportReport}
        loading={loading}
      />

      {/* Charts Section */}
      <DashboardCharts data={transformedChartData} />

      {/* Status Distribution */}
      {reportData && reportData.statusDistribution.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Distribuição por Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportData.statusDistribution.map((status, index) => (
              <div
                key={status.status}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{status.status}</span>
                  <Badge variant="outline">{status.count}</Badge>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${status.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground mt-1">
                    {status.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}