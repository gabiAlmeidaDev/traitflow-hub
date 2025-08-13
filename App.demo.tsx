import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Target, BarChart3, Settings } from 'lucide-react'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">TalentAlign</h1>
                <Badge variant="secondary">v1.0</Badge>
              </div>
              <nav className="flex space-x-4">
                <Link to="/">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link to="/funcionarios">
                  <Button variant="ghost">Funcionários</Button>
                </Link>
                <Link to="/testes">
                  <Button variant="ghost">Testes</Button>
                </Link>
                <Link to="/relatorios">
                  <Button variant="ghost">Relatórios</Button>
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/funcionarios" element={<Funcionarios />} />
            <Route path="/testes" element={<Testes />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

// Dashboard Page
function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Visão geral da plataforma de avaliação</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funcionários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+5% desde último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testes Realizados</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">856</div>
            <p className="text-xs text-muted-foreground">+12% desde último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Realocações</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+8% desde último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% desde último mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Link to="/testes">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Novo Teste
          </Button>
        </Link>
        <Link to="/funcionarios">
          <Button variant="outline" size="lg">
            Gerenciar Funcionários
          </Button>
        </Link>
      </div>
    </div>
  )
}

// Funcionários Page
function Funcionarios() {
  const funcionarios = [
    { id: 1, nome: "Ana Silva", cargo: "Desenvolvedora", fit: 92 },
    { id: 2, nome: "Carlos Santos", cargo: "Designer", fit: 88 },
    { id: 3, nome: "Maria Costa", cargo: "Gerente", fit: 75 },
    { id: 4, nome: "João Oliveira", cargo: "Analista", fit: 94 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Funcionários</h2>
          <p className="text-gray-600">Gerencie e avalie sua equipe</p>
        </div>
        <Button>Adicionar Funcionário</Button>
      </div>

      <div className="grid gap-4">
        {funcionarios.map((funcionario) => (
          <Card key={funcionario.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{funcionario.nome}</h3>
                  <p className="text-gray-600">{funcionario.cargo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Fit Score</p>
                  <p className="text-2xl font-bold text-green-600">{funcionario.fit}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Testes Page
function Testes() {
  const tiposTeste = [
    { nome: "DISC", descricao: "Avaliação comportamental", duracao: "15 min" },
    { nome: "Big Five", descricao: "Personalidade", duracao: "20 min" },
    { nome: "Técnico", descricao: "Competências específicas", duracao: "30 min" },
    { nome: "Liderança", descricao: "Capacidade de gestão", duracao: "25 min" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Testes</h2>
        <p className="text-gray-600">Sistema de avaliação comportamental e técnica</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tiposTeste.map((teste, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{teste.nome}</CardTitle>
              <CardDescription>{teste.descricao}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{teste.duracao}</Badge>
                <Button variant="outline">Aplicar Teste</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Relatórios Page
function Relatorios() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Relatórios</h2>
        <p className="text-gray-600">Analytics e insights da sua organização</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Relatório Individual</CardTitle>
            <CardDescription>Perfil completo do funcionário</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Gerar Relatório</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análise Comparativa</CardTitle>
            <CardDescription>Funcionário vs cargo ideal</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Gerar Análise</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sugestões de Realocação</CardTitle>
            <CardDescription>Top 5 recomendações</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Ver Sugestões</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

