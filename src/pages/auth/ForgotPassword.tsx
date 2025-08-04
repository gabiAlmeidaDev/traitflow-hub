import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
      toast({
        title: "Erro ao enviar e-mail",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSent(true);
      toast({
        title: "E-mail enviado com sucesso!",
        description: "Verifique sua caixa de entrada para redefinir a senha.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-16 left-16 w-72 h-72 bg-gradient-to-r from-info/30 to-primary/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-16 right-16 w-80 h-80 bg-gradient-to-r from-accent/20 to-info/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2.5s' }}></div>
      </div>
      
      <Card className="w-full max-w-md relative z-10 animate-slide-up glass-effect">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="hero-title text-4xl">Recuperar senha</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {sent 
              ? "E-mail de recuperação enviado"
              : "Digite seu email para receber as instruções"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-center">
              <Alert>
                <AlertDescription>
                  Enviamos um e-mail com instruções para redefinir sua senha. 
                  Verifique sua caixa de entrada e spam.
                </AlertDescription>
              </Alert>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSent(false);
                  setEmail('');
                }}
                className="w-full"
              >
                Tentar outro e-mail
              </Button>

              <Link to="/auth/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar instruções'
                )}
              </Button>

              <Link to="/auth/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao login
                </Button>
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}