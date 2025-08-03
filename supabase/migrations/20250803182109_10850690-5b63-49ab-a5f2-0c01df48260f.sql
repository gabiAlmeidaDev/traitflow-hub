-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin_plataforma', 'admin_empresa', 'usuario_empresa');

-- Create enum for subscription status
CREATE TYPE public.subscription_status AS ENUM ('active', 'inactive', 'suspended', 'cancelled');

-- Create enum for plan types
CREATE TYPE public.plan_type AS ENUM ('free', 'basic', 'premium', 'enterprise');

-- Create empresas table
CREATE TABLE public.empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  cnpj TEXT UNIQUE,
  endereco JSONB,
  configuracoes JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  plano_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create planos table
CREATE TABLE public.planos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo plan_type NOT NULL,
  preco_mensal DECIMAL(10,2),
  limite_usuarios INTEGER,
  limite_testes INTEGER,
  limite_candidatos INTEGER,
  recursos JSONB DEFAULT '{}',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome_completo TEXT,
  telefone TEXT,
  papel user_role NOT NULL DEFAULT 'usuario_empresa',
  configuracoes JSONB DEFAULT '{}',
  ultimo_acesso TIMESTAMPTZ,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create assinaturas table
CREATE TABLE public.assinaturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
  plano_id UUID REFERENCES public.planos(id) NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  status subscription_status NOT NULL DEFAULT 'active',
  inicio_periodo DATE NOT NULL,
  fim_periodo DATE NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create testes table
CREATE TABLE public.testes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
  criado_por UUID REFERENCES public.profiles(id) NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  configuracoes JSONB DEFAULT '{}',
  status TEXT DEFAULT 'rascunho',
  data_inicio TIMESTAMPTZ,
  data_fim TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create candidatos table
CREATE TABLE public.candidatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  dados_adicionais JSONB DEFAULT '{}',
  status TEXT DEFAULT 'ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create batches_testes table
CREATE TABLE public.batches_testes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
  teste_id UUID REFERENCES public.testes(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  link_unico TEXT UNIQUE NOT NULL,
  data_expiracao TIMESTAMPTZ,
  limite_candidatos INTEGER,
  status TEXT DEFAULT 'ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create aplicacoes_testes table
CREATE TABLE public.aplicacoes_testes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
  teste_id UUID REFERENCES public.testes(id) ON DELETE CASCADE NOT NULL,
  batch_id UUID REFERENCES public.batches_testes(id) ON DELETE CASCADE,
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE CASCADE NOT NULL,
  resultados JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pendente',
  iniciado_em TIMESTAMPTZ,
  finalizado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create logs_auditoria table
CREATE TABLE public.logs_auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  acao TEXT NOT NULL,
  recurso TEXT NOT NULL,
  recurso_id UUID,
  dados_anteriores JSONB,
  dados_novos JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notificacoes table
CREATE TABLE public.notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT DEFAULT 'info',
  lida BOOLEAN DEFAULT false,
  dados_extras JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add foreign key constraint
ALTER TABLE public.empresas ADD CONSTRAINT fk_empresas_plano 
  FOREIGN KEY (plano_id) REFERENCES public.planos(id);

-- Enable Row Level Security
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches_testes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aplicacoes_testes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT papel FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to get current user empresa_id
CREATE OR REPLACE FUNCTION public.get_current_user_empresa_id()
RETURNS UUID AS $$
  SELECT empresa_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_current_user_role() = 'super_admin';
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to check if user is admin (super_admin or admin_plataforma)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_current_user_role() IN ('super_admin', 'admin_plataforma');
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_super_admin());

CREATE POLICY "Company admins can view company profiles" ON public.profiles
  FOR SELECT USING (
    public.get_current_user_role() = 'admin_empresa' AND 
    empresa_id = public.get_current_user_empresa_id()
  );

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_super_admin());

CREATE POLICY "Super admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (public.is_super_admin());

-- RLS Policies for empresas
CREATE POLICY "Super admins can manage all companies" ON public.empresas
  FOR ALL USING (public.is_super_admin());

CREATE POLICY "Users can view their own company" ON public.empresas
  FOR SELECT USING (id = public.get_current_user_empresa_id());

-- RLS Policies for planos
CREATE POLICY "Everyone can view plans" ON public.planos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admins can manage plans" ON public.planos
  FOR ALL USING (public.is_super_admin());

-- RLS Policies for assinaturas
CREATE POLICY "Super admins can view all subscriptions" ON public.assinaturas
  FOR SELECT USING (public.is_super_admin());

CREATE POLICY "Users can view their company subscription" ON public.assinaturas
  FOR SELECT USING (empresa_id = public.get_current_user_empresa_id());

CREATE POLICY "Super admins can manage subscriptions" ON public.assinaturas
  FOR ALL USING (public.is_super_admin());

