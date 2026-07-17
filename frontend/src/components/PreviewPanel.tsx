import React from 'react';
import type { ConvertResponse } from '../types/api';

interface PreviewPanelProps {
    result: ConvertResponse | null;
    format: 'md' | 'json' | 'txt';
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ result, format }) => {
    if (!result) return null;

    if (result.error) {
        return (
            <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                <p><strong>Error:</strong> {result.error}</p>
            </div>
        );
    }

    return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-md shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Metadata</h3>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <div>
                        <span className="font-semibold block">Judul:</span>
                        <span>{result.title || 'N/A'}</span>
                    </div>
                    <div>
                        <span className="font-semibold block">Penulis:</span>
                        <span>{result.author || 'N/A'}</span>
                    </div>
                    <div>
                        <span className="font-semibold block">Tanggal:</span>
                        <span>{result.date || 'N/A'}</span>
                    </div>
                    <div>
                        <span className="font-semibold block">URL Asal:</span>
                        <a href={result.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                            {result.source_url || 'N/A'}
                        </a>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2 p-4 bg-white dark:bg-gray-900 rounded-md shadow border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Preview ({format.toUpperCase()})
                </h3>
                <pre className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded overflow-auto h-96 text-sm font-mono whitespace-pre-wrap">
                    {result.data}
                </pre>
            </div>
        </div>
    );
};

export default PreviewPanel;
