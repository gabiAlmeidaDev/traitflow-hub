import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'           // << aqui
import '@/index.css'

// Error boundary para capturar erros de renderização
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-2xl font-bold text-destructive">Algo deu errado!</h1>
        <p className="text-muted-foreground">
          Ocorreu um erro inesperado na aplicação.
        </p>
        <details className="text-sm text-left bg-muted p-4 rounded-md max-w-md">
          <summary className="cursor-pointer font-medium">Detalhes do erro</summary>
          <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
        </details>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('React Error Boundary caught an error:', error, errorInfo);
      }}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
)