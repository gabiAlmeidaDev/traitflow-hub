import { FileText, Download, Filter, Calendar, BarChart3, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

const mockReports = [
  {
    id: 1,
    title: "Relatório Mensal - Janeiro 2024",
    type: "mensal",
    generated: "2024-01-31",
    tests: 247,
    candidates: 89,
    completion: 94,
  },
  {
    id: 2,
    title: "Análise de Personalidade - Q4 2023",
    type: "personalidade",
    generated: "2024-01-15",
    tests: 156,
    candidates: 67,
    completion: 92,
  },
  {
    id: 3,
    title: "Relatório de Liderança",
    type: "competencia",
    generated: "2024-01-10",
    tests: 78,
    candidates: 45,
    completion: 96,
  },
];

export default function Relatorios() {
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
        <Button className="gap-2">
          <FileText className="w-4 h-4" />
          Gerar Relatório
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="font-medium">Relatório Mensal</p>
              <p className="text-sm text-muted-foreground">Resumo geral</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info/10 rounded-lg">
              <PieChart className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="font-medium">Análise de Personalidade</p>
              <p className="text-sm text-muted-foreground">Distribuição</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="font-medium">Relatório Customizado</p>
              <p className="text-sm text-muted-foreground">Período específico</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-danger/10 rounded-lg">
              <Download className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="font-medium">Exportar Dados</p>
              <p className="text-sm text-muted-foreground">CSV/PDF</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <DashboardCharts data={null} />

      {/* Recent Reports */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Relatórios Recentes
          </h3>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtrar
          </Button>
        </div>
        
        <div className="space-y-4">
          {mockReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{report.title}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {report.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {report.tests} testes • {report.candidates} candidatos
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-success">
                    {report.completion}% conclusão
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(report.generated).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-3 h-3" />
                  Baixar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}