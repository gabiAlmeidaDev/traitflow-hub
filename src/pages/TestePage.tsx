import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Question {
  id: string;
  pergunta: string;
  tipo: string;
  opcoes?: any;
  peso: number;
  ordem: number;
}

interface TestApplication {
  id: string;
  teste_id: string;
  candidato_id: string;
  status: string;
  iniciado_em?: string;
  finalizado_em?: string;
  resultados?: any;
}

interface Test {
  id: string;
  titulo: string;
  descricao?: string;
  configuracoes?: any;
}

interface Candidate {
  id: string;
  nome: string;
  email: string;
}

export default function TestePage() {
  const { linkUnico } = useParams<{ linkUnico: string }>();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState<TestApplication | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testCompleted, setTestCompleted] = useState(false);

  useEffect(() => {
    if (linkUnico) {
      loadTestData();
    }
  }, [linkUnico]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeRemaining !== null && timeRemaining > 0 && application?.status === 'em_andamento') {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeRemaining, application?.status]);

  const loadTestData = async () => {
    try {
      setLoading(true);
      
      // Get test application by unique link
      const { data: appData, error: appError } = await supabase
        .from('aplicacoes_testes')
        .select(`
          *,
          testes (id, titulo, descricao, configuracoes),
          candidatos (id, nome, email)
        `)
        .eq('link_unico', linkUnico)
        .single();

      if (appError) {
        if (appError.code === 'PGRST116') {
          throw new Error('Link de teste não encontrado ou expirado');
        }
        throw appError;
      }

      setApplication(appData);
      setTest(appData.testes);
      setCandidate(appData.candidatos);

      // Check if test is already completed
      if (appData.status === 'concluido') {
        setTestCompleted(true);
        return;
      }

      // Get questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questoes_teste')
        .select('*')
        .eq('teste_id', appData.teste_id)
        .order('ordem');

      if (questionsError) throw questionsError;

      const formattedQuestions = questionsData.map(q => ({
        ...q,
        peso: q.peso || 1,
        opcoes: q.opcoes ? (Array.isArray(q.opcoes) ? q.opcoes : []) : []
      })) as Question[];

      setQuestions(formattedQuestions);

      // Set timer if configured
      const timeLimit = (appData.testes?.configuracoes as any)?.tempo_limite as number;
      if (timeLimit && appData.status !== 'em_andamento') {
        setTimeRemaining(timeLimit * 60); // Convert minutes to seconds
      }

      // Start test if not started
      if (appData.status === 'pendente') {
        await startTest(appData.id);
      }

    } catch (err) {
      console.error('Error loading test data:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar teste');
    } finally {
      setLoading(false);
    }
  };

  const startTest = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('aplicacoes_testes')
        .update({
          status: 'em_andamento',
          iniciado_em: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      setApplication(prev => prev ? {
        ...prev,
        status: 'em_andamento',
        iniciado_em: new Date().toISOString()
      } : null);

    } catch (err) {
      console.error('Error starting test:', err);
      setError('Erro ao iniciar teste');
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    if (!application) return;

    try {
      setSubmitting(true);

      // Calculate score (simplified scoring system)
      const score = calculateScore();

      const { error } = await supabase
        .from('aplicacoes_testes')
        .update({
          status: 'concluido',
          finalizado_em: new Date().toISOString(),
          resultados: {
            respostas: answers,
            pontuacao: score,
            tempo_gasto: timeRemaining ? ((test?.configuracoes as any)?.tempo_limite * 60 - timeRemaining) : 0
          }
        })
        .eq('id', application.id);

      if (error) throw error;

      setTestCompleted(true);

      // Send completion notification
      await supabase.functions.invoke('send-test-notification', {
        body: {
          applicationId: application.id,
          candidateEmail: candidate?.email,
          candidateName: candidate?.nome,
          testTitle: test?.titulo,
          score
        }
      });

    } catch (err) {
      console.error('Error submitting test:', err);
      setError('Erro ao enviar teste');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    let totalWeight = 0;

    questions.forEach(question => {
      totalWeight += question.peso;
      if (answers[question.id]) {
        // Simplified scoring - in a real app, you'd have more complex logic
        totalScore += question.peso;
      }
    });

    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-danger mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Erro</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </Card>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Teste Concluído!</h1>
          <p className="text-muted-foreground mb-4">
            Obrigado por completar o teste "{test?.titulo}". 
            Seus resultados foram enviados e você receberá um retorno em breve.
          </p>
          <p className="text-sm text-muted-foreground">
            Você pode fechar esta janela.
          </p>
        </Card>
      </div>
    );
  }

  if (!test || !candidate || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-warning mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Teste Indisponível</h1>
          <p className="text-muted-foreground">
            Este teste não possui questões configuradas ou não está disponível no momento.
          </p>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{test.titulo}</h1>
              <p className="text-muted-foreground">Candidato: {candidate.nome}</p>
            </div>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Questão {currentQuestion + 1} de {questions.length} • {answeredQuestions} respondidas
          </p>
        </Card>

        {/* Question */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {currentQ.pergunta}
          </h2>

          {currentQ.tipo === 'multipla_escolha' && currentQ.opcoes && (
            <RadioGroup
              value={answers[currentQ.id] || ''}
              onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
              className="space-y-3"
            >
              {currentQ.opcoes.map((opcao, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={opcao} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-foreground cursor-pointer">
                    {opcao}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </Card>

        {/* Navigation */}
        <Card className="p-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Anterior
            </Button>

            <div className="flex gap-2">
              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={handleSubmitTest}
                  disabled={submitting || answeredQuestions === 0}
                  className="bg-success hover:bg-success/90"
                >
                  {submitting ? 'Enviando...' : 'Finalizar Teste'}
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  disabled={!answers[currentQ.id]}
                >
                  Próxima
                </Button>
              )}
            </div>
          </div>

          {answeredQuestions < questions.length && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Você ainda tem {questions.length - answeredQuestions} questões não respondidas.
              </AlertDescription>
            </Alert>
          )}
        </Card>
      </div>
    </div>
  );
}