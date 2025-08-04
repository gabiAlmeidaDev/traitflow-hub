import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Plus, Trash2, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { TesteFormData, Teste } from "@/hooks/useTestes";

const questaoSchema = z.object({
  pergunta: z.string().min(1, "Pergunta é obrigatória"),
  tipo: z.enum(["multipla_escolha", "texto", "escala"]),
  opcoes: z.any().optional(),
  peso: z.number().min(1).max(10),
  ordem: z.number(),
});

const testeSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().optional(),
  data_inicio: z.date().optional(),
  data_fim: z.date().optional(),
  configuracoes: z.object({
    tempo_limite: z.number().optional(),
    embaralhar_questoes: z.boolean().optional(),
    mostrar_resultado: z.boolean().optional(),
  }),
  questoes: z.array(questaoSchema).min(1, "Pelo menos uma questão é obrigatória"),
});

interface TesteFormProps {
  teste?: Teste;
  onSubmit: (data: TesteFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function TesteForm({ teste, onSubmit, onCancel, loading }: TesteFormProps) {
  const [showPreview, setShowPreview] = useState(false);

  const form = useForm<TesteFormData>({
    resolver: zodResolver(testeSchema),
    defaultValues: {
      titulo: teste?.titulo || "",
      descricao: teste?.descricao || "",
      data_inicio: teste?.data_inicio ? new Date(teste.data_inicio) : undefined,
      data_fim: teste?.data_fim ? new Date(teste.data_fim) : undefined,
      configuracoes: {
        tempo_limite: teste?.configuracoes?.tempo_limite || 60,
        embaralhar_questoes: teste?.configuracoes?.embaralhar_questoes || false,
        mostrar_resultado: teste?.configuracoes?.mostrar_resultado || true,
      },
      questoes: teste?.questoes || [
        {
          pergunta: "",
          tipo: "multipla_escolha",
          opcoes: { opcoes: ["", "", "", ""], resposta_correta: 0 },
          peso: 1,
          ordem: 1,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questoes",
  });

  const handleSubmit = async (data: TesteFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const addQuestao = () => {
    append({
      pergunta: "",
      tipo: "multipla_escolha",
      opcoes: { opcoes: ["", "", "", ""], resposta_correta: 0 },
      peso: 1,
      ordem: fields.length + 1,
    });
  };

  const renderQuestaoOptions = (index: number, tipo: string) => {
    if (tipo === "multipla_escolha") {
      return (
        <div className="space-y-2">
          <Label>Opções</Label>
          {[0, 1, 2, 3].map((optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-2">
              <Input
                placeholder={`Opção ${optionIndex + 1}`}
                value={form.watch(`questoes.${index}.opcoes.opcoes.${optionIndex}`) || ""}
                onChange={(e) => {
                  const opcoes = form.getValues(`questoes.${index}.opcoes.opcoes`) || ["", "", "", ""];
                  opcoes[optionIndex] = e.target.value;
                  form.setValue(`questoes.${index}.opcoes.opcoes`, opcoes);
                }}
              />
              <Switch
                checked={form.watch(`questoes.${index}.opcoes.resposta_correta`) === optionIndex}
                onCheckedChange={(checked) => {
                  if (checked) {
                    form.setValue(`questoes.${index}.opcoes.resposta_correta`, optionIndex);
                  }
                }}
              />
              <Label className="text-xs">Correta</Label>
            </div>
          ))}
        </div>
      );
    }

    if (tipo === "escala") {
      return (
        <div className="space-y-2">
          <Label>Configuração da Escala</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Mínimo</Label>
              <Input
                type="number"
                placeholder="1"
                value={form.watch(`questoes.${index}.opcoes.min`) || 1}
                onChange={(e) => {
                  form.setValue(`questoes.${index}.opcoes.min`, parseInt(e.target.value) || 1);
                }}
              />
            </div>
            <div>
              <Label className="text-xs">Máximo</Label>
              <Input
                type="number"
                placeholder="5"
                value={form.watch(`questoes.${index}.opcoes.max`) || 5}
                onChange={(e) => {
                  form.setValue(`questoes.${index}.opcoes.max`, parseInt(e.target.value) || 5);
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Preview do Teste</h2>
          <Button variant="outline" onClick={() => setShowPreview(false)}>
            Voltar à Edição
          </Button>
        </div>
        
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">{form.watch("titulo")}</h3>
          {form.watch("descricao") && (
            <p className="text-muted-foreground mb-6">{form.watch("descricao")}</p>
          )}
          
          <div className="space-y-6">
            {form.watch("questoes").map((questao, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <h4 className="font-medium mb-3">
                  {index + 1}. {questao.pergunta}
                </h4>
                
                {questao.tipo === "multipla_escolha" && (
                  <div className="space-y-2">
                    {questao.opcoes?.opcoes?.map((opcao: string, optIndex: number) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <input type="radio" name={`preview-${index}`} disabled />
                        <label>{opcao}</label>
                      </div>
                    ))}
                  </div>
                )}
                
                {questao.tipo === "texto" && (
                  <Textarea placeholder="Sua resposta..." disabled />
                )}
                
                {questao.tipo === "escala" && (
                  <div className="flex items-center gap-4">
                    <span>{questao.opcoes?.min || 1}</span>
                    <input type="range" min={questao.opcoes?.min || 1} max={questao.opcoes?.max || 5} disabled />
                    <span>{questao.opcoes?.max || 5}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {teste ? "Editar Teste" : "Criar Novo Teste"}
          </h2>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              <Save className="w-4 h-4" />
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título do teste" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="configuracoes.tempo_limite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo Limite (minutos)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="60"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 60)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o objetivo do teste"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              control={form.control}
              name="data_inicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Início</FormLabel>
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
              name="data_fim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Fim</FormLabel>
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
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              control={form.control}
              name="configuracoes.embaralhar_questoes"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Embaralhar questões</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="configuracoes.mostrar_resultado"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Mostrar resultado</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Questões</h3>
            <Button type="button" onClick={addQuestao} className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Questão
            </Button>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Questão {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remover
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name={`questoes.${index}.pergunta`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pergunta</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Digite a pergunta"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`questoes.${index}.tipo`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecionar tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="multipla_escolha">Múltipla Escolha</SelectItem>
                              <SelectItem value="texto">Texto</SelectItem>
                              <SelectItem value="escala">Escala</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`questoes.${index}.peso`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Peso</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {renderQuestaoOptions(index, form.watch(`questoes.${index}.tipo`))}
              </div>
            ))}
          </div>
        </Card>
      </form>
    </Form>
  );
}