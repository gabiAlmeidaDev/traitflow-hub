-- Create table for test questions
CREATE TABLE public.questoes_teste (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teste_id UUID NOT NULL,
  empresa_id UUID NOT NULL,
  pergunta TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL DEFAULT 'multipla_escolha',
  opcoes JSONB,
  peso INTEGER DEFAULT 1,
  ordem INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.questoes_teste ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their company questions" 
ON public.questoes_teste 
FOR ALL 
USING (empresa_id = get_current_user_empresa_id());

CREATE POLICY "Super admins can view all questions" 
ON public.questoes_teste 
FOR SELECT 
USING (is_super_admin());

-- Create trigger for timestamps
CREATE TRIGGER update_questoes_teste_updated_at
BEFORE UPDATE ON public.questoes_teste
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add unique link for individual candidate applications
ALTER TABLE public.aplicacoes_testes 
ADD COLUMN IF NOT EXISTS link_unico TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS token_acesso TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_aplicacoes_testes_link_unico ON public.aplicacoes_testes(link_unico);
CREATE INDEX IF NOT EXISTS idx_aplicacoes_testes_token ON public.aplicacoes_testes(token_acesso);

-- Function to generate unique test links
CREATE OR REPLACE FUNCTION public.generate_test_link()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$ LANGUAGE plpgsql;