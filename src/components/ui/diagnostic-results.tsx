import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from './button';
import { runFirebaseDiagnostics } from '@/lib/firebase-diagnostic';

interface DiagnosticResult {
  service: string;
  status: 'success' | 'error';
  message: string;
  timestamp: number;
}

export function DiagnosticResults() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const diagnosticResults = await runFirebaseDiagnostics();
      setResults(diagnosticResults);
    } catch (error) {
      console.error('Error running diagnostics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Firebase Integration Diagnostics</h2>
        <Button 
          onClick={runDiagnostics}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run Diagnostics'
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div 
            key={index}
            className="rounded-lg border bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {result.status === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <h3 className="font-medium">{result.service}</h3>
                  <p className="text-sm text-gray-600">{result.message}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(result.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {!loading && results.length === 0 && (
          <p className="text-center text-gray-500">
            Run the diagnostics to see results
          </p>
        )}
      </div>
    </div>
  );
}