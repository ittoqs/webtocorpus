import { useState } from 'react';
import InputForm from './components/InputForm';
import PreviewPanel from './components/PreviewPanel';
import Skeleton from './components/Skeleton';
import type { ConvertRequest, ConvertResponse } from './types/api';
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConvertResponse | null>(null);
  const [currentFormat, setCurrentFormat] = useState<'md' | 'json' | 'txt'>('md');

  const handleConvert = async (url: string, format: 'md' | 'json' | 'txt') => {
    setIsLoading(true);
    setResult(null);
    setCurrentFormat(format);

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, format } as ConvertRequest),
      });

      const data: ConvertResponse = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        data: '',
        error: error.message || 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result || !result.data) return;

    const blob = new Blob([result.data], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `corpus_${new Date().getTime()}.${currentFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            WebToCorpus
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Convert any static webpage into a clean Markdown, JSON, or Plain Text corpus.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 sm:p-10 mb-8">
          <InputForm onSubmit={handleConvert} isLoading={isLoading} />
        </div>

        {isLoading && <Skeleton />}

        {!isLoading && result && (
          <div>
            <PreviewPanel result={result} format={currentFormat} />

            {result.data && !result.error && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Corpus
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
