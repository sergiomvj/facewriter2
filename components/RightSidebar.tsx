
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, GrammarSuggestion, ArticleGenerationParams, ContentType, SeoSuggestion, ImageProvider, Language, NarrativeTune } from '../types';
import { SendIcon, SparklesIcon, InsertIcon, CheckCircleIcon, TrendIcon, UploadIcon, ReplaceIcon, TranslateIcon, ImageIcon, ChatBubbleIcon, ChartBarIcon } from './icons';

// --- START: Component Definitions for Tool Panels ---

/**
 * Renders a list of grammar suggestions. Used in the LeftSidebar.
 */
export const GrammarChecker: React.FC<{ suggestions: GrammarSuggestion[]; isLoading: boolean; onApply: (suggestion: GrammarSuggestion) => void; }> = ({ suggestions, isLoading, onApply }) => {
    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center p-4"><SparklesIcon className="w-8 h-8 text-blue-400 animate-pulse" /></div>;
    }
    if (suggestions.length === 0) {
        return <div className="flex-1 p-4 text-sm text-center text-gray-500">Run a grammar check from the editor toolbar to see suggestions here.</div>;
    }
    return (
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {suggestions.map((s, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-xs text-red-500 dark:text-red-400 line-through">{s.original}</p>
                    <p className="text-sm text-green-600 dark:text-green-300">{s.suggestion}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">{s.explanation}</p>
                    <button onClick={() => onApply(s)} className="mt-2 flex items-center text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-semibold">
                        <CheckCircleIcon className="w-4 h-4 mr-1" /> Apply Fix
                    </button>
                </div>
            ))}
        </div>
    );
};

/**
 * Renders a form to generate a new article from a brief. Used in the LeftSidebar.
 */
export const ArticleGenerator: React.FC<{ onGenerate: (params: ArticleGenerationParams) => void; isLoading: boolean; }> = ({ onGenerate, isLoading }) => {
    const [goal, setGoal] = useState('');
    const [audience, setAudience] = useState('');
    const [contentType, setContentType] = useState<ContentType>('Blog Post');
    const [narrativeTune, setNarrativeTune] = useState<NarrativeTune>('Professional');
    const [keywords, setKeywords] = useState('');
    const [language, setLanguage] = useState<Language>('English');

    const contentTypes: ContentType[] = ['Blog Post', 'Tutorial', 'Press Release', 'Product Description', 'Newsletter'];
    const narrativeTunes: NarrativeTune[] = ['Formal', 'Casual', 'Humorous', 'Professional', 'Inspirational', 'Technical', 'Empathetic'];
    const languages: Language[] = ['English', 'Portuguese', 'Spanish'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate({ goal, audience, contentType, narrativeTune, keywords, language });
    };

    return (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
            <GeneratorInput label="Article Goal" value={goal} onChange={setGoal} placeholder="e.g., Announce a new feature" required />
            <GeneratorInput label="Target Audience" value={audience} onChange={setAudience} placeholder="e.g., Tech enthusiasts" required />
            <GeneratorSelect label="Content Type" value={contentType} onChange={setContentType} options={contentTypes} />
            <GeneratorSelect label="Language" value={language} onChange={setLanguage} options={languages} />
            <GeneratorSelect label="Narrative Tune" value={narrativeTune} onChange={setNarrativeTune} options={narrativeTunes} />
            <GeneratorInput label="SEO Keywords" value={keywords} onChange={setKeywords} placeholder="e.g., AI writing, content creation" />
            
            <button type="submit" disabled={isLoading} className="mt-2 flex items-center justify-center w-full bg-blue-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-blue-700 disabled:cursor-not-allowed">
                {isLoading ? (
                    <><div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div> Generating...</>
                ) : (
                    <><SparklesIcon className="w-5 h-5 mr-2" /> Generate Article</>
                )}
            </button>
        </form>
    );
};

const GeneratorInput: React.FC<{ label: string, value: string, onChange: (val: string) => void, placeholder: string, required?: boolean }> = ({ label, value, onChange, placeholder, required }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent" />
    </div>
);