-- RLS Policies for testes
CREATE POLICY "Users can manage their company tests" ON public.testes
  FOR ALL USING (empresa_id = public.get_current_user_empresa_id());

CREATE POLICY "Super admins can view all tests" ON public.testes
  FOR SELECT USING (public.is_super_admin());

-- RLS Policies for candidatos
CREATE POLICY "Users can manage their company candidates" ON public.candidatos
  FOR ALL USING (empresa_id = public.get_current_user_empresa_id());

CREATE POLICY "Super admins can view all candidates" ON public.candidatos
  FOR SELECT USING (public.is_super_admin());

-- RLS Policies for batches_testes
CREATE POLICY "Users can manage their company batches" ON public.batches_testes
  FOR ALL USING (empresa_id = public.get_current_user_empresa_id());

CREATE POLICY "Super admins can view all batches" ON public.batches_testes
  FOR SELECT USING (public.is_super_admin());

-- RLS Policies for aplicacoes_testes
CREATE POLICY "Users can manage their company applications" ON public.aplicacoes_testes
  FOR ALL USING (empresa_id = public.get_current_user_empresa_id());

CREATE POLICY "Super admins can view all applications" ON public.aplicacoes_testes
  FOR SELECT USING (public.is_super_admin());

-- RLS Policies for logs_auditoria
CREATE POLICY "Super admins can view all logs" ON public.logs_auditoria
  FOR SELECT USING (public.is_super_admin());

CREATE POLICY "Company admins can view their company logs" ON public.logs_auditoria
  FOR SELECT USING (
    public.get_current_user_role() = 'admin_empresa' AND 
    empresa_id = public.get_current_user_empresa_id()
  );

CREATE POLICY "System can insert logs" ON public.logs_auditoria
  FOR INSERT WITH CHECK (true);

-- RLS Policies for notificacoes
CREATE POLICY "Users can view their own notifications" ON public.notificacoes
  FOR SELECT USING (usuario_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notificacoes
  FOR UPDATE USING (usuario_id = auth.uid());

CREATE POLICY "System can insert notifications" ON public.notificacoes
  FOR INSERT WITH CHECK (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_completo, papel)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'nome_completo', NEW.email),
    CASE 
      WHEN NEW.email = 'admin@traitview.com' THEN 'super_admin'::user_role
      ELSE 'usuario_empresa'::user_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON public.empresas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_planos_updated_at BEFORE UPDATE ON public.planos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assinaturas_updated_at BEFORE UPDATE ON public.assinaturas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testes_updated_at BEFORE UPDATE ON public.testes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidatos_updated_at BEFORE UPDATE ON public.candidatos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_batches_testes_updated_at BEFORE UPDATE ON public.batches_testes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_aplicacoes_testes_updated_at BEFORE UPDATE ON public.aplicacoes_testes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notificacoes_updated_at BEFORE UPDATE ON public.notificacoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default plans
INSERT INTO public.planos (nome, tipo, preco_mensal, limite_usuarios, limite_testes, limite_candidatos, recursos) VALUES
('Gratuito', 'free', 0.00, 2, 5, 50, '{"relatorios_basicos": true, "suporte_email": false}'),
('Básico', 'basic', 99.90, 5, 20, 200, '{"relatorios_basicos": true, "relatorios_avancados": false, "suporte_email": true}'),
('Premium', 'premium', 299.90, 15, 100, 1000, '{"relatorios_basicos": true, "relatorios_avancados": true, "suporte_email": true, "suporte_telefone": true}'),
('Enterprise', 'enterprise', 999.90, 50, 500, 5000, '{"relatorios_basicos": true, "relatorios_avancados": true, "suporte_email": true, "suporte_telefone": true, "api_acesso": true}');

-- Create indexes for better performance
CREATE INDEX idx_profiles_empresa_id ON public.profiles(empresa_id);
CREATE INDEX idx_profiles_papel ON public.profiles(papel);
CREATE INDEX idx_testes_empresa_id ON public.testes(empresa_id);
CREATE INDEX idx_candidatos_empresa_id ON public.candidatos(empresa_id);
CREATE INDEX idx_batches_testes_empresa_id ON public.batches_testes(empresa_id);
CREATE INDEX idx_aplicacoes_testes_empresa_id ON public.aplicacoes_testes(empresa_id);
CREATE INDEX idx_logs_auditoria_empresa_id ON public.logs_auditoria(empresa_id);
CREATE INDEX idx_logs_auditoria_usuario_id ON public.logs_auditoria(usuario_id);
CREATE INDEX idx_notificacoes_usuario_id ON public.notificacoes(usuario_id);
CREATE INDEX idx_notificacoes_lida ON public.notificacoes(lida);