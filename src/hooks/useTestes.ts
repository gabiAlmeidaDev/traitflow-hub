import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Teste {
  id: string;
  titulo: string;
  descricao?: string;
  status: 'rascunho' | 'ativo' | 'inativo';
  data_inicio?: string;
  data_fim?: string;
  configuracoes: any;
  criado_por: string;
  empresa_id: string;
  created_at: string;
  updated_at: string;
  questoes?: Questao[];
}

export interface Questao {
  id?: string;
  teste_id?: string;
  pergunta: string;
  tipo: 'multipla_escolha' | 'texto' | 'escala';
  opcoes?: any;
  peso: number;
  ordem: number;
}

export interface TesteFormData {
  titulo: string;
  descricao?: string;
  data_inicio?: Date;
  data_fim?: Date;
  configuracoes: {
    tempo_limite?: number;
    embaralhar_questoes?: boolean;
    mostrar_resultado?: boolean;
  };
  questoes: Questao[];
}

export interface TestesStats {
  total: number;
  ativos: number;
  rascunhos: number;
  inativos: number;
}

export function useTestes() {
  const { user } = useAuth();
  const [testes, setTestes] = useState<Teste[]>([]);
  const [stats, setStats] = useState<TestesStats>({ total: 0, ativos: 0, rascunhos: 0, inativos: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestes = async () => {
    if (!user?.user_metadata?.empresa_id) return;

    try {
      setLoading(true);
      setError(null);

      const { data: testesData, error: testesError } = await supabase
        .from('testes')
        .select(`
          *,
          questoes_teste (*)
        `)
        .eq('empresa_id', user.user_metadata.empresa_id)
        .order('created_at', { ascending: false });

      if (testesError) throw testesError;

      const testesWithQuestoes = testesData?.map(teste => ({
        ...teste,
        status: teste.status as 'rascunho' | 'ativo' | 'inativo',
        questoes: Array.isArray(teste.questoes_teste) ? teste.questoes_teste : []
      })) || [];

      setTestes(testesWithQuestoes);

      // Calculate stats
      const stats = testesWithQuestoes.reduce(
        (acc, teste) => {
          acc.total++;
          if (teste.status === 'ativo') acc.ativos++;
          else if (teste.status === 'rascunho') acc.rascunhos++;
          else if (teste.status === 'inativo') acc.inativos++;
          return acc;
        },
        { total: 0, ativos: 0, rascunhos: 0, inativos: 0 }
      );

      setStats(stats);
    } catch (err) {
      console.error('Error fetching testes:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar testes');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os testes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTeste = async (data: TesteFormData) => {
    if (!user?.user_metadata?.empresa_id || !user.id) return;

    try {
      setLoading(true);

      // Create test
      const { data: testeData, error: testeError } = await supabase
        .from('testes')
        .insert({
          titulo: data.titulo,
          descricao: data.descricao,
          data_inicio: data.data_inicio?.toISOString(),
          data_fim: data.data_fim?.toISOString(),
          configuracoes: data.configuracoes,
          criado_por: user.id,
          empresa_id: user.user_metadata.empresa_id,
          status: 'rascunho'
        })
        .select()
        .single();

      if (testeError) throw testeError;

      // Create questions
      if (data.questoes.length > 0) {
        const questoes = data.questoes.map((questao, index) => ({
          teste_id: testeData.id,
          pergunta: questao.pergunta,
          tipo: questao.tipo,
          opcoes: questao.opcoes,
          peso: questao.peso,
          ordem: index + 1,
          empresa_id: user.user_metadata.empresa_id
        }));

        const { error: questoesError } = await supabase
          .from('questoes_teste')
          .insert(questoes);

        if (questoesError) throw questoesError;
      }

      toast({
        title: "Sucesso",
        description: "Teste criado com sucesso",
      });

      await fetchTestes();
      return testeData;
    } catch (err) {
      console.error('Error creating teste:', err);
      toast({
        title: "Erro",
        description: "Erro ao criar teste",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTeste = async (id: string, data: TesteFormData) => {
    if (!user?.user_metadata?.empresa_id) return;

    try {
      setLoading(true);

      // Update test
      const { error: testeError } = await supabase
        .from('testes')
        .update({
          titulo: data.titulo,
          descricao: data.descricao,
          data_inicio: data.data_inicio?.toISOString(),
          data_fim: data.data_fim?.toISOString(),
          configuracoes: data.configuracoes,
        })
        .eq('id', id)
        .eq('empresa_id', user.user_metadata.empresa_id);

      if (testeError) throw testeError;

      // Delete existing questions
      await supabase
        .from('questoes_teste')
        .delete()
        .eq('teste_id', id);

      // Create new questions
      if (data.questoes.length > 0) {
        const questoes = data.questoes.map((questao, index) => ({
          teste_id: id,
          pergunta: questao.pergunta,
          tipo: questao.tipo,
          opcoes: questao.opcoes,
          peso: questao.peso,
          ordem: index + 1,
          empresa_id: user.user_metadata.empresa_id
        }));

        const { error: questoesError } = await supabase
          .from('questoes_teste')
          .insert(questoes);

        if (questoesError) throw questoesError;
      }

      toast({
        title: "Sucesso",
        description: "Teste atualizado com sucesso",
      });

      await fetchTestes();
    } catch (err) {
      console.error('Error updating teste:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar teste",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeste = async (id: string) => {
    if (!user?.user_metadata?.empresa_id) return;

    try {
      setLoading(true);

      // Check if test has applications
      const { data: applications } = await supabase
        .from('aplicacoes_testes')
        .select('id')
        .eq('teste_id', id)
        .limit(1);

      if (applications && applications.length > 0) {
        toast({
          title: "Erro",
          description: "Não é possível excluir um teste que já possui aplicações",
          variant: "destructive",
        });
        return;
      }

      // Delete questions first
      await supabase
        .from('questoes_teste')
        .delete()
        .eq('teste_id', id);

      // Delete test
      const { error } = await supabase
        .from('testes')
        .delete()
        .eq('id', id)
        .eq('empresa_id', user.user_metadata.empresa_id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Teste excluído com sucesso",
      });

      await fetchTestes();
    } catch (err) {
      console.error('Error deleting teste:', err);
      toast({
        title: "Erro",
        description: "Erro ao excluir teste",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'rascunho' | 'ativo' | 'inativo') => {
    if (!user?.user_metadata?.empresa_id) return;

    try {
      const { error } = await supabase
        .from('testes')
        .update({ status })
        .eq('id', id)
        .eq('empresa_id', user.user_metadata.empresa_id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Status do teste atualizado para ${status}`,
      });

      await fetchTestes();
    } catch (err) {
      console.error('Error updating status:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      });
    }
  };

  const duplicateTeste = async (id: string) => {
    const teste = testes.find(t => t.id === id);
    if (!teste) return;

    const duplicatedData: TesteFormData = {
      titulo: `${teste.titulo} (Cópia)`,
      descricao: teste.descricao,
      data_inicio: teste.data_inicio ? new Date(teste.data_inicio) : undefined,
      data_fim: teste.data_fim ? new Date(teste.data_fim) : undefined,
      configuracoes: teste.configuracoes || {},
      questoes: teste.questoes?.map(q => ({
        pergunta: q.pergunta,
        tipo: q.tipo,
        opcoes: q.opcoes,
        peso: q.peso,
        ordem: q.ordem
      })) || []
    };

    await createTeste(duplicatedData);
  };

  useEffect(() => {
    fetchTestes();
  }, [user]);

  return {
    testes,
    stats,
    loading,
    error,
    fetchTestes,
    createTeste,
    updateTeste,
    deleteTeste,
    updateStatus,
    duplicateTeste,
  };
}