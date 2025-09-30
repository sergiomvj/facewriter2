import React from 'react';
import { View } from '../App';
import { SparklesIcon } from './icons';

interface DashboardProps {
    onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 p-8 md:p-12 overflow-y-auto">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back!</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Ready to create something amazing today?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <DashboardCard title="Total Projects" value="12" />
                <DashboardCard title="Articles Published" value="8" />
                <DashboardCard title="Pending Review" value="2" />
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Start a New Article</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Jump right into the editor or use the AI generator to kickstart your next masterpiece from a brief.
                </p>
                <button
                    onClick={() => onNavigate('editor')}
                    className="flex items-center justify-center bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg"
                >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Create New Article
                </button>
            </div>
        </div>
    );
};

interface DashboardCardProps {
    title: string;
    value: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value }) => {
    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    );
};


export default Dashboard;