const GeneratorSelect: React.FC<{ label: string, value: string, onChange: (val: any) => void, options: string[] }> = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
        <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent appearance-none">
            {options.map(opt => <option key={opt} value={opt} className="bg-white dark:bg-gray-800">{opt}</option>)}
        </select>
    </div>
);


/**
 * Renders a report of SEO suggestions. Used in the LeftSidebar.
 */
export const SeoReport: React.FC<{ suggestions: SeoSuggestion[]; isLoading: boolean; }> = ({ suggestions, isLoading }) => {
    const severityColor: Record<SeoSuggestion['severity'], string> = {
        high: 'border-red-500',
        medium: 'border-yellow-500',
        low: 'border-blue-500',
    };
    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center p-4"><SparklesIcon className="w-8 h-8 text-blue-400 animate-pulse" /></div>;
    }
    if (suggestions.length === 0) {
        return <div className="flex-1 p-4 text-sm text-center text-gray-500">Submit text for SEO analysis from the editor toolbar to see suggestions.</div>;
    }
    return (
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {suggestions.map((s, i) => (
                <div key={i} className={`bg-gray-200 dark:bg-gray-700 p-3 rounded-lg border-l-4 ${severityColor[s.severity]}`}>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{s.area}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{s.suggestion}</p>
                </div>
            ))}
        </div>
    );
};

// --- END: Component Definitions for Tool Panels ---


interface RightSidebarProps {
  // Chat
  messages: ChatMessage[];
  onSendMessage: (prompt: string) => void;
  isAssistantLoading: boolean;
  onInsert: (text: string) => void;
  // Trends
  trendsResult: string;
  isFetchingTrends: boolean;
  onFetchTrends: (query: string) => void;
  // Image
  imageUrl: string;
  isGeneratingImage: boolean;
  imageDescription: string;
  isGeneratingDescription: boolean;
  onGenerateImageDescription: () => void;
  onImageUpload: (file: File) => void;
  hasAiGeneratedImage: boolean;
  // Translation
  onTranslate: (language: Language) => void;
  isTranslating: boolean;
  translatedContent: string;
  onReplaceWithTranslation: () => void;
}

const RIGHT_SIDEBAR_TABS = ['Chat', 'Translation', 'Trends', 'Image', 'Insights'];

const TOOL_ICONS: { [key: string]: React.ReactNode } = {
    'Translation': <TranslateIcon className="w-5 h-5" />,
    'Trends': <TrendIcon className="w-5 h-5" />,
    'Image': <ImageIcon className="w-5 h-5" />,
    'Chat': <ChatBubbleIcon className="w-5 h-5" />,
    'Insights': <ChartBarIcon className="w-5 h-5" />,
};


