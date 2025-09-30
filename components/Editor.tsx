import React, { useRef, useState } from 'react';
import { BoldIcon, ItalicIcon, ListIcon, GrammarIcon, SummarizeIcon, ExpandIcon, ShortenIcon, RewriteIcon, SparklesIcon, SaveIcon, ImageIcon, SeoIcon, TranslateIcon } from './icons';
import { TextModificationAction, Destination } from '../types';

interface EditorProps {
  title: string;
  content: string;
  goal: string;
  client: string;
  destination: Destination;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onGoalChange: (goal: string) => void;
  onClientChange: (client: string) => void;
  onDestinationChange: (destination: Destination) => void;
  onGrammarCheck: (content: string) => void;
  onSummarizeSelection: (selectedText: string) => void;
  onTextModify: (selectedText: string, action: TextModificationAction) => void;
  isModifyingText: boolean;
  onGenerateTitle: () => void;
  isGeneratingTitle: boolean;
  onGenerateImage: () => void;
  onSeoAnalysis: () => void;
  onSave: () => void;
  saveStatus: string;
  onTranslateRequest: () => void;
}

const destinationOptions: Destination[] = ['Article Blog', 'Youtube Script', 'Instagram Post', 'Facebook Post', 'X Post', 'Linkedin Post'];

