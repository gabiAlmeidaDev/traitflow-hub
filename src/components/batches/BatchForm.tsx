import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTestes } from "@/hooks/useTestes";
import type { BatchFormData, Batch } from "@/hooks/useBatches";

const batchSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  teste_id: z.string().min(1, "Teste é obrigatório"),
  data_expiracao: z.date().optional(),
  limite_candidatos: z.number().optional(),
});

interface BatchFormProps {
  batch?: Batch;
  onSubmit: (data: BatchFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function BatchForm({ batch, onSubmit, onCancel, loading }: BatchFormProps) {
  const { testes } = useTestes();

  const form = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      nome: batch?.nome || "",
      descricao: batch?.descricao || "",
      teste_id: batch?.teste_id || "",
      data_expiracao: batch?.data_expiracao ? new Date(batch.data_expiracao) : undefined,
      limite_candidatos: batch?.limite_candidatos || undefined,
    },
  });

  const handleSubmit = async (data: BatchFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {batch ? "Editar Batch" : "Criar Novo Batch"}
        </h2>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Batch</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do batch" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teste_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teste</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar teste" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {testes
                          .filter(teste => teste.status === 'ativo')
                          .map((teste) => (
                            <SelectItem key={teste.id} value={teste.id}>
                              {teste.titulo}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o propósito deste batch"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_expiracao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Expiração (Opcional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecionar data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="limite_candidatos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite de Candidatos (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 50"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value ? parseInt(e.target.value) : undefined;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                <Save className="w-4 h-4" />
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}