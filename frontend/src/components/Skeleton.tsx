import React from 'react';

const Skeleton: React.FC = () => {
    return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="md:col-span-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-md shadow">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="space-y-4">
                    <div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                    </div>
                    <div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                    <div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
            <div className="md:col-span-2 p-4 bg-white dark:bg-gray-900 rounded-md shadow border border-gray-200 dark:border-gray-700">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded"></div>
            </div>
        </div>
    );
};

export default Skeleton;
