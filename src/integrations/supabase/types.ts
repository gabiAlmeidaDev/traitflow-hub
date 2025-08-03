export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      aplicacoes_testes: {
        Row: {
          batch_id: string | null
          candidato_id: string
          created_at: string
          empresa_id: string
          finalizado_em: string | null
          id: string
          iniciado_em: string | null
          resultados: Json | null
          status: string | null
          teste_id: string
          updated_at: string
        }
        Insert: {
          batch_id?: string | null
          candidato_id: string
          created_at?: string
          empresa_id: string
          finalizado_em?: string | null
          id?: string
          iniciado_em?: string | null
          resultados?: Json | null
          status?: string | null
          teste_id: string
          updated_at?: string
        }
        Update: {
          batch_id?: string | null
          candidato_id?: string
          created_at?: string
          empresa_id?: string
          finalizado_em?: string | null
          id?: string
          iniciado_em?: string | null
          resultados?: Json | null
          status?: string | null
          teste_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "aplicacoes_testes_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches_testes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aplicacoes_testes_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aplicacoes_testes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aplicacoes_testes_teste_id_fkey"
            columns: ["teste_id"]
            isOneToOne: false
            referencedRelation: "testes"
            referencedColumns: ["id"]
          },
        ]
      }
      assinaturas: {
        Row: {
          created_at: string
          empresa_id: string
          fim_periodo: string
          id: string
          inicio_periodo: string
          plano_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id: string | null
          updated_at: string
          valor: number
        }
        Insert: {
          created_at?: string
          empresa_id: string
          fim_periodo: string
          id?: string
          inicio_periodo: string
          plano_id: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id?: string | null
          updated_at?: string
          valor: number
        }
        Update: {
          created_at?: string
          empresa_id?: string
          fim_periodo?: string
          id?: string
          inicio_periodo?: string
          plano_id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id?: string | null
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinaturas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      batches_testes: {
        Row: {
          created_at: string
          data_expiracao: string | null
          descricao: string | null
          empresa_id: string
          id: string
          limite_candidatos: number | null
          link_unico: string
          nome: string
          status: string | null
          teste_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_expiracao?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          limite_candidatos?: number | null
          link_unico: string
          nome: string
          status?: string | null
          teste_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_expiracao?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          limite_candidatos?: number | null
          link_unico?: string
          nome?: string
          status?: string | null
          teste_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "batches_testes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batches_testes_teste_id_fkey"
            columns: ["teste_id"]
            isOneToOne: false
            referencedRelation: "testes"
            referencedColumns: ["id"]
          },
        ]
      }
      candidatos: {
        Row: {
          created_at: string
          dados_adicionais: Json | null
          email: string
          empresa_id: string
          id: string
          nome: string
          status: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dados_adicionais?: Json | null
          email: string
          empresa_id: string
          id?: string
          nome: string
          status?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dados_adicionais?: Json | null
          email?: string
          empresa_id?: string
          id?: string
          nome?: string
          status?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidatos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cnpj: string | null
          configuracoes: Json | null
          created_at: string
          email: string
          endereco: Json | null
          id: string
          nome: string
          plano_id: string | null
          status: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          configuracoes?: Json | null
          created_at?: string
          email: string
          endereco?: Json | null
          id?: string
          nome: string
          plano_id?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          configuracoes?: Json | null
          created_at?: string
          email?: string
          endereco?: Json | null
          id?: string
          nome?: string
          plano_id?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_empresas_plano"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_auditoria: {
        Row: {
          acao: string
          created_at: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          empresa_id: string | null
          id: string
          ip_address: unknown | null
          recurso: string
          recurso_id: string | null
          user_agent: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          empresa_id?: string | null
          id?: string
          ip_address?: unknown | null
          recurso: string
          recurso_id?: string | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          empresa_id?: string | null
          id?: string
          ip_address?: unknown | null
          recurso?: string
          recurso_id?: string | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_auditoria_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logs_auditoria_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes: {
        Row: {
          created_at: string
          dados_extras: Json | null
          empresa_id: string | null
          id: string
          lida: boolean | null
          mensagem: string
          tipo: string | null
          titulo: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          dados_extras?: Json | null
          empresa_id?: string | null
          id?: string
          lida?: boolean | null
          mensagem: string
          tipo?: string | null
          titulo: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          dados_extras?: Json | null
          empresa_id?: string | null
          id?: string
          lida?: boolean | null
          mensagem?: string
          tipo?: string | null
          titulo?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          ativo: boolean | null
          created_at: string
          id: string
          limite_candidatos: number | null
          limite_testes: number | null
          limite_usuarios: number | null
          nome: string
          preco_mensal: number | null
          recursos: Json | null
          tipo: Database["public"]["Enums"]["plan_type"]
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          id?: string
          limite_candidatos?: number | null
          limite_testes?: number | null
          limite_usuarios?: number | null
          nome: string
          preco_mensal?: number | null
          recursos?: Json | null
          tipo: Database["public"]["Enums"]["plan_type"]
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          id?: string
          limite_candidatos?: number | null
          limite_testes?: number | null
          limite_usuarios?: number | null
          nome?: string
          preco_mensal?: number | null
          recursos?: Json | null
          tipo?: Database["public"]["Enums"]["plan_type"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ativo: boolean | null
          configuracoes: Json | null
          created_at: string
          empresa_id: string | null
          id: string
          nome_completo: string | null
          papel: Database["public"]["Enums"]["user_role"]
          telefone: string | null
          ultimo_acesso: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          configuracoes?: Json | null
          created_at?: string
          empresa_id?: string | null
          id: string
          nome_completo?: string | null
          papel?: Database["public"]["Enums"]["user_role"]
          telefone?: string | null
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          configuracoes?: Json | null
          created_at?: string
          empresa_id?: string | null
          id?: string
          nome_completo?: string | null
          papel?: Database["public"]["Enums"]["user_role"]
          telefone?: string | null
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      testes: {
        Row: {
          configuracoes: Json | null
          created_at: string
          criado_por: string
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          empresa_id: string
          id: string
          status: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          configuracoes?: Json | null
          created_at?: string
          criado_por: string
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          status?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          configuracoes?: Json | null
          created_at?: string
          criado_por?: string
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          status?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testes_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_empresa_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      plan_type: "free" | "basic" | "premium" | "enterprise"
      subscription_status: "active" | "inactive" | "suspended" | "cancelled"
      user_role:
        | "super_admin"
        | "admin_plataforma"
        | "admin_empresa"
        | "usuario_empresa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      plan_type: ["free", "basic", "premium", "enterprise"],
      subscription_status: ["active", "inactive", "suspended", "cancelled"],
      user_role: [
        "super_admin",
        "admin_plataforma",
        "admin_empresa",
        "usuario_empresa",
      ],
    },
  },
} as const
