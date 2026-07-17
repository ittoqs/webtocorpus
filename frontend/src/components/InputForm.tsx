import React, { useState } from 'react';

interface InputFormProps {
    onSubmit: (url: string, format: 'md' | 'json' | 'txt') => void;
    isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
    const [url, setUrl] = useState('');
    const [format, setFormat] = useState<'md' | 'json' | 'txt'>('md');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url) {
            onSubmit(url, format);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
            <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    URL Situs Web
                </label>
                <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    required
                    disabled={isLoading}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Format Output
                </label>
                <div className="mt-2 flex space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio"
                            name="format"
                            value="md"
                            checked={format === 'md'}
                            onChange={() => setFormat('md')}
                            disabled={isLoading}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Markdown (.md)</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio"
                            name="format"
                            value="json"
                            checked={format === 'json'}
                            onChange={() => setFormat('json')}
                            disabled={isLoading}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">JSON (.json)</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio"
                            name="format"
                            value="txt"
                            checked={format === 'txt'}
                            onChange={() => setFormat('txt')}
                            disabled={isLoading}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Plain Text (.txt)</span>
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || !url}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading || !url ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
                {isLoading ? 'Processing...' : 'Convert to Corpus'}
            </button>
        </form>
    );
};

export default InputForm;
