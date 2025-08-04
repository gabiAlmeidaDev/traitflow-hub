import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CreateApplicationData {
  candidatoId: string;
  testeId: string;
  batchId?: string;
}

export interface ApplicationWithDetails {
  id: string;
  link_unico: string;
  status: string;
  candidato: {
    id: string;
    nome: string;
    email: string;
  };
  teste: {
    id: string;
    titulo: string;
    descricao?: string;
  };
  created_at: string;
  iniciado_em?: string;
  finalizado_em?: string;
  resultados?: any;
}

export function useTestApplications() {
  const { toast } = useToast();

  const createApplication = async (data: CreateApplicationData, empresaId: string) => {
    try {
      // Generate unique link
      const { data: linkData, error: linkError } = await supabase
        .rpc('generate_test_link');

      if (linkError) throw linkError;

      const applicationData = {
        candidato_id: data.candidatoId,
        teste_id: data.testeId,
        batch_id: data.batchId || null,
        empresa_id: empresaId,
        status: 'pendente',
        link_unico: linkData,
        token_acesso: Math.random().toString(36).substring(2, 15)
      };

      const { data: application, error } = await supabase
        .from('aplicacoes_testes')
        .insert([applicationData])
        .select(`
          *,
          candidatos (id, nome, email),
          testes (id, titulo, descricao)
        `)
        .single();

      if (error) throw error;

      const formattedApplication = {
        ...application,
        candidato: application.candidatos,
        teste: application.testes
      } as ApplicationWithDetails;

      return {
        success: true,
        data: formattedApplication,
        testLink: `${window.location.origin}/teste/${linkData}`
      };

    } catch (err) {
      console.error('Error creating test application:', err);
      const message = err instanceof Error ? err.message : 'Erro ao criar aplicação de teste';
      
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });

      return { success: false, error: message };
    }
  };

  const getApplicationsByCompany = async (empresaId: string) => {
    try {
      const { data, error } = await supabase
        .from('aplicacoes_testes')
        .select(`
          *,
          candidatos (id, nome, email),
          testes (id, titulo, descricao),
          batches_testes (id, nome)
        `)
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data.map(item => ({
        ...item,
        candidato: item.candidatos,
        teste: item.testes
      })) as ApplicationWithDetails[];

      return { success: true, data: formattedData };

    } catch (err) {
      console.error('Error fetching applications:', err);
      const message = err instanceof Error ? err.message : 'Erro ao buscar aplicações';
      
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });

      return { success: false, error: message, data: [] };
    }
  };

  const sendTestInvitation = async (applicationId: string, candidateEmail: string) => {
    try {
      // Get application details
      const { data: application, error } = await supabase
        .from('aplicacoes_testes')
        .select(`
          *,
          candidatos (nome, email),
          testes (titulo)
        `)
        .eq('id', applicationId)
        .single();

      if (error) throw error;

      const testLink = `${window.location.origin}/teste/${application.link_unico}`;

      // In a real implementation, you would send an email here
      // For now, we'll create a notification
      await supabase
        .from('notificacoes')
        .insert({
          usuario_id: application.candidato_id,
          titulo: `Convite para Teste: ${application.testes.titulo}`,
          mensagem: `Você foi convidado para realizar o teste "${application.testes.titulo}". Acesse o link para começar.`,
          tipo: 'convite_teste',
          dados_extras: {
            applicationId,
            testLink,
            testeId: application.teste_id
          }
        });

      toast({
        title: "Sucesso",
        description: `Convite enviado para ${candidateEmail}`,
      });

      return { success: true, testLink };

    } catch (err) {
      console.error('Error sending test invitation:', err);
      const message = err instanceof Error ? err.message : 'Erro ao enviar convite';
      
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });

      return { success: false, error: message };
    }
  };

  const getApplicationStats = async (empresaId: string) => {
    try {
      const { data, error } = await supabase
        .from('aplicacoes_testes')
        .select('status')
        .eq('empresa_id', empresaId);

      if (error) throw error;

      const total = data.length;
      const pendentes = data.filter(app => app.status === 'pendente').length;
      const emAndamento = data.filter(app => app.status === 'em_andamento').length;
      const concluidos = data.filter(app => app.status === 'concluido').length;

      return {
        success: true,
        stats: {
          total,
          pendentes,
          emAndamento,
          concluidos,
          taxaConclusao: total > 0 ? Math.round((concluidos / total) * 100) : 0
        }
      };

    } catch (err) {
      console.error('Error fetching application stats:', err);
      return {
        success: false,
        stats: { total: 0, pendentes: 0, emAndamento: 0, concluidos: 0, taxaConclusao: 0 }
      };
    }
  };

  return {
    createApplication,
    getApplicationsByCompany,
    sendTestInvitation,
    getApplicationStats
  };
}