
import React from 'react';
import { View } from '../App';
import { 
  FolderIcon, DashboardIcon, SettingsIcon, LogoutIcon, PlusCircleIcon, SparklesIcon,
  SeoIcon, GrammarIcon, SunIcon, MoonIcon
} from './icons';
import { GrammarSuggestion, ArticleGenerationParams, SeoSuggestion, Theme } from '../types';
import { 
    GrammarChecker, 
    ArticleGenerator, 
    SeoReport, 
} from './RightSidebar';

interface LeftSidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  onNewProject: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  // Tool Props
  grammarSuggestions: GrammarSuggestion[];
  isGrammarLoading: boolean;
  onApplySuggestion: (suggestion: GrammarSuggestion) => void;
  activeTool: string;
  setActiveTool: (tab: string) => void;
  onGenerateArticle: (params: ArticleGenerationParams) => void;
  isGeneratingArticle: boolean;
  seoSuggestions: SeoSuggestion[];
  isAnalyzingSeo: boolean;
}

const LEFT_SIDEBAR_TABS = ['Generate', 'SEO', 'Grammar'];

const TOOL_ICONS: { [key: string]: React.ReactNode } = {
    'Generate': <SparklesIcon className="w-5 h-5" />,
    'SEO': <SeoIcon className="w-5 h-5" />,
    'Grammar': <GrammarIcon className="w-5 h-5" />,
};

const LeftSidebar: React.FC<LeftSidebarProps> = (props) => {
  const { currentView, onNavigate, onLogout, onNewProject, activeTool, setActiveTool, theme, onThemeChange } = props;

  const renderToolContent = () => {
    switch (activeTool) {
      case 'Generate':
        return <ArticleGenerator onGenerate={props.onGenerateArticle} isLoading={props.isGeneratingArticle} />;
      case 'SEO':
        return <SeoReport suggestions={props.seoSuggestions} isLoading={props.isAnalyzingSeo} />;
      case 'Grammar':
        return <GrammarChecker suggestions={props.grammarSuggestions} isLoading={props.isGrammarLoading} onApply={props.onApplySuggestion} />;
      default:
        return null;
    }
  };


  return (
    <aside className="w-full md:w-96 bg-gray-100 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col flex-shrink-0 overflow-y-auto">
      <div className="flex items-center mb-6">
        <img 
          src={theme === 'dark' ? 'https://i.imgur.com/M3mmwBK.png' : 'https://i.imgur.com/zC7l7YH.png'} 
          alt="FaceWriter Logo" 
          className="h-8 w-auto" 
        />
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem 
          label="Dashboard" 
          icon={<DashboardIcon className="w-5 h-5" />} 
          isActive={currentView === 'dashboard'} 
          onClick={() => onNavigate('dashboard')} 
        />
        <NavItem 
          label="Projects" 
          icon={<FolderIcon className="w-5 h-5" />} 
          isActive={currentView === 'editor'} 
          onClick={() => onNavigate('editor')} 
        />
        <NavItem 
          label="Settings" 
          icon={<SettingsIcon className="w-5 h-5" />} 
          isActive={currentView === 'settings'} 
          onClick={() => onNavigate('settings')} 
        />
        <button onClick={onNewProject} className="flex items-center w-full text-left py-2.5 px-4 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white mt-2 border border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500">
            <PlusCircleIcon className="w-5 h-5 mr-3" /> New Project
        </button>
      </nav>
      
      {currentView === 'editor' && (
        <div className="flex-1 flex flex-col min-h-0 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 space-y-4">
          <h2 className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-500 px-4">Tools</h2>
          <div className="border-y border-gray-200 dark:border-gray-700 px-2">
              <div className="flex space-x-1 overflow-x-auto py-2">
                  {LEFT_SIDEBAR_TABS.map(tab => (
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
          <div className="flex-1 flex flex-col min-h-0">
            {renderToolContent()}
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 flex items-center justify-between">
        <NavItem 
          label="Logout" 
          icon={<LogoutIcon className="w-5 h-5" />} 
          onClick={onLogout} 
        />
        <button 
          onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center w-full text-left py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-500 bg-opacity-20 dark:bg-opacity-30 text-blue-600 dark:text-white'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
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

export default LeftSidebar;
