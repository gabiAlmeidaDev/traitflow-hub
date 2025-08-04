import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportData, format, filters } = await req.json();

    if (format === 'csv') {
      const csvContent = generateCSV(reportData);
      
      return new Response(csvContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="relatorio.csv"',
        },
      });
    }

    if (format === 'pdf') {
      const pdfContent = await generatePDF(reportData);
      
      return new Response(pdfContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="relatorio.pdf"',
        },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid format' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function generateCSV(reportData: any): string {
  const lines = [
    'Relatório de Testes - TraitView',
    '',
    'RESUMO GERAL',
    `Total de Testes,${reportData.totalTests}`,
    `Total de Candidatos,${reportData.totalCandidates}`,
    `Total de Aplicações,${reportData.totalApplications}`,
    `Taxa de Conclusão,${reportData.completionRate}%`,
    '',
    'DISTRIBUIÇÃO POR STATUS',
    'Status,Quantidade,Porcentagem',
    ...reportData.statusDistribution.map((item: any) => 
      `${item.status},${item.count},${item.percentage.toFixed(1)}%`
    ),
    '',
    'EVOLUÇÃO MENSAL',
    'Mês,Testes,Candidatos',
    ...reportData.monthlyEvolution.map((item: any) => 
      `${item.month},${item.tests},${item.candidates}`
    ),
    '',
    'PONTUAÇÃO DE TRAÇOS',
    'Traço,Pontuação',
    ...reportData.traitScores.map((item: any) => 
      `${item.trait},${item.score}`
    ),
    '',
    'DISTRIBUIÇÃO DE PERSONALIDADE',
    'Tipo,Porcentagem',
    ...reportData.personalityDistribution.map((item: any) => 
      `${item.name},${item.value}%`
    ),
  ];

  return lines.join('\n');
}

async function generatePDF(reportData: any): Promise<Uint8Array> {
  // For a simple PDF implementation, we'll create a basic HTML structure
  // In a production environment, you might want to use a library like puppeteer
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório TraitView</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .section { margin-bottom: 30px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .metric { background: #f5f5f5; padding: 15px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Relatório de Testes - TraitView</h1>
        <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      <div class="section">
        <h2>Resumo Geral</h2>
        <div class="grid">
          <div class="metric">
            <h3>Total de Testes</h3>
            <p style="font-size: 24px; margin: 0;">${reportData.totalTests}</p>
          </div>
          <div class="metric">
            <h3>Total de Candidatos</h3>
            <p style="font-size: 24px; margin: 0;">${reportData.totalCandidates}</p>
          </div>
          <div class="metric">
            <h3>Total de Aplicações</h3>
            <p style="font-size: 24px; margin: 0;">${reportData.totalApplications}</p>
          </div>
          <div class="metric">
            <h3>Taxa de Conclusão</h3>
            <p style="font-size: 24px; margin: 0;">${reportData.completionRate}%</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Distribuição por Status</h2>
        <table>
          <thead>
            <tr><th>Status</th><th>Quantidade</th><th>Porcentagem</th></tr>
          </thead>
          <tbody>
            ${reportData.statusDistribution.map((item: any) => 
              `<tr><td>${item.status}</td><td>${item.count}</td><td>${item.percentage.toFixed(1)}%</td></tr>`
            ).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>Pontuação de Traços</h2>
        <table>
          <thead>
            <tr><th>Traço</th><th>Pontuação</th></tr>
          </thead>
          <tbody>
            ${reportData.traitScores.map((item: any) => 
              `<tr><td>${item.trait}</td><td>${item.score}</td></tr>`
            ).join('')}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;

  // Convert HTML to PDF (simplified approach)
  // In production, you'd want to use a proper HTML to PDF converter
  const encoder = new TextEncoder();
  return encoder.encode(htmlContent);
}