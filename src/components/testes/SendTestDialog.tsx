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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Candidato } from '@/hooks/useCandidatos';
import { useTestApplications } from '@/hooks/useTestApplications';
import { useAuth } from '@/contexts/AuthContext';
import { Copy, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SendTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidatos: Candidato[];
  testes: any[];
}

export function SendTestDialog({ open, onOpenChange, candidatos, testes }: SendTestDialogProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { createApplication, sendTestInvitation } = useTestApplications();
  
  const [selectedCandidato, setSelectedCandidato] = useState<string>('');
  const [selectedTeste, setSelectedTeste] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCandidato || !selectedTeste || !profile?.empresa_id) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create test application
      const result = await createApplication({
        candidatoId: selectedCandidato,
        testeId: selectedTeste
      }, profile.empresa_id);

      if (result.success && result.data) {
        setGeneratedLink(result.testLink || '');
        
        // Send invitation
        const candidato = candidatos.find(c => c.id === selectedCandidato);
        if (candidato) {
          await sendTestInvitation(result.data.id, candidato.email);
        }

        toast({
          title: "Sucesso",
          description: "Teste enviado com sucesso!",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast({
        title: "Sucesso",
        description: "Link copiado para a área de transferência!",
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedCandidato('');
    setSelectedTeste('');
    setCustomMessage('');
    setGeneratedLink('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enviar Teste para Candidato</DialogTitle>
          <DialogDescription>
            Selecione um candidato e um teste para criar um link de aplicação.
          </DialogDescription>
        </DialogHeader>
        
        {!generatedLink ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="candidato">Candidato *</Label>
              <Select value={selectedCandidato} onValueChange={setSelectedCandidato}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um candidato" />
                </SelectTrigger>
                <SelectContent>
                  {candidatos.map((candidato) => (
                    <SelectItem key={candidato.id} value={candidato.id}>
                      {candidato.nome} ({candidato.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teste">Teste *</Label>
              <Select value={selectedTeste} onValueChange={setSelectedTeste}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um teste" />
                </SelectTrigger>
                <SelectContent>
                  {testes.map((teste) => (
                    <SelectItem key={teste.id} value={teste.id}>
                      {teste.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem Personalizada (Opcional)</Label>
              <Textarea
                id="message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Adicione uma mensagem personalizada para o candidato..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !selectedCandidato || !selectedTeste}
              >
                {isSubmitting ? (
                  <>
                    <Send className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Teste
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <h4 className="font-semibold text-success mb-2">Teste Enviado com Sucesso!</h4>
              <p className="text-sm text-muted-foreground mb-3">
                O link do teste foi gerado e o candidato foi notificado.
              </p>
              
              <div className="space-y-2">
                <Label>Link do Teste:</Label>
                <div className="flex gap-2">
                  <Input
                    value={generatedLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>
                Fechar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}