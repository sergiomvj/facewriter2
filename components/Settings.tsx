import React, { useState } from 'react';
import { AppSettings, LLMProvider, ImageProvider } from '../types';
import { KeyIcon, SaveIcon } from './icons';

interface SettingsProps {
    settings: AppSettings;
    onSave: (newSettings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
    const [currentSettings, setCurrentSettings] = useState<AppSettings>(settings);
    const [saveStatus, setSaveStatus] = useState('');

    const handleSave = () => {
        onSave(currentSettings);
        setSaveStatus('Settings saved successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
    };
    
    const handleImageProviderChange = (provider: ImageProvider) => {
        const providers = currentSettings.imageProviders;
        const newProviders = providers.includes(provider) 
            ? providers.filter(p => p !== provider)
            : [...providers, provider];
        setCurrentSettings(prev => ({...prev, imageProviders: newProviders}));
    };

    const llmOptions: LLMProvider[] = ['Gemini', 'OpenAI', 'Anthropic'];
    const allImageProviders: ImageProvider[] = ['Unsplash', 'Pexels', 'Pixabay'];

    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 p-8 md:p-12 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <button 
                    onClick={handleSave}
                    className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                    <SaveIcon className="w-5 h-5 mr-2" />
                    Save Changes
                </button>
            </div>

            {saveStatus && <div className="bg-green-500/20 text-green-600 dark:text-green-300 p-3 rounded-md mb-6 text-sm">{saveStatus}</div>}

            <div className="space-y-8 max-w-3xl">
                <SettingsSection title="AI & LLM Provider">
                    <SelectField
                        label="LLM Provider"
                        value={currentSettings.llmProvider}
                        onChange={value => setCurrentSettings(prev => ({ ...prev, llmProvider: value as LLMProvider }))}
                        options={llmOptions}
                    />
                    <ApiKeyField
                        label="Gemini API Key"
                        value={currentSettings.geminiApiKey}
                        onChange={value => setCurrentSettings(prev => ({...prev, geminiApiKey: value}))}
                    />
                </SettingsSection>
                
                <SettingsSection title="Image Providers">
                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select the stock image providers you want to use.</p>
                     <div className="space-y-2">
                        {allImageProviders.map(provider => (
                             <CheckboxField 
                                key={provider}
                                label={provider}
                                checked={currentSettings.imageProviders.includes(provider)}
                                onChange={() => handleImageProviderChange(provider)}
                            />
                        ))}
                     </div>
                     <ApiKeyField
                        label="Unsplash API Key"
                        value={currentSettings.unsplashApiKey}
                        onChange={value => setCurrentSettings(prev => ({...prev, unsplashApiKey: value}))}
                    />
                </SettingsSection>
            </div>
        </div>
    );
};

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const ApiKeyField: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{label}</label>
        <div className="relative">
            <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
                type="password"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="Enter your API key"
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-3 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent"
            />
        </div>
    </div>
);

const SelectField: React.FC<{ label: string; value: string; onChange: (value: string) => void; options: string[] }> = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{label}</label>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent appearance-none"
        >
            {options.map(opt => <option key={opt} value={opt} className="bg-white dark:bg-gray-800">{opt}</option>)}
        </select>
    </div>
);

const CheckboxField: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-3 cursor-pointer">
        <input 
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </label>
);

export default Settings;