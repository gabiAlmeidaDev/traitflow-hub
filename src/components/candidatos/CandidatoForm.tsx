import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CandidatoFormData, Candidato } from '@/hooks/useCandidatos';

interface CandidatoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CandidatoFormData) => Promise<{ success: boolean; error?: string }>;
  candidato?: Candidato | null;
  loading?: boolean;
}

export function CandidatoForm({ open, onOpenChange, onSubmit, candidato, loading }: CandidatoFormProps) {
  const [formData, setFormData] = useState<CandidatoFormData>(() => ({
    nome: candidato?.nome || '',
    email: candidato?.email || '',
    telefone: candidato?.telefone || '',
    cargo: candidato?.dados_adicionais?.cargo || '',
    departamento: candidato?.dados_adicionais?.departamento || '',
    observacoes: candidato?.dados_adicionais?.observacoes || '',
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || !formData.email.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await onSubmit(formData);
      if (result.success) {
        onOpenChange(false);
        // Reset form
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          cargo: '',
          departamento: '',
          observacoes: '',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CandidatoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {candidato ? 'Editar Candidato' : 'Adicionar Candidato'}
          </DialogTitle>
          <DialogDescription>
            {candidato 
              ? 'Edite as informações do candidato abaixo.' 
              : 'Adicione um novo candidato ao sistema.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="exemplo@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={formData.cargo}
                onChange={(e) => handleInputChange('cargo', e.target.value)}
                placeholder="Ex: Desenvolvedor, Gerente, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento</Label>
              <Input
                id="departamento"
                value={formData.departamento}
                onChange={(e) => handleInputChange('departamento', e.target.value)}
                placeholder="Ex: TI, Vendas, RH, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                placeholder="Informações adicionais sobre o candidato..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.nome.trim() || !formData.email.trim()}
            >
              {isSubmitting ? 'Salvando...' : candidato ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}