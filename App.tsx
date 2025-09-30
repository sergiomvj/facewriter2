
import React, { useState, useCallback, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Editor from './components/Editor';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import { ChatMessage, GrammarSuggestion, TextModificationAction, ArticleGenerationParams, Destination, SeoSuggestion, Language, AppSettings, Theme } from './types';
import { runGemini, checkGrammar, modifyText, generateArticle, fetchTrends, summarizeForImagePrompt, generateImage, analyzeSeo, generateImageDescription, translateText, generateSeoTitle } from './services/geminiService';

export type View = 'dashboard' | 'editor' | 'settings';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [theme, setTheme] = useState<Theme>('dark');

  const [appSettings, setAppSettings] = useState<AppSettings>({
    llmProvider: 'Gemini',
    geminiApiKey: '',
    unsplashApiKey: '',
    imageProviders: ['Unsplash', 'Pexels'],
  });

  // Editor and App State
  const [editorTitle, setEditorTitle] = useState('My First SEO Article');
  const [editorContent, setEditorContent] = useState(
    'Start writing your next masterpiece here...\n\nUse the "Generate" tab in the tools panel to create a new article from a brief. You can also select text to see the new AI modification tools!'
  );
  const [articleGoal, setArticleGoal] = useState('');
  const [client, setClient] = useState('');
  const [destination, setDestination] = useState<Destination>('Article Blog');
  const [saveStatus, setSaveStatus] = useState('');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'system', text: 'Welcome to FaceWriter Assistant! How can I help you today?' }
  ]);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [grammarSuggestions, setGrammarSuggestions] = useState<GrammarSuggestion[]>([]);
  const [isGrammarLoading, setIsGrammarLoading] = useState(false);
  const [activeLeftTool, setActiveLeftTool] = useState<string>('Generate');
  const [isModifyingText, setIsModifyingText] = useState(false);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  const [trendsResult, setTrendsResult] = useState('');
  const [isFetchingTrends, setIsFetchingTrends] = useState(false);
  
  const [imageUrl, setImageUrl] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const [seoSuggestions, setSeoSuggestions] = useState<SeoSuggestion[]>([]);
  const [isAnalyzingSeo, setIsAnalyzingSeo] = useState(false);

  const [translatedContent, setTranslatedContent] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);
  
  const handleNewProject = useCallback(() => {
    setEditorTitle('New Untitled Article');
    setEditorContent('Start writing...');
    setArticleGoal('');
    setClient('');
    setDestination('Article Blog');
    setChatMessages([{ role: 'system', text: 'New project started. How can I help?' }]);
    setGrammarSuggestions([]);
    setImageUrl('');
    setImagePrompt('');
    setImageDescription('');
    setSeoSuggestions([]);
    setTranslatedContent('');
    setCurrentView('editor');
    setActiveLeftTool('Generate');
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => setSaveStatus(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);
  
  const handleSendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', text: prompt }]);
    setIsAssistantLoading(true);
    try {
      const response = await runGemini(prompt);
      setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setChatMessages(prev => [...prev, { role: 'system', text: `Error: ${errorMessage}` }]);
    } finally {
      setIsAssistantLoading(false);
    }
  }, []);
  
  const handleInsertIntoEditor = useCallback((text: string) => {
    setEditorContent(prev => `${prev}\n\n${text}`);
  }, []);

  const handleGrammarCheck = useCallback(async (content: string) => {
    if (!content.trim()) return;
    setIsGrammarLoading(true);
    setActiveLeftTool('Grammar');
    setGrammarSuggestions([]);
    try {
      const suggestions = await checkGrammar(content);
      setGrammarSuggestions(suggestions);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setChatMessages(prev => [...prev, { role: 'system', text: `Grammar Check Error: ${errorMessage}` }]);
    } finally {
      setIsGrammarLoading(false);
    }
  }, []);

  const handleSummarizeSelection = useCallback(async (selectedText: string) => {
    if (!selectedText.trim()) return;
    const userPrompt = `Summarize the following text: "${selectedText}"`;
    const fullPrompt = `Please summarize the following text:\n\n"${selectedText}"`;
    setChatMessages(prev => [...prev, { role: 'user', text: userPrompt }]);
    // setActiveTool('Chat'); // TODO: Need to decide how to activate right sidebar tab
    setIsAssistantLoading(true);
    try {
      const response = await runGemini(fullPrompt);
      setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setChatMessages(prev => [...prev, { role: 'system', text: `Error: ${errorMessage}` }]);
    } finally {
      setIsAssistantLoading(false);
    }
  }, []);

  const handleApplySuggestion = useCallback((suggestion: GrammarSuggestion) => {
    setEditorContent(prev => prev.replace(suggestion.original, suggestion.suggestion));
    setGrammarSuggestions(prev => prev.filter(s => s.original !== suggestion.original));
  }, []);

  const handleTextModification = useCallback(async (text: string, action: TextModificationAction) => {
    if (!text.trim()) return;
    setIsModifyingText(true);
    try {
        const newText = await modifyText(text, action);
        setEditorContent(prev => prev.replace(text, newText));
    } catch (error) {
        console.error('Text modification error:', error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        setChatMessages(prev => [...prev, { role: 'system', text: `Error modifying text: ${errorMessage}` }]);
    } finally {
        setIsModifyingText(false);
    }
  }, []);

  const handleGenerateArticle = useCallback(async (params: ArticleGenerationParams) => {
    setIsGeneratingArticle(true);
    try {
      const article = await generateArticle(params);
      setEditorTitle(article.title);
      setEditorContent(article.content);
      setArticleGoal(params.goal);
      // setActiveTool('Chat');
    } catch (error) {
      console.error('Article generation error:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setChatMessages(prev => [...prev, { role: 'system', text: `Error generating article: ${errorMessage}` }]);
    } finally {
      setIsGeneratingArticle(false);
    }
  }, []);

  const handleGenerateSeoTitle = useCallback(async () => {
    if (!articleGoal && !editorContent.trim()) {
      setChatMessages(prev => [...prev, { role: 'system', text: `Please provide an article goal or some content before generating a title.` }]);
      // setActiveTool('Chat');
      return;
    }
    setIsGeneratingTitle(true);
    try {
        const newTitle = await generateSeoTitle({ goal: articleGoal, content: editorContent });
        setEditorTitle(newTitle);
    } catch (error) {
        console.error('SEO Title generation error:', error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        setChatMessages(prev => [...prev, { role: 'system', text: `Error generating SEO title: ${errorMessage}` }]);
    } finally {
        setIsGeneratingTitle(false);
    }
  }, [articleGoal, editorContent]);

  const handleFetchTrends = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsFetchingTrends(true);
    setTrendsResult('');
    try {
      const result = await fetchTrends(query);
      setTrendsResult(result);
    } catch (error) {
      console.error('Trends fetching error:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setTrendsResult(`Error fetching trends: ${errorMessage}`);
    } finally {
      setIsFetchingTrends(false);
    }
  }, []);

  const handleGenerateImage = useCallback(async () => {
    setIsGeneratingImage(true);
    setImageUrl('');
    setImageDescription('');
    // setActiveTool('Image'); // TODO: Activate right sidebar
    try {
      const textForPrompt = editorContent.split(' ').slice(0, 100).join(' ');
      const newImagePrompt = await summarizeForImagePrompt(textForPrompt);
      setImagePrompt(newImagePrompt);
      const base64Image = await generateImage(newImagePrompt);
      setImageUrl(`data:image/jpeg;base64,${base64Image}`);
    } catch (error) {
      console.error('Image generation error:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setChatMessages(prev => [...prev, { role: 'system', text: `Error generating image: ${errorMessage}` }]);
    } finally {
      setIsGeneratingImage(false);
    }
  }, [editorContent]);
  
  const handleGenerateImageDescription = useCallback(async () => {
    if (!imagePrompt) return;
    setIsGeneratingDescription(true);
    setImageDescription('');
    try {
      const description = await generateImageDescription(imagePrompt);
      setImageDescription(description);
    } catch (error) {
      console.error('Image description generation error:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setChatMessages(prev => [...prev, { role: 'system', text: `Error generating image description: ${errorMessage}` }]);
    } finally {
      setIsGeneratingDescription(false);
    }
  }, [imagePrompt]);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
            setImageUrl(result);
            setImagePrompt('');
            setImageDescription('');
            // setActiveTool('Image');
        }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSeoAnalysis = useCallback(async () => {
    setIsAnalyzingSeo(true);
    setSeoSuggestions([]);
    setActiveLeftTool('SEO');
    try {
      const suggestions = await analyzeSeo({ title: editorTitle, content: editorContent, goal: articleGoal, client });
      setSeoSuggestions(suggestions);
    } catch (error) {
      console.error('SEO analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setChatMessages(prev => [...prev, { role: 'system', text: `Error analyzing SEO: ${errorMessage}` }]);
    } finally {
      setIsAnalyzingSeo(false);
    }
  }, [editorTitle, editorContent, articleGoal, client]);

  const handleSave = useCallback(() => {
    console.log("--- SAVING ARTICLE ---", { settings: appSettings, title: editorTitle, goal: articleGoal, client, destination, content: editorContent });
    setSaveStatus('Article saved successfully!');
  }, [editorTitle, articleGoal, client, destination, editorContent, appSettings]);

  const handleTranslate = useCallback(async (language: Language) => {
    if (!editorContent.trim()) return;
    setIsTranslating(true);
    setTranslatedContent('');
    // setActiveTool('Translation');
    try {
      const result = await translateText(editorContent, language);
      setTranslatedContent(result);
    } catch (error) {
      console.error('Translation error:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setTranslatedContent(`Error translating text: ${errorMessage}`);
    } finally {
      setIsTranslating(false);
    }
  }, [editorContent]);

  const handleReplaceWithTranslation = useCallback(() => {
    if (translatedContent) {
      setEditorContent(translatedContent);
      setTranslatedContent('');
    }
  }, [translatedContent]);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} theme={theme} />;
  }
  
  const renderCurrentView = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'settings':
        return <Settings settings={appSettings} onSave={setAppSettings} />;
      case 'editor':
      default:
        return (
          <Editor
            title={editorTitle} content={editorContent} goal={articleGoal} client={client} destination={destination}
            onTitleChange={setEditorTitle} onContentChange={setEditorContent} onGoalChange={setArticleGoal} onClientChange={setClient} onDestinationChange={setDestination}
            onGrammarCheck={handleGrammarCheck} onSummarizeSelection={handleSummarizeSelection} onTextModify={handleTextModification} isModifyingText={isModifyingText}
            onGenerateTitle={handleGenerateSeoTitle} isGeneratingTitle={isGeneratingTitle} onGenerateImage={handleGenerateImage} onSeoAnalysis={handleSeoAnalysis}
            onSave={handleSave} saveStatus={saveStatus} onTranslateRequest={() => { /* TODO: activate right sidebar */}}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-400 overflow-hidden">
      <div className="flex flex-col md:flex-row flex-1 min-w-0">
        <LeftSidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          onLogout={handleLogout}
          onNewProject={handleNewProject}
          theme={theme}
          onThemeChange={setTheme}
          
          // Tool Props
          grammarSuggestions={grammarSuggestions}
          isGrammarLoading={isGrammarLoading}
          onApplySuggestion={handleApplySuggestion}
          activeTool={activeLeftTool}
          setActiveTool={setActiveLeftTool}
          onGenerateArticle={handleGenerateArticle}
          isGeneratingArticle={isGeneratingArticle}
          seoSuggestions={seoSuggestions}
          isAnalyzingSeo={isAnalyzingSeo}
        />
        <main className="flex-1 flex flex-col min-w-0 min-h-0">
          {renderCurrentView()}
        </main>
        {currentView === 'editor' && (
          <RightSidebar
            // Chat
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isAssistantLoading={isAssistantLoading}
            onInsert={handleInsertIntoEditor}
            // Trends
            trendsResult={trendsResult}
            isFetchingTrends={isFetchingTrends}
            onFetchTrends={handleFetchTrends}
            // Image
            imageUrl={imageUrl}
            isGeneratingImage={isGeneratingImage}
            imageDescription={imageDescription}
            isGeneratingDescription={isGeneratingDescription}
            onGenerateImageDescription={handleGenerateImageDescription}
            onImageUpload={handleImageUpload}
            hasAiGeneratedImage={!!imagePrompt}
            // Translation
            onTranslate={handleTranslate}
            isTranslating={isTranslating}
            translatedContent={translatedContent}
            onReplaceWithTranslation={handleReplaceWithTranslation}
          />
        )}
      </div>
    </div>
  );
};

export default App;
