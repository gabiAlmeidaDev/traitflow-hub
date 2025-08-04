import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Batch {
  id: string;
  nome: string;
  descricao?: string;
  teste_id: string;
  status: 'ativo' | 'inativo' | 'expirado';
  data_expiracao?: string;
  limite_candidatos?: number;
  link_unico: string;
  empresa_id: string;
  created_at: string;
  updated_at: string;
  teste?: {
    titulo: string;
    descricao?: string;
  };
}

export interface BatchFormData {
  nome: string;
  descricao?: string;
  teste_id: string;
  data_expiracao?: Date;
  limite_candidatos?: number;
}

export interface BatchesStats {
  total: number;
  ativos: number;
  inativos: number;
  expirados: number;
}

export function useBatches() {
  const { user } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [stats, setStats] = useState<BatchesStats>({ total: 0, ativos: 0, inativos: 0, expirados: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBatches = async () => {
    if (!user?.user_metadata?.empresa_id) return;

    try {
      setLoading(true);
      setError(null);

      const { data: batchesData, error: batchesError } = await supabase
        .from('batches_testes')
        .select(`
          *,
          testes!inner(titulo, descricao)
        `)
        .eq('empresa_id', user.user_metadata.empresa_id)
        .order('created_at', { ascending: false });

      if (batchesError) throw batchesError;

      const batchesWithTestes = batchesData?.map(batch => ({
        ...batch,
        status: batch.status as 'ativo' | 'inativo' | 'expirado',
        teste: Array.isArray(batch.testes) ? batch.testes[0] : batch.testes
      })) || [];

      setBatches(batchesWithTestes);

      // Calculate stats
      const stats = batchesWithTestes.reduce(
        (acc, batch) => {
          acc.total++;
          if (batch.status === 'ativo') acc.ativos++;
          else if (batch.status === 'inativo') acc.inativos++;
          else if (batch.status === 'expirado') acc.expirados++;
          return acc;
        },
        { total: 0, ativos: 0, inativos: 0, expirados: 0 }
      );

      setStats(stats);
    } catch (err) {
      console.error('Error fetching batches:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar batches');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os batches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateUniqueLink = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const createBatch = async (data: BatchFormData) => {
    if (!user?.user_metadata?.empresa_id) return;

    try {
      setLoading(true);

      const uniqueLink = generateUniqueLink();

      const { data: batchData, error: batchError } = await supabase
        .from('batches_testes')
        .insert({
          nome: data.nome,
          descricao: data.descricao,
          teste_id: data.teste_id,
          data_expiracao: data.data_expiracao?.toISOString(),
          limite_candidatos: data.limite_candidatos,
          link_unico: uniqueLink,
          empresa_id: user.user_metadata.empresa_id,
          status: 'ativo'
        })
        .select()
        .single();

      if (batchError) throw batchError;

      toast({
        title: "Sucesso",
        description: "Batch criado com sucesso",
      });

      await fetchBatches();
      return batchData;
    } catch (err) {
      console.error('Error creating batch:', err);
      toast({
        title: "Erro",
        description: "Erro ao criar batch",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBatch = async (id: string, data: BatchFormData) => {
    if (!user?.user_metadata?.empresa_id) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('batches_testes')
        .update({
          nome: data.nome,
          descricao: data.descricao,
          teste_id: data.teste_id,
          data_expiracao: data.data_expiracao?.toISOString(),
          limite_candidatos: data.limite_candidatos,
        })
        .eq('id', id)
        .eq('empresa_id', user.user_metadata.empresa_id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Batch atualizado com sucesso",
      });

      await fetchBatches();
    } catch (err) {
      console.error('Error updating batch:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar batch",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBatch = async (id: string) => {
    if (!user?.user_metadata?.empresa_id) return;

    try {
      setLoading(true);

      // Check if batch has applications
      const { data: applications } = await supabase
        .from('aplicacoes_testes')
        .select('id')
        .eq('batch_id', id)
        .limit(1);

      if (applications && applications.length > 0) {
        toast({
          title: "Erro",
          description: "Não é possível excluir um batch que já possui aplicações",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('batches_testes')
        .delete()
        .eq('id', id)
        .eq('empresa_id', user.user_metadata.empresa_id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Batch excluído com sucesso",
      });

      await fetchBatches();
    } catch (err) {
      console.error('Error deleting batch:', err);
      toast({
        title: "Erro",
        description: "Erro ao excluir batch",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'ativo' | 'inativo' | 'expirado') => {
    if (!user?.user_metadata?.empresa_id) return;

    try {
      const { error } = await supabase
        .from('batches_testes')
        .update({ status })
        .eq('id', id)
        .eq('empresa_id', user.user_metadata.empresa_id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Status do batch atualizado para ${status}`,
      });

      await fetchBatches();
    } catch (err) {
      console.error('Error updating status:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      });
    }
  };

  const regenerateLink = async (id: string) => {
    if (!user?.user_metadata?.empresa_id) return;

    try {
      const newLink = generateUniqueLink();

      const { error } = await supabase
        .from('batches_testes')
        .update({ link_unico: newLink })
        .eq('id', id)
        .eq('empresa_id', user.user_metadata.empresa_id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Link regenerado com sucesso",
      });

      await fetchBatches();
    } catch (err) {
      console.error('Error regenerating link:', err);
      toast({
        title: "Erro",
        description: "Erro ao regenerar link",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [user]);

  return {
    batches,
    stats,
    loading,
    error,
    fetchBatches,
    createBatch,
    updateBatch,
    deleteBatch,
    updateStatus,
    regenerateLink,
  };
}