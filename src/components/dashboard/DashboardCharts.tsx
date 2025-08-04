import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { ChartData } from "@/hooks/useDashboardData";

interface DashboardChartsProps {
  data: ChartData | null;
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  // Default fallback data
  const defaultPieData = [
    { name: "Extrovertido", value: 35, color: "hsl(var(--success))" },
    { name: "Introvertido", value: 25, color: "hsl(var(--danger))" },
    { name: "Analítico", value: 20, color: "hsl(var(--warning))" },
    { name: "Criativo", value: 20, color: "hsl(var(--info))" },
  ];

  const defaultLineData = [
    { month: "Jan", testes: 0, candidatos: 0 },
    { month: "Fev", testes: 0, candidatos: 0 },
    { month: "Mar", testes: 0, candidatos: 0 },
    { month: "Abr", testes: 0, candidatos: 0 },
    { month: "Mai", testes: 0, candidatos: 0 },
    { month: "Jun", testes: 0, candidatos: 0 },
  ];

  const defaultBarData = [
    { trait: "Liderança", score: 0 },
    { trait: "Comunicação", score: 0 },
    { trait: "Criatividade", score: 0 },
    { trait: "Análise", score: 0 },
    { trait: "Trabalho em Equipe", score: 0 },
  ];

  const pieData = data?.personalityDistribution || defaultPieData;
  const lineData = data?.monthlyEvolution || defaultLineData;
  const barData = data?.traitScores || defaultBarData;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Pie Chart - Distribuição de Personalidades */}
      <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Distribuição de Personalidades
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              animationDuration={800}
              animationBegin={0}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name}: {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Line Chart - Evolução Temporal */}
      <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Evolução de Testes e Candidatos
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="testes"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              animationDuration={1000}
            />
            <Line
              type="monotone"
              dataKey="candidatos"
              stroke="hsl(var(--success))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--success))", strokeWidth: 2 }}
              animationDuration={1000}
              animationBegin={200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Scores por Característica */}
      <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Média de Scores por Característica
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="trait" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar 
              dataKey="score" 
              fill="hsl(var(--info))"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}