const RightSidebar: React.FC<RightSidebarProps> = (props) => {
    const [activeTool, setActiveTool] = useState('Chat');
    const [prompt, setPrompt] = useState('');

    const handleSend = () => {
        props.onSendMessage(prompt);
        setPrompt('');
    };
  
    const renderToolContent = () => {
      switch (activeTool) {
        case 'Translation':
          return <TranslationTab onTranslate={props.onTranslate} isTranslating={props.isTranslating} translatedContent={props.translatedContent} onReplaceWithTranslation={props.onReplaceWithTranslation} />;
        case 'Trends':
          return <TrendsExplorer onFetch={props.onFetchTrends} result={props.trendsResult} isLoading={props.isFetchingTrends} />;
        case 'Chat':
          return <AssistantChat messages={props.messages} isLoading={props.isAssistantLoading} onInsert={props.onInsert} />;
        case 'Image':
          return <ImageViewer
            imageUrl={props.imageUrl}
            isLoading={props.isGeneratingImage}
            description={props.imageDescription}
            isDescriptionLoading={props.isGeneratingDescription}
            onGenerateDescription={props.onGenerateImageDescription}
            onImageUpload={props.onImageUpload}
            hasAiGeneratedImage={props.hasAiGeneratedImage}
          />;
        case 'Insights':
          return <div className="p-4 text-sm text-center text-gray-500">Content insights and analytics will appear here.</div>;
        default:
          return null;
      }
    };
  
    return (
      <aside className="w-full md:w-96 bg-gray-100 dark:bg-gray-800 p-4 border-l border-gray-200 dark:border-gray-700 h-full flex flex-col flex-shrink-0 overflow-y-auto">
        <div className="space-y-4">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-500 px-4">Resources</h2>
            <div className="border-y border-gray-200 dark:border-gray-700 px-2">
                <div className="flex space-x-1 overflow-x-auto py-2">
                    {RIGHT_SIDEBAR_TABS.map(tab => (
                        <ToolTabButton 
                          key={tab} 
                          label={tab} 
                          icon={TOOL_ICONS[tab]} 
                          isActive={activeTool === tab} 
                          onClick={() => setActiveTool(tab)} 
                        />
                    ))}
                </div>
            </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0 mt-4">
          {renderToolContent()}
          {activeTool === 'Chat' && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !props.isAssistantLoading && handleSend()}
                  placeholder="Ask FaceWriter Assistant..."
                  className="bg-transparent w-full p-3 text-sm text-gray-900 dark:text-white focus:outline-none"
                  disabled={props.isAssistantLoading}
                />
                <button onClick={handleSend} disabled={props.isAssistantLoading} className="p-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed">
                  {props.isAssistantLoading ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
                  ) : (
                    <SendIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    );
};
  
const ToolTabButton: React.FC<{label: string, icon: React.ReactNode, isActive: boolean, onClick: () => void}> = ({label, icon, isActive, onClick}) => {
    return (
        <button
            onClick={onClick}
            title={label}
            className={`flex items-center space-x-2 flex-shrink-0 py-2 px-3 text-sm font-semibold rounded-md focus:outline-none transition-colors duration-200 ${
                isActive ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
            }`}
        >
          {icon}
          <span className="hidden sm:inline md:hidden lg:inline">{label}</span>
        </button>
    );
}

// Individual Tool Panel Components
const AssistantChat: React.FC<{ messages: ChatMessage[]; isLoading: boolean; onInsert: (text: string) => void; }> = ({ messages, isLoading, onInsert }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => {
                if (msg.role === 'system') {
                    return (
                        <div key={index} className="text-center text-xs text-gray-500 italic p-2">{msg.text}</div>
                    );
                }
                const isUser = msg.role === 'user';
                return (
                    <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-sm rounded-lg p-3 text-sm ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            {!isUser && (
                                <button onClick={() => onInsert(msg.text)} className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                    <InsertIcon className="w-3 h-3 mr-1" />
                                    Insert into editor
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
            {isLoading && (
                 <div className="flex justify-start">
                    <div className="max-w-xs md:max-w-sm rounded-lg p-3 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 flex items-center">
                        <SparklesIcon className="w-5 h-5 text-blue-400 mr-2 animate-pulse" />
                        <span>Thinking...</span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

const TrendsExplorer: React.FC<{onFetch: (query: string) => void; result: string; isLoading: boolean}> = ({ onFetch, result, isLoading }) => {
    const [query, setQuery] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFetch(query);
    }
    return (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Explore Trends</h3>
            <form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-4">
                <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Enter a topic..." required className="flex-grow bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit" disabled={isLoading} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-700">
                    {isLoading ? <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <TrendIcon className="w-5 h-5" />}
                </button>
            </form>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 text-sm text-gray-800 dark:text-gray-300 flex-1 overflow-y-auto whitespace-pre-wrap">
                {isLoading ? <div className="text-center text-gray-500 dark:text-gray-400">Fetching trends...</div> : (result || "Search results will appear here.")}
            </div>
        </div>
    );
};

interface ImageViewerProps {
  imageUrl: string;
  isLoading: boolean;
  description: string;
  isDescriptionLoading: boolean;
  onGenerateDescription: () => void;
  onImageUpload: (file: File) => void;
  hasAiGeneratedImage: boolean;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  imageUrl, isLoading, description, isDescriptionLoading,
  onGenerateDescription, onImageUpload, hasAiGeneratedImage
}) => {
    const [provider, setProvider] = useState<ImageProvider>('Unsplash');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const providerUrls: Record<ImageProvider, string> = {
        Unsplash: 'https://unsplash.com/s/photos/',
        Pixabay: 'https://pixabay.com/images/search/',
        Pexels: 'https://www.pexels.com/search/',
    };

    const handleSearch = () => {
        if (!description) return;
        const searchUrl = `${providerUrls[provider]}${encodeURIComponent(description)}`;
        window.open(searchUrl, '_blank');
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onImageUpload(file);
      }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center p-4">
            <div className="flex flex-col items-center">
                <SparklesIcon className="w-8 h-8 text-blue-400 mb-2 animate-pulse" />
                <span className="text-sm">Generating image...</span>
            </div>
        </div>;
    }
    if (!imageUrl) {
        return <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-sm text-gray-500">
            <p className='mb-4'>Click "Ask image to Facemedia" in the editor to generate an image.</p>
            <button onClick={triggerFileInput} className="flex items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              <UploadIcon className="w-5 h-5 mr-2" />
              Choose on computer
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>;
    }
    return (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
            <div>
                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Image Preview</h3>
                <img src={imageUrl} alt="AI generated or user uploaded" className="w-full h-auto rounded-lg" />
            </div>

            <div className="space-y-2">
                <button onClick={onGenerateDescription} disabled={!hasAiGeneratedImage || isDescriptionLoading} className="w-full flex justify-center items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-md font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed">
                    {isDescriptionLoading ? <><SparklesIcon className="w-5 h-5 mr-2 animate-pulse" /> Generating...</> : 'Generate Short Description'}
                </button>
                {description && (
                    <div className="bg-black/5 dark:bg-gray-900/50 p-2 rounded-md">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Search Keywords:</p>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{description}</p>
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Find Similar on Stock Sites</h4>
              <div className="flex items-center space-x-2">
                <select value={provider} onChange={(e) => setProvider(e.target.value as ImageProvider)} className="flex-grow bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                  <option value="Unsplash" className="bg-white dark:bg-gray-800">Unsplash</option>
                  <option value="Pixabay" className="bg-white dark:bg-gray-800">Pixabay</option>
                  <option value="Pexels" className="bg-white dark:bg-gray-800">Pexels</option>
                </select>
                <button onClick={handleSearch} disabled={!description} className="p-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 disabled:bg-blue-700 disabled:cursor-not-allowed">Search</button>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button onClick={triggerFileInput} className="w-full flex justify-center items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-md font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <UploadIcon className="w-5 h-5 mr-2" />
                Choose Another Image
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
        </div>
    );
};

interface TranslationTabProps {
  onTranslate: (language: Language) => void;
  isTranslating: boolean;
  translatedContent: string;
  onReplaceWithTranslation: () => void;
}
const TranslationTab: React.FC<TranslationTabProps> = ({ onTranslate, isTranslating, translatedContent, onReplaceWithTranslation }) => {
    const [language, setLanguage] = useState<Language>('Spanish');
    const languages: Language[] = ['English', 'Portuguese', 'Spanish'];

    return (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Translate Content</h3>
            <div className="flex items-center space-x-2 mb-4">
                <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="flex-grow bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                    {languages.map(lang => <option key={lang} value={lang} className="bg-white dark:bg-gray-800">{lang}</option>)}
                </select>
                <button onClick={() => onTranslate(language)} disabled={isTranslating} className="p-2 px-4 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 disabled:bg-blue-700 disabled:cursor-not-allowed">
                    {isTranslating ? 'Translating...' : 'Translate'}
                </button>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 text-sm text-gray-800 dark:text-gray-300 flex-1 overflow-y-auto whitespace-pre-wrap">
                {isTranslating ? <div className="text-center text-gray-500 dark:text-gray-400">Translating content...</div> : (translatedContent || "Translation result will appear here.")}
            </div>
            {translatedContent && !translatedContent.startsWith('Error') && (
                <button onClick={onReplaceWithTranslation} className="mt-4 w-full flex justify-center items-center bg-gray-600 text-white py-2 rounded-md font-semibold hover:bg-gray-500 transition-colors">
                    <ReplaceIcon className="w-5 h-5 mr-2" />
                    Replace Content in Editor
                </button>
            )}
        </div>
    );
};

export default RightSidebar;