const Editor: React.FC<EditorProps> = ({
  title, content, goal, client, destination,
  onTitleChange, onContentChange, onGoalChange, onClientChange, onDestinationChange,
  onGrammarCheck, onSummarizeSelection, onTextModify, isModifyingText,
  onGenerateTitle, isGeneratingTitle, onGenerateImage, onSeoAnalysis, onSave, saveStatus, onTranslateRequest
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectionToolbar, setSelectionToolbar] = useState<{ top: number; left: number; text: string } | null>(null);

  const applyFormatting = (format: 'bold' | 'italic' | 'list' | 'h1' | 'h2' | 'h3') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText;

    if (format === 'bold') {
      newText = `${content.substring(0, start)}**${selectedText}**${content.substring(end)}`;
    } else if (format === 'italic') {
      newText = `${content.substring(0, start)}*${selectedText}*${content.substring(end)}`;
    } else if (format === 'list') {
        const lines = selectedText.split('\n');
        const newList = lines.map(line => line.trim() ? `- ${line}` : '').join('\n');
        newText = `${content.substring(0, start)}${newList}${content.substring(end)}`;
    } else if (format.startsWith('h')) {
      const level = parseInt(format.substring(1));
      const prefix = '#'.repeat(level) + ' ';
      
      let lineStart = content.lastIndexOf('\n', start - 1) + 1;
      let selectionEnd = end;
      if (content[selectionEnd-1] === '\n') {
        selectionEnd--;
      }
      const lineEnd = content.indexOf('\n', selectionEnd);
      const finalLineEnd = lineEnd === -1 ? content.length : lineEnd;

      const linesToModify = content.substring(lineStart, finalLineEnd);
      const modifiedLines = linesToModify.split('\n').map(line => {
        const cleanLine = line.replace(/^\s*#+\s*/, '');
        return prefix + cleanLine;
      }).join('\n');
      
      newText = content.substring(0, lineStart) + modifiedLines + content.substring(finalLineEnd);
    } else {
        newText = content;
    }

    onContentChange(newText);
    setTimeout(() => textarea.focus(), 0);
  };

  const handleSummarize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
      if (selectedText) {
        onSummarizeSelection(selectedText);
      } else {
        alert("Please select text to summarize.");
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);

    if (selectedText.trim().length > 0) {
      const top = e.clientY + 15;
      const left = e.clientX;
      setSelectionToolbar({ top, left, text: selectedText });
    } else {
      setSelectionToolbar(null);
    }
  };

  const handleTextModification = (action: TextModificationAction) => {
    if (selectionToolbar) {
      onTextModify(selectionToolbar.text, action);
      setSelectionToolbar(null);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col bg-white dark:bg-gray-900 p-8 md:p-12 overflow-y-auto">
      {selectionToolbar && (
        <SelectionToolbar
            top={selectionToolbar.top}
            left={selectionToolbar.left}
            onModify={handleTextModification}
            isLoading={isModifyingText}
        />
       )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text" value={goal} onChange={(e) => onGoalChange(e.target.value)}
            placeholder="Primary goal of this article?"
            className="bg-transparent text-sm text-gray-600 dark:text-gray-400 focus:outline-none w-full border-b border-gray-300 dark:border-gray-700 pb-1"
            aria-label="Article Goal"
          />
          <input
            type="text" value={client} onChange={(e) => onClientChange(e.target.value)}
            placeholder="Client Name"
            className="bg-transparent text-sm text-gray-600 dark:text-gray-400 focus:outline-none w-full border-b border-gray-300 dark:border-gray-700 pb-1"
            aria-label="Client Name"
          />
          <select
            value={destination} onChange={(e) => onDestinationChange(e.target.value as Destination)}
            className="bg-transparent dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400 focus:outline-none w-full border-b border-gray-300 dark:border-gray-700 pb-1 appearance-none"
            aria-label="Final Destination"
          >
            {destinationOptions.map(opt => <option key={opt} value={opt} className="bg-white dark:bg-gray-800">{opt}</option>)}
          </select>
        </div>
        <div className="flex items-center mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Article Title"
            className="bg-transparent text-4xl font-bold text-gray-900 dark:text-white focus:outline-none w-full"
            aria-label="Article Title"
            disabled={isGeneratingTitle}
          />
          <button 
            onClick={onGenerateTitle} 
            disabled={isGeneratingTitle} 
            className="p-2 ml-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Create the best title as SEO patterns"
            title="Create the best title as SEO patterns"
          >
              {isGeneratingTitle ? (
                  <div className="w-6 h-6 border-2 border-t-transparent border-gray-500 dark:border-gray-400 rounded-full animate-spin"></div>
              ) : (
                  <SparklesIcon className="w-6 h-6" />
              )}
          </button>
      </div>
      <div className="flex items-center space-x-2 p-2 border-b border-t border-gray-200 dark:border-gray-700 mb-4 sticky top-0 bg-white dark:bg-gray-900 z-10">
        <ToolbarButton onClick={onSave} aria-label="Save Text"><SaveIcon className="w-5 h-5"/></ToolbarButton>
        {saveStatus && <span className="text-xs text-green-500 dark:text-green-400 animate-pulse">{saveStatus}</span>}
        <div className="flex-grow"></div>
        <ToolbarButton onClick={() => applyFormatting('bold')} aria-label="Bold"><BoldIcon className="w-5 h-5" /></ToolbarButton>
        <ToolbarButton onClick={() => applyFormatting('italic')} aria-label="Italic"><ItalicIcon className="w-5 h-5" /></ToolbarButton>
        <ToolbarButton onClick={() => applyFormatting('list')} aria-label="Bullet List"><ListIcon className="w-5 h-5" /></ToolbarButton>
        <div className="h-6 w-px bg-gray-200 dark:border-gray-700 mx-2"></div>
        <ToolbarButton onClick={() => applyFormatting('h1')} aria-label="Heading 1" className="text-lg font-bold w-8">H1</ToolbarButton>
        <ToolbarButton onClick={() => applyFormatting('h2')} aria-label="Heading 2" className="text-md font-bold w-8">H2</ToolbarButton>
        <ToolbarButton onClick={() => applyFormatting('h3')} aria-label="Heading 3" className="text-sm font-bold w-8">H3</ToolbarButton>
        <div className="h-6 w-px bg-gray-200 dark:border-gray-700 mx-2"></div>
        <ToolbarButton onClick={handleSummarize} aria-label="Summarize Selection"><SummarizeIcon className="w-5 h-5" /></ToolbarButton>
        <ToolbarButton onClick={() => onGrammarCheck(content)} aria-label="Check Grammar"><GrammarIcon className="w-5 h-5" /></ToolbarButton>
        <ToolbarButton onClick={onTranslateRequest} aria-label="Translate Text"><TranslateIcon className="w-5 h-5" /></ToolbarButton>
        <div className="h-6 w-px bg-gray-200 dark:border-gray-700 mx-2"></div>
        <ToolbarButton onClick={onGenerateImage} aria-label="Ask image to Facemedia"><ImageIcon className="w-5 h-5" /></ToolbarButton>
        <ToolbarButton onClick={onSeoAnalysis} aria-label="Submit Text to SEO patterns"><SeoIcon className="w-5 h-5" /></ToolbarButton>
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        onMouseUp={handleMouseUp}
        onMouseDown={() => setSelectionToolbar(null)} // Hide toolbar on new click
        placeholder="Start writing..."
        className="bg-transparent text-lg text-gray-700 dark:text-gray-300 flex-1 w-full resize-none leading-relaxed focus:outline-none"
        aria-label="Article Content"
        disabled={isModifyingText}
      />
    </div>
  );
};

interface SelectionToolbarProps {
    top: number;
    left: number;
    onModify: (action: TextModificationAction) => void;
    isLoading: boolean;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({ top, left, onModify, isLoading }) => {
    return (
        <div 
          className="fixed z-20 bg-gray-700 rounded-lg shadow-xl p-1 flex items-center space-x-1"
          style={{ top: `${top}px`, left: `${left}px`, transform: 'translateX(-50%)' }}
          onMouseDown={(e) => e.stopPropagation()} // Prevent editor's onMouseDown from hiding this
        >
          {isLoading ? (
            <div className="flex items-center justify-center p-2">
              <SparklesIcon className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
          ) : (
            <>
              <ToolbarButton onClick={() => onModify('expand')} aria-label="Expand Text"><ExpandIcon className="w-5 h-5"/></ToolbarButton>
              <ToolbarButton onClick={() => onModify('shorten')} aria-label="Shorten Text"><ShortenIcon className="w-5 h-5"/></ToolbarButton>
              <ToolbarButton onClick={() => onModify('rewrite')} aria-label="Rewrite Text"><RewriteIcon className="w-5 h-5"/></ToolbarButton>
            </>
          )}
        </div>
    );
};

const ToolbarButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button
    {...props}
    className={`p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  >
    {children}
  </button>
);

export default Editor;