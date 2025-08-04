import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { applicationId, candidateEmail, candidateName, testTitle, score } = await req.json();

    console.log('Sending test completion notification:', {
      applicationId,
      candidateEmail,
      candidateName,
      testTitle,
      score
    });

    // Get application details
    const { data: application, error: appError } = await supabase
      .from('aplicacoes_testes')
      .select(`
        *,
        candidatos (nome, email),
        testes (titulo, empresa_id),
        empresas!inner(nome, email)
      `)
      .eq('id', applicationId)
      .single();

    if (appError) {
      console.error('Error fetching application:', appError);
      throw appError;
    }

    // Here you would integrate with your email service (Resend, etc.)
    // For now, we'll just log the email content
    const emailContent = {
      to: candidateEmail,
      subject: `Teste "${testTitle}" - Resultado`,
      html: `
        <h2>Teste Concluído com Sucesso!</h2>
        <p>Olá ${candidateName},</p>
        <p>Você concluiu o teste "<strong>${testTitle}</strong>" com sucesso!</p>
        <p><strong>Pontuação:</strong> ${score}%</p>
        <p>Em breve você receberá um retorno sobre os próximos passos do processo seletivo.</p>
        <br>
        <p>Atenciosamente,<br>${application.empresas.nome}</p>
      `
    };

    console.log('Email to be sent:', emailContent);

    // For demonstration, we'll create a notification record instead
    await supabase
      .from('notificacoes')
      .insert({
        usuario_id: application.candidatos.id,
        titulo: `Teste "${testTitle}" Concluído`,
        mensagem: `Você concluiu o teste com pontuação de ${score}%.`,
        tipo: 'teste_concluido',
        dados_extras: {
          applicationId,
          score,
          testTitle
        }
      });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Notification sent successfully',
      emailContent 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-test-notification function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});