import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Candidato {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  status: string;
  dados_adicionais?: any;
  empresa_id: string;
  created_at: string;
  updated_at: string;
}

export interface CandidatoStats {
  total: number;
  ativos: number;
  emAvaliacao: number;
  concluidos: number;
}

export interface CandidatoFormData {
  nome: string;
  email: string;
  telefone?: string;
  cargo?: string;
  departamento?: string;
  observacoes?: string;
}

export function useCandidatos() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [stats, setStats] = useState<CandidatoStats>({ total: 0, ativos: 0, emAvaliacao: 0, concluidos: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.empresa_id) {
      fetchCandidatos();
    }
  }, [profile?.empresa_id]);

  const fetchCandidatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('candidatos')
        .select('*')
        .eq('empresa_id', profile?.empresa_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const candidatosFormatted = (data || []).map(c => ({
        ...c,
        telefone: c.telefone || undefined,
        dados_adicionais: c.dados_adicionais || {}
      })) as Candidato[];

      setCandidatos(candidatosFormatted);
      
      // Calculate stats
      const total = data?.length || 0;
      const ativos = data?.filter(c => c.status === 'ativo').length || 0;
      const emAvaliacao = data?.filter(c => c.status === 'em_avaliacao').length || 0;
      const concluidos = data?.filter(c => c.status === 'concluido').length || 0;

      setStats({ total, ativos, emAvaliacao, concluidos });

    } catch (err) {
      console.error('Error fetching candidatos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar candidatos');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os candidatos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCandidato = async (data: CandidatoFormData) => {
    try {
      if (!profile?.empresa_id) {
        throw new Error('Empresa não identificada');
      }

      const { nome, email, telefone, cargo, departamento, observacoes } = data;

      const candidatoData = {
        nome,
        email,
        telefone: telefone || null,
        empresa_id: profile.empresa_id,
        status: 'ativo',
        dados_adicionais: {
          cargo: cargo || null,
          departamento: departamento || null,
          observacoes: observacoes || null,
        }
      };

      const { data: newCandidato, error } = await supabase
        .from('candidatos')
        .insert([candidatoData])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Este email já está cadastrado');
        }
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Candidato adicionado com sucesso",
      });

      await fetchCandidatos(); // Refresh the list
      return { success: true, data: newCandidato };

    } catch (err) {
      console.error('Error creating candidato:', err);
      const message = err instanceof Error ? err.message : 'Erro ao adicionar candidato';
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    }
  };

  const updateCandidato = async (id: string, data: CandidatoFormData) => {
    try {
      const { nome, email, telefone, cargo, departamento, observacoes } = data;

      const updateData = {
        nome,
        email,
        telefone: telefone || null,
        dados_adicionais: {
          cargo: cargo || null,
          departamento: departamento || null,
          observacoes: observacoes || null,
        }
      };

      const { error } = await supabase
        .from('candidatos')
        .update(updateData)
        .eq('id', id)
        .eq('empresa_id', profile?.empresa_id);

      if (error) {
        if (error.code === '23505') {
          throw new Error('Este email já está cadastrado');
        }
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Candidato atualizado com sucesso",
      });

      await fetchCandidatos(); // Refresh the list
      return { success: true };

    } catch (err) {
      console.error('Error updating candidato:', err);
      const message = err instanceof Error ? err.message : 'Erro ao atualizar candidato';
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    }
  };

  const deleteCandidato = async (id: string) => {
    try {
      const { error } = await supabase
        .from('candidatos')
        .delete()
        .eq('id', id)
        .eq('empresa_id', profile?.empresa_id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Candidato removido com sucesso",
      });

      await fetchCandidatos(); // Refresh the list
      return { success: true };

    } catch (err) {
      console.error('Error deleting candidato:', err);
      const message = err instanceof Error ? err.message : 'Erro ao remover candidato';
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('candidatos')
        .update({ status })
        .eq('id', id)
        .eq('empresa_id', profile?.empresa_id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso",
      });

      await fetchCandidatos(); // Refresh the list
      return { success: true };

    } catch (err) {
      console.error('Error updating status:', err);
      const message = err instanceof Error ? err.message : 'Erro ao atualizar status';
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    }
  };

  return {
    candidatos,
    stats,
    loading,
    error,
    fetchCandidatos,
    createCandidato,
    updateCandidato,
    deleteCandidato,
    updateStatus,
  };